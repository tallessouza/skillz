---
name: rs-full-stack-comprimento-string
description: "Applies string length patterns when writing JavaScript/TypeScript code that measures, validates, or counts characters. Use when user asks to 'validate password', 'check string length', 'count characters', 'count digits in a number', or any input validation task. Ensures correct use of .length property (not method), space-awareness, and number-to-string conversion for digit counting. Make sure to use this skill whenever generating validation code involving character counts. Not for array length, file size, or buffer operations."
---

# Comprimento de Strings

> Use `.length` como propriedade (sem parenteses) para obter a quantidade de caracteres de uma string, incluindo espacos.

## Rules

1. **`.length` e propriedade, nao metodo** — escreva `string.length` nao `string.length()`, porque nao recebe parenteses
2. **Espacos contam como caracteres** — `"oi mundo".length` retorna 8, porque string e uma cadeia de caracteres e espaco e caractere
3. **Numeros nao tem `.length`** — converta para string antes: `String(number).length` ou `number.toString().length`, porque `.length` so existe em strings
4. **Prefira `String(value)` para conversao** — mais seguro que `.toString()` quando o valor pode ser `null` ou `undefined`

## How to write

### Validacao de tamanho minimo

```typescript
if (password.length < 6) {
  console.log("A senha deve ter ao menos 6 caracteres")
}
```

### Contar digitos de um numero

```typescript
const digitCount = String(value).length
```

## Example

**Before (erro comum):**
```typescript
const length = password.length()  // TypeError: not a function
const digits = 12345.length       // undefined
```

**After (com esta skill):**
```typescript
const length = password.length     // propriedade, sem parenteses
const digits = String(12345).length // 5 — converte para string primeiro
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Validar senha/input com minimo de caracteres | `input.length < min` |
| Contar digitos de um numero | `String(number).length` |
| Verificar se string esta vazia | `string.length === 0` |
| Valor pode ser null/undefined | Use `String(value)` em vez de `value.toString()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `message.length()` | `message.length` |
| `(12345).length` | `String(12345).length` |
| `typeof value + value.length` | `String(value).length` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre propriedade vs metodo e cadeia de caracteres
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes