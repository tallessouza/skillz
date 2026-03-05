---
name: rs-full-stack-data-hora-formatada-localidade
description: "Applies JavaScript date/time locale formatting patterns when writing code that displays dates or times. Use when user asks to 'format a date', 'display time', 'show date in Brazilian format', 'locale date string', or 'internationalize dates'. Enforces toLocaleDateString/toLocaleTimeString with explicit locale codes. Make sure to use this skill whenever generating code that outputs dates or times to users. Not for date arithmetic, date parsing from strings, or timezone conversion logic."
---

# Exibindo Data e Hora Formatadas por Localidade

> Ao exibir datas e horas para o usuario, sempre use toLocaleDateString() e toLocaleTimeString() com locale explicito, nunca toString() ou concatenacao manual.

## Rules

1. **Use toLocaleDateString() para datas** — nunca formate manualmente com getDay()/getMonth(), porque o metodo ja aplica o padrao correto da localidade (dia/mes/ano vs mes/dia/ano)
2. **Use toLocaleTimeString() para horarios** — retorna hora:minuto:segundo no padrao local, incluindo AM/PM quando aplicavel
3. **Sempre passe o locale explicitamente** — `toLocaleDateString('pt-BR')` nao `toLocaleDateString()`, porque o padrao implicito depende do ambiente e causa inconsistencia entre servidor e cliente
4. **Separe data e hora em chamadas distintas** — toLocaleDateString retorna SO a data, toLocaleTimeString retorna SO o horario, porque cada um tem formatacao independente
5. **Use codigos de locale padrao BCP 47** — `'pt-BR'`, `'en-US'`, `'ja-JP'`, nunca abreviacoes inventadas

## How to write

### Data formatada por localidade

```typescript
const date = new Date('2024-07-02T14:30:15')

// Data no padrao brasileiro: 02/07/2024
const dataBR = date.toLocaleDateString('pt-BR')

// Data no padrao americano: 7/2/2024
const dataUS = date.toLocaleDateString('en-US')
```

### Horario formatado por localidade

```typescript
const date = new Date('2024-07-02T14:30:15')

// Horario brasileiro: 14:30:15
const horaBR = date.toLocaleTimeString('pt-BR')

// Horario americano: 2:30:15 PM
const horaUS = date.toLocaleTimeString('en-US')
```

## Example

**Before (formatacao manual fragil):**
```typescript
const d = new Date()
const formatted = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
const time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
```

**After (com este skill aplicado):**
```typescript
const date = new Date()
const formattedDate = date.toLocaleDateString('pt-BR')
const formattedTime = date.toLocaleTimeString('pt-BR')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Exibir data para usuario brasileiro | `toLocaleDateString('pt-BR')` |
| Exibir horario para usuario americano | `toLocaleTimeString('en-US')` |
| Nao sabe o locale do usuario | Use `navigator.language` ou aceite como parametro |
| Precisa de data E hora juntos | Duas chamadas separadas, concatene o resultado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `date.toString()` | `date.toLocaleDateString('pt-BR')` |
| `date.getDate() + '/' + date.getMonth()` | `date.toLocaleDateString('pt-BR')` |
| `date.toLocaleDateString()` (sem locale) | `date.toLocaleDateString('pt-BR')` |
| `date.getHours() + ':' + date.getMinutes()` | `date.toLocaleTimeString('pt-BR')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre locales, padroes BCP 47 e diferencas entre formatos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exibindo-data-e-hora-formatadas-de-acordo-com-a-localidade/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exibindo-data-e-hora-formatadas-de-acordo-com-a-localidade/references/code-examples.md)
