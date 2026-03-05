# Code Examples: Controller Listar Comentarios da Pergunta

## Exemplo completo do controller

```typescript
// src/infra/http/controllers/fetch-question-comments.controller.ts
import { Controller, Get, Param } from '@nestjs/common'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentPresenter } from '../presenters/comment-presenter'

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(@Param('questionId') questionId: string) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
    })

    const comments = result.value.comments

    return { comments: comments.map(CommentPresenter.toHTTP) }
  }
}
```

## Presenter generico para comentarios

```typescript
// src/infra/http/presenters/comment-presenter.ts
import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
```

Nota: o tipo generico `Comment<any>` e usado porque `Comment` e uma classe abstrata com props genericas. O `any` indica que nao nos importamos com as props especificas da subclasse neste presenter.

## Teste e2e completo

```typescript
// src/infra/http/controllers/fetch-question-comments.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { JwtService } from '@nestjs/jwt'

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 01',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 01' }),
        expect.objectContaining({ content: 'Comment 02' }),
      ]),
    })
  })
})
```

## Registro no modulo

```typescript
// src/infra/http/http.module.ts (trecho relevante)
@Module({
  controllers: [
    // ... outros controllers
    FetchQuestionCommentsController,
  ],
  providers: [
    // ... outros providers
    FetchQuestionCommentsUseCase,
  ],
})
export class HttpModule {}
```

## Comparacao: controller similar usado como base

O `FetchQuestionAnswersController` foi a base para copiar:

```typescript
// Original (answers)
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string) {
    const result = await this.fetchQuestionAnswers.execute({ questionId })
    return { answers: result.value.answers.map(AnswerPresenter.toHTTP) }
  }
}

// Derivado (comments) — mesma estrutura, nomes diferentes
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string) {
    const result = await this.fetchQuestionComments.execute({ questionId })
    return { comments: result.value.comments.map(CommentPresenter.toHTTP) }
  }
}
```

A estrutura e identica — so mudam os nomes. Isso confirma o padrao de copiar e substituir.