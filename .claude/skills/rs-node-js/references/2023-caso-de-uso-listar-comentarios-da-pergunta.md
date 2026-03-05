---
name: rs-node-js-2023-fetch-question-comments
description: "Applies DDD fetch/list use case pattern with pagination when writing Node.js repository queries or use cases. Use when user asks to 'list items', 'fetch comments', 'paginate results', 'create a findMany method', or 'list by parent entity'. Enforces pagination params reuse, semantic naming in repositories, and proper empty-array-not-null return convention. Make sure to use this skill whenever creating list/fetch use cases in clean architecture projects. Not for single-item lookups, mutations, or authentication use cases."
---

# Caso de Uso: Fetch com Paginacao (DDD + Clean Architecture)

> Todo caso de uso de listagem segue o padrao: repositorio com findManyBy + PaginationParams, retorno sempre array (nunca null), e teste unitario com paginacao.

## Rules

1. **Retorno de listagem e sempre array, nunca null** — `QuestionComment[]` nao `QuestionComment[] | null`, porque array vazio ja representa "nenhum resultado encontrado"
2. **Reuse PaginationParams em todo findMany** — toda listagem recebe `{ page: number }` via interface compartilhada, porque paginacao e universal em listagens
3. **Nomeie pelo contexto semantico** — `findManyByQuestionId` nao `findMany`, porque o repositorio precisa expressar o filtro no nome do metodo
4. **Reaproveite estrutura de casos de uso similares** — copie o fetch existente e adapte nomes, porque a estrutura (execute, repositorio, retorno) e identica entre listagens
5. **Teste sempre dois cenarios** — listagem basica (3 itens) + paginacao (22 itens, pagina 2 = 2 itens), porque valida tanto o filtro quanto o offset

## How to write

### Use case

```typescript
interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

interface FetchQuestionCommentsUseCaseResponse {
  questionComments: QuestionComment[] // nunca null
}

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, { page })

    return { questionComments }
  }
}
```

### Repository interface

```typescript
export abstract class QuestionCommentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> // array, NUNCA null
}
```

### In-memory repository

```typescript
async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
  const questionComments = this.items
    .filter((item) => item.questionId.toString() === questionId)
    .slice((page - 1) * 20, page * 20)

  return questionComments
}
```

## Example

**Before (anti-pattern):**
```typescript
// Retorno null quando nao encontra
async findManyByQuestionId(id: string): Promise<QuestionComment[] | null> {
  const items = this.items.filter(i => i.qId === id)
  return items.length ? items : null
}
```

**After (com esta skill):**
```typescript
// Array vazio = nenhum resultado. Sem null. Com paginacao.
async findManyByQuestionId(
  questionId: string,
  { page }: PaginationParams,
): Promise<QuestionComment[]> {
  return this.items
    .filter((item) => item.questionId.toString() === questionId)
    .slice((page - 1) * 20, page * 20)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo caso de uso de listagem | Copie o fetch mais similar, troque nomes semanticamente |
| Metodo findMany no repositorio | Sempre receba PaginationParams como segundo argumento |
| Teste de listagem | Crie 3 itens com o mesmo parentId, valide `.length === 3` |
| Teste de paginacao | Crie 22 itens, busque pagina 2, valide `.length === 2` |
| Retorno vazio | Retorne `[]`, nunca `null` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Promise<Comment[] \| null>` | `Promise<Comment[]>` |
| `findMany(id: string)` sem paginacao | `findMany(id: string, params: PaginationParams)` |
| `if (!items.length) return null` | `return items` (array vazio e valido) |
| Teste so com 1 cenario de listagem | Teste basico + teste de paginacao |
| Nomes genericos: `findAll`, `getList` | Nomes com filtro: `findManyByQuestionId` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-listar-comentarios-da-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-listar-comentarios-da-pergunta/references/code-examples.md)
