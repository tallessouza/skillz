# Code Examples: Controller Listar Comentarios da Resposta

## Exemplo 1: Controller completo

### Arquivo: `fetch-answer-comments.controller.ts`

```typescript
import { Controller, Get, Param, Query } from '@nestjs/common'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query('page') page: number,
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page: page ?? 1,
    })

    if (result.isLeft()) {
      throw new Error('Unexpected error')
    }

    return { comments: result.value.answerComments }
  }
}
```

## Exemplo 2: Teste e2e completo

### Arquivo: `fetch-answer-comments.controller.e2e-spec.ts`

```typescript
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { StudentFactory } from 'test/factories/make-student'
import { JwtService } from '@nestjs/jwt'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
    })

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
      }),
      answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
      }),
    ])

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ authorId: user.id.toString() }),
        expect.objectContaining({ authorId: user.id.toString() }),
      ]),
    })
  })
})
```

## Exemplo 3: Registro no HttpModule

```typescript
// http.module.ts — adicoes necessarias
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

@Module({
  controllers: [
    // ... controllers existentes
    FetchAnswerCommentsController,
  ],
  providers: [
    // ... providers existentes
    FetchAnswerCommentsUseCase,
  ],
})
export class HttpModule {}
```

## Exemplo 4: Injectable no use case

```typescript
// O use case precisa do decorator @Injectable() para funcionar como provider NestJS
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchAnswerCommentsUseCase {
  // ... implementacao do use case
}
```

## Padrao de substituicao (checklist)

Ao copiar de `FetchQuestionComments` para `FetchAnswerComments`:

| Original | Substituir por |
|----------|---------------|
| `FetchQuestionComments` | `FetchAnswerComments` |
| `questionId` | `answerId` |
| `question-comments` | `answer-comments` |
| `/questions/:questionId/comments` | `/answers/:answerId/comments` |
| `QuestionCommentFactory` | `AnswerCommentFactory` |
| `questionComments` | `answerComments` |
| `makeQuestionComment` | `makeAnswerComment` |