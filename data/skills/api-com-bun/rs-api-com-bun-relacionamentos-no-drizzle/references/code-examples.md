# Code Examples: Relacionamentos no Drizzle ORM

## Exemplo completo da aula

### Schema de users (tabela referenciada)

```typescript
// src/db/schema/users.ts
import { pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})
```

### Schema de restaurants (com foreign key)

```typescript
// src/db/schema/restaurants.ts
import { pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
})

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
    relationName: 'restaurant_manager',
  }),
}))
```

## Migration gerada — Adição do campo

```sql
-- Primeira migration: adiciona coluna + foreign key
ALTER TABLE "restaurants" ADD COLUMN "manager_id" text;
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_manager_id_users_id_fk"
  FOREIGN KEY ("manager_id") REFERENCES "users"("id")
  ON DELETE no action ON UPDATE no action;
```

## Migration gerada — Alteração do cascade

```sql
-- Segunda migration: altera cascade (drop + recreate)
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_manager_id_users_id_fk";
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_manager_id_users_id_fk"
  FOREIGN KEY ("manager_id") REFERENCES "users"("id")
  ON DELETE set null ON UPDATE no action;
```

## Variação: Campo NOT NULL com cascade delete

```typescript
// Quando o filho DEVE ser deletado junto com o pai
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, {
      onDelete: 'cascade',
    }),
})

export const ordersRelations = relations(orders, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
    relationName: 'order_restaurant',
  }),
}))
```

## Variação: Relation many (lado inverso)

```typescript
// Só adicione se tiver operação que liste restaurantes de um usuário
export const usersRelations = relations(users, ({ many }) => ({
  managedRestaurants: many(restaurants, {
    relationName: 'restaurant_manager',
  }),
}))
```

## Usando a relation em queries

```typescript
// Query que aproveita o relation definido
const restaurantsWithManager = await db.query.restaurants.findMany({
  with: {
    manager: true, // funciona porque restaurantsRelations define 'manager'
  },
})

// Sem o relations() definido, isso daria erro
```

## Padrão completo: tabela com múltiplas foreign keys

```typescript
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  customerId: text('customer_id')
    .notNull()
    .references(() => users.id),
})

// Quando há múltiplas refs à mesma tabela, relationName é OBRIGATÓRIO
export const ordersRelations = relations(orders, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
    relationName: 'order_restaurant',
  }),
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: 'order_customer',
  }),
}))
```