---
name: rs-next-js-melhorando-o-date-picker
description: "Applies URL-driven state management pattern for DatePicker components in Next.js App Router. Use when user asks to 'create a date picker', 'filter by date', 'sync state with URL', 'use search params', or 'navigate between dates'. Enforces useRouter/useSearchParams from next/navigation, date formatting with date-fns, and URL as single source of truth. Make sure to use this skill whenever building date filtering or URL state sync in Next.js. Not for server-side date logic, static calendars, or form-only date inputs."
---

# DatePicker Dinamico com URL State no Next.js

> Use a URL como fonte unica de verdade para estado de filtros, sincronizando componentes client-side com busca server-side automaticamente.

## Rules

1. **Use `next/navigation`, nunca `next/router`** — `useRouter`, `usePathName`, `useSearchParams` vem de `next/navigation` porque o App Router substituiu o roteamento antigo da pasta Pages
2. **URL e o estado global** — ao inves de Context ou estado local, persista filtros na URL com search params, porque isso permite compartilhar links com filtros pre-aplicados e recarregar a pagina sem perder estado
3. **Valide datas parseadas antes de usar** — use `isValid` do date-fns apos criar `new Date(year, month - 1, day)`, porque janeiro e mes 0 no JavaScript e inputs invalidos criam datas silenciosamente erradas
4. **Formate datas com locale** — use `format(date, 'PPP', { locale: ptBR })` para exibicao amigavel, e `format(date, 'yyyy-MM-dd')` para URL, porque o formato americano e parseavel e o localizado e legivel
5. **Wrap funcoes de inicializacao em useCallback** — `getInitialDate` precisa de useCallback para ser dependencia estavel no useEffect que sincroniza URL com estado local
6. **Marque como `"use client"` componentes com hooks** — useRouter, useState, useEffect exigem client component

## How to write

### Capturar data da URL

```typescript
"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const router = useRouter()
const pathname = usePathname()
const searchParams = useSearchParams()
const dateParam = searchParams.get("date") // "2025-09-08" ou null
```

### Parsear e validar data da URL

```typescript
import { isValid } from "date-fns"

const getInitialDate = useCallback(() => {
  if (!dateParam) return undefined
  const [year, month, day] = dateParam.split("-").map(Number)
  const parsedDate = new Date(year, month - 1, day) // month - 1 porque janeiro = 0
  return isValid(parsedDate) ? parsedDate : new Date()
}, [dateParam])
```

### Atualizar URL com nova data

```typescript
import { format } from "date-fns"

function updateURLWithDate(selectedDate: Date | undefined) {
  if (!selectedDate) return
  const newParams = new URLSearchParams(searchParams.toString())
  newParams.set("date", format(selectedDate, "yyyy-MM-dd"))
  router.push(`${pathname}?${newParams.toString()}`)
}
```

### Navegar entre dias

```typescript
import { addDays } from "date-fns"

function handleNavigateDay(days: number) {
  const newDate = addDays(date ?? new Date(), days)
  setDate(newDate)
  updateURLWithDate(newDate)
}

// Nos botoes:
<button onClick={() => handleNavigateDay(-1)}>←</button>
<button onClick={() => handleNavigateDay(1)}>→</button>
```

### Sincronizar URL com estado via useEffect

```typescript
useEffect(() => {
  const newDate = getInitialDate()
  if (newDate && date?.getTime() !== newDate.getTime()) {
    setDate(newDate)
  }
}, [getInitialDate, date])
```

## Example

**Before (estado local isolado):**
```typescript
const [date, setDate] = useState(new Date())
// Estado perdido ao recarregar, impossivel compartilhar link filtrado
```

**After (URL como estado global):**
```typescript
const searchParams = useSearchParams()
const dateParam = searchParams.get("date")
const [date, setDate] = useState<Date | undefined>()
// URL reflete filtro, server component rebusca dados automaticamente
// Link compartilhavel: /appointments?date=2025-09-08
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Filtro que usuario quer compartilhar via link | URL search params |
| Exibir data formatada pro usuario | `format(date, 'PPP', { locale: ptBR })` |
| Persistir data na URL | `format(date, 'yyyy-MM-dd')` |
| Componente precisa de useRouter/useState | Adicione `"use client"` no topo |
| Criar Date a partir de mes numerico | Subtraia 1 do mes (janeiro = 0) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `import { useRouter } from "next/router"` | `import { useRouter } from "next/navigation"` |
| `new Date(year, month, day)` sem ajustar mes | `new Date(year, month - 1, day)` |
| Estado local para filtros compartilhaveis | URL search params como fonte de verdade |
| `getInitialDate` sem useCallback dentro de useEffect | Wrap em useCallback com dependencias corretas |
| Formatar data sem locale | `format(date, 'PPP', { locale: ptBR })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
