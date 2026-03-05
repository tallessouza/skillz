# Code Examples: Rota Metrica Produtos Populares

## Estrutura completa do arquivo getPopularProducts.ts

```typescript
import { eq, desc, sum } from 'drizzle-orm'
import { db } from '../db/connection'
import { orders, orderItems, products } from '../db/schema'

export async function getPopularProducts(app) {
  app.get('/metrics/popular-products', async (request, reply) => {
    // Validacao do restaurantId (mesmo padrao das outras rotas)
    const restaurantId = // extraido do request/auth

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

    return popularProducts
  })
}
```

## Registro no server

```typescript
import { getPopularProducts } from './routes/getPopularProducts'

// No arquivo do server
app.register(getPopularProducts)
```

## Variacoes do padrao

### Top clientes por valor de compra

```typescript
const topCustomers = await db
  .select({
    customer: customers.name,
    totalSpent: sum(orderItems.priceInCents).mapWith(Number),
  })
  .from(orderItems)
  .leftJoin(orders, eq(orders.id, orderItems.orderId))
  .leftJoin(customers, eq(customers.id, orders.customerId))
  .where(eq(orders.restaurantId, restaurantId))
  .groupBy(customers.name)
  .orderBy((fields) => desc(fields.totalSpent))
  .limit(10)
```

### Categorias mais vendidas com count

```typescript
import { count } from 'drizzle-orm'

const topCategories = await db
  .select({
    category: products.category,
    totalOrders: count(orderItems.id),
  })
  .from(orderItems)
  .leftJoin(products, eq(products.id, orderItems.productId))
  .groupBy(products.category)
  .orderBy((fields) => desc(fields.totalOrders))
  .limit(5)
```

## Funcoes de agregacao disponiveis no Drizzle

```typescript
import { sum, count, avg, min, max } from 'drizzle-orm'

// sum - soma valores, retorna string
sum(orderItems.quantity).mapWith(Number)

// count - conta registros
count(orderItems.id)

// avg - media, retorna string
avg(orderItems.priceInCents).mapWith(Number)

// min/max
min(orders.createdAt)
max(orders.totalInCents).mapWith(Number)
```