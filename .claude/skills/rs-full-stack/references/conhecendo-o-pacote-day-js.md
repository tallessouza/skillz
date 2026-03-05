---
name: rs-full-stack-conhecendo-o-pacote-day-js
description: "Applies day.js library patterns when working with dates and times in JavaScript/TypeScript. Use when user asks to 'format a date', 'compare dates', 'add days to a date', 'manipulate time', or 'work with dates in JS'. Guides lightweight library selection over heavy alternatives like moment.js. Make sure to use this skill whenever date/time manipulation is needed in JavaScript projects. Not for backend-only date handling with native SQL functions or Python datetime."
---

# Day.js — Manipulacao de Data e Hora

> Ao manipular datas em JavaScript, use day.js ao inves de reimplementar logica manualmente, porque data e hora e complexo demais para resolver com codigo ad-hoc.

## Rules

1. **Prefira day.js sobre moment.js** — day.js tem ~2KB, moment.js e significativamente maior, porque bundle size impacta performance da aplicacao
2. **Nunca reimplemente logica de data** — comparacao, formatacao, adicao de dias ja existem prontos no day.js, porque codigo custom de data e fonte constante de bugs
3. **Avalie peso antes de instalar qualquer biblioteca** — verifique tamanho no npm antes de adicionar, porque bibliotecas pesadas degradam a experiencia do usuario
4. **Use metodos encadeados do day.js** — `.add()`, `.subtract()`, `.format()`, `.isBefore()`, `.isAfter()` sao a API padrao, porque encadeamento torna o codigo legivel

## How to write

### Comparacao de datas
```typescript
import dayjs from 'dayjs'

// Verificar se uma data e anterior a outra
const isExpired = dayjs(expirationDate).isBefore(dayjs())
```

### Adicao de tempo
```typescript
// Adicionar dias, meses, anos
const nextWeek = dayjs().add(7, 'day')
const nextMonth = dayjs().add(1, 'month')
const nextYear = dayjs().add(1, 'year')
```

### Extrair componentes
```typescript
const hour = dayjs().hour()
const minute = dayjs().minute()
const year = dayjs().year()
```

### Formatacao
```typescript
const formatted = dayjs().format('DD/MM/YYYY HH:mm')
```

## Example

**Before (implementacao manual):**
```typescript
function isDateBefore(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getTime() < d2.getTime()
}

function addDays(date: string, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
```

**After (com day.js):**
```typescript
import dayjs from 'dayjs'

const isBefore = dayjs(date1).isBefore(date2)
const futureDate = dayjs(date).add(days, 'day')
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa comparar datas | `dayjs(a).isBefore(b)` ou `.isAfter(b)` |
| Precisa somar/subtrair tempo | `.add(n, 'unit')` / `.subtract(n, 'unit')` |
| Precisa formatar para exibicao | `.format('DD/MM/YYYY')` |
| Precisa extrair parte da data | `.hour()`, `.minute()`, `.year()`, `.month()` |
| Precisa de funcionalidade avancada | Verifique plugins do day.js antes de buscar outra lib |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `new Date().getTime() < other.getTime()` | `dayjs().isBefore(other)` |
| `date.setDate(date.getDate() + 7)` | `dayjs(date).add(7, 'day')` |
| `import moment from 'moment'` | `import dayjs from 'dayjs'` (2KB vs 70KB+) |
| Funcao custom de formatacao de data | `dayjs(date).format('DD/MM/YYYY')` |

## Escolha de bibliotecas — criterios

| Criterio | Como verificar |
|----------|---------------|
| Tamanho do pacote | Checar no npm ou bundlephobia.com |
| Downloads semanais | npm mostra na pagina do pacote |
| Ultima atualizacao | npm mostra data da ultima versao |
| Contribuidores ativos | Repositorio no GitHub |
| Comunidade | Issues, PRs, stars no GitHub |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de bibliotecas e ecossistema npm
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-pacote-day-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-pacote-day-js/references/code-examples.md)
