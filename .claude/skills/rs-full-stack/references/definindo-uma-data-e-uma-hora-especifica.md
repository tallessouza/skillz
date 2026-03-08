---
name: rs-full-stack-definindo-data-hora
description: "Enforces correct Date instantiation patterns in JavaScript when creating specific dates and times. Use when user asks to 'create a date', 'set a date', 'define date and time', 'new Date', or 'work with dates in JS'. Applies rules: month is 0-indexed with numeric constructor, string format uses 1-indexed months, T separator for ISO strings. Make sure to use this skill whenever generating code that creates Date objects with specific values. Not for date formatting, date arithmetic, or timezone manipulation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [JavaScript, Date, ISO-8601, date-constructor, month-indexing]
---

# Definindo Data e Hora Específica em JavaScript

> Ao criar objetos Date com valores específicos, escolha o construtor correto e respeite a indexação de meses de cada formato.

## Rules

1. **Meses são 0-indexados no construtor numérico** — `new Date(2024, 6, 3)` = julho, porque meses vão de 0 (janeiro) a 11 (dezembro). Passar 12 causa overflow para janeiro do ano seguinte.
2. **Meses são 1-indexados no formato string ISO** — `new Date("2024-07-03")` = julho, porque o formato ISO usa meses de 01 a 12.
3. **Use T para separar data e hora em ISO strings** — `"2024-07-03T14:30:00"`, onde T vem de "time".
4. **Ordem dos argumentos numéricos: ano, mês, dia, hora, minuto, segundo** — nunca inverta dia e mês, porque não há validação que impeça.
5. **String legível também funciona** — `new Date("July 3, 2024 14:30:00")` é válido, mas prefira ISO para código de produção porque é independente de locale.

## How to write

### Apenas data (construtor numérico)
```javascript
// Mês 6 = julho (0-indexado)
const birthday = new Date(2024, 6, 3)
```

### Data e hora (construtor numérico)
```javascript
// ano, mês(0-index), dia, hora, minuto, segundo
const appointment = new Date(2024, 6, 3, 14, 30, 0)
```

### Data e hora (string ISO)
```javascript
// Mês 07 = julho (1-indexado no formato string)
const event = new Date("2024-07-03T14:30:00")
```

### Data e hora (string legível)
```javascript
const meeting = new Date("July 3, 2024 14:30:00")
```

## Example

**Before (bug silencioso):**
```javascript
// Dev quer julho, mas passa 7 no construtor numérico → agosto
const date = new Date(2024, 7, 3)
```

**After (with this skill applied):**
```javascript
// Julho = mês 6 no construtor numérico
const date = new Date(2024, 6, 3)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa de data fixa no código | Use construtor numérico com comentário do mês real |
| Recebe data como string de API/input | Use formato ISO `"YYYY-MM-DDTHH:mm:ss"` |
| Precisa de legibilidade máxima | Use string legível `"July 3, 2024 14:30:00"` |
| Sem hora definida | Passe apenas ano, mês, dia — hora será 00:00:00 |
| Mês 12 no construtor numérico | Não use — causa overflow para janeiro do próximo ano |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `new Date(2024, 7, 3)` querendo julho | `new Date(2024, 6, 3)` // julho = 6 |
| `new Date(2024, 12, 1)` querendo dezembro | `new Date(2024, 11, 1)` // dezembro = 11 |
| `new Date("2024-6-03T14:30:00")` | `new Date("2024-06-03T14:30:00")` // zero-pad |
| Misturar indexação entre formatos | Comentar qual formato está usando |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Data mostra mes errado (off by one) | Mes 0-indexado no construtor numerico | Subtraia 1 do mes desejado: julho = 6 |
| `new Date(2024, 12, 1)` retorna janeiro 2025 | Overflow de mes | Dezembro = 11, nao 12 |
| String ISO retorna data errada | Mes 1-indexado na string, nao 0-indexado | Use `"2024-07-03"` para julho (07, nao 06) |
| Hora nao aparece na data | Faltou separador `T` na string ISO | Use `"2024-07-03T14:30:00"` com T entre data e hora |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre indexação de meses, overflow behavior e diferenças entre construtores
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações