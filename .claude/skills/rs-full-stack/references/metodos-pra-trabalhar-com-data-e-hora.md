---
name: rs-full-stack-metodos-data-hora
description: "Applies JavaScript Date getter methods correctly when working with dates and times. Use when user asks to 'get day of week', 'extract month from date', 'format date', 'work with Date object', or 'manipulate dates in JS'. Enforces zero-indexed corrections for getMonth() and getDay(), and proper method selection. Make sure to use this skill whenever generating code that reads date/time components from Date objects. Not for date formatting libraries like date-fns or dayjs, nor for date arithmetic or timezone handling."
---

# Métodos para Trabalhar com Data e Hora

> Ao extrair componentes de um Date, aplicar as correções de índice zero antes de exibir valores ao usuário.

## Rules

1. **Use getDay() para dia da semana** — retorna 0-6 (domingo=0), porque o padrão ECMAScript define domingo como início da semana
2. **Use getDate() para dia do mês** — retorna 1-31, este é o único getter que NÃO começa do zero
3. **Corrija getMonth() com +1** — retorna 0-11, porque meses são zero-indexed no JS; `date.getMonth() + 1` para exibição
4. **Use getFullYear() para o ano** — retorna 4 dígitos; nunca use getYear() porque é deprecated e retorna valores inconsistentes
5. **Use getHours/getMinutes/getSeconds para tempo** — retornam valores numéricos individuais, não strings formatadas

## How to write

### Criando e extraindo componentes

```typescript
const date = new Date("2024-07-02T14:30:10")

const dayOfWeek = date.getDay()        // 0-6 (0 = domingo)
const dayOfMonth = date.getDate()      // 1-31
const month = date.getMonth() + 1      // +1 porque retorna 0-11
const year = date.getFullYear()        // 2024
const hours = date.getHours()          // 14
const minutes = date.getMinutes()      // 30
const seconds = date.getSeconds()      // 10
```

### Mapeando dia da semana para nome

```typescript
const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const dayName = weekdays[date.getDay()]
```

## Example

**Before (bug comum — mês errado):**
```typescript
const date = new Date("2024-07-02T14:30:10")
console.log(`Mês: ${date.getMonth()}`) // Mostra 6, mas é julho (7)
```

**After (com correção de índice):**
```typescript
const date = new Date("2024-07-02T14:30:10")
console.log(`Mês: ${date.getMonth() + 1}`) // Mostra 7 (julho)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Exibir mês para o usuário | Sempre `getMonth() + 1` |
| Exibir dia da semana como texto | Use array de nomes indexado por `getDay()` |
| Comparar datas | Use `getTime()` para comparação numérica |
| Precisa do dia do mês | `getDate()` — único que não é zero-indexed |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `date.getYear()` | `date.getFullYear()` |
| `date.getMonth()` para exibição direta | `date.getMonth() + 1` |
| `date.getDay()` achando que é dia do mês | `date.getDate()` para dia do mês |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre zero-indexing e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-metodos-pra-trabalhar-com-data-e-hora/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-metodos-pra-trabalhar-com-data-e-hora/references/code-examples.md)
