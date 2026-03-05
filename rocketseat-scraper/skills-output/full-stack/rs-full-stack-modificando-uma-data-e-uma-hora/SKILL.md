---
name: rs-full-stack-modificando-data-hora
description: "Applies JavaScript Date mutation methods when modifying date or time values. Use when user asks to 'change a date', 'set the year', 'modify the time', 'update month', or any Date object manipulation task. Enforces correct usage of setFullYear, setMonth (0-indexed), setDate, setHours, setMinutes, setSeconds. Make sure to use this skill whenever mutating existing Date objects in JavaScript. Not for date formatting, parsing, or date library usage like dayjs/luxon."
---

# Modificando Data e Hora em JavaScript

> Ao modificar objetos Date, use os metodos set* corretos e lembre que meses sao 0-indexed.

## Rules

1. **Use `setFullYear` para ano** — `date.setFullYear(2030)` nao `date.setYear(2030)`, porque `setYear` e deprecated e inconsistente entre browsers
2. **Meses sao 0-indexed** — janeiro = 0, fevereiro = 1, dezembro = 11, porque a API Date do JS segue essa convencao e errar aqui causa bugs silenciosos de 1 mes
3. **Use `setMonth` sem "Full"** — `date.setMonth(7)` para agosto, porque so `setFullYear` tem o prefixo "Full", os demais metodos nao
4. **Use `setDate` para dia do mes** — `date.setDate(10)` altera o dia, porque `setDay` nao existe
5. **Metodos set* mutam o objeto original** — eles nao retornam um novo Date, porque Date e mutavel em JS

## How to write

### Modificar data

```javascript
const date = new Date("July 3, 2024 14:30")

date.setFullYear(2030)  // ano: 2024 → 2030
date.setMonth(0)        // mes: julho(6) → janeiro(0)
date.setDate(10)        // dia: 3 → 10
```

### Modificar hora

```javascript
date.setHours(18)       // hora: 14 → 18
date.setMinutes(15)     // minuto: 30 → 15
date.setSeconds(30)     // segundo: 0 → 30
```

## Example

**Before (bug comum — mes errado):**
```javascript
const date = new Date("July 3, 2024 14:30")
date.setMonth(7) // Queria julho, mas setou agosto!
```

**After (com esta skill):**
```javascript
const date = new Date("July 3, 2024 14:30")
date.setMonth(6) // Julho = indice 6 (0-indexed)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa mudar o ano | `setFullYear(ano)` — unico metodo com "Full" |
| Precisa mudar o mes | `setMonth(n)` onde n = mes - 1 (0-indexed) |
| Precisa mudar o dia | `setDate(dia)` — 1-indexed, valor normal |
| Precisa mudar hora/min/seg | `setHours`, `setMinutes`, `setSeconds` — valores diretos |
| Precisa de imutabilidade | Clone antes: `const clone = new Date(date.getTime())` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `date.setYear(2030)` | `date.setFullYear(2030)` |
| `date.setMonth(1)` para janeiro | `date.setMonth(0)` para janeiro |
| `date.setMonth(7)` para julho | `date.setMonth(6)` para julho |
| `date.setDay(10)` | `date.setDate(10)` |
| `const newDate = date.setFullYear(2030)` | `date.setFullYear(2030)` (retorna timestamp, nao Date) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes