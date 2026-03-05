---
name: rs-full-stack-conversao-coercao-tipos
description: "Enforces correct type conversion and coercion patterns when writing JavaScript code. Use when user asks to 'convert types', 'cast values', 'compare types', 'fix type errors', or any JS code involving mixed types. Applies rules: explicit conversion with Number/String/Boolean, understanding coercion with + operator, typeof checks, truthy/falsy awareness. Make sure to use this skill whenever generating JavaScript that mixes types or converts values. Not for TypeScript type system, generics, or type declarations."
---

# Conversão e Coerção de Tipos em JavaScript

> Sempre converta tipos de forma explícita (type conversion) em vez de depender da coerção automática do JavaScript, porque coerção implícita gera bugs silenciosos.

## Rules

1. **Use conversão explícita sempre que possível** — `Number("9")` não `"9" * 1`, porque deixa a intenção clara para quem lê o código
2. **Use `typeof` para verificar tipos antes de operar** — `typeof value` retorna `"string"`, `"number"`, `"boolean"`, porque evita surpresas em operações mistas
3. **Conheça os 3 conversores nativos** — `Number()`, `String()` e `Boolean()` são as formas canônicas de conversão explícita, porque são legíveis e previsíveis
4. **Use `.toString()` como alternativa para converter para string** — `age.toString()` ou `String(age)`, ambas formas são válidas
5. **Entenda que `+` com string sempre concatena** — `"10" + 5` resulta em `"105"` (coerção converte o número para string), porque o operador `+` prioriza strings
6. **Lembre que `Boolean(0)` é `false`, qualquer outro número é `true`** — incluindo negativos como `-25`, porque só o zero é falsy entre números

## How to write

### Conversão explícita de tipos

```javascript
// String para Number
const quantity = Number("9")  // 9 (number)

// Number para String
const age = 18
const ageText = age.toString()  // "18" (string)
// ou
const ageText2 = String(age)   // "18" (string)

// Number para Boolean
const isActive = Boolean(1)    // true
const isEmpty = Boolean(0)     // false
```

### Verificação de tipo com typeof

```javascript
const value = "9"
console.log(typeof value)          // "string"
console.log(typeof Number(value))  // "number"
```

## Example

**Before (coerção implícita — bug silencioso):**
```javascript
const price = "10"
const discount = 5
const total = price + discount  // "105" (string concatenada!)
```

**After (conversão explícita — comportamento previsível):**
```javascript
const price = "10"
const discount = 5
const total = Number(price) + discount  // 15 (soma numérica)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Recebeu input de formulário (sempre string) | `Number(input)` antes de calcular |
| Precisa montar mensagem com número | `String(value)` ou template literal |
| Flag on/off vindo como 0/1 | `Boolean(value)` para converter |
| Não tem certeza do tipo | `typeof value` antes de operar |
| Operação com `+` e tipos mistos | Converta explicitamente antes |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"10" + 5` esperando 15 | `Number("10") + 5` |
| `value * 1` para converter | `Number(value)` |
| `value + ""` para converter para string | `String(value)` |
| `!!value` para converter para boolean | `Boolean(value)` |
| Operar sem saber o tipo | `typeof value` antes de operar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre coerção vs conversão, regras de truthy/falsy e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações