---
name: rs-api-com-bun-rota-detalhes-pedido
description: "Applies Drizzle ORM Query API patterns for fetching entity details with nested relations and column selection. Use when user asks to 'create a detail route', 'fetch order details', 'get entity with relations', 'drizzle findFirst with', 'nested joins drizzle', or 'select specific columns'. Make sure to use this skill whenever building GET detail endpoints with Drizzle relational queries. Not for list/search routes (see rota-listagem-de-pedidos), mutations (see rota-aprovar-pedido), or raw SQL queries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: orders
  tags: [drizzle, query-api, findFirst, with, columns, detail, elysia, bun]
---

# Rota de Detalhes com Drizzle Query API

> Use a Query API do Drizzle com `findFirst`, `with` e `columns` para buscar entidades com relacionamentos aninhados.

## Rules

1. **Use Query API para detalhes** — `db.query.orders.findFirst()` em vez de `db.select().from()`, porque a Query API resolve relacionamentos naturalmente
2. **Traga relacionamentos com `with`** — nunca faca joins manuais quando a Query API resolve
3. **Selecione apenas colunas necessarias** — `columns: { id: true }` tanto na principal quanto nos aninhados
4. **Valide autorizacao antes da query** — verifique `restaurantId` antes de buscar
5. **Retorne erro especifico** — status 400 com mensagem clara quando nao encontrar

## How to write

```typescript
export const getOrderDetails = new Elysia().use(auth).get(
  '/orders/:id',
  async ({ getCurrentUser, params, set }) => {
    const { restaurantId } = await getCurrentUser()
    if (!restaurantId) throw new UnauthorizedError()

    const order = await db.query.orders.findFirst({
      columns: { id: true, status: true, totalInCents: true, createdAt: true },
      where(fields, { eq }) { return eq(fields.id, params.id) },
      with: {
        customer: { columns: { name: true, phone: true, email: true } },
        orderItems: {
          columns: { id: true, priceInCents: true, quantity: true },
          with: { product: { columns: { name: true } } },
        },
      },
    })

    if (!order) { set.status = 400; return { message: 'Order not found' } }
    return order
  },
  { params: t.Object({ id: t.String() }) }
)
```

## Example

**Before (Select API com joins):**
```typescript
const order = await db.select().from(orders)
  .leftJoin(customers, eq(orders.customerId, customers.id))
  .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
  .where(eq(orders.id, orderId))
```

**After (Query API com `with`):**
```typescript
const order = await db.query.orders.findFirst({
  columns: { id: true, status: true, totalInCents: true },
  where: (fields, { eq }) => eq(fields.id, orderId),
  with: {
    customer: { columns: { name: true } },
    orderItems: { columns: { priceInCents: true, quantity: true }, with: { product: { columns: { name: true } } } },
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Buscar entidade com relacionamentos | `findFirst()` com `with` |
| Campos especificos | `columns: { field: true }` |
| Sub-relacionamento | Aninhe `with` dentro do `with` |
| Query API insuficiente | Select API como fallback |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Joins manuais para detalhes | `findFirst` com `with` |
| `select()` sem filtro de colunas | `columns: { field: true }` |
| Query sem validar autorizacao | Verifique `restaurantId` antes |
| Trazer todos os campos | Selecionar apenas necessarios |

## Troubleshooting

### with retorna array vazio
**Symptom:** `orderItems` retorna `[]` mesmo quando existem items
**Cause:** Relations nao foram definidas para orderItems no schema
**Fix:** Verifique que `ordersRelations` inclui `many(orderItems)` e que `orderItemsRelations` esta exportado.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
