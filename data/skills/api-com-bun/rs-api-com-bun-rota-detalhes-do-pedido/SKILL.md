---
name: rs-api-com-bun-rota-detalhes-pedido
description: "Applies Drizzle ORM Query API patterns for fetching entity details with nested relations and column selection in Elysia/Bun APIs. Use when user asks to 'create a detail route', 'fetch order details', 'get entity with relations', 'drizzle findFirst', 'nested joins drizzle', or 'select specific columns drizzle'. Make sure to use this skill whenever building GET detail endpoints with Drizzle ORM relational queries. Not for list/search routes, mutations, or raw SQL queries."
---

# Rota de Detalhes com Drizzle Query API

> Use a Query API do Drizzle com `findFirst`, `with` e `columns` para buscar entidades com relacionamentos aninhados e campos selecionados.

## Rules

1. **Use Query API em vez de Select API para detalhes** — `db.query.orders.findFirst()` em vez de `db.select().from()`, porque a Query API tem experiencia melhor para buscar dados com relacionamentos
2. **Traga relacionamentos com `with`** — nunca faca joins manuais quando a Query API resolve, porque os relacionamentos ja estao definidos no schema
3. **Selecione apenas colunas necessarias com `columns`** — tanto na entidade principal quanto nos relacionamentos aninhados, porque reduz payload e melhora performance
4. **Valide autorizacao antes da query** — verifique se o usuario tem permissao (ex: `restaurantId`) antes de buscar dados, porque evita queries desnecessarias
5. **Retorne erro especifico quando nao encontrar** — use status 400 com mensagem clara, nao 500 generico

## How to write

### Rota de detalhe com autenticacao

```typescript
export const getOrderDetails = new Elysia().use(auth).get(
  '/orders/:id',
  async ({ getCurrentUser, params, set }) => {
    const { id: orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
      with: {
        customer: {
          columns: { name: true, phone: true, email: true },
        },
        orderItems: {
          columns: { id: true, priceInCents: true, quantity: true },
          with: {
            product: { columns: { name: true } },
          },
        },
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found' }
    }

    return order
  },
  { params: t.Object({ id: t.String() }) }
)
```

## Example

**Before (Select API com joins manuais):**
```typescript
const order = await db
  .select()
  .from(orders)
  .leftJoin(customers, eq(orders.customerId, customers.id))
  .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orders.id, orderId))
```

**After (Query API com `with` aninhado):**
```typescript
const order = await db.query.orders.findFirst({
  columns: { id: true, status: true, totalInCents: true, createdAt: true },
  where: (fields, { eq }) => eq(fields.id, orderId),
  with: {
    customer: { columns: { name: true, phone: true, email: true } },
    orderItems: {
      columns: { id: true, priceInCents: true, quantity: true },
      with: { product: { columns: { name: true } } },
    },
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Buscar entidade unica com relacionamentos | `db.query.{table}.findFirst()` com `with` |
| Precisa de campos especificos apenas | Use `columns: { field: true }` em cada nivel |
| Relacionamento tem sub-relacionamento | Aninhe `with` dentro do `with` |
| Query API nao suporta a query | Use Select API como fallback |
| Rota precisa de autenticacao | Use `.use(auth)` e valide `restaurantId` antes da query |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Joins manuais para detalhes simples | `findFirst` com `with` |
| `select()` sem filtro de colunas | `columns: { field: true }` |
| Query sem validar autorizacao | Verifique `restaurantId` antes |
| `throw new Error()` para not found | `set.status = 400; return { message }` |
| Trazer todos os campos de relacionamentos | Selecionar apenas os necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
