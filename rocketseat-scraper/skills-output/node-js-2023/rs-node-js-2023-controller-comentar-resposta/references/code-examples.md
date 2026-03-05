# Code Examples: Controller Comentar Resposta

## Exemplo completo do controller

```typescript
// src/infra/http/controllers/comment-on-answer.controller.ts
import { Body, Controller, Param, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Param('answerId') answerId: string,
    @Body() body: { content: string },
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const userId = user.sub

    await this.commentOnAnswer.execute({
      answerId,
      authorId: userId,
      content,
    })
  }
}
```

## Exemplo completo do teste E2E

```typescript
// src/infra/http/controllers/comment-on-answer.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Comment on answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
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

  test('[POST] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'new comment' })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'new comment',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
```

## Registro no HttpModule

```typescript
// src/infra/http/http.module.ts (trecho relevante)
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

@Module({
  controllers: [
    // ... outros controllers
    CommentOnAnswerController,
  ],
  providers: [
    // ... outros providers
    CommentOnAnswerUseCase,
  ],
})
export class HttpModule {}
```

## Comparacao lado a lado: Question vs Answer

| Aspecto | CommentOnQuestion | CommentOnAnswer |
|---------|-------------------|-----------------|
| Rota | `/questions/:questionId/comments` | `/answers/:answerId/comments` |
| Param | `questionId` | `answerId` |
| Use case | `CommentOnQuestionUseCase` | `CommentOnAnswerUseCase` |
| Body | `{ content }` | `{ content }` |
| Teste: entidade pai | `questionFactory` | `questionFactory` + `answerFactory` |
| Teste: cadeia | question → comment | question → answer → comment |
| HTTP status | 201 | 201 |