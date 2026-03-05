---
name: rs-full-stack-fuso-horario
description: "Applies correct timezone and timestamp handling when writing JavaScript/TypeScript date code. Use when user asks to 'work with dates', 'format a date', 'convert timezone', 'handle timestamps', or 'create a Date object'. Enforces UTC-first thinking, timestamp awareness, and local vs UTC distinction. Make sure to use this skill whenever generating code that involves Date objects, timestamps, or timezone conversions. Not for calendar UI components, date picker libraries, or cron scheduling."
---

# Fuso Horário e Timestamps em JavaScript

> Ao trabalhar com datas em JavaScript, pensar sempre em timestamp (ponto absoluto no tempo) antes de pensar em representação visual (local ou UTC).

## Rules

1. **Timestamp é o valor canônico** — armazene e transmita datas como timestamp (milissegundos desde epoch), porque é independente de fuso horário e não ambíguo
2. **Epoch do JavaScript é meia-noite UTC de 1 de janeiro de 1970** — `new Date(0)` retorna esse momento, mas exibe com deslocamento local do ambiente de execução
3. **Distinga local de UTC explicitamente** — use métodos `getUTCHours()` vs `getHours()`, porque misturar os dois causa bugs silenciosos de fuso horário
4. **Fuso horário local vem do ambiente** — o objeto Date não armazena timezone; o navegador/runtime aplica o deslocamento na hora da exibição
5. **Nunca confie na exibição padrão do Date** — `toString()` usa fuso local do ambiente, `toISOString()` usa UTC; escolha conscientemente

## How to write

### Criar datas com timestamp

```typescript
// Timestamp é milissegundos desde epoch UTC
const now = Date.now() // timestamp atual em ms
const specificDate = new Date(1704067200000) // ponto absoluto no tempo

// Epoch reference — exibe diferente conforme fuso do ambiente
const epoch = new Date(0)
// No Brasil (UTC-3): "Wed Dec 31 1969 21:00:00 GMT-0300"
// Em UTC: "Thu Jan 01 1970 00:00:00 GMT+0000"
```

### Local vs UTC

```typescript
const date = new Date()

// Local (depende do ambiente)
const localHours = date.getHours()
const localString = date.toLocaleString('pt-BR')

// UTC (absoluto, independente de ambiente)
const utcHours = date.getUTCHours()
const isoString = date.toISOString() // sempre UTC
```

## Example

**Before (bug de fuso horário):**
```typescript
// Salva hora local no banco — cada usuário vê diferente
const createdAt = new Date().toString()
// "Sat Mar 01 2026 10:00:00 GMT-0300" — atrelado ao fuso do servidor
```

**After (com esta skill aplicada):**
```typescript
// Salva timestamp absoluto — consistente globalmente
const createdAt = Date.now() // 1772485200000
// Exibe no fuso do usuário apenas na camada de apresentação
const display = new Date(createdAt).toLocaleString('pt-BR')
```

## Heuristics

| Situação | Faça |
|----------|------|
| Armazenar data no banco/API | Use timestamp (number) ou ISO string UTC |
| Exibir data para o usuário | Use `toLocaleString()` com locale explícito |
| Comparar duas datas | Compare timestamps numéricos, nunca strings |
| Depurar valor de Date | Use `toISOString()` para ver o valor absoluto UTC |
| `new Date(0)` mostra 1969 | Normal — seu fuso local é negativo (ex: UTC-3) |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `date.toString()` para persistir | `date.toISOString()` ou `Date.now()` |
| `getHours()` para lógica de negócio cross-timezone | `getUTCHours()` |
| `new Date("2026-03-01")` sem timezone | `new Date("2026-03-01T00:00:00Z")` com Z explícito |
| Comparar `date1.toString() === date2.toString()` | `date1.getTime() === date2.getTime()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre epoch, UTC e deslocamento local
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-aprendendo-sobre-fuso-horario/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-aprendendo-sobre-fuso-horario/references/code-examples.md)
