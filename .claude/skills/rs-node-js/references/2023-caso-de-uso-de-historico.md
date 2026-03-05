---
name: rs-node-js-2023-caso-de-uso-de-historico
description: "Enforces use-case patterns for listing resources with pagination in Node.js SOLID APIs. Use when user asks to 'create a use case', 'list items with pagination', 'fetch history', 'implement pagination', or 'create repository methods for listing'. Applies rules: fetch=list vs get=single, findMany=list vs findBy=single, page-based slice pagination (page-1)*perPage, TDD for paginated endpoints. Make sure to use this skill whenever implementing list/history use cases with pagination. Not for single-resource fetching, authentication, or database-specific query optimization."
---

# Caso de Uso de Historico com Paginacao

> Ao implementar listagem de recursos, use convencoes semanticas de nomenclatura e paginacao por slice com testes TDD.

## Rules

1. **Use `Fetch` para listas, `Get` para item unico** — `FetchUserCheckInsHistoryUseCase` nao `GetUserCheckInsHistoryUseCase`, porque a semantica do nome comunica imediatamente se o retorno e singular ou plural
2. **Use `findMany` para listas, `findBy` para item unico no repositorio** — `findManyByUserId` nao `findByUserId` quando retorna array, porque mantem consistencia semantica entre use case e repositorio
3. **Retorne sempre array, mesmo vazio** — `Promise<CheckIn[]>` nunca `Promise<CheckIn[] | null>`, porque lista vazia e um resultado valido, nao ausencia de resultado
4. **Paginacao por slice: `(page - 1) * perPage`** — porque indices comecam em 0, entao pagina 1 deve comecar no indice 0
5. **Teste paginacao com N+2 itens** — se pagina tem 20 itens, crie 22 no teste para validar que pagina 2 retorna apenas 2 itens
6. **Use `expect.objectContaining` para validar listas** — nao precisa comparar objeto inteiro, valide apenas os campos relevantes

## How to write

### Use Case com paginacao

```typescript
interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
```

### Metodo do repositorio (interface)

```typescript
export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
```

### Implementacao in-memory com slice

```typescript
async findManyByUserId(userId: string, page: number) {
  return this.items
    .filter((item) => item.user_id === userId)
    .slice((page - 1) * 20, page * 20)
}
```

### Teste TDD para paginacao

```typescript
it('should be able to fetch paginated check-in history', async () => {
  for (let i = 1; i <= 22; i++) {
    await checkInsRepository.create({
      gym_id: `gym-${i}`,
      user_id: 'user-01',
    })
  }

  const { checkIns } = await sut.execute({
    userId: 'user-01',
    page: 2,
  })

  expect(checkIns).toHaveLength(2)
  expect(checkIns).toEqual([
    expect.objectContaining({ gym_id: 'gym-21' }),
    expect.objectContaining({ gym_id: 'gym-22' }),
  ])
})
```

## Example

**Before (sem convencoes):**
```typescript
class GetCheckInsUseCase {
  async execute(userId: string) {
    const result = this.repo.findByUser(userId)
    return result || null
  }
}
```

**After (com this skill applied):**
```typescript
class FetchUserCheckInsHistoryUseCase {
  async execute({ userId, page }: Request): Promise<Response> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)
    return { checkIns }
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Retorna lista de recursos | Prefixe com `Fetch`, use `findMany` no repo |
| Retorna recurso unico | Prefixe com `Get`, use `findBy` no repo |
| Paginacao necessaria | Receba `page` como parametro, use slice `(page-1)*perPage` |
| Teste de listagem | Crie registros via repositorio antes de chamar use case |
| Teste de paginacao | Crie perPage+2 itens, valide pagina 2 com 2 itens |
| Validacao parcial de objetos | Use `expect.objectContaining` com campos-chave |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `GetUsersUseCase` (lista) | `FetchUsersUseCase` |
| `findByUserId(): CheckIn[]` | `findManyByUserId(): CheckIn[]` |
| `return result \|\| null` (lista) | `return { checkIns }` (array vazio e valido) |
| `.slice(page * 20, ...)` | `.slice((page - 1) * 20, page * 20)` |
| `expect(list).toEqual([fullObj])` | `expect(list).toEqual([expect.objectContaining({key})])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-de-historico/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-de-historico/references/code-examples.md)
