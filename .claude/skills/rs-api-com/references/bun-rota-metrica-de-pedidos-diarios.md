---
name: rs-api-com-bun-metrica-pedidos-diarios
description: "Generates daily metric routes with day-over-day comparison using Drizzle ORM and PostgreSQL. Use when user asks to 'create a daily metric', 'count today orders', 'compare today vs yesterday', 'day-over-day percentage', or 'daily amount route'. Applies patterns: groupBy with SQL to_char for date grouping, startOfDay for date boundaries, percentage diff calculation between two periods. Make sure to use this skill whenever building dashboard metric endpoints that compare current day to previous day. Not for monthly metrics, revenue calculations, or time-series charts."
---

# Rota de Metrica Diaria com Comparacao Day-over-Day

> Ao criar rotas de metricas diarias, agrupe por dia usando SQL to_char, calcule o diff percentual entre hoje e ontem, e retorne ambos os valores separados.

## Rules

1. **Subtraia 1 dia para obter ontem** — use `subDays(today, 1)` ou equivalente, porque o percentual de variacao precisa de dois pontos de comparacao
2. **Use startOfDay para o limite inferior** — `yesterday.startOfDay()` garante que a query pega desde meia-noite, porque sem isso voce perde pedidos do inicio do dia
3. **Agrupe por data formatada** — `to_char(createdAt, 'YYYY-MM-DD')` no groupBy, porque precisa separar os totais de hoje e ontem
4. **Retorne o dia como string nomeada** — use alias semantico como `dayWithMonthAndYear`, porque facilita o find no resultado
5. **Calcule diff percentual como diferenca relativa** — `((hoje - ontem) / ontem) * 100`, porque 1 ontem e 4 hoje = 300% (3 a mais), nao 400%
6. **Trate ausencia de dados** — se nao encontrar pedidos para um dia, use 0 como fallback, porque o seed ou ambiente pode nao ter dados

## How to write

### Query com groupBy por dia

```typescript
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

const startOfYesterday = startOfDay(yesterday)

const ordersPerDay = await db
  .select({
    amount: count(),
    dayWithMonthAndYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
  })
  .from(orders)
  .where(gte(orders.createdAt, startOfYesterday))
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
```

### Find e calculo de diff

```typescript
const todayFormatted = format(today, 'yyyy-MM-dd')
const yesterdayFormatted = format(yesterday, 'yyyy-MM-dd')

const todayOrdersAmount = ordersPerDay.find(
  (order) => order.dayWithMonthAndYear === todayFormatted
)
const yesterdayOrdersAmount = ordersPerDay.find(
  (order) => order.dayWithMonthAndYear === yesterdayFormatted
)

const diffFromYesterday =
  yesterdayOrdersAmount && yesterdayOrdersAmount.amount
    ? ((todayOrdersAmount?.amount ?? 0) - yesterdayOrdersAmount.amount) /
      yesterdayOrdersAmount.amount * 100
    : null

return { amount: todayOrdersAmount?.amount ?? 0, diffFromYesterday }
```

## Example

**Before (sem comparacao, valor cru):**
```typescript
export async function getDayOrdersAmount() {
  const result = await db.select({ count: count() }).from(orders)
  return { total: result[0].count }
}
```

**After (com comparacao day-over-day):**
```typescript
export async function getDayOrdersAmount() {
  const today = new Date()
  const yesterday = subDays(today, 1)
  const startOfYesterdayDate = startOfDay(yesterday)

  const ordersPerDay = await db
    .select({
      amount: count(),
      dayWithMonthAndYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
    })
    .from(orders)
    .where(gte(orders.createdAt, startOfYesterdayDate))
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)

  const todayWithMonthAndYear = format(today, 'yyyy-MM-dd')
  const yesterdayWithMonthAndYear = format(yesterday, 'yyyy-MM-dd')

  const todayOrdersAmount = ordersPerDay.find(
    (o) => o.dayWithMonthAndYear === todayWithMonthAndYear
  )
  const yesterdayOrdersAmount = ordersPerDay.find(
    (o) => o.dayWithMonthAndYear === yesterdayWithMonthAndYear
  )

  const diffFromYesterday =
    yesterdayOrdersAmount?.amount
      ? Math.round(
          ((todayOrdersAmount?.amount ?? 0) - yesterdayOrdersAmount.amount) /
            yesterdayOrdersAmount.amount * 100
        )
      : null

  return {
    amount: todayOrdersAmount?.amount ?? 0,
    diffFromYesterday,
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Metrica diaria de contagem | groupBy com to_char YYYY-MM-DD |
| Metrica diaria de receita | Mesmo padrao mas com sum() ao inves de count() |
| Sem pedidos ontem | Retorne diffFromYesterday como null, nao 0 |
| Formato da data no to_char vs format | to_char usa YYYY-MM-DD (SQL), format usa yyyy-MM-dd (JS) — mantenha consistente |
| Precisa de mais dias | Amplie o startOfDay e adicione mais finds, mas considere rota separada |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `WHERE createdAt > yesterday` (sem startOfDay) | `WHERE createdAt >= startOfDay(yesterday)` |
| `diffPercentual = hoje / ontem * 100` | `diff = (hoje - ontem) / ontem * 100` |
| `groupBy(orders.createdAt)` (agrupa por timestamp exato) | `groupBy(sql\`to_char(..., 'YYYY-MM-DD')\`)` |
| Retornar apenas o total sem comparacao | Retornar amount + diffFromYesterday |
| `to_char(createdAt, 'DD')` (so dia, ambiguo entre meses) | `to_char(createdAt, 'YYYY-MM-DD')` (data completa) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-metrica-de-pedidos-diarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-metrica-de-pedidos-diarios/references/code-examples.md)
