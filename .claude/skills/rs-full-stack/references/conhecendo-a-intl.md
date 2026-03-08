---
name: rs-full-stack-conhecendo-a-intl
description: "Applies JavaScript Intl API patterns for date/time formatting and locale detection. Use when user asks to 'format a date', 'get timezone', 'internationalize dates', 'locale formatting', or 'Intl API'. Enforces correct usage of Intl.DateTimeFormat for locale-aware formatting and timezone offset calculations. Make sure to use this skill whenever formatting dates for display or detecting user locale in JavaScript/TypeScript. Not for date arithmetic, date libraries like dayjs/moment, or server-side i18n frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [intl-api, date-formatting, locale, timezone, DateTimeFormat, internationalization]
---

# Intl API — Formatacao de Data e Hora

> Use a API Intl nativa do JavaScript para formatar datas conforme a localidade e obter informacoes de timezone, sem dependencias externas.

## Rules

1. **Use Intl.DateTimeFormat para formatar datas** — `new Intl.DateTimeFormat('pt-BR').format(date)` nao `date.toLocaleDateString()`, porque DateTimeFormat oferece controle granular e e reutilizavel
2. **Detecte locale e timezone via resolvedOptions()** — `Intl.DateTimeFormat().resolvedOptions()` retorna locale, timezone e calendario do usuario sem precisar de bibliotecas externas
3. **Passe o locale explicitamente** — `new Intl.DateTimeFormat('pt-BR')` nao `new Intl.DateTimeFormat()`, porque o locale implicito varia entre ambientes (servidor vs browser)
4. **Use getTimezoneOffset() para diferenca UTC** — retorna em minutos, divida por 60 para horas. O valor e o oposto do que parece: UTC-3 retorna 180 (positivo)
5. **Prefira Intl sobre bibliotecas externas** — para formatacao simples de data/hora, a API nativa e suficiente e elimina dependencias

## How to write

### Detectar locale e timezone do usuario

```typescript
const localeInfo = Intl.DateTimeFormat().resolvedOptions()
// { locale: 'pt-BR', timeZone: 'America/Sao_Paulo', calendar: 'gregory', ... }
```

### Formatar data conforme localidade

```typescript
const currentDate = new Date()

// Formato pt-BR: 01/03/2026
const brFormatted = new Intl.DateTimeFormat('pt-BR').format(currentDate)

// Formato en-US: 3/1/2026
const usFormatted = new Intl.DateTimeFormat('en-US').format(currentDate)
```

### Obter diferenca de timezone

```typescript
const date = new Date()
const offsetInMinutes = date.getTimezoneOffset()   // 180 para UTC-3
const offsetInHours = date.getTimezoneOffset() / 60 // 3
```

## Example

**Before (dependencia desnecessaria):**
```typescript
import dayjs from 'dayjs'
const formatted = dayjs().format('DD/MM/YYYY')
const tz = dayjs.tz.guess()
```

**After (com Intl nativo):**
```typescript
const formatted = new Intl.DateTimeFormat('pt-BR').format(new Date())
const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Exibir data para o usuario | `new Intl.DateTimeFormat(locale).format(date)` |
| Detectar timezone do usuario | `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| Calcular offset UTC em horas | `new Date().getTimezoneOffset() / 60` |
| Formatacao complexa com opcoes | Passe options object no segundo parametro do DateTimeFormat |
| Manipulacao de datas (add/subtract) | Use date-fns ou dayjs — Intl nao faz aritmetica |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `date.toLocaleDateString()` sem locale | `new Intl.DateTimeFormat('pt-BR').format(date)` |
| `moment().format('DD/MM/YYYY')` para formatacao simples | `new Intl.DateTimeFormat('pt-BR').format(new Date())` |
| Hardcode de timezone string | `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| `getTimezoneOffset()` sem dividir por 60 quando quer horas | `getTimezoneOffset() / 60` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Formato de data inesperado | Locale implicito varia entre ambientes | Passar locale explicitamente: `new Intl.DateTimeFormat('pt-BR')` |
| `getTimezoneOffset()` retorna valor positivo para UTC-3 | Comportamento nativo — valor e invertido | Dividir por 60 e inverter sinal se necessario |
| DateTimeFormat nao disponivel | Ambiente muito antigo (IE) | Usar polyfill ou biblioteca como date-fns |
| Formatacao diferente entre servidor e browser | Locale do servidor difere do browser | Definir locale explicitamente em ambos os ambientes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a API Intl, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes