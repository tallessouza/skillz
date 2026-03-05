# Code Examples: Schema de Produtos e Pedidos

## Estrutura completa dos arquivos

### db/schema/products.ts

```typescript
import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { restaurants } from './restaurants'

export const products = pgTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'), // nullable intencional — descricao e opcional
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### db/schema/orders.ts

```typescript
import { createId } from '@paralleldrive/cuid2'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { restaurants } from './restaurants'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'delivering',
  'delivered',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  customerId: text('customer_id')
    .references(() => users.id, { onDelete: 'set null' }),
  // ^ nullable: se cliente deletar conta, pedidos permanecem para historico do restaurante
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  // ^ cache do total — evita JOIN pesado em consultas de faturamento
  createdAt: timestamp('created_at').defaultNow(),
  // sem updatedAt — pedidos sao imutaveis apos criacao
})
```

### db/schema/order-items.ts

```typescript
import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { orders } from './orders'
import { products } from './products'

export const orderItems = pgTable('order_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  // ^ se pedido deletado, itens nao fazem sentido sozinhos
  productId: text('product_id')
    .references(() => products.id, { onDelete: 'set null' }),
  // ^ nullable: produto removido do cardapio nao apaga historico de vendas
  priceInCents: integer('price_in_cents').notNull(),
  // ^ snapshot do preco no momento da compra, NAO referencia ao preco atual
  quantity: integer('quantity').notNull(),
  // sem createdAt — mesmo timestamp do pedido pai
  // sem updatedAt — itens sao imutaveis
})
```

### db/schema/index.ts (exportacoes)

```typescript
export * from './users'
export * from './restaurants'
export * from './auth-links'
export * from './products'
export * from './orders'
export * from './order-items'
```

## Decisoes de cascade lado a lado

```
ENTIDADE PAI DELETADA     │  ESTRATEGIA      │  RAZAO
─────────────────────────┼──────────────────┼──────────────────────────
restaurante → produtos    │  CASCADE          │  produtos sem restaurante nao fazem sentido
restaurante → orders      │  CASCADE          │  cliente nao quer ver pedidos de loja deletada
cliente → orders          │  SET NULL         │  restaurante precisa do historico financeiro
order → orderItems        │  CASCADE          │  itens sem pedido nao fazem sentido
produto → orderItems      │  SET NULL         │  historico de vendas deve ser preservado
```

## Gerando e aplicando migrations

```bash
# Gerar migration a partir dos schemas
bun run generate

# Verificar o arquivo gerado em drizzle/migrations/
# Deve conter CREATE TABLE para products, orders, order_items
# Deve conter CREATE TYPE order_status

# Aplicar ao banco
bun run migrate
```