# Code Examples: Controller de Listagem de Respostas

## Controller completo

```typescript
// src/infra/http/controllers/fetch-question-answers.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      questionId,
      page,
    })

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
```

## Presenter

```typescript
// src/infra/http/presenters/answer-presenter.ts
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHttp(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
```

## Teste e2e completo

```typescript
// src/infra/http/controllers/fetch-question-answers.controller.e2e-spec.ts
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all([
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer 01',
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer 02',
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer 01' }),
        expect.objectContaining({ content: 'Answer 02' }),
      ]),
    })
  })
})
```

## Registro no HttpModule

```typescript
// src/infra/http/http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    FetchQuestionAnswersController,
  ],
  providers: [
    // ... outros providers
    FetchQuestionAnswersUseCase,
  ],
})
export class HttpModule {}
```

## Padrao generico para qualquer recurso filho

```typescript
// Template: listar recursos filhos por ID do pai
@Controller('/:parentResource/:parentId/:childResource')
export class FetchParentChildrenController {
  constructor(private useCase: FetchParentChildrenUseCase) {}

  @Get()
  async handle(@Param('parentId') parentId: string) {
    const result = await this.useCase.execute({ parentId })
    const children = result.value.children
    return { children: children.map(ChildPresenter.toHttp) }
  }
}
```