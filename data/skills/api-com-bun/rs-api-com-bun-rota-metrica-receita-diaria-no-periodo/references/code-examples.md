# Code Examples: Receita Diaria por Periodo

## Rota completa conforme a aula

```typescript
import { and, eq, gte, lte, sum, sql } from 'drizzle-orm'
import dayjs from 'dayjs'
import { t } from 'elysia'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'

export const getDailyReceiptInPeriod = async ({
  query,
  getManagedRestaurantId,
  set,
}) => {
  const restaurantId = await getManagedRestaurantId()
  const { from, to } = query

  const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
  const endDate = to
    ? dayjs(to)
    : from
      ? startDate.add(7, 'days')
      : dayjs()

  if (endDate.diff(startDate, 'days') > 7) {
    set.status = 400
    return {
      message: 'You cannot list receipt in a larger period than 7 days.',
    }
  }

  const receiptPerDay = await db
    .select({
      receipt: sum(orders.totalInCents).mapWith(Number),
      date: sql<string>`to_char(${orders.createdAt}, 'DD/MM')`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        gte(
          orders.createdAt,
          startDate
            .add(startDate.utcOffset(), 'minutes')
            .startOf('day')
            .toDate(),
        ),
        lte(
          orders.createdAt,
          endDate
            .add(endDate.utcOffset(), 'minutes')
            .endOf('day')
            .toDate(),
        ),
      ),
    )
    .groupBy(sql`to_char(${orders.createdAt}, 'DD/MM')`)

  const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
    const [dayA, monthA] = a.date.split('/').map(Number)
    const [dayB, monthB] = b.date.split('/').map(Number)

    if (monthA === monthB) {
      return dayA - dayB
    }

    const dateA = new Date(2024, monthA - 1, dayA)
    const dateB = new Date(2024, monthB - 1, dayB)

    return dateA.getTime() - dateB.getTime()
  })

  return orderedReceiptPerDay
}
```

## Registro da rota com query params TypeBox

```typescript
app.get('/metrics/daily-receipt-in-period', getDailyReceiptInPeriod, {
  query: t.Object({
    from: t.Optional(t.String()),
    to: t.Optional(t.String()),
  }),
})
```

## Variacao: sem correcao de timezone (para comparacao)

```typescript
// SEM correcao - resultados errados apos 21h em UTC-3
gte(orders.createdAt, startDate.startOf('day').toDate())
lte(orders.createdAt, endDate.endOf('day').toDate())

// COM correcao - resultados corretos em qualquer horario
gte(orders.createdAt, startDate.add(startDate.utcOffset(), 'minutes').startOf('day').toDate())
lte(orders.createdAt, endDate.add(endDate.utcOffset(), 'minutes').endOf('day').toDate())
```

## Variacao: sort simples vs sort com meses diferentes

```typescript
// Se voce tem certeza que o periodo nunca cruza meses:
receiptPerDay.sort((a, b) => {
  const dayA = Number(a.date.split('/')[0])
  const dayB = Number(b.date.split('/')[0])
  return dayA - dayB
})

// Versao robusta que lida com mudanca de mes (usada na aula):
receiptPerDay.sort((a, b) => {
  const [dayA, monthA] = a.date.split('/').map(Number)
  const [dayB, monthB] = b.date.split('/').map(Number)
  if (monthA === monthB) return dayA - dayB
  const dateA = new Date(2024, monthA - 1, dayA)
  const dateB = new Date(2024, monthB - 1, dayB)
  return dateA.getTime() - dateB.getTime()
})
```

## Epoch timestamp explicado

```typescript
// getTime() retorna milissegundos desde 1 Jan 1970 00:00:00 UTC
const dateA = new Date(2024, 0, 28) // 28 Jan
const dateB = new Date(2024, 1, 2)  // 2 Feb

dateA.getTime() // 1706400000000
dateB.getTime() // 1706832000000

// dateB > dateA mesmo que 2 < 28, porque fevereiro > janeiro
dateA.getTime() - dateB.getTime() // numero negativo = A vem antes de B
```