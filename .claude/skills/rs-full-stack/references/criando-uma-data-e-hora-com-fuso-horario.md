---
name: rs-full-stack-data-hora-fuso-horario
description: "Applies timezone offset patterns when creating JavaScript Date objects with specific timezones. Use when user asks to 'create a date with timezone', 'handle timezone offset', 'format date with timezone', 'work with UTC offset', or 'manipulate timezones in JS'. Ensures correct ISO 8601 format with offset notation instead of Z suffix. Make sure to use this skill whenever generating code that creates dates with specific timezone offsets. Not for date libraries like dayjs/luxon, nor for Intl.DateTimeFormat configuration."
---

# Criando Data e Hora com Fuso Horário

> Ao criar datas com fuso horário em JavaScript, substitua o sufixo Z pelo deslocamento UTC no formato ±HH:MM.

## Rules

1. **Use toISOString() como base** — extraia o formato ISO e substitua o `Z` pelo offset desejado, porque o formato ISO já fornece 90% da string necessária
2. **Remova o Z antes de adicionar offset** — `Z` significa UTC+0, substituí-lo pelo offset cria a data no fuso correto
3. **Formato do offset: ±HH:MM** — sempre use sinal (`+` ou `-`) seguido de horas e minutos com dois dígitos: `+03:00`, `-05:00`
4. **Offset positivo desloca a hora para trás** — `+03:00` significa que a hora local está 3h à frente do UTC, então o JS ajusta subtraindo 3h ao converter para UTC
5. **Offset negativo desloca a hora para frente** — `-03:00` faz o JS adicionar 3h ao converter para UTC
6. **Use toLocaleString() para exibir** — facilita a comparação visual entre datas com e sem fuso

## How to write

### Criar data com offset de fuso horário

```typescript
// 1. Capture a string ISO da data atual (ou qualquer data)
const now = new Date()
const isoString = now.toISOString() // "2024-01-15T19:58:10.000Z"

// 2. Remova o Z e adicione o offset desejado
const isoWithoutZ = isoString.replace("Z", "")
const dateWithTimezone = new Date(`${isoWithoutZ}+03:00`)

// 3. Exiba formatado
console.log(dateWithTimezone.toLocaleString())
```

### Criar data com offset direto na string

```typescript
// Direto na criação — offset de -05:00 (New York)
const dateNY = new Date("2024-01-15T14:30:00.000-05:00")

// Offset de +09:00 (Tokyo)
const dateTokyo = new Date("2024-01-15T14:30:00.000+09:00")
```

## Example

**Before (sem fuso — assume UTC ou local):**
```typescript
const date = new Date()
console.log(date.toLocaleString()) // hora local do sistema
```

**After (com fuso horário explícito):**
```typescript
const now = new Date()
const iso = now.toISOString().replace("Z", "")
const dateWithTimezone = new Date(`${iso}+03:00`)
console.log(dateWithTimezone.toLocaleString()) // hora ajustada pelo offset
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de data no fuso de Brasília | Use offset `-03:00` |
| Precisa de data em UTC | Mantenha o `Z` ou use `+00:00` |
| Comparando datas de fusos diferentes | Converta ambas para ISO e compare os timestamps |
| Exibindo para o usuário | Use `toLocaleString()` para formato legível |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new Date("2024-01-15T14:30:00.000Z+03:00")` | `new Date("2024-01-15T14:30:00.000+03:00")` — remova o Z antes |
| `+3` como offset | `+03:00` — sempre dois dígitos com minutos |
| Somar horas manualmente para simular fuso | Use o offset na string ISO |
| Ignorar fuso em apps multi-região | Sempre armazene com offset ou em UTC |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre como o JS interpreta offsets e a inversão de direção
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-uma-data-e-hora-com-fuso-horario/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-uma-data-e-hora-com-fuso-horario/references/code-examples.md)
