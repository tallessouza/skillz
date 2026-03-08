---
name: rs-api-com-bun-metrica-produtos-populares
description: "Generates aggregation queries with Drizzle ORM for ranking/top-N endpoints when building analytics routes. Use when user asks to 'get popular products', 'build ranking route', 'aggregate sales data', 'count with group by', or 'top-5 products'. Applies pivot table joins, sum/count aggregations, groupBy with required select fields, orderBy desc, and limit patterns. Make sure to use this skill whenever building analytics or ranking endpoints with Drizzle ORM. Not for simple CRUD routes, authentication, or non-aggregation queries (see rota-listagem-de-pedidos)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, ranking, popular, aggregation, groupBy, sum, dashboard, bun]
---

# Rota de Metrica: Produtos Populares (Ranking)

> Parta da tabela pivo (intermediaria) e faca joins para os lados, agrupe, ordene e limite.

## Rules

1. **Parta da tabela pivo** — `from(orderItems)` nao `from(products)`, porque conecta ambos os lados com menos joins
2. **Use leftJoin** — preserva todos os registros do lado esquerdo
3. **Todo campo no groupBy deve estar no select** — obrigatorio no SQL
4. **sum() retorna string** — sempre `.mapWith(Number)`
5. **orderBy com callback** — `orderBy((fields) => desc(fields.amount))` para campos agregados
6. **Limite resultados** — `.limit(5)` para top-N

## How to write

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

## Example

**Before (tabela errada, sem agregacao):**
```typescript
const popular = await db.select().from(products)
  .leftJoin(orderItems, eq(orderItems.productId, products.id))
```

**After (tabela pivo, agregacao, ordenacao, limite):**
```typescript
const popularProducts = await db
  .select({ product: products.name, amount: sum(orderItems.quantity).mapWith(Number) })
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
| Rankear entidades por contagem/soma | Parta da pivo, agrupe pela entidade |
| N:N (produto-pedido) | Tabela intermediaria como `from()` |
| Agregacao retorna string | `.mapWith(Number)` |
| Top-N | `orderBy desc` + `.limit(N)` |
| Campo no groupBy | Obrigatorio no select |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `from(products)` com 2+ joins | `from(orderItems)` como pivo |
| `sum(...)` sem mapWith | `sum(field).mapWith(Number)` |
| groupBy sem campo no select | Inclua no select |
| orderBy fora do contexto | `orderBy((fields) => desc(fields.amount))` |
| Ranking sem limit | `.limit(5)` |

## Troubleshooting

### Agregacao retorna string ao inves de number
**Symptom:** `amount` e "123" ao inves de 123, calculos quebram
**Cause:** `sum()` no PostgreSQL retorna tipo bigint (string no JS)
**Fix:** Adicione `.mapWith(Number)` ao `sum()`.

### groupBy erro: column must appear in GROUP BY
**Symptom:** Erro SQL dizendo que coluna nao esta no GROUP BY
**Cause:** Campo no select que nao esta no groupBy
**Fix:** Adicione todo campo nao-agregado do select ao groupBy.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
