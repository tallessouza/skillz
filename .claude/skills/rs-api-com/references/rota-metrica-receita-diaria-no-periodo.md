---
name: rs-api-com-bun-receita-diaria-periodo
description: "Applies date-period query patterns when building API routes that filter and aggregate revenue by date ranges. Use when user asks to 'create period metrics route', 'filter by date range', 'group results by day', 'handle timezone in drizzle queries', or 'sort date results chronologically'. Enforces timezone offset correction, date boundary validation, max period limit, and day-grouping with SQL to_char. Make sure to use this skill whenever building period-based metric endpoints. Not for simple CRUD routes, authentication, or monthly aggregations (see rota-metrica-de-receita-mensal)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: metrics
  tags: [drizzle, metrics, date-range, timezone, to_char, period, revenue, dayjs, bun]
---

# Rota de Receita Diaria por Periodo

> Corrija timezone antes da query, valide o tamanho do periodo, e agrupe com SQL to_char.

## Rules

1. **Query params de data sao string** — use dayjs para converter `from` e `to`
2. **Defaults inteligentes** — sem `from`: 7 dias atras; sem `to`: from + 7 dias ou hoje
3. **Valide periodo maximo** — retorne 400 se exceder limite (ex: 7 dias)
4. **startOfDay/endOfDay nos limites** — garante que o filtro captura o dia inteiro
5. **Corrija timezone com utcOffset** — banco salva UTC, frontend envia com timezone local
6. **Agrupe com to_char** — `to_char(createdAt, 'DD/MM')` retorna formato pronto
7. **Ordene datas no JS** — sort com split/map/Date, porque DD/MM nao ordena cronologicamente no SQL

## How to write

### Query params com defaults

```typescript
const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
const endDate = to ? dayjs(to) : from ? startDate.add(7, 'days') : dayjs()
```

### Validacao de periodo

```typescript
if (endDate.diff(startDate, 'days') > 7) {
  set.status = 400
  return { message: 'Period cannot exceed 7 days.' }
}
```

### Query com timezone

```typescript
const receiptPerDay = await db.select({
  receipt: sum(orders.totalInCents).mapWith(Number),
  date: sql<string>`to_char(${orders.createdAt}, 'DD/MM')`,
}).from(orders).where(and(
  eq(orders.restaurantId, restaurantId),
  gte(orders.createdAt, startDate.add(startDate.utcOffset(), 'minutes').startOf('day').toDate()),
  lte(orders.createdAt, endDate.add(endDate.utcOffset(), 'minutes').endOf('day').toDate()),
)).groupBy(sql`to_char(${orders.createdAt}, 'DD/MM')`)
```

### Ordenacao cronologica

```typescript
const ordered = receiptPerDay.sort((a, b) => {
  const [dayA, monthA] = a.date.split('/').map(Number)
  const [dayB, monthB] = b.date.split('/').map(Number)
  if (monthA === monthB) return dayA - dayB
  return new Date(2024, monthA - 1, dayA).getTime() - new Date(2024, monthB - 1, dayB).getTime()
})
```

## Example

**Before (sem timezone, sem validacao):**
```typescript
const results = await db.select({ receipt: sum(orders.totalInCents) })
  .from(orders).where(gte(orders.createdAt, new Date(from)))
```

**After (completo):**
```typescript
const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
if (endDate.diff(startDate, 'days') > 7) { set.status = 400; return { message: '...' } }

const receiptPerDay = await db.select({
  receipt: sum(orders.totalInCents).mapWith(Number),
  date: sql<string>`to_char(${orders.createdAt}, 'DD/MM')`,
}).from(orders).where(and(
  eq(orders.restaurantId, restaurantId),
  gte(orders.createdAt, startDate.add(startDate.utcOffset(), 'minutes').startOf('day').toDate()),
  lte(orders.createdAt, endDate.add(endDate.utcOffset(), 'minutes').endOf('day').toDate()),
)).groupBy(sql`to_char(${orders.createdAt}, 'DD/MM')`)

return receiptPerDay.sort(/* cronologico */)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Frontend envia datas com timezone | utcOffset em minutos antes de filtrar |
| Sem from nem to | Default: ultimos 7 dias |
| Agrupar por dia | `to_char(col, 'DD/MM')` |
| Resultado DD/MM precisa ordem | Sort no JS com split/Date |
| Dados errados apos 21h | Problema de timezone — utcOffset resolve |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `new Date(from)` sem startOfDay | `dayjs(from).startOf('day').toDate()` |
| `orderBy` em texto DD/MM | Sort no JS |
| Query sem limite de periodo | Valide `diff > MAX` |
| Filtro sem timezone | `.add(utcOffset(), 'minutes')` |

## Troubleshooting

### Dados de hoje nao aparecem na metrica
**Symptom:** Pedidos de hoje sao ignorados no resultado
**Cause:** endOfDay nao aplicado, filtro corta antes de 23:59
**Fix:** Use `endDate.endOf('day').toDate()` no limite superior da query.

### Dados aparecem no dia errado
**Symptom:** Pedidos criados as 22h aparecem no dia seguinte
**Cause:** Timezone nao corrigido — banco armazena UTC, frontend esta em UTC-3
**Fix:** Adicione `.add(date.utcOffset(), 'minutes')` antes de startOfDay/endOfDay.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
