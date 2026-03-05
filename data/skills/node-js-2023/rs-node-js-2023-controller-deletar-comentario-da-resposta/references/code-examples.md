# Code Examples: Controller Deletar Comentario da Resposta

## 1. Estrutura do controller

```typescript
// src/infra/http/controllers/deleteAnswerComment.controller.ts
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
```

## 2. Registro no HTTP Module

```typescript
// src/infra/http/http.module.ts
import { DeleteAnswerCommentController } from './controllers/deleteAnswerComment.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Module({
  controllers: [
    // ... controllers existentes
    DeleteAnswerCommentController,
  ],
  providers: [
    // ... providers existentes
    DeleteAnswerCommentUseCase,
  ],
})
export class HttpModule {}
```

## 3. Teste e2e completo

```typescript
// src/infra/http/controllers/deleteAnswerComment.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user.id,
    })

    const answerCommentId = answerComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
```

## 4. Bug no repositorio Prisma (correcao)

```typescript
// ANTES (bug): referenciava question ao inves de comment
async delete(answerComment: AnswerComment) {
  await this.prisma.comment.delete({
    where: { id: answerComment.questionId.toString() }, // BUG
  })
}

// DEPOIS (corrigido): referencia correta ao id do comment
async delete(answerComment: AnswerComment) {
  await this.prisma.comment.delete({
    where: { id: answerComment.id.toString() }, // CORRETO
  })
}
```

## 5. Comparacao: Question vs Answer Comment Controller

```typescript
// deleteQuestionComment → deleteAnswerComment
// Diferencas:

// Rota:
@Controller('/questions/comments/:id')  // Question
@Controller('/answers/comments/:id')    // Answer

// Parametro:
@Param('id') questionCommentId: string  // Question
@Param('id') answerCommentId: string    // Answer

// Use case:
DeleteQuestionCommentUseCase            // Question
DeleteAnswerCommentUseCase              // Answer

// Factories no teste:
QuestionCommentFactory                  // Question
AnswerFactory + AnswerCommentFactory    // Answer (precisa de mais factories)
```