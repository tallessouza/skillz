---
name: rs-full-stack-convertendo-data-para-string
description: "Applies JavaScript Date-to-string conversion methods when formatting dates or times. Use when user asks to 'format a date', 'convert date to string', 'display only time', 'show only date', or 'format datetime output'. Covers toString, toDateString, and toTimeString methods with correct usage patterns. Make sure to use this skill whenever generating code that displays dates or times as text. Not for date parsing, date arithmetic, Intl.DateTimeFormat, or locale-specific formatting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, date, string-conversion, formatting, toDateString, toTimeString]
---

# Convertendo Data para String em JavaScript

> Usar o metodo de conversao correto (toString, toDateString, toTimeString) para extrair exatamente a parte da data/hora necessaria.

## Rules

1. **Use `toDateString()` para exibir somente a data** — retorna dia da semana, mes, dia do mes e ano, sem horario, porque evita exibir informacao desnecessaria ao usuario
2. **Use `toTimeString()` para exibir somente a hora** — retorna horas, minutos, segundos e timezone, sem a data, porque separa responsabilidades de exibicao
3. **Use `toString()` apenas quando precisar da representacao completa** — retorna data + hora + timezone, porque e equivalente ao output padrao do console.log
4. **Crie o Date com formato ISO ao definir data e hora** — `new Date("2024-07-02T14:30:00")`, porque o formato ISO e o unico confiavel cross-browser

## How to write

### Extrair somente a data

```javascript
const date = new Date("2024-07-02T14:30:00")
const dateOnly = date.toDateString()
// "Tue Jul 02 2024" — sem horario
```

### Extrair somente a hora

```javascript
const date = new Date("2024-07-02T14:30:00")
const timeOnly = date.toTimeString()
// "14:30:00 GMT-0300" — sem data
```

### Conversao completa para string

```javascript
const date = new Date("2024-07-02T14:30:00")
const full = date.toString()
// "Tue Jul 02 2024 14:30:00 GMT-0300 (Horario Padrao de Brasilia)"
```

## Example

**Before (exibindo informacao desnecessaria):**
```javascript
const event = new Date("2024-07-02T14:30:00")
document.getElementById("date").textContent = event.toString()
// Mostra data + hora + timezone quando so precisava da data
```

**After (com metodo especifico):**
```javascript
const event = new Date("2024-07-02T14:30:00")
document.getElementById("date").textContent = event.toDateString()
// "Tue Jul 02 2024" — limpo, so a data
```

## Heuristics

| Situacao | Metodo |
|----------|--------|
| Mostrar data de nascimento, data de evento | `toDateString()` |
| Mostrar horario de alarme, hora de reuniao | `toTimeString()` |
| Log completo para debug | `toString()` |
| Formato customizado (dd/mm/yyyy) | Usar `Intl.DateTimeFormat` (fora do escopo desta skill) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `date.toString()` quando so precisa da data | `date.toDateString()` |
| `date.toString()` quando so precisa da hora | `date.toTimeString()` |
| `date.toString().split(" ").slice(0,4).join(" ")` | `date.toDateString()` |
| `date.toString().split(" ")[4]` | `date.toTimeString()` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `toDateString()` retorna dia da semana em ingles | Metodo nao aceita locale — usa o padrao do runtime | Use `Intl.DateTimeFormat('pt-BR')` se precisar de portugues |
| `toTimeString()` mostra timezone inesperada | Reflete o fuso do sistema, nao UTC | Use `toISOString()` para UTC ou configure o ambiente |
| `Invalid Date` ao criar Date com string | Formato da string nao e ISO 8601 | Use `new Date("YYYY-MM-DDTHH:mm:ss")` sempre |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes