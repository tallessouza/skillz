# Code Examples: Relacionamentos no Drizzle ORM

## Exemplo completo: restaurants relations

```typescript
import { relations } from 'drizzle-orm'
import { restaurants } from './restaurants'
import { orders } from './orders'
import { products } from './products'
import { users } from './users'

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
  }),
  orders: many(orders),
  products: many(products),
}))
```

## Exemplo completo: orders relations

```typescript
import { relations } from 'drizzle-orm'
import { orders } from './orders'
import { users } from './users'
import { restaurants } from './restaurants'
import { orderItems } from './order-items'

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: 'orderCustomer',
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  orderItems: many(orderItems),
}))
```

## Exemplo completo: products relations

```typescript
import { relations } from 'drizzle-orm'
import { products } from './products'
import { restaurants } from './restaurants'
import { orderItems } from './order-items'

export const productsRelations = relations(products, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [products.restaurantId],
    references: [restaurants.id],
    relationName: 'productRestaurant',
  }),
  orderItems: many(orderItems),
}))
```

## Exemplo completo: orderItems relations

```typescript
import { relations } from 'drizzle-orm'
import { orderItems } from './order-items'
import { orders } from './orders'
import { products } from './products'

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
    relationName: 'orderItemOrder',
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
```

## Exemplo completo: users relations

```typescript
import { relations } from 'drizzle-orm'
import { users } from './users'
import { restaurants } from './restaurants'
import { orders } from './orders'

export const usersRelations = relations(users, ({ one, many }) => ({
  managedRestaurant: one(restaurants, {
    fields: [users.id],
    references: [restaurants.managerId],
    relationName: 'managedRestaurant',
  }),
  orders: many(orders),
}))
```

## Verificacao: relations nao geram migrations

```bash
# Apos adicionar apenas relations(), rodar:
bunx drizzle-kit generate

# Output esperado: "No schema changes detected"
# Isso confirma que relations() sao apenas para o ORM
```

## Padrao de uso em queries (contexto para o proximo passo)

```typescript
// Com relations declaradas, voce pode fazer:
const result = await db.query.orders.findMany({
  with: {
    customer: true,
    restaurant: true,
    orderItems: {
      with: {
        product: true,
      },
    },
  },
})
```