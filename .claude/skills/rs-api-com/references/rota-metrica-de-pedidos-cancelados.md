---
name: rs-api-com-bun-metrica-pedidos-cancelados
description: "Generates canceled orders metric route reusing existing metric structure with status filter. Use when user asks to 'track canceled orders', 'build cancellation metric', 'create canceled orders route', 'add order status filter to metric', or 'inverted metric semantics'. Applies pattern: reuse metric structure, add eq status filter, signal inverted interpretation. Make sure to use this skill whenever building dashboard metrics where higher values indicate negative outcomes. Not for frontend display logic, chart rendering, or non-order metrics."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, canceled, orders, dashboard, inverted-metric, bun]
---

# Rota: Metrica de Pedidos Cancelados

> Reutilize a estrutura de metrica base e adicione apenas o filtro de status, invertendo a interpretacao do diff.

## Rules

1. **Copie a rota de metrica existente** — reutilize `getMonthOrdersAmount`, so muda o filtro de status
2. **Adicione filtro `cancelled`** — `eq(orders.status, 'cancelled')` no where
3. **Nomeie com prefixo descritivo** — `getMonthCancelledOrdersAmount`
4. **Sinalize semantica invertida** — diff positivo em cancelamentos e RUIM para o negocio

## How to write

```typescript
export async function getMonthCancelledOrdersAmount() {
  // Mesma estrutura de getMonthOrdersAmount
  // Com eq(orders.status, 'cancelled') adicionado ao where

  const monthCancelledOrders = await db.select({ count: count() }).from(orders)
    .where(and(
      gte(orders.createdAt, startOfMonth),
      eq(orders.status, 'cancelled'),
    ))

  const lastMonthCancelled = await db.select({ count: count() }).from(orders)
    .where(and(
      gte(orders.createdAt, startOfLastMonth),
      sql`${orders.createdAt} < ${startOfMonth}`,
      eq(orders.status, 'cancelled'),
    ))

  const diffFromLastMonth = lastMonthCancelled[0].count > 0
    ? Math.round(((monthCancelledOrders[0].count - lastMonthCancelled[0].count) / lastMonthCancelled[0].count) * 100)
    : 0

  return { currentAmount: monthCancelledOrders[0].count, diffFromLastMonth }
}
```

## Example

**Before (do zero):**
```typescript
export async function cancelledOrders() {
  const result = await db.query.orders.findMany({ where: eq(orders.status, 'cancelled') })
  return result.length
}
```

**After (reutilizando estrutura):**
```typescript
// Copia de getMonthOrdersAmount + eq(orders.status, 'cancelled')
export async function getMonthCancelledOrdersAmount() { ... }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova metrica similar | Copie existente, adicione filtro |
| Metrica onde maior = pior | Retorne diff normal, frontend interpreta |
| diff positivo em cancelamentos | Frontend exibe em vermelho |
| diff negativo em cancelamentos | Frontend exibe em verde |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Query do zero para metrica similar | Copiar e adicionar filtro |
| Inverter calculo do diff no backend | Frontend interpreta |
| `getCancelledOrders` generico | `getMonthCancelledOrdersAmount` |
| Filtrar cancelados no JS | `eq(orders.status, 'cancelled')` na query |

## Troubleshooting

### Metrica retorna 0 mesmo com cancelamentos
**Symptom:** currentAmount sempre 0
**Cause:** Status no banco e 'canceled' (1 L) mas o filtro usa 'cancelled' (2 Ls), ou vice-versa
**Fix:** Verifique o enum de status no schema Drizzle e use exatamente o mesmo valor no filtro.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
