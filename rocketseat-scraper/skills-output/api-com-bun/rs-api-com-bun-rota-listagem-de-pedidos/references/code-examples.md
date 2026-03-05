# Code Examples: Rota de Listagem com Paginacao e Filtros

## Exemplo completo da rota

```typescript
import Elysia, { t } from 'elysia'
import { and, count, eq, getTableColumns, ilike } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-typebox'
import { db } from '../db/connection'
import { orders, users } from '../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getOrders = new Elysia().use(auth).get(
  '/orders',
  async ({ getCurrentUser, query }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const { customerName, orderId, status, pageIndex } = query

    // Base query: filtros compartilhados entre count e data
    const baseQuery = db
      .select(getTableColumns(orders))
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          status ? eq(orders.status, status) : undefined,
          customerName
            ? ilike(users.name, `%${customerName}%`)
            : undefined,
        ),
      )

    // Duas queries em paralelo
    const [amountOfOrdersQuery, allOrders] = await Promise.all([
      db
        .select({ count: count(orders.id) })
        .from(baseQuery.as('baseQuery')),
      db
        .select()
        .from(baseQuery.as('baseQuery'))
        .offset(pageIndex * 10)
        .limit(10),
    ])

    const amountOfOrders = amountOfOrdersQuery[0].count

    return {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: amountOfOrders,
      },
    }
  },
  {
    query: t.Object({
      customerName: t.Optional(t.String()),
      orderId: t.Optional(t.String()),
      status: t.Optional(
        createSelectSchema(orders).properties.status,
      ),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  },
)
```

## Registrando a rota no servidor

```typescript
import { getOrders } from './routes/get-orders'

const app = new Elysia()
  .use(getOrders)
  // ... outras rotas
```

## Variacao: desestruturacao do count

O instrutor mostrou duas formas de extrair o count:

### Forma 1: Desestruturacao aninhada
```typescript
const [[ { count: amountOfOrders } ], allOrders] = await Promise.all([...])
```

### Forma 2: Acesso direto (mais legivel)
```typescript
const [amountOfOrdersQuery, allOrders] = await Promise.all([...])
const amountOfOrders = amountOfOrdersQuery[0].count
```

## Instalacao do drizzle-typebox

```bash
bun add drizzle-typebox
```

## Schema da tabela orders (referencia)

```typescript
// A tabela orders tem um enum de status como:
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id'),
  customerId: text('customer_id'),
  status: text('status', {
    enum: ['pending', 'processing', 'delivering', 'delivered', 'cancelled'],
  }),
  createdAt: timestamp('created_at').defaultNow(),
  // ... outros campos
})
```

## Padrao reutilizavel: like com percentuais

```typescript
// Match em qualquer posicao
ilike(campo, `%${valor}%`)

// Match no inicio
ilike(campo, `${valor}%`)

// Match no final
ilike(campo, `%${valor}`)
```

## Padrao reutilizavel: meta de paginacao

```typescript
// Resposta padrao para endpoints paginados
return {
  data: items,
  meta: {
    pageIndex,       // pagina atual (base 0)
    perPage: 10,     // itens por pagina
    totalCount,      // total de registros (com filtros aplicados)
  },
}
```