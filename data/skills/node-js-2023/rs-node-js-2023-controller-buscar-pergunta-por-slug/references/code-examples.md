# Code Examples: Controller Buscar Pergunta por Slug

## Controller completo

```typescript
// src/infra/http/controllers/get-question-by-slug.controller.ts
import { Controller, Get, Param, BadRequestException } from '@nestjs/common'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHttp(result.value.question) }
  }
}
```

## Comparacao: controller de listagem vs controller de recurso unico

### Listagem (FetchRecentQuestions)
```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryParamPipe) page: number) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    // Retorna ARRAY mapeado
    return { questions: result.value.questions.map(QuestionPresenter.toHttp) }
  }
}
```

### Recurso unico (GetQuestionBySlug)
```typescript
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    // Retorna OBJETO unico
    return { question: QuestionPresenter.toHttp(result.value.question) }
  }
}
```

## Registro no HttpModule

```typescript
// src/infra/http/http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    GetQuestionBySlugController, // Registrar o controller
  ],
  providers: [
    // ... outros providers
    GetQuestionBySlugUseCase, // Registrar o use case como provider
  ],
})
export class HttpModule {}
```

## Use case com @Injectable()

```typescript
// No dominio, o use case precisa do decorator do NestJS
import { Injectable } from '@nestjs/common'

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugUseCaseRequest) {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
```

## E2E Test completo

```typescript
// src/infra/http/controllers/get-question-by-slug.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('question-01'),
      title: 'Question 01',
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 01' }),
    })
  })
})
```

## Script de watch para E2E tests

```json
// package.json
{
  "scripts": {
    "test:e2e": "vitest run --config ./vitest.config.e2e.ts",
    "test:e2e:watch": "vitest --config ./vitest.config.e2e.ts"
  }
}
```

A unica diferenca e remover `run` — sem ele, o vitest entra em modo watch e re-executa apenas os testes cujos arquivos relacionados mudaram.