---
name: rs-next-js-finalizando-o-deploy
description: "Enforces correct date/time handling in Next.js production deployments. Use when user asks to 'fix dates in production', 'deploy Next.js app', 'format dates with timezone', 'toLocaleTimeString', or encounters timezone bugs after deploying to Vercel. Applies rules: never use raw getHours/getMinutes in server code, always specify timezone in toLocaleTimeString, extract repeated date formatting into utils. Make sure to use this skill whenever working with dates in Next.js server actions or SSR code. Not for client-only date display, date-fns library configuration, or general JavaScript date tutorials."
---

# Datas em Producao (Next.js)

> Toda manipulacao de data em server actions ou SSR deve especificar timezone explicitamente, porque o servidor de producao roda em fuso horario diferente do local.

## Rules

1. **Nunca use getHours()/getMinutes() em server actions** — use `toLocaleTimeString` com timezone explicito, porque em producao o servidor esta em UTC ou outro fuso e `getHours()` retorna a hora do servidor, nao do usuario
2. **Sempre especifique timeZone no toLocaleTimeString** — `{ timeZone: 'America/Sao_Paulo' }`, porque sem isso o resultado depende do ambiente de execucao
3. **Extraia formatacao de data para utils** — crie uma funcao `formatDateTime` reutilizavel, porque a mesma logica aparece em create, update e agrupamento de appointments
4. **Use hour12: false para formato 24h** — evita ambiguidade AM/PM em aplicacoes brasileiras
5. **Converta string de hora para numero com parseInt** — `toLocaleTimeString` retorna string, mas comparacoes de periodo (manha/tarde) precisam de numero
6. **Teste em producao apos cada fix de data** — local funciona com qualquer abordagem, o bug so aparece no deploy

## How to write

### Funcao formatDateTime (utils)

```typescript
export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  })
}
```

### Uso em server actions

```typescript
import { formatDateTime } from './utils'

// Em create/update actions
const hour = parseInt(formatDateTime(scheduledAt))
```

### Uso em agrupamento por periodo

```typescript
function groupAppointmentByPeriod(appointments: Appointment[]) {
  // Para exibicao
  const time = formatDateTime(apt.scheduledAt)

  // Para logica de periodo (manha/tarde)
  const hour = parseInt(formatDateTime(apt.scheduledAt))
  const period = hour < 12 ? 'morning' : 'afternoon'
}
```

## Example

**Before (funciona local, quebra em producao):**
```typescript
// Server action
const hour = scheduledAt.getHours()
const minutes = scheduledAt.getMinutes()

// Agrupamento
const time = `${apt.scheduledAt.getHours()}:${apt.scheduledAt.getMinutes()}`
```

**After (funciona em qualquer ambiente):**
```typescript
// Server action
const hour = parseInt(formatDateTime(scheduledAt))

// Agrupamento
const time = formatDateTime(apt.scheduledAt)
const period = parseInt(formatDateTime(apt.scheduledAt)) < 12 ? 'morning' : 'afternoon'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Qualquer `new Date()` em server action | Especifique timezone |
| `getHours()` em codigo SSR | Substitua por `formatDateTime` |
| Horario aparece errado so em producao | Problema de timezone — use `toLocaleTimeString` com timezone |
| Precisa suportar multiplos fusos | Use date-fns com `{ locale: ptBR }` |
| Ajuste visual de espacamento | Use `gap` no container pai ao inves de margin individual |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `date.getHours()` em server action | `parseInt(formatDateTime(date))` |
| `toLocaleTimeString()` sem timeZone | `toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })` |
| Mesma logica de formatacao em 3 lugares | Uma funcao `formatDateTime` em utils |
| `hour12: true` para app brasileiro | `hour12: false` |
| Confiar que local == producao para datas | Sempre testar no ambiente de deploy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
