---
name: rs-full-stack-completando-uma-string
description: "Applies padStart and padEnd string methods when formatting or masking strings in JavaScript/TypeScript. Use when user asks to 'mask a credit card', 'pad a string', 'hide digits', 'format card number', 'complete a string', or any string padding task. Ensures correct usage of padStart/padEnd with dynamic length and fill characters. Make sure to use this skill whenever generating code that masks, pads, or formats fixed-length strings. Not for general string manipulation like split, replace, or regex operations."
---

# Completando Strings com padStart e padEnd

> Use padStart e padEnd para preencher strings ate um tamanho alvo com caracteres especificos, do inicio ou do final.

## Rules

1. **Use padStart para mascarar do inicio** — `lastDigits.padStart(totalLength, 'x')` nao loops manuais, porque padStart e declarativo e handles edge cases automaticamente
2. **Use padEnd para completar no final** — `value.padEnd(targetLength, '#')` nao concatenacao manual, porque padEnd respeita o limite sem ultrapassar
3. **Tamanho dinamico sempre** — use `originalString.length` nao numeros hardcoded como `16`, porque o tamanho pode mudar e o codigo quebra silenciosamente
4. **Extraia a parte visivel com slice negativo** — `str.slice(-4)` para pegar os ultimos N caracteres, porque slice negativo conta de tras pra frente
5. **padStart e padEnd nunca ultrapassam o tamanho alvo** — se o fillString for maior que o espaco restante, ele trunca automaticamente

## How to write

### Mascara de cartao de credito

```typescript
const creditCard = "1234567812344928"
const lastDigits = creditCard.slice(-4)
const maskedNumber = lastDigits.padStart(creditCard.length, "x")
// "xxxxxxxxxxxx4928"
```

### Padding no final

```typescript
const number = "123"
const padded = number.padEnd(10, "#")
// "123#######"
```

### Fill string maior que 1 caractere

```typescript
const value = "123"
const padded = value.padEnd(10, "oculto")
// "123ocultooc" — NAO, padEnd trunca no limite
// resultado real: "123ocultoo" (10 chars exatos)
```

## Example

**Before (manual, fragil):**
```typescript
const card = "1234567812344928"
const masked = "xxxxxxxxxxxx" + card.substring(12, 16)
```

**After (com padStart):**
```typescript
const card = "1234567812344928"
const lastDigits = card.slice(-4)
const masked = lastDigits.padStart(card.length, "x")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ocultar digitos iniciais (cartao, CPF, telefone) | `slice(-N)` + `padStart(original.length, char)` |
| Preencher codigo com zeros a esquerda | `id.padStart(6, "0")` → "000042" |
| Alinhar texto em colunas | `text.padEnd(columnWidth, " ")` |
| Fill string multi-caractere | Pode usar, padStart/padEnd trunca automaticamente no limite |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `"x".repeat(12) + card.slice(-4)` | `card.slice(-4).padStart(card.length, "x")` |
| `lastDigits.padStart(16, "x")` | `lastDigits.padStart(card.length, "x")` |
| `while (str.length < 10) str += "#"` | `str.padEnd(10, "#")` |
| `card.substring(12, 16)` para ultimos 4 | `card.slice(-4)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre padStart/padEnd, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes