---
name: rs-api-com-bun-receita-diaria-periodo
description: "Applies date-period query patterns when building API routes that filter and aggregate data by date ranges. Use when user asks to 'create a metrics route', 'filter by date period', 'group results by day', 'handle timezone in queries', or 'sort date results'. Enforces timezone offset correction, date boundary validation, and day-grouping with SQL to_char. Make sure to use this skill whenever building period-based metric endpoints or date-range database queries. Not for simple CRUD routes, authentication, or non-date-related aggregations."
---

# Rota de Metrica com Receita Diaria por Periodo

> Ao construir rotas que filtram dados por periodo de datas, corrija timezone antes da query, valide o tamanho do periodo, e agrupe com SQL to_char.

## Rules

1. **Query params de data sao sempre string** — use dayjs para converter `from` e `to` recebidos como query parameters, porque tudo em query params chega como string
2. **Defaults inteligentes para periodos opcionais** — se `from` ausente, use 7 dias atras; se `to` ausente, use `from + 7 dias` ou data atual, porque o frontend nem sempre envia ambos
3. **Valide tamanho maximo do periodo** — retorne 400 se o periodo exceder o limite (ex: 7 dias), porque queries de periodo aberto destroem performance
4. **Use startOfDay/endOfDay nos limites** — `startDate.startOf('day')` e `endDate.endOf('day')` garantem que o filtro captura o dia inteiro (00:00 a 23:59:59), porque dayjs usa o horario atual por padrao
5. **Corrija timezone com utcOffset antes da query** — `startDate.add(startDate.utcOffset(), 'minutes')` converte o offset do timezone em minutos e adiciona, porque o banco salva em UTC e o frontend envia com timezone local
6. **Agrupe por dia com SQL to_char** — use `to_char(createdAt, 'DD/MM')` no group by e no select, porque retorna o formato pronto para o frontend
7. **Ordene datas no JavaScript, nao no SQL** — sort com split/map/Date e comparar por mes primeiro depois dia, porque ordenar texto DD/MM no SQL nao respeita ordem cronologica

## How to write

### Query params com defaults encadeados

```typescript
const { from, to } = query

const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
const endDate = to
  ? dayjs(to)
  : from
    ? startDate.add(7, 'days')
    : dayjs()
```

### Validacao de periodo maximo

```typescript
if (endDate.diff(startDate, 'days') > 7) {
  set.status = 400
  return { message: 'You cannot list receipt in a larger period than 7 days.' }
}
```

### Query com correcao de timezone

```typescript
const receiptPerDay = await db
  .select({
    receipt: sum(orders.totalInCents).mapWith(Number),
    date: sql<string>`to_char(${orders.createdAt}, 'DD/MM')`,
  })
  .from(orders)
  .where(
    and(
      eq(orders.restaurantId, restaurantId),
      gte(
        orders.createdAt,
        startDate
          .add(startDate.utcOffset(), 'minutes')
          .startOf('day')
          .toDate(),
      ),
      lte(
        orders.createdAt,
        endDate
          .add(endDate.utcOffset(), 'minutes')
          .endOf('day')
          .toDate(),
      ),
    ),
  )
  .groupBy(sql`to_char(${orders.createdAt}, 'DD/MM')`)
```

### Ordenacao cronologica de DD/MM no JavaScript

```typescript
const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
  const [dayA, monthA] = a.date.split('/').map(Number)
  const [dayB, monthB] = b.date.split('/').map(Number)

  if (monthA === monthB) return dayA - dayB

  const dateA = new Date(2024, monthA - 1, dayA)
  const dateB = new Date(2024, monthB - 1, dayB)
  return dateA.getTime() - dateB.getTime()
})
```

## Example

**Before (sem correcao de timezone, sem validacao):**
```typescript
const results = await db
  .select({ receipt: sum(orders.totalInCents), date: orders.createdAt })
  .from(orders)
  .where(gte(orders.createdAt, new Date(from)))

return results
```

**After (com esta skill aplicada):**
```typescript
const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
const endDate = to ? dayjs(to) : from ? startDate.add(7, 'days') : dayjs()

if (endDate.diff(startDate, 'days') > 7) {
  set.status = 400
  return { message: 'You cannot list receipt in a larger period than 7 days.' }
}

const receiptPerDay = await db
  .select({
    receipt: sum(orders.totalInCents).mapWith(Number),
    date: sql<string>`to_char(${orders.createdAt}, 'DD/MM')`,
  })
  .from(orders)
  .where(
    and(
      eq(orders.restaurantId, restaurantId),
      gte(orders.createdAt, startDate.add(startDate.utcOffset(), 'minutes').startOf('day').toDate()),
      lte(orders.createdAt, endDate.add(endDate.utcOffset(), 'minutes').endOf('day').toDate()),
    ),
  )
  .groupBy(sql`to_char(${orders.createdAt}, 'DD/MM')`)

const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
  const [dayA, monthA] = a.date.split('/').map(Number)
  const [dayB, monthB] = b.date.split('/').map(Number)
  if (monthA === monthB) return dayA - dayB
  const dateA = new Date(2024, monthA - 1, dayA)
  const dateB = new Date(2024, monthB - 1, dayB)
  return dateA.getTime() - dateB.getTime()
})

return orderedReceiptPerDay
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Frontend envia datas com timezone (ex: -03:00) | Adicione utcOffset em minutos antes de filtrar |
| Periodo sem `from` nem `to` | Default: ultimos 7 dias ate hoje |
| Periodo com so `from` | endDate = startDate + 7 dias |
| Precisa agrupar por dia | Use `to_char(col, 'DD/MM')` no groupBy e select |
| Resultado agrupado por DD/MM precisa de ordem | Ordene no JS com split/map/Date, nao no SQL |
| Usuario assiste depois das 21h e ve dados errados | Problema classico de timezone — utcOffset resolve |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `where(gte(col, new Date(from)))` sem startOf | `gte(col, dayjs(from).startOf('day').toDate())` |
| `orderBy` em coluna texto DD/MM | Sort no JavaScript com comparacao por mes+dia |
| Query de periodo sem limite maximo | Valide `endDate.diff(startDate, 'days') > MAX` |
| Filtro de data sem correcao de timezone | `.add(date.utcOffset(), 'minutes')` antes do filtro |
| `new Date(year, month, day)` com mes direto | `new Date(year, month - 1, day)` porque JS meses comecam em 0 |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
