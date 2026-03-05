# Code Examples: Rota de Metrica de Pedidos Diarios

## Exemplo completo da rota

```typescript
import { count, sql, gte } from 'drizzle-orm'
import { db } from '../db'
import { orders } from '../schema'

export async function getDayOrdersAmount() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Meia-noite de ontem — limite inferior da query
  const startOfYesterday = startOfDay(yesterday)

  // Query agrupada por dia
  const ordersPerDay = await db
    .select({
      amount: count(),
      dayWithMonthAndYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
    })
    .from(orders)
    .where(gte(orders.createdAt, startOfYesterday))
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)

  // Formata as datas para comparacao
  const todayWithMonthAndYear = format(today, 'yyyy-MM-dd')
  const yesterdayWithMonthAndYear = format(yesterday, 'yyyy-MM-dd')

  // Encontra os totais de cada dia
  const todayOrdersAmount = ordersPerDay.find(
    (orderPerDay) => orderPerDay.dayWithMonthAndYear === todayWithMonthAndYear
  )
  const yesterdayOrdersAmount = ordersPerDay.find(
    (orderPerDay) =>
      orderPerDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
  )

  // Calcula o diff percentual
  const diffFromYesterday =
    yesterdayOrdersAmount?.amount
      ? Math.round(
          ((todayOrdersAmount?.amount ?? 0) - yesterdayOrdersAmount.amount) /
            yesterdayOrdersAmount.amount *
            100
        )
      : null

  return {
    amount: todayOrdersAmount?.amount ?? 0,
    diffFromYesterday,
  }
}
```

## Registro da rota no server

```typescript
import { getDayOrdersAmount } from './routes/get-day-orders-amount'

// No arquivo de rotas/server
app.get('/metrics/day-orders-amount', getDayOrdersAmount)
```

## Padrao compartilhado: metrica com diff percentual

Este padrao se repete para qualquer metrica de dashboard:

```typescript
// Template generico para metricas com comparacao temporal
async function getMetricWithDiff<T>({
  table,
  dateColumn,
  aggregation, // count() ou sum(column)
  currentPeriodStart,
  previousPeriodStart,
  dateFormat, // 'YYYY-MM-DD' para dia, 'YYYY-MM' para mes
}: MetricParams) {
  const results = await db
    .select({
      value: aggregation,
      period: sql<string>`to_char(${dateColumn}, '${dateFormat}')`,
    })
    .from(table)
    .where(gte(dateColumn, previousPeriodStart))
    .groupBy(sql`to_char(${dateColumn}, '${dateFormat}')`)

  // Find current and previous
  // Calculate diff
  // Return { value, diff }
}
```

## Comparacao com getMonthReceipt (rota irmã)

| Aspecto | getMonthReceipt | getDayOrdersAmount |
|---------|----------------|-------------------|
| Agregacao | `sum(orders.totalInCents)` | `count()` |
| Periodo | Mes atual vs mes anterior | Hoje vs ontem |
| Subtracao | `subMonths(today, 1)` | `subDays(today, 1)` |
| Formato to_char | `'YYYY-MM'` | `'YYYY-MM-DD'` |
| Alias | `monthWithYear` | `dayWithMonthAndYear` |
| Diff | `diffFromLastMonth` | `diffFromYesterday` |
| Retorno | `receipt` (valor em centavos) | `amount` (contagem) |

## Resultado esperado da API

```json
{
  "amount": 4,
  "diffFromYesterday": 300
}
```

Interpretacao: 4 pedidos hoje, 300% a mais que ontem (ontem teve 1 pedido).