---
name: rs-full-stack-obtendo-a-data-e-a-hora
description: "Applies JavaScript Date object fundamentals when working with dates and times. Use when user asks to 'get current date', 'work with dates', 'create a Date object', 'convert timestamps', or 'handle time in JS'. Covers new Date(), getTime(), epoch reference, and timezone awareness. Make sure to use this skill whenever generating code that involves Date operations in JavaScript. Not for date formatting, date libraries like dayjs/luxon, or date arithmetic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, date, timestamp, epoch, timezone]
---

# Obtendo a Data e a Hora em JavaScript

> Usar `new Date()` para obter data/hora atual, `getTime()` para milissegundos desde epoch, e sempre considerar fuso horario.

## Rules

1. **Use `new Date()` para data atual** — retorna data e hora completa com referencia de fuso horario local, porque e o metodo padrao e mais legivel
2. **Use `getTime()` para timestamps numericos** — retorna milissegundos desde epoch (1 Jan 1970 00:00:00 UTC), porque timestamps sao comparaveis e serializaveis
3. **Lembre que epoch e UTC** — a data de referencia do JavaScript e meia-noite de 1 de janeiro de 1970 UTC, porque `new Date(0)` mostra 31/dez/1969 em fusos negativos como BRT (-3)
4. **`new Date()` aceita sobrecarga (overload)** — pode receber zero args (agora), um numero (milissegundos), string, ou ano/mes/dia separados, porque o construtor tem multiplas assinaturas
5. **Sempre considere fuso horario** — o Date exibe na localidade do ambiente, porque o deslocamento de fuso afeta a representacao visual da mesma data

## How to write

### Data e hora atual

```javascript
const now = new Date()
// Wed Dec 13 2023 14:30:00 GMT-0300 (Horario Padrao de Brasilia)
```

### Timestamp em milissegundos

```javascript
const timestampInMs = new Date().getTime()
// 1702488600000 (milissegundos desde epoch)
```

### Data a partir de timestamp

```javascript
const dateFromTimestamp = new Date(0)
// Wed Dec 31 1969 21:00:00 GMT-0300 (epoch ajustado ao fuso BRT)

const specificDate = new Date(1702488600000)
// Recria a data a partir do timestamp
```

## Example

**Before (confuso sobre epoch):**
```javascript
const ref = new Date(0)
console.log(ref) // "31 de dezembro de 1969?? Bug!"
```

**After (com entendimento de fuso):**
```javascript
const epochReference = new Date(0)
// 31/dez/1969 21:00 em BRT (-3) = 01/jan/1970 00:00 UTC
// Nao e bug — e o deslocamento de fuso horario
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa da data/hora agora | `new Date()` |
| Precisa comparar ou armazenar datas | Use `getTime()` para obter timestamp numerico |
| Recebeu timestamp de API | `new Date(timestampInMs)` para converter |
| Data parece "errada" por 1 dia | Verifique o fuso horario — provavelmente e deslocamento UTC |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Assumir que `new Date(0)` e 1/jan/1970 local | Lembrar que epoch e UTC, fuso desloca a exibicao |
| Ignorar fuso ao exibir datas | Sempre considerar timezone do usuario |
| Comparar datas como strings | Comparar via `getTime()` (numerico) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Data aparece como 31/dez/1969 em vez de 01/jan/1970 | Deslocamento de fuso horario (ex: BRT -3) | Isso e esperado — epoch e UTC, display e local |
| `new Date(timestamp)` mostra data errada | Timestamp em segundos em vez de milissegundos | Multiplique por 1000: `new Date(ts * 1000)` |
| Comparacao de datas retorna resultado inesperado | Comparando objetos Date como referencia | Use `getTime()` para comparar numericamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre epoch, fuso horario e overload do Date
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes