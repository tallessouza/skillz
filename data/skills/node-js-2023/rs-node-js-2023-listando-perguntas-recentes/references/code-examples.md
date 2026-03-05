# Code Examples: Listando Perguntas Recentes

## Controller antes da refatoracao (acesso direto ao Prisma)

```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryParamPipe) page: number) {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
```

## Controller depois da refatoracao (usando UseCase)

```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(
    private fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(@Query('page', queryParamPipe) page: number) {
    const result = await this.fetchRecentQuestions.execute({ page })

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
```

## UseCase com @Injectable()

```typescript
@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({ questions })
  }
}
```

## Presenter completo

```typescript
export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
```

## Registro no HttpModule

```typescript
@Module({
  controllers: [
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
  ],
})
export class HttpModule {}
```

## Presenter para outras entidades (pattern reutilizavel)

```typescript
// AnswerPresenter
export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}

// CommentPresenter
export class CommentPresenter {
  static toHTTP(comment: Comment) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
    }
  }
}
```

## Exemplo de resposta JSON antes vs depois

### Antes (sem Presenter — entidade crua)

```json
[
  {
    "_id": { "value": "550e8400-e29b-41d4-a716-446655440000" },
    "props": {
      "title": "Como configurar NestJS com Prisma?",
      "content": "Estou tentando configurar...",
      "slug": { "_value": "como-configurar-nestjs-com-prisma" },
      "authorId": { "value": "author-1" },
      "bestAnswerId": null,
      "attachments": {
        "currentItems": [],
        "initial": [],
        "new": [],
        "removed": []
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": null
    },
    "_domainEvents": []
  }
]
```

### Depois (com Presenter)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Como configurar NestJS com Prisma?",
    "slug": "como-configurar-nestjs-com-prisma",
    "bestAnswerId": null,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": null
  }
]
```