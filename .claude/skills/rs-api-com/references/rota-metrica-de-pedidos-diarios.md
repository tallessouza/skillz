---
name: rs-api-com-bun-metrica-pedidos-diarios
description: "Generates daily metric routes with day-over-day comparison using Drizzle ORM and PostgreSQL. Use when user asks to 'create daily metric', 'count today orders', 'compare today vs yesterday', 'day-over-day percentage', or 'daily amount route'. Applies groupBy with SQL to_char, startOfDay for boundaries, and percentage diff calculation. Make sure to use this skill whenever building dashboard metric endpoints comparing current day to previous day. Not for monthly metrics (see rota-metrica-de-pedidos-mensais), revenue calculations (see rota-metrica-de-receita-mensal), or time-series charts."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, daily, day-over-day, groupBy, to_char, dashboard, bun]
---

# Rota de Metrica Diaria com Comparacao Day-over-Day

> Agrupe por dia usando SQL to_char, calcule diff percentual entre hoje e ontem, retorne ambos.

## Rules

1. **Subtraia 1 dia para ontem** — percentual precisa de dois pontos de comparacao
2. **Use startOfDay para limite inferior** — garante que a query pega desde meia-noite
3. **Agrupe por data formatada** — `to_char(createdAt, 'YYYY-MM-DD')` no groupBy
4. **Retorne dia como string nomeada** — alias semantico como `dayWithMonthAndYear`
5. **Diff percentual como diferenca relativa** — `(hoje - ontem) / ontem * 100`
6. **Trate ausencia de dados** — sem pedidos = fallback para 0

## How to write

```typescript
const today = new Date()
const yesterday = subDays(today, 1)

const ordersPerDay = await db
  .select({
    amount: count(),
    dayWithMonthAndYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
  })
  .from(orders)
  .where(gte(orders.createdAt, startOfDay(yesterday)))
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)

const todayAmount = ordersPerDay.find(o => o.dayWithMonthAndYear === format(today, 'yyyy-MM-dd'))
const yesterdayAmount = ordersPerDay.find(o => o.dayWithMonthAndYear === format(yesterday, 'yyyy-MM-dd'))

const diffFromYesterday = yesterdayAmount?.amount
  ? Math.round(((todayAmount?.amount ?? 0) - yesterdayAmount.amount) / yesterdayAmount.amount * 100)
  : null

return { amount: todayAmount?.amount ?? 0, diffFromYesterday }
```

## Example

**Before (sem comparacao):**
```typescript
const result = await db.select({ count: count() }).from(orders)
return { total: result[0].count }
```

**After (com day-over-day):**
```typescript
const ordersPerDay = await db.select({
  amount: count(),
  dayWithMonthAndYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
}).from(orders).where(gte(orders.createdAt, startOfDay(yesterday)))
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
// ... find + diff calculation
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metrica diaria de contagem | groupBy com to_char YYYY-MM-DD |
| Metrica diaria de receita | Mesmo padrao com sum() |
| Sem pedidos ontem | Retorne diff como null |
| Formato to_char vs format JS | SQL: YYYY-MM-DD / JS: yyyy-MM-dd |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `WHERE createdAt > yesterday` sem startOfDay | `gte(createdAt, startOfDay(yesterday))` |
| `diff = hoje / ontem * 100` | `diff = (hoje - ontem) / ontem * 100` |
| `groupBy(orders.createdAt)` (timestamp exato) | `groupBy(sql'to_char(..., YYYY-MM-DD)')` |

## Troubleshooting

### Metrica retorna 0 mesmo com pedidos
**Symptom:** `todayAmount` e undefined apesar de existirem pedidos hoje
**Cause:** Formato da data no `find()` nao corresponde ao formato do `to_char`
**Fix:** Garanta consistencia: SQL usa `YYYY-MM-DD` (maiusculo), JS format usa `yyyy-MM-dd` (minusculo).

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
