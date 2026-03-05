---
name: rs-api-com-bun-metrica-pedidos-mensais
description: "Generates monthly orders metric route comparing current vs previous month in Drizzle ORM + Bun APIs. Use when user asks to 'create orders metric', 'monthly orders count', 'compare month over month orders', or 'sales amount by month'. Applies pattern: reuse receipt route structure, swap aggregation from sum to count, adapt field names. Make sure to use this skill whenever building time-comparison metric endpoints. Not for revenue/receipt metrics, daily metrics, or non-order entities."
---

# Rota: Metrica de Pedidos Mensais

> Rotas de metrica de comparacao mensal seguem estrutura identica — mude apenas a query de agregacao e os nomes dos campos.

## Rules

1. **Reutilize a estrutura da rota de receipt** — copie `getMonthReceipt` e substitua a agregacao, porque a logica de comparacao mensal (current vs last month, diff percentual) e identica
2. **Use `count` em vez de `sum`** — importe `count` do Drizzle ORM, porque pedidos mensais contam registros, nao somam valores
3. **Nomeie campos pelo conteudo** — `currentMonthOrdersAmount` e `lastMonthOrdersAmount`, nunca `data` ou `result`, porque o nome deve descrever o que retorna
4. **Agrupe por ano e mes apenas** — use `monthWithYear` no group by, porque a granularidade mensal nao precisa de dia
5. **Filtre a partir do inicio do mes anterior** — `startOfLastMonth` como limite inferior da query, porque a comparacao exige dados dos dois meses

## How to write

### Query de pedidos por mes

```typescript
const ordersPerMonth = db
  .select({
    monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
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
```

### Estrutura da rota completa

```typescript
export const getMonthOrdersAmount = /* handler */ async () => {
  // 1. Calcular startOfLastMonth e datas de referencia
  // 2. Executar query agrupando por mes (count, nao sum)
  // 3. Extrair currentMonthOrdersAmount e lastMonthOrdersAmount
  // 4. Calcular diffFromLastMonth como percentual
  // 5. Retornar { amount, diffFromLastMonth }
}
```

## Example

**Before (copiou getMonthReceipt sem adaptar):**
```typescript
const monthReceipts = await db.select({
  monthWithYear: sql`...`,
  receipt: sum(orders.totalInCents),
})
// ...
const currentMonthReceipt = monthReceipts.find(...)
```

**After (adaptado para orders amount):**
```typescript
const ordersPerMonth = await db.select({
  monthWithYear: sql`...`,
  amount: count(),
})
// ...
const currentMonthOrdersAmount = ordersPerMonth.find(...)
const lastMonthOrdersAmount = ordersPerMonth.find(...)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova metrica mensal de contagem | Copie `getMonthReceipt`, troque `sum` por `count` |
| Nova metrica mensal de valor | Copie `getMonthReceipt`, mantenha `sum`, mude o campo |
| Precisa comparar com mes anterior | Use `startOfLastMonth` como filtro e agrupe por `YYYY-MM` |
| Registrar rota no server | Importe e adicione a rota no arquivo de servidor |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const data = db.select(...)` | `const ordersPerMonth = db.select(...)` |
| `receipt` em rota de contagem | `amount` — descreve contagem, nao receita |
| `sum()` para contar pedidos | `count()` — conta registros |
| Duas queries separadas (mes atual + anterior) | Uma query agrupada filtrando desde `startOfLastMonth` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
