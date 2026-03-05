---
name: rs-api-com-bun-metrica-pedidos-cancelados
description: "Generates canceled orders metric route using Drizzle ORM with Bun and ElysiaJS. Use when user asks to 'create canceled orders route', 'build cancellation metric', 'track canceled orders', or 'add order status filter'. Applies pattern: reuse existing metric route, add status filter, invert metric interpretation for UI. Make sure to use this skill whenever building dashboard metrics that have inverted semantics (higher = worse). Not for frontend display logic, chart rendering, or non-order metrics."
---

# Rota: Metrica de Pedidos Cancelados

> Ao criar metricas de cancelamento, reutilize a estrutura da metrica base e adicione apenas o filtro de status, invertendo a interpretacao do diff para a UI.

## Rules

1. **Copie a rota de metrica existente como base** — reutilize `getMonthOrdersAmount` porque a estrutura e identica, so muda o filtro de status
2. **Adicione filtro de status `cancelled`** — use `eq(orders.status, 'cancelled')` no `where`, porque e o unico diferencial da query
3. **Nomeie com prefixo descritivo** — `getMonthCancelledOrdersAmount` nao `getCancelledOrders`, porque segue o padrao das outras metricas do dashboard
4. **Sinalize semantica invertida no retorno** — diff positivo em cancelamentos e RUIM para o negocio, porque diferente das outras metricas onde maior e melhor

## How to write

### Rota de metrica de cancelamento

```typescript
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { orders } from '../db/schema'

export async function getMonthCancelledOrdersAmount() {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  const monthCancelledOrdersAmount = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfMonth),
        eq(orders.status, 'cancelled'),
      ),
    )

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

## Example

**Before (criando do zero sem reutilizar):**
```typescript
// Query completamente nova, sem seguir padrao existente
export async function cancelledOrders() {
  const result = await db.query.orders.findMany({
    where: eq(orders.status, 'cancelled'),
  })
  return result.length
}
```

**After (reutilizando estrutura da metrica base):**
```typescript
// Copia exata de getMonthOrdersAmount + filtro de status
export async function getMonthCancelledOrdersAmount() {
  // ... mesma estrutura de datas e queries
  // ... com eq(orders.status, 'cancelled') adicionado ao where
  return { currentAmount, diffFromLastMonth }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova metrica similar a existente | Copie a rota existente, adicione apenas o filtro diferencial |
| Metrica onde maior = pior | Retorne o diff normalmente, sinalize inversao para o frontend |
| Registrar rota no server | Siga o mesmo padrao de registro das outras metricas |
| diffFromLastMonth positivo em cancelamentos | Frontend deve exibir em vermelho (ruim) |
| diffFromLastMonth negativo em cancelamentos | Frontend deve exibir em verde (bom, menos cancelamentos) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar query do zero para metrica similar | Copiar metrica existente e adicionar filtro |
| Inverter o calculo do diff no backend | Retornar diff normal, frontend interpreta |
| `getCancelledOrders` (nome generico) | `getMonthCancelledOrdersAmount` (segue padrao) |
| Filtrar cancelados no JS apos query | Filtrar com `eq(orders.status, 'cancelled')` na query |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
