# Code Examples: Disparando Eventos de Domínio

## Repositório Prisma de Answers completo

```typescript
// src/infra/database/prisma/repositories/prisma-answers-repository.ts
import { DomainEvents } from '@/core/events/domain-events'

export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({ data })

    // Dispatch FORA de Promise.all — é síncrono
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({
      where: { id: data.id },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
```

## Repositório Prisma de Questions completo

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { DomainEvents } from '@/core/events/domain-events'

export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({ data })

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: { id: data.id },
      data,
    })

    // Importante: save dispara eventos para o caso de
    // "escolher melhor resposta" que modifica a question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
```

## Classe DomainEvents com shouldRun

```typescript
// src/core/events/domain-events.ts
export class DomainEvents {
  public static shouldRun = true

  // ... outras propriedades e métodos

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    if (!this.shouldRun) return

    const aggregate = this.findAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromList(aggregate)
    }
  }
}
```

## Setup E2E global

```typescript
// test/setup-e2e.ts
import { DomainEvents } from '@/core/events/domain-events'

beforeAll(async () => {
  DomainEvents.shouldRun = false

  // ... resto do setup (database, environment, etc)
})
```

## Teste E2E: OnAnswerCreated

```typescript
// src/infra/events/on-answer-created.e2e-spec.ts
import { DomainEvents } from '@/core/events/domain-events'
import { waitFor } from 'test/utils/wait-for'

describe('On Answer Created (E2E)', () => {
  // ... providers, setup

  beforeAll(async () => {
    DomainEvents.shouldRun = true

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    // ... get factories, prisma, jwt
    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer content',
        attachments: [],
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

## Teste E2E: OnQuestionBestAnswerChosen

```typescript
// src/infra/events/on-question-best-answer-chosen.e2e-spec.ts
import { DomainEvents } from '@/core/events/domain-events'
import { waitFor } from 'test/utils/wait-for'

describe('On Question Best Answer Chosen (E2E)', () => {
  beforeAll(async () => {
    DomainEvents.shouldRun = true

    // ... mesmo setup do módulo de teste
    await app.init()
  })

  it('should send a notification when question best answer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)

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

## Padrão waitFor (utilitário de teste)

```typescript
// test/utils/wait-for.ts
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
  interval = 10,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsed = 0

    const intervalId = setInterval(async () => {
      try {
        await assertions()
        clearInterval(intervalId)
        resolve()
      } catch (err) {
        elapsed += interval
        if (elapsed >= maxDuration) {
          clearInterval(intervalId)
          reject(err)
        }
      }
    }, interval)
  })
}
```