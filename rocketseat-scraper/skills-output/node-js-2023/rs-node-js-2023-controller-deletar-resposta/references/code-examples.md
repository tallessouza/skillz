# Code Examples: Controller Deletar Resposta

## Controller Completo

```typescript
// src/infra/http/controllers/delete-answer.controller.ts
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') answerId: string) {
    await this.deleteAnswer.execute({
      answerId,
      authorId: /* current user id from auth */,
    })
  }
}
```

## Teste E2E Completo

```typescript
// src/infra/http/controllers/delete-answer.controller.e2e-spec.ts
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { JwtService } from '@nestjs/jwt'

describe('Delete answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findUnique({
      where: { id: answerId },
    })

    expect(answerOnDatabase).toBeNull()
  })
})
```

## Registrando no Modulo

```typescript
// No modulo HTTP, adicionar:
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

@Module({
  controllers: [
    // ... outros controllers
    DeleteAnswerController,
  ],
  providers: [
    // ... outros providers
    DeleteAnswerUseCase,
  ],
})
export class HttpModule {}
```

## Tecnica de Debug para Erro 500

```typescript
// Temporario — usar quando teste e2e retorna 500 sem detalhes
@Delete()
@HttpCode(204)
async handle(@Param('id') answerId: string) {
  try {
    await this.deleteAnswer.execute({ answerId })
  } catch (error) {
    console.log(error) // Ver erro real no console do teste
    throw error
  }
}
```

## Comparacao: Delete Question vs Delete Answer

A estrutura e identica — so muda a entidade:

```typescript
// Delete Question
@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') questionId: string) {
    await this.deleteQuestion.execute({ questionId })
  }
}

// Delete Answer (mesma estrutura, entidade diferente)
@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') answerId: string) {
    await this.deleteAnswer.execute({ answerId })
  }
}
```