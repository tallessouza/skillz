---
name: rs-node-js-2023-listando-perguntas-recentes
description: "Applies the Presenter pattern and controller-to-use-case wiring in NestJS Clean Architecture when listing or fetching domain entities for HTTP responses. Use when user asks to 'list items', 'fetch recent', 'return data from API', 'format response', or 'create a presenter'. Ensures domain entities are never leaked raw to HTTP layer. Make sure to use this skill whenever wiring NestJS controllers to use cases or formatting domain entities for API responses. Not for database schema design, authentication, or frontend components."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [presenter, nestjs, controller, use-case, clean-architecture, http-response, domain-entity]
---

# Listando Perguntas Recentes — Controller → UseCase → Presenter

> Nunca retorne entidades de dominio diretamente na resposta HTTP; use um Presenter para formatar os dados como o frontend espera.

## Rules

1. **Controller chama UseCase, nunca repositorio direto** — remova qualquer acesso direto ao Prisma/ORM do controller, porque o controller pertence a camada de infra HTTP e nao deve conhecer detalhes de persistencia
2. **UseCase recebe `@Injectable()`** — mesmo que "suje" a camada de dominio, o decorator do NestJS e necessario para injecao de dependencia, e o trade-off e aceitavel
3. **Registre o UseCase nos providers do modulo HTTP** — sem isso o NestJS nao consegue injetar o caso de uso no controller, causando erro silencioso
4. **Use Presenter para formatar a resposta** — entidades de dominio usam `_id`, `props`, `WatchedList` internamente; o frontend espera campos planos como `id`, `title`, `slug`
5. **Presenter e uma funcao pura de mapeamento** — recebe a entidade de dominio, retorna um objeto plano serializavel para JSON

## How to write

### Controller chamando UseCase

```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryParamPipe) page: number) {
    const result = await this.fetchRecentQuestions.execute({ page })

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
```

### Presenter

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

### Registro no modulo

```typescript
@Module({
  controllers: [
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase, // Nao esqueca de adicionar aqui
  ],
})
export class HttpModule {}
```

## Example

**Before (entidade de dominio vazando direto):**
```json
{
  "_id": { "value": "abc-123" },
  "props": {
    "title": "Como usar NestJS?",
    "slug": { "_value": "como-usar-nestjs" },
    "attachments": { "currentItems": [], "initial": [] }
  }
}
```

**After (com Presenter aplicado):**
```json
{
  "id": "abc-123",
  "title": "Como usar NestJS?",
  "slug": "como-usar-nestjs",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Controller acessa Prisma diretamente | Extraia para UseCase + Repository |
| Resposta HTTP mostra `_id` ou `props` | Crie um Presenter |
| Erro de injecao no controller | Verifique se UseCase esta nos `providers` do modulo |
| UseCase precisa de `@Injectable()` | Adicione mesmo na camada de dominio — trade-off aceitavel |
| Endpoint retorna lista | Use `.map(Presenter.toHTTP)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return { questions }` (entidade crua) | `return { questions: questions.map(QuestionPresenter.toHTTP) }` |
| `this.prisma.question.findMany()` no controller | `this.fetchRecentQuestions.execute({ page })` |
| Formatacao inline no controller | Metodo estatico no Presenter |
| Esquecer provider no module | Sempre adicionar UseCase nos `providers` |

## Troubleshooting

### Resposta HTTP mostra _id, props e WatchedList internos da entidade
**Symptom:** API retorna campos internos do dominio como `_id.value` e `props.title` ao inves de `id` e `title`
**Cause:** Entidade de dominio esta sendo retornada diretamente sem passar por um Presenter
**Fix:** Crie um `QuestionPresenter.toHTTP(question)` que mapeia campos internos para formato plano e use `.map(QuestionPresenter.toHTTP)`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
