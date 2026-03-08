---
name: rs-api-com-bun-metrica-pedidos-mensais
description: "Generates monthly orders metric route comparing current vs previous month using Drizzle ORM count aggregation. Use when user asks to 'create monthly orders metric', 'count orders by month', 'compare month over month', 'monthly orders amount', or 'reuse receipt route for count'. Applies pattern: reuse receipt structure, swap sum for count, rename fields. Make sure to use this skill whenever building monthly count comparison endpoints. Not for revenue/receipt metrics (see rota-metrica-de-receita-mensal), daily metrics (see rota-metrica-de-pedidos-diarios), or non-order entities."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, monthly, count, month-over-month, dashboard, bun]
---

# Rota: Metrica de Pedidos Mensais

> Rotas de metrica mensal seguem estrutura identica — mude apenas a agregacao e os nomes dos campos.

## Rules

1. **Reutilize estrutura da rota de receipt** — logica de comparacao mensal e identica
2. **Use `count` em vez de `sum`** — pedidos mensais contam registros
3. **Nomeie campos pelo conteudo** — `currentMonthOrdersAmount`, nao `data`
4. **Agrupe por ano e mes** — `YYYY-MM` no group by
5. **Filtre desde inicio do mes anterior** — `startOfLastMonth` como limite inferior

## How to write

```typescript
const ordersPerMonth = await db.select({
  monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
  amount: count(),
}).from(orders).where(and(
  eq(orders.restaurantId, restaurantId),
  gte(orders.createdAt, startOfLastMonth),
)).groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

const current = ordersPerMonth.find(o => o.monthWithYear === currentMonthWithYear)
const last = ordersPerMonth.find(o => o.monthWithYear === lastMonthWithYear)

const diffFromLastMonth = current && last
  ? Number(((current.amount * 100) / last.amount - 100).toFixed(2))
  : null

return { amount: current?.amount ?? 0, diffFromLastMonth }
```

## Example

**Before (copiou receipt sem adaptar):**
```typescript
const monthReceipts = await db.select({ receipt: sum(orders.totalInCents) })
```

**After (adaptado para count):**
```typescript
const ordersPerMonth = await db.select({ amount: count() })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova metrica mensal de contagem | Copie receipt, troque sum por count |
| Nova metrica mensal de valor | Mantenha sum, mude o campo |
| Comparar com mes anterior | startOfLastMonth + groupBy YYYY-MM |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const data = db.select(...)` | `const ordersPerMonth = db.select(...)` |
| `receipt` em rota de contagem | `amount` |
| `sum()` para contar | `count()` |
| Duas queries separadas | Uma query agrupada |

## Troubleshooting

### Diff retorna NaN
**Symptom:** `diffFromLastMonth` e NaN ao inves de numero
**Cause:** Division por zero quando nao ha pedidos no mes anterior
**Fix:** Adicione guard: `last?.amount ? ... : null` antes da divisao.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
