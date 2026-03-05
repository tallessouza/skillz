---
name: rs-api-com-bun-metrica-produtos-populares
description: "Generates aggregation queries with Drizzle ORM for ranking/metrics routes when user asks to 'create a metrics endpoint', 'get popular products', 'build a ranking route', 'aggregate sales data', or 'count with group by'. Applies pivot table joins, sum/count aggregations, groupBy with required select fields, orderBy with desc, and limit patterns. Make sure to use this skill whenever building analytics or ranking endpoints with Drizzle ORM. Not for simple CRUD routes, authentication, or non-aggregation queries."
---

# Rota de Metrica com Agregacao no Drizzle ORM

> Ao construir rotas de ranking/metricas, parta da tabela pivo (intermediaria) e faca joins para os lados, agrupe, ordene e limite.

## Rules

1. **Parta da tabela pivo** — `from(orderItems)` nao `from(products)`, porque a tabela intermediaria conecta ambos os lados com menos joins necessarios
2. **Use leftJoin, nao innerJoin, para relacoes 1:N** — um produto pode estar em varios pedidos, leftJoin preserva todos os registros do lado esquerdo
3. **Todo campo no groupBy deve aparecer no select** — obrigatorio no SQL, Drizzle exige o mesmo
4. **sum() retorna string** — sempre faca `.mapWith(Number)` para converter o resultado
5. **orderBy com funcao para acessar campos** — use a sintaxe `orderBy((fields) => desc(fields.amount))` para referenciar campos agregados
6. **Limite resultados de ranking** — sempre use `.limit(N)` para top-N queries

## How to write

### Rota de ranking com agregacao

```typescript
import { eq, desc, sum } from 'drizzle-orm'

const popularProducts = await db
  .select({
    product: products.name,
    amount: sum(orderItems.quantity).mapWith(Number),
  })
  .from(orderItems)
  .leftJoin(orders, eq(orders.id, orderItems.orderId))
  .leftJoin(products, eq(products.id, orderItems.productId))
  .where(eq(orders.restaurantId, restaurantId))
  .groupBy(products.name)
  .orderBy((fields) => {
    return desc(fields.amount)
  })
  .limit(5)
```

## Example

**Before (partindo da tabela errada, sem agregacao correta):**

```typescript
const popular = await db
  .select()
  .from(products)
  .leftJoin(orderItems, eq(orderItems.productId, products.id))
  .leftJoin(orders, eq(orders.id, orderItems.orderId))
  .where(eq(orders.restaurantId, restaurantId))
```

**After (partindo da tabela pivo, com agregacao, ordenacao e limite):**

```typescript
const popularProducts = await db
  .select({
    product: products.name,
    amount: sum(orderItems.quantity).mapWith(Number),
  })
  .from(orderItems)
  .leftJoin(orders, eq(orders.id, orderItems.orderId))
  .leftJoin(products, eq(products.id, orderItems.productId))
  .where(eq(orders.restaurantId, restaurantId))
  .groupBy(products.name)
  .orderBy((fields) => desc(fields.amount))
  .limit(5)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa rankear entidades por contagem/soma | Parta da tabela pivo, agrupe pela entidade |
| Relacionamento N:N (produto-pedido) | Use tabela intermediaria como `from()` |
| Agregacao retorna string (sum, count) | `.mapWith(Number)` sempre |
| Top-N resultados | `orderBy desc` + `.limit(N)` |
| Campo usado no groupBy | Inclua obrigatoriamente no select |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `from(products)` com 2+ joins para chegar nos pedidos | `from(orderItems)` como tabela pivo |
| `sum(...)` sem `.mapWith(Number)` | `sum(orderItems.quantity).mapWith(Number)` |
| `groupBy(products.name)` sem `products.name` no select | Inclua no select: `{ product: products.name }` |
| `orderBy(desc(popularProducts.amount))` fora do contexto | `orderBy((fields) => desc(fields.amount))` |
| Query de ranking sem `.limit()` | Sempre `.limit(5)` ou o N desejado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
