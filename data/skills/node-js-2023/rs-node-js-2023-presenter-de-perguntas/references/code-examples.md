# Code Examples: Presenter Pattern

## Estrutura de pastas

```
src/infra/http/
├── controllers/
│   └── fetch-recent-questions.controller.ts
└── presenters/
    └── question-presenter.ts
```

## QuestionPresenter completo

```typescript
// src/infra/http/presenters/question-presenter.ts
import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,          // Value Object → string
      bestAnswerId: question.bestAnswerId?.toString(), // Optional UniqueEntityId
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      // Nota: content NAO incluido — listagem nao precisa
    }
  }
}
```

## Uso no controller

```typescript
// src/infra/http/controllers/fetch-recent-questions.controller.ts
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryParamPipe) page: number) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
```

## Variacao: Presenter com content (para detalhe)

```typescript
// Para uma rota GET /questions/:slug que retorna o detalhe
export class QuestionDetailPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,           // Incluido no detalhe
      bestAnswerId: question.bestAnswerId?.toString(),
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
```

## Resposta HTTP resultante

```json
{
  "questions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Como usar Presenter no NestJS?",
      "slug": "como-usar-presenter-no-nestjs",
      "bestAnswerId": null,
      "createdAt": "2023-10-15T10:30:00.000Z",
      "updatedAt": "2023-10-15T10:30:00.000Z"
    }
  ]
}
```

## Padroes de conversao de Value Objects no Presenter

```typescript
// UniqueEntityId (obrigatorio)
id: question.id.toString()

// UniqueEntityId (opcional)
bestAnswerId: question.bestAnswerId?.toString()

// Slug (Value Object com .value)
slug: question.slug.value

// Email (Value Object com .value) — exemplo hipotetico
email: user.email.value

// Enum — retorna direto
status: question.status

// Date — retorna direto (JSON.stringify serializa automaticamente)
createdAt: question.createdAt
```