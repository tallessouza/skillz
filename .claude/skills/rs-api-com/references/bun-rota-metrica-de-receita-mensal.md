---
name: rs-api-com-bun-receita-mensal
description: "Generates monthly revenue metric endpoints with period comparison when building dashboard APIs or metrics routes. Use when user asks to 'create a revenue endpoint', 'build monthly metrics', 'compare current vs previous month', 'calculate percentage difference', or 'aggregate orders by month'. Applies patterns: date range filtering with DayJS, SQL groupBy with toChar for month grouping, sum with mapWith for type conversion, percentage diff calculation. Make sure to use this skill whenever generating financial metric or dashboard summary endpoints. Not for payment processing, invoice generation, or frontend chart rendering."
---

# Rota de Metrica de Receita Mensal

> Ao criar endpoints de metricas mensais, busque dados do mes atual E anterior numa unica query, agrupe por ano-mes, e calcule o diferencial percentual.

## Rules

1. **Busque dois meses numa unica query** — filtre desde o inicio do mes anterior ate agora, porque voce precisa dos dois periodos para calcular o diferencial
2. **Agrupe por ano+mes com toChar no SQL** — use `to_char(created_at, 'YYYY-MM')` no groupBy e no select, porque separar por mes no aplicativo seria ineficiente
3. **Converta sum para numero com mapWith** — `sum()` retorna string no SQL, use `.mapWith(Number)` para converter, porque calculos posteriores precisam de numero
4. **Prepare as chaves de comparacao antes da query** — formate `YYYY-MM` do mes atual e anterior com DayJS antes da query, porque voce vai usar para filtrar o resultado
5. **Trate ausencia de dados** — se nao houver pedidos num mes, o find retorna undefined, entao use condicional antes de calcular percentual
6. **Calcule diferencial como `(atual * 100 / anterior) - 100`** — use toFixed(2) e converta de volta para Number, porque evita strings no retorno da API

## How to write

### Preparacao de datas com DayJS

```typescript
import dayjs from 'dayjs'

const today = dayjs()
const lastMonth = today.subtract(1, 'month')
const startOfLastMonth = lastMonth.startOf('month')

const currentMonthWithYear = today.format('YYYY-MM')
const lastMonthWithYear = lastMonth.format('YYYY-MM')
```

### Query com aggregation e groupBy

```typescript
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
```

### Calculo do diferencial percentual

```typescript
const currentMonthReceipt = monthReceipts.find(
  (r) => r.monthWithYear === currentMonthWithYear,
)
const lastMonthReceipt = monthReceipts.find(
  (r) => r.monthWithYear === lastMonthWithYear,
)

const diffFromLastMonth =
  currentMonthReceipt && lastMonthReceipt
    ? Number(
        ((currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt - 100).toFixed(2),
      )
    : null
```

## Example

**Before (queries separadas, sem tipagem):**
```typescript
const current = await db.select({ total: sum(orders.totalInCents) })
  .from(orders).where(/* filtro mes atual */)
const previous = await db.select({ total: sum(orders.totalInCents) })
  .from(orders).where(/* filtro mes anterior */)
// sum retorna string, diff calculado errado
const diff = current[0].total - previous[0].total
```

**After (query unica, tipado, com diff percentual):**
```typescript
const monthReceipts = await db
  .select({
    receipt: sum(orders.totalInCents).mapWith(Number),
    monthWithYear: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
  })
  .from(orders)
  .where(and(
    eq(orders.restaurantId, restaurantId),
    gte(orders.createdAt, startOfLastMonth.toDate()),
  ))
  .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)

const current = monthReceipts.find(r => r.monthWithYear === currentMonthWithYear)
const previous = monthReceipts.find(r => r.monthWithYear === lastMonthWithYear)

const diffFromLastMonth = current && previous
  ? Number(((current.receipt * 100) / previous.receipt - 100).toFixed(2))
  : null

return { receipt: current?.receipt, diffFromLastMonth }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Metrica compara periodo atual vs anterior | Uma query com groupBy, nao duas queries separadas |
| sum() no Drizzle | Sempre `.mapWith(Number)` porque retorna string |
| Campo de data no groupBy | Use `sql\`to_char(campo, 'YYYY-MM')\`` para agrupar por mes |
| Pode nao ter dados no periodo | Retorne null no diff, nao 0 ou NaN |
| Valores monetarios | Mantenha em centavos (totalInCents), converta so no frontend |
| DayJS subtract + startOf | `subtract(1, 'month').startOf('month')` para pegar dia 1 do mes anterior |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duas queries separadas para mes atual e anterior | Uma query com groupBy por ano-mes |
| `sum()` sem mapWith (retorna string) | `sum(field).mapWith(Number)` |
| Filtrar por mes no JavaScript apos buscar tudo | `gte(createdAt, startOfLastMonth.toDate())` no WHERE |
| `diff = atual - anterior` (diferenca absoluta) | `(atual * 100 / anterior) - 100` (percentual) |
| Retornar diff sem toFixed | `Number(diff.toFixed(2))` para precisao |
| `sql\`...\`` sem tipar o retorno | `sql<string>\`...\`` para tipagem correta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-metrica-de-receita-mensal/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-metrica-de-receita-mensal/references/code-examples.md)
