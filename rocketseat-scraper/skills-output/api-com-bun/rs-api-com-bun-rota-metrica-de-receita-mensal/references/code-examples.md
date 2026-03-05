# Code Examples: Rota de Metrica de Receita Mensal

## Exemplo completo da rota

```typescript
import dayjs from 'dayjs'
import { db } from '../db'
import { orders } from '../db/schema'
import { and, eq, gte, sum, sql } from 'drizzle-orm'

export const getMonthReceipt = async (restaurantId: string) => {
  const today = dayjs()
  const lastMonth = today.subtract(1, 'month')
  const startOfLastMonth = lastMonth.startOf('month')

  // Chaves para comparacao (formato identico ao toChar no SQL)
  const currentMonthWithYear = today.format('YYYY-MM')    // ex: "2024-02"
  const lastMonthWithYear = lastMonth.format('YYYY-MM')    // ex: "2024-01"

  // Query unica que busca receita dos dois meses
  const monthReceipts = await db
    .select({
      receipt: sum(orders.totalInCents).mapWith(Number),
      monthWithYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        gte(orders.createdAt, startOfLastMonth.toDate()),
      ),
    )
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)

  // Separar resultados por mes
  const currentMonthReceipt = monthReceipts.find(
    (monthReceipt) => monthReceipt.monthWithYear === currentMonthWithYear,
  )
  const lastMonthReceipt = monthReceipts.find(
    (monthReceipt) => monthReceipt.monthWithYear === lastMonthWithYear,
  )

  // Calcular diferencial percentual
  const diffFromLastMonth =
    currentMonthReceipt && lastMonthReceipt
      ? Number(
          (
            (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt -
            100
          ).toFixed(2),
        )
      : null

  return {
    receipt: currentMonthReceipt?.receipt ?? 0,
    diffFromLastMonth,
  }
}
```

## Registro da rota com Elysia

```typescript
import Elysia from 'elysia'
import { auth } from '../auth'
import { getMonthReceipt } from './get-month-receipt'

export const monthReceiptRoute = new Elysia().use(auth).get(
  '/metrics/month-receipt',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()
    return getMonthReceipt(restaurantId)
  },
)
```

## Formato de retorno da API

```json
{
  "receipt": 15000,
  "diffFromLastMonth": 10.44
}
```

- `receipt`: receita em centavos do mes atual
- `diffFromLastMonth`: percentual de variacao (positivo = crescimento, negativo = queda, null = dados insuficientes)

## Resultado intermediario da query (monthReceipts)

```json
[
  { "receipt": 13580, "monthWithYear": "2024-01" },
  { "receipt": 15000, "monthWithYear": "2024-02" }
]
```

## Variacao: metrica de receita diaria (mesmo padrao)

```typescript
const todayReceipts = await db
  .select({
    receipt: sum(orders.totalInCents).mapWith(Number),
    date: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
  })
  .from(orders)
  .where(
    and(
      eq(orders.restaurantId, restaurantId),
      gte(orders.createdAt, dayjs().subtract(1, 'day').startOf('day').toDate()),
    ),
  )
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
```

## Variacao: metrica com contagem de pedidos

```typescript
const monthMetrics = await db
  .select({
    receipt: sum(orders.totalInCents).mapWith(Number),
    orderCount: count(orders.id).mapWith(Number),
    monthWithYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
  })
  .from(orders)
  .where(
    and(
      eq(orders.restaurantId, restaurantId),
      gte(orders.createdAt, startOfLastMonth.toDate()),
    ),
  )
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
```