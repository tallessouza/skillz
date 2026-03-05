---
name: rs-next-js-busca-dinamica-1
description: "Enforces URL-based filtering patterns using Next.js searchParams in Server Components. Use when user asks to 'filter data by URL', 'use searchParams', 'filter by date in Next.js', 'dynamic search', or 'query string filtering'. Applies rules: searchParams as Promise (Next.js 15+), date-fns for date manipulation, Prisma gte/lte range queries, orderBy for sorted results. Make sure to use this skill whenever implementing URL-based filtering or search in Next.js App Router. Not for client-side useSearchParams, pagination, or infinite scroll."
---

# Busca Dinamica com searchParams (Server Components)

> Filtre dados via URL usando searchParams no servidor — o estado fica na URL, compartilhavel e sem client-side state.

## Rules

1. **searchParams e uma Promise no Next.js 15+** — faca `await searchParams` antes de desestruturar, porque o Next mudou de sincrono para assincrono
2. **Use date-fns para manipulacao de datas** — `parseISO`, `startOfDay`, `endOfDay` evitam bugs silenciosos que `new Date()` causa com timezones
3. **Filtre por range com gte/lte no Prisma** — para filtrar "todos de um dia", use `startOfDay` como gte e `endOfDay` como lte
4. **Sempre ordene resultados filtrados** — adicione `orderBy` pelo campo temporal para evitar ordem aleatoria de insercao
5. **Fallback para data atual** — se searchParams nao tiver date, use `new Date()` como default
6. **Estado na URL, nao em useState** — searchParams permite compartilhar links ja filtrados, sem precisar reproduzir o filtro manualmente

## How to write

### Tipagem de searchParams (Next.js 15+)

```typescript
// searchParams agora e Promise — tipar assim:
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams

  const selectedDate = date ? parseISO(date) : new Date()
}
```

### Filtro por range de data no Prisma

```typescript
import { startOfDay, endOfDay, parseISO } from 'date-fns'

const appointments = await prisma.appointment.findMany({
  where: {
    scheduledAt: {
      gte: startOfDay(selectedDate),
      lte: endOfDay(selectedDate),
    },
  },
  orderBy: {
    scheduledAt: 'asc',
  },
})
```

### URL com searchParams

```
// Formato da URL com filtro de data:
/appointments?date=2025-09-08

// Sem filtro — usa data atual como fallback:
/appointments
```

## Example

**Before (sem filtro, todos os registros):**
```typescript
export default async function Home() {
  const appointments = await prisma.appointment.findMany()

  return <AppointmentList appointments={appointments} />
}
```

**After (filtro por data via URL):**
```typescript
import { parseISO, startOfDay, endOfDay } from 'date-fns'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date ? parseISO(date) : new Date()

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  })

  return <AppointmentList appointments={appointments} />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Filtro que precisa ser compartilhavel via link | searchParams na URL |
| Filtro que e estado temporario do usuario | useState no client |
| Filtrar registros de um dia especifico | gte: startOfDay, lte: endOfDay |
| Filtrar range de datas (semana/mes) | gte: inicio do periodo, lte: fim do periodo |
| Pagina sem parametro de data | Fallback para new Date() |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const { date } = searchParams` (sincrono) | `const { date } = await searchParams` |
| `new Date(dateString)` para parsing | `parseISO(dateString)` do date-fns |
| `where: { scheduledAt: selectedDate }` (igualdade exata) | `where: { scheduledAt: { gte: startOfDay(...), lte: endOfDay(...) } }` |
| findMany sem orderBy em listas temporais | findMany com `orderBy: { scheduledAt: 'asc' }` |
| useState para filtro que deveria ser na URL | searchParams no Server Component |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-busca-dinamica-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-busca-dinamica-1/references/code-examples.md)
