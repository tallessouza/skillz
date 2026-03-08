---
name: rs-node-js-2023-presenter-de-perguntas
description: "Applies the Presenter pattern when building HTTP API responses in NestJS or Node.js. Use when user asks to 'create an endpoint', 'return data from API', 'format response', 'list resources', or 'map domain to response'. Enforces separation between domain entities and HTTP output, controls which fields are exposed, and handles Result/Either patterns. Make sure to use this skill whenever creating or modifying controller responses that return domain objects. Not for database mappers, GraphQL resolvers, or domain logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: presenter-pattern
  tags: [presenter, http-response, nestjs, clean-architecture, value-objects, domain-mapping]
---

# Presenter Pattern (Camada HTTP)

> Nunca retorne entidades de dominio diretamente — converta para o formato exato que o front-end precisa atraves de um Presenter.

## Rules

1. **Presenter e especifico da porta de saida** — criar dentro de `presenters/` na camada HTTP, porque outras portas (GraphQL, gRPC) teriam seus proprios presenters
2. **Metodo estatico `toHTTP`** — recebe entidade do dominio, retorna objeto plano com apenas os campos necessarios, porque evita vazamento de dados internos
3. **Importe do dominio, nunca do Prisma** — o Presenter converte dominio→HTTP, nao banco→HTTP, porque mantem a separacao de camadas
4. **Retorne apenas campos necessarios para a tela** — numa listagem, nao inclua `content` se so precisa de `title` e `slug`, porque reduz payload e evita expor dados desnecessarios
5. **Trate Value Objects corretamente** — use `.value` para Slug, `.toString()` para UniqueEntityId, e optional chaining `?.` para campos nullable como `bestAnswerId`
6. **Use `.map()` com o Presenter no controller** — `questions.map(QuestionPresenter.toHTTP)`, porque padroniza a conversao de listas

## How to write

### Presenter basico

```typescript
// src/infra/http/presenters/question-presenter.ts
import { Question } from '@/domain/forum/enterprise/entities/question'

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

### Uso no controller com Result/Either

```typescript
// No controller
const result = await this.fetchRecentQuestions.execute({ page })

if (result.isLeft()) {
  throw new BadRequestException()
}

const questions = result.value.questions

return { questions: questions.map(QuestionPresenter.toHTTP) }
```

## Example

**Before (retornando dominio direto):**
```typescript
// Controller retorna entidade crua — expoe campos internos, Value Objects nao serializados
return { questions }
```

**After (com Presenter):**
```typescript
return { questions: questions.map(QuestionPresenter.toHTTP) }
// Resultado: [{ id: "uuid", title: "...", slug: "minha-pergunta", bestAnswerId: null, createdAt: "...", updatedAt: "..." }]
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Listagem de recursos | Presenter sem `content` — so campos de preview |
| Detalhe de um recurso | Presenter com `content` — pode ser outro Presenter |
| Campo e Value Object (Slug, Email) | Extrair `.value` no Presenter |
| Campo e UniqueEntityId | Usar `.toString()` no Presenter |
| Campo opcional (bestAnswerId) | Usar optional chaining `?.toString()` |
| Multiplas portas (HTTP + GraphQL) | Prefixar: `HttpQuestionPresenter`, `GqlQuestionPresenter` |
| So tem HTTP | Nome simples: `QuestionPresenter` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `return { questions }` (dominio direto) | `return { questions: questions.map(QuestionPresenter.toHTTP) }` |
| Importar `Question` do Prisma no Presenter | Importar `Question` do dominio |
| Retornar todos os campos sempre | Selecionar campos por contexto (listagem vs detalhe) |
| `question.slug` (Value Object cru) | `question.slug.value` |
| `question.bestAnswerId.toString()` (sem null check) | `question.bestAnswerId?.toString()` |
| Converter no proprio controller | Delegar para classe Presenter dedicada |

## Troubleshooting

### Value Object retorna [object Object] na resposta JSON
**Symptom:** A resposta da API mostra `[object Object]` em vez do valor do Slug ou UniqueEntityId
**Cause:** O Presenter nao esta extraindo `.value` ou `.toString()` dos Value Objects do dominio
**Fix:** Use `question.slug.value` para Slug e `question.id.toString()` para UniqueEntityId no metodo `toHTTP`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
