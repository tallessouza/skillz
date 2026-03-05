---
name: rs-node-2023-caso-de-uso-de-metricas
description: "Applies the metrics use case pattern when creating count/aggregation use cases in Node.js with SOLID principles. Use when user asks to 'create a metrics use case', 'count records by user', 'get user statistics', 'implement dashboard data', or 'add aggregation use case'. Follows pattern: repository count method, simple use case without pagination, return typed count. Make sure to use this skill whenever building count-based queries or metrics endpoints in SOLID architecture. Not for complex analytics, time-series data, or chart rendering."
---

# Caso de Uso de Metricas

> Casos de uso de contagem/metricas sao os mais simples da aplicacao: um metodo count no repositorio, sem paginacao, retornando um numero tipado.

## Rules

1. **Crie um metodo count no repositorio** — `countByUserId(userId: string): Promise<number>`, porque metricas sao agregacoes, nao listas paginadas
2. **Sem paginacao em metricas de contagem** — retorne apenas o numero, porque um count nao precisa de page/offset
3. **Nomeie o retorno pelo que ele mede** — `checkInsCount` nao `count` ou `data`, porque o use case pode evoluir para retornar multiplas metricas
4. **Reutilize o repositorio existente** — adicione o metodo count na interface do repositorio que ja existe (ex: CheckInsRepository), porque metricas consomem os mesmos dados
5. **Implemente o in-memory primeiro** — `items.filter(...).length` no repositorio em memoria, porque o teste unitario roda antes do banco real
6. **Planeje a evolucao** — retorne um objeto `{ checkInsCount }` nao um numero solto, porque futuramente outras metricas serao adicionadas

## How to write

### Interface do repositorio (adicionar metodo)

```typescript
// Adicione ao repositorio existente, nao crie um novo
export interface CheckInsRepository {
  // ... metodos existentes
  countByUserId(userId: string): Promise<number>
}
```

### In-Memory Repository

```typescript
async countByUserId(userId: string): Promise<number> {
  return this.items.filter((checkIn) => checkIn.user_id === userId).length
}
```

### Use Case

```typescript
interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
```

## Example

**Before (anti-pattern — buscando tudo para contar):**
```typescript
async execute({ userId }) {
  const checkIns = await this.checkInsRepository.findManyByUserId(userId, 1)
  return { count: checkIns.length } // Retorna apenas a primeira pagina!
}
```

**After (com esta skill):**
```typescript
async execute({ userId }) {
  const checkInsCount = await this.checkInsRepository.countByUserId(userId)
  return { checkInsCount }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de um numero total (lifetime) | Metodo `countBy...` no repositorio |
| Precisa de contagem por periodo | Metodo `countBy...Between(userId, startDate, endDate)` |
| Precisa de multiplas metricas | Retorne objeto com cada metrica nomeada |
| Query sera complexa no banco real | Implemente simples no in-memory, otimize no Prisma depois |
| Use case parece com outro existente | Copie e adapte — padrao valido para use cases simples |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Buscar todos os registros e contar no JS | `countByUserId` dedicado no repositorio |
| Retornar `number` direto do use case | Retornar `{ checkInsCount: number }` (extensivel) |
| Adicionar paginacao em contagem | Contagem e um numero, nao precisa de page |
| Criar repositorio separado para metricas | Adicionar metodo count no repositorio existente |
| Nomear retorno como `count` ou `data` | Nomear pelo dominio: `checkInsCount` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
