# Code Examples: Metrica de Pedidos Cancelados

## Exemplo completo da aula

### Rota getMonthCancelledOrdersAmount

A rota segue exatamente o padrao de `getMonthOrdersAmount`, com a adicao do filtro de status:

```typescript
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { orders } from '../db/schema'

export async function getMonthCancelledOrdersAmount() {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  // Query mes atual — filtro de cancelled adicionado
  const monthCancelledOrdersAmount = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfMonth),
        eq(orders.status, 'cancelled'),
      ),
    )

  // Query mes passado — mesmo filtro de cancelled
  const lastMonthCancelledOrdersAmount = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfLastMonth),
        sql`${orders.createdAt} < ${startOfMonth}`,
        eq(orders.status, 'cancelled'),
      ),
    )

  const currentAmount = monthCancelledOrdersAmount[0].count
  const lastMonthAmount = lastMonthCancelledOrdersAmount[0].count
  const diffFromLastMonth =
    lastMonthAmount > 0
      ? Math.round(((currentAmount - lastMonthAmount) / lastMonthAmount) * 100)
      : 0

  return { currentAmount, diffFromLastMonth }
}
```

### Registro no server

```typescript
// No arquivo do server, registrar a rota seguindo o padrao das outras metricas
app.get('/metrics/month-cancelled-orders-amount', async () => {
  const result = await getMonthCancelledOrdersAmount()
  return result
})
```

## Comparacao: metrica base vs metrica de cancelamento

### getMonthOrdersAmount (base)
```typescript
.where(
  and(
    gte(orders.createdAt, startOfMonth),
    // Sem filtro de status — conta TODOS os pedidos
  ),
)
```

### getMonthCancelledOrdersAmount (cancelamento)
```typescript
.where(
  and(
    gte(orders.createdAt, startOfMonth),
    eq(orders.status, 'cancelled'),  // UNICA diferenca
  ),
)
```

## Resultado do teste (Hopscotch)

O instrutor testou e obteve:
- `currentAmount`: 21 pedidos cancelados no mes
- `diffFromLastMonth`: 16 (16% a mais que o mes passado — interpretado como RUIM)

## Interpretacao no frontend (mencionado pelo instrutor)

```typescript
// Logica de exibicao no frontend (nao implementado na aula)
const isNegativeMetric = true // cancelamentos sao metrica invertida

const color = isNegativeMetric
  ? diffFromLastMonth > 0 ? 'red' : 'green'   // invertido
  : diffFromLastMonth > 0 ? 'green' : 'red'   // normal
```