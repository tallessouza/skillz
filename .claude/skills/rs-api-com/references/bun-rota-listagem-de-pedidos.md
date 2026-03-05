---
name: rs-api-com-bun-rota-listagem-pedidos
description: "Generates paginated list endpoints with filters using Drizzle ORM and Elysia. Use when user asks to 'list orders', 'create paginated route', 'add filters to query', 'build listing endpoint', or 'paginate results with count'. Applies patterns: base query reuse for count+data, conditional filters with undefined, Drizzle Typebox schema validation, getTableColumns for safe select. Make sure to use this skill whenever building list/search endpoints with Drizzle ORM. Not for single-record fetches, mutations, or non-Drizzle ORMs."
---

# Rota de Listagem com Paginacao e Filtros (Drizzle ORM)

> Ao criar endpoints de listagem, use uma base query compartilhada entre a query de contagem e a query paginada, aplicando filtros condicionais com undefined.

## Rules

1. **Duas queries numa listagem paginada** — uma para `count` total, outra para registros paginados, porque o front-end precisa do total para calcular paginas
2. **Base query compartilhada** — crie a query com filtros sem `await`, depois use-a como subquery em ambas as queries, porque filtros devem ser identicos em count e data
3. **Filtros opcionais retornam undefined** — no `and()` do Drizzle, `undefined` descarta o filtro automaticamente, entao use ternarios `condition ? filter : undefined`
4. **Use `ilike` para buscas textuais** — com `%valor%` para match parcial case-insensitive, porque usuarios esperam busca flexivel
5. **Use PageIndex (base 0), nao PageNumber** — simplifica o calculo de offset: `pageIndex * perPage`, porque evita off-by-one
6. **Valide enums com drizzle-typebox** — `createSelectSchema(table).properties.column` gera o schema exato da coluna, porque impede valores invalidos sem duplicar a definicao
7. **Use `getTableColumns()` em joins** — evita ambiguidade de colunas (ex: `id` em ambas tabelas), porque select sem especificar campos causa erro em joins

## How to write

### Query params com Typebox + Drizzle Typebox

```typescript
import { createSelectSchema } from 'drizzle-typebox'

const route: Elysia = new Elysia().get('/orders', async ({ query }) => {
  // ...
}, {
  query: t.Object({
    customerName: t.Optional(t.String()),
    orderId: t.Optional(t.String()),
    status: t.Optional(createSelectSchema(orders).properties.status),
    pageIndex: t.Numeric({ minimum: 0 }),
  })
})
```

### Base query com filtros condicionais

```typescript
const baseQuery = db
  .select(getTableColumns(orders))
  .from(orders)
  .innerJoin(users, eq(users.id, orders.customerId))
  .where(
    and(
      eq(orders.restaurantId, restaurantId),
      orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
      status ? eq(orders.status, status) : undefined,
      customerName ? ilike(users.name, `%${customerName}%`) : undefined,
    )
  )
```

### Count + dados paginados em paralelo

```typescript
const [amountOfOrdersQuery, allOrders] = await Promise.all([
  db.select({ count: count(orders.id) }).from(baseQuery.as('baseQuery')),
  db.select().from(baseQuery.as('baseQuery'))
    .offset(pageIndex * 10)
    .limit(10),
])

const amountOfOrders = amountOfOrdersQuery[0].count
```

### Retorno padrao

```typescript
return {
  orders: allOrders,
  meta: {
    pageIndex,
    perPage: 10,
    totalCount: amountOfOrders,
  },
}
```

## Example

**Before (query inline sem reutilizacao):**
```typescript
const orders = await db.select().from(ordersTable).limit(10)
const total = await db.select({ count: count() }).from(ordersTable)
// Filtros nao compartilhados, count ignora filtros = paginacao quebrada
```

**After (base query compartilhada):**
```typescript
const baseQuery = db.select(getTableColumns(orders)).from(orders)
  .innerJoin(users, eq(users.id, orders.customerId))
  .where(and(
    eq(orders.restaurantId, restaurantId),
    status ? eq(orders.status, status) : undefined,
  ))

const [countResult, data] = await Promise.all([
  db.select({ count: count(orders.id) }).from(baseQuery.as('baseQuery')),
  db.select().from(baseQuery.as('baseQuery')).offset(pageIndex * 10).limit(10),
])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Filtro textual (nome, descricao) | `ilike` com `%valor%` |
| Filtro por enum (status) | `eq` com schema validado via `createSelectSchema` |
| Filtro por ID parcial | `ilike` com `%valor%` (case insensitive) |
| Join causa ambiguidade no select | `getTableColumns(tabela)` no select |
| Count com join | Passe campo especifico: `count(orders.id)`, nao `count()` |
| Subquery como from | `.as('nomeUnico')` obrigatorio |
| Parametro numerico via URL | `t.Numeric()` ao inves de `t.Number()` (converte string→number) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `count()` sem campo em query com join | `count(orders.id)` com campo explicito |
| `select()` vazio em query com join | `select(getTableColumns(orders))` |
| Queries de count e data com filtros diferentes | Base query unica reutilizada em ambas |
| `t.Number()` para query params | `t.Numeric()` que converte string→number |
| Duplicar enum de status manualmente | `createSelectSchema(table).properties.status` |
| `pageNumber` comecando em 1 | `pageIndex` comecando em 0 (offset = index * perPage) |
| Queries sequenciais (await + await) | `Promise.all([query1, query2])` em paralelo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-listagem-de-pedidos/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-listagem-de-pedidos/references/code-examples.md)
