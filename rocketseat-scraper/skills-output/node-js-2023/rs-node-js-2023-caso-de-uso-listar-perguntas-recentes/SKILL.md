---
name: rs-node-js-2023-listar-perguntas-recentes
description: "Applies DDD list/fetch use case patterns with pagination when writing Node.js repository methods, use cases, or tests. Use when user asks to 'create a use case', 'list entities', 'paginate results', 'fetch recent items', or 'implement repository methods'. Enforces naming conventions (fetch vs get), pagination params extraction, in-memory repository sorting/slicing, and test structure for paginated queries. Make sure to use this skill whenever implementing list endpoints or paginated queries in DDD/Clean Architecture. Not for single-entity retrieval, database ORM configuration, or HTTP controller implementation."
---

# Caso de Uso: Listagem com Paginacao (DDD)

> Use cases de listagem usam `fetch`/`list` no nome, recebem paginacao como parametro obrigatorio, e delegam ordenacao/slice ao repositorio.

## Rules

1. **Use `fetch` ou `list` para listagens, `get` para registro unico** — `FetchRecentQuestions` nao `GetRecentQuestions`, porque semanticamente `get` implica um unico resultado enquanto `fetch`/`list` implica colecao
2. **Paginacao e obrigatoria em listagens** — entidades podem crescer indefinidamente, sempre receba `page` como parametro do use case
3. **Extraia PaginationParams para core** — crie `core/repositories/pagination-params.ts` com interface reutilizavel, porque page nao e dado de dominio, e metadado compartilhado
4. **Prefixe metodos do repositorio com `findMany` ou `findBy`** — `findManyRecent` para listagens, `findBySlug` para registro unico, porque o prefixo comunica a cardinalidade do retorno
5. **Nao passe parametros soltos ao repositorio** — use `{ page }` via PaginationParams, porque novos metadados (perPage, filters) serao adicionados sem quebrar assinatura
6. **Teste ordenacao e paginacao separadamente** — um teste valida ordem, outro valida slice, porque cada comportamento tem logica independente

## How to write

### PaginationParams (core)

```typescript
// src/core/repositories/pagination-params.ts
export interface PaginationParams {
  page: number
}
```

### Metodo do repositorio (interface)

```typescript
// No contrato do repositorio
findManyRecent(params: PaginationParams): Promise<Question[]>
```

### In-Memory Repository (sort + slice)

```typescript
async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
  const questions = this.items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice((page - 1) * 20, page * 20)

  return questions
}
```

### Use case

```typescript
interface FetchRecentQuestionsRequest {
  page: number
}

interface FetchRecentQuestionsResponse {
  questions: Question[]
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ page }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })
    return { questions }
  }
}
```

## Example

**Teste de ordenacao:**
```typescript
it('should fetch recent questions ordered by creation date', async () => {
  await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }))
  await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }))
  await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }))

  const { questions } = await sut.execute({ page: 1 })

  expect(questions).toEqual([
    expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
    expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
    expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
  ])
})
```

**Teste de paginacao:**
```typescript
it('should fetch paginated recent questions', async () => {
  for (let i = 1; i <= 22; i++) {
    await repository.create(makeQuestion())
  }

  const { questions } = await sut.execute({ page: 2 })

  expect(questions).toHaveLength(2)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Listagem de qualquer entidade | Sempre receba `page`, use `findMany*` |
| Registro unico por identificador | Use `get` no use case, `findBy*` no repo |
| Factory (makeQuestion) com campo opcional | Permita override via props, use default so se nao informado |
| Testar ordenacao | Crie itens com datas explicitas e valide ordem no array |
| Testar paginacao | Crie N+extras itens, busque pagina 2, valide `.toHaveLength(extras)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `GetRecentQuestions` (para listagem) | `FetchRecentQuestions` ou `ListRecentQuestions` |
| `findRecent(page: number)` | `findManyRecent({ page }: PaginationParams)` |
| `this.items.slice(0, 20)` sem sort | `this.items.sort(...).slice(...)` |
| Testar ordem e paginacao no mesmo teste | Testes separados para cada comportamento |
| `createdAt: new Date()` hardcoded na factory | `props.createdAt ?? new Date()` com override |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
