# Code Examples: Testes E2E de Eventos de Domínio

## Exemplo completo: on-answer-created.e2e-spec.ts

```typescript
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { waitFor } from 'test/utils/wait-for'

describe('On Answer Created (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer content',
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
```

## waitFor atualizado para suportar async

```typescript
// test/utils/wait-for.ts
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let elapsedTime = 0

    const interval = setInterval(async () => {
      try {
        await assertions()
        clearInterval(interval)
        resolve()
      } catch (err) {
        elapsedTime += 10
        if (elapsedTime >= maxDuration) {
          clearInterval(interval)
          reject(err)
        }
      }
    }, 10)
  })
}
```

## Repositório Prisma com dispatch de eventos

```typescript
// prisma-answers-repository.ts
import { DomainEvents } from '@/core/events/domain-events'

export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({ data })

    // ESSENCIAL: sem isso, nenhum evento de domínio é disparado
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
```

## Comparação: InMemory vs Prisma repository

```typescript
// InMemoryAnswersRepository (já funcionava nos testes unitários)
async create(answer: Answer) {
  this.items.push(answer)
  DomainEvents.dispatchEventsForAggregate(answer.id) // ✅ já existia
}

// PrismaAnswersRepository (precisava adicionar)
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })
  DomainEvents.dispatchEventsForAggregate(answer.id) // ✅ adicionar isso
}
```

## DomainEvents.dispatch — por que é assíncrono

```typescript
// domain-events.ts
static dispatch(aggregate: AggregateRoot) {
  const domainEvents = this.handlersMap.get(aggregate.constructor.name)

  if (domainEvents) {
    // Sem await — não bloqueia o fluxo
    domainEvents.forEach((callback) => callback(aggregate))
  }
}
```

## Rodando testes específicos

```bash
# Rode apenas o teste de evento específico (recomendado durante dev)
npx vitest run src/infra/events/on-answer-created.e2e-spec.ts

# Ou filtrando por path
npx vitest --testPathPattern "on-answer-created"
```