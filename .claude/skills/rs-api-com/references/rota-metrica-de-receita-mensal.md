---
name: rs-api-com-bun-receita-mensal
description: "Generates monthly revenue metric endpoints with period comparison when building dashboard APIs. Use when user asks to 'create revenue endpoint', 'build monthly receipt metric', 'compare current vs previous month revenue', 'aggregate orders by month with sum', or 'calculate percentage difference'. Applies DayJS date ranges, SQL groupBy toChar, sum with mapWith for type conversion, and percentage diff. Make sure to use this skill whenever building financial metric endpoints. Not for payment processing, invoice generation, or frontend chart rendering (use rs-next-js)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, revenue, monthly, sum, mapWith, dayjs, dashboard, bun]
---

# Rota de Metrica de Receita Mensal

> Busque dois meses numa unica query, agrupe por ano-mes, e calcule o diferencial percentual.

## Rules

1. **Uma query para dois meses** — filtre desde inicio do mes anterior
2. **Agrupe com toChar** — `to_char(created_at, 'YYYY-MM')` no groupBy e select
3. **Converta sum com mapWith** — `sum()` retorna string, use `.mapWith(Number)`
4. **Prepare chaves antes da query** — formate `YYYY-MM` com DayJS
5. **Trate ausencia de dados** — find pode retornar undefined
6. **Diferencial percentual** — `(atual * 100 / anterior) - 100`, com toFixed(2)

## How to write

```typescript
const today = dayjs()
const lastMonth = today.subtract(1, 'month')
const startOfLastMonth = lastMonth.startOf('month')

const monthReceipts = await db.select({
  receipt: sum(orders.totalInCents).mapWith(Number),
  monthWithYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
}).from(orders).where(and(
  eq(orders.restaurantId, restaurantId),
  gte(orders.createdAt, startOfLastMonth.toDate()),
)).groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)

const current = monthReceipts.find(r => r.monthWithYear === today.format('YYYY-MM'))
const previous = monthReceipts.find(r => r.monthWithYear === lastMonth.format('YYYY-MM'))

const diffFromLastMonth = current && previous
  ? Number(((current.receipt * 100) / previous.receipt - 100).toFixed(2))
  : null

return { receipt: current?.receipt ?? 0, diffFromLastMonth }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Comparar periodos | Uma query com groupBy |
| sum() no Drizzle | `.mapWith(Number)` |
| Data no groupBy | `to_char(campo, 'YYYY-MM')` |
| Sem dados no periodo | Retorne null no diff |
| Valores monetarios | Mantenha em centavos |
| DayJS subtract + startOf | `subtract(1, 'month').startOf('month')` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Duas queries separadas | Uma com groupBy |
| `sum()` sem mapWith | `sum(field).mapWith(Number)` |
| Filtrar por mes no JS | `gte(createdAt, startOfLastMonth)` no WHERE |
| `diff = atual - anterior` | `(atual * 100 / anterior) - 100` |
| `sql'...'` sem tipar | `sql<string>'...'` |

## Troubleshooting

### sum retorna string ao inves de number
**Symptom:** Calculos retornam "1234undefined" ou NaN
**Cause:** `sum()` no SQL retorna tipo string, nao foi convertido
**Fix:** Adicione `.mapWith(Number)` apos o `sum()`: `sum(orders.totalInCents).mapWith(Number)`.

### Diff retorna Infinity
**Symptom:** Percentual mostra Infinity quando nao ha dados no mes anterior
**Cause:** Divisao por zero (previous.receipt = 0 ou undefined)
**Fix:** Adicione guard: `current && previous ? ... : null`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
