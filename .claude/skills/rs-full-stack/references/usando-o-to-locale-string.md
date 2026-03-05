---
name: rs-full-stack-usando-o-to-locale-string
description: "Applies toLocaleString() formatting patterns when working with dates, times, and currency in JavaScript/TypeScript. Use when user asks to 'format a date', 'display currency', 'format money', 'show date in Portuguese', or 'localize numbers'. Covers dateStyle options (short/medium/long/full), granular day/month/hour/minute config, and currency formatting with style:'currency'. Make sure to use this skill whenever generating code that displays dates or monetary values to users. Not for date arithmetic, parsing, or timezone conversion logic."
---

# Formatacao com toLocaleString()

> Use `toLocaleString()` para formatar datas, horas e valores monetarios de acordo com a localidade, sem bibliotecas externas.

## Rules

1. **Use toLocaleString() em vez de formatacao manual** — `date.toLocaleString("pt-BR")` em vez de concatenar com padStart, porque o metodo ja lida com localidade, ordem dos campos e separadores
2. **Sempre passe o locale como primeiro argumento** — `"pt-BR"`, `"en-US"`, etc., porque sem ele o resultado depende do ambiente de execucao e quebra entre servidores
3. **Use dateStyle para formatacao rapida** — `short`, `medium`, `long`, `full` cobrem 90% dos casos sem configuracao granular
4. **Use o objeto de opcoes para controle granular** — `{ day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }` quando dateStyle nao atende
5. **Formate moeda com style + currency** — `{ style: "currency", currency: "BRL" }` em vez de concatenar "R$" manualmente, porque toLocaleString cuida de separadores decimais e simbolo
6. **Nao misture dateStyle com opcoes granulares** — sao mutuamente exclusivos; usar ambos lanca erro

## How to write

### Formatacao basica por locale

```typescript
const date = new Date("2024-07-02 09:30:00")

// Formato local padrao
date.toLocaleString("pt-BR")  // "02/07/2024, 09:30:00"
date.toLocaleString("en-US")  // "7/2/2024, 9:30:00 AM"
```

### dateStyle — niveis de detalhe

```typescript
const options = { dateStyle: "short" }   // "02/07/2024"
const options = { dateStyle: "medium" }  // "2 de jul. de 2024"
const options = { dateStyle: "long" }    // "2 de julho de 2024"
const options = { dateStyle: "full" }    // "terça-feira, 2 de julho de 2024"

date.toLocaleString("pt-BR", options)
```

### Configuracao granular (dia, mes, hora, minuto)

```typescript
date.toLocaleString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})
// "02/07, 09:30"
```

### Formatacao de moeda

```typescript
const amount = 12.5
amount.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
})
// "R$ 12,50"
```

## Example

**Before (formatacao manual fragil):**
```typescript
const day = String(date.getDate()).padStart(2, "0")
const month = String(date.getMonth() + 1).padStart(2, "0")
const year = date.getFullYear()
const formatted = `${day}/${month}/${year}`
const price = `R$ ${amount.toFixed(2).replace(".", ",")}`
```

**After (com toLocaleString):**
```typescript
const formatted = date.toLocaleString("pt-BR", { dateStyle: "short" })
const price = amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Exibir data para usuario final | `toLocaleString()` com locale explicito |
| Precisa apenas da data, sem hora | `toLocaleDateString()` |
| Precisa apenas da hora, sem data | `toLocaleTimeString()` |
| Data completa com dia da semana | `{ dateStyle: "full" }` |
| Data abreviada tipo "2 de jul." | `{ dateStyle: "medium" }` |
| Exibir preco/valor monetario | `{ style: "currency", currency: "BRL" }` |
| Controle fino de campos | Opcoes granulares: `day`, `month`, `hour`, `minute` |
| Enviar data para API/banco | Nao use toLocaleString — use ISO 8601 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"R$ " + amount.toFixed(2)` | `amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })` |
| `padStart(2, "0")` para formatar data | `toLocaleString("pt-BR", { day: "2-digit" })` |
| `date.toLocaleString()` sem locale | `date.toLocaleString("pt-BR")` |
| `{ dateStyle: "short", day: "2-digit" }` | Use dateStyle OU opcoes granulares, nunca ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-usando-o-to-locale-string/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-usando-o-to-locale-string/references/code-examples.md)
