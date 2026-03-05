# Code Examples: Metrica de Pedidos Mensais

## Exemplo completo da rota

Baseado no commit referenciado e na explicacao do instrutor:

### getMonthOrdersAmount.ts

```typescript
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { orders } from '../db/schema'
import { UnauthorizedError } from '../errors/unauthorized-error'

export async function getMonthOrdersAmount(restaurantId: string) {
  const today = new Date()
  
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  const ordersPerMonth = await db
    .select({
      monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      amount: count(),
    })
    .from(orders)
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        gte(orders.createdAt, startOfLastMonth),
      ),
    )
    .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = `${startOfLastMonth.getFullYear()}-${String(startOfLastMonth.getMonth() + 1).padStart(2, '0')}`

  const currentMonthOrdersAmount = ordersPerMonth.find(
    (order) => order.monthWithYear === currentMonth,
  )

  const lastMonthOrdersAmount = ordersPerMonth.find(
    (order) => order.monthWithYear === lastMonth,
  )

  const currentAmount = currentMonthOrdersAmount?.amount ?? 0
  const lastAmount = lastMonthOrdersAmount?.amount ?? 0

  const diffFromLastMonth =
    lastAmount !== 0
      ? ((currentAmount - lastAmount) / lastAmount) * 100
      : currentAmount > 0
        ? 100
        : 0

  return {
    amount: currentAmount,
    diffFromLastMonth: Number(diffFromLastMonth.toFixed(2)),
  }
}
```

## Comparacao: receipt vs orders amount

### getMonthReceipt (original)

```typescript
// Agregacao por soma de valores
const monthReceipts = await db
  .select({
    monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    receipt: sum(orders.totalInCents).mapWith(Number),
  })
  .from(orders)
  .where(...)
  .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
```

### getMonthOrdersAmount (adaptado)

```typescript
// Agregacao por contagem de registros
const ordersPerMonth = await db
  .select({
    monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    amount: count(),
  })
  .from(orders)
  .where(...)
  .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
```

## Comparacao: day orders vs month orders

### getDayOrdersAmount (query base)

```typescript
// Agrupamento por dia
const ordersPerDay = await db
  .select({
    dayWithMonthAndYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
    amount: count(),
  })
  .from(orders)
  .where(...)
  .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
```

### getMonthOrdersAmount (adaptado para mes)

```typescript
// Agrupamento por mes — mesmo count(), diferente TO_CHAR
const ordersPerMonth = await db
  .select({
    monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    amount: count(),
  })
  .from(orders)
  .where(...)
  .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
```

## Registro no server

```typescript
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'

// No setup de rotas do Elysia/Bun:
app.get('/metrics/month-orders-amount', async ({ restaurantId }) => {
  return getMonthOrdersAmount(restaurantId)
})
```

## Padrao de adaptacao para novas metricas mensais

Para criar qualquer nova metrica mensal de comparacao:

```typescript
// 1. Copie a estrutura de getMonthReceipt
// 2. Mude a funcao de agregacao:
//    - Contagem: count()
//    - Soma: sum(campo).mapWith(Number)
//    - Media: avg(campo).mapWith(Number)
// 3. Renomeie variaveis para refletir o conteudo
// 4. Mantenha toda a logica de comparacao intacta
```