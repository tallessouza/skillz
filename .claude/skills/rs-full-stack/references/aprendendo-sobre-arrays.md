---
name: rs-full-stack-aprendendo-sobre-arrays
description: "Applies correct array indexing and access patterns when writing JavaScript/TypeScript code. Use when user asks to 'create an array', 'access array element', 'loop through list', 'get item by index', or any array manipulation task. Enforces zero-based indexing awareness, bracket notation access, and proper mental model of arrays as ordered collections. Make sure to use this skill whenever generating code that creates or accesses arrays. Not for array methods like map/filter/reduce, sorting algorithms, or data structure theory."
---

# Arrays — Coleções Ordenadas com Índices

> Ao trabalhar com arrays, trate-os como listas ordenadas onde cada item ocupa uma posição específica (índice) que sempre começa do zero.

## Rules

1. **Índices começam do zero** — o primeiro elemento é `[0]`, não `[1]`, porque arrays são zero-indexed em JavaScript
2. **Último índice = length - 1** — um array com 100 elementos vai do índice `0` ao `99`, porque o total de posições é `length`, mas o índice máximo é `length - 1`
3. **Acesse com colchetes** — `array[indice]` é a forma de acessar um valor pela posição, porque bracket notation é o padrão em JavaScript
4. **Nomeie arrays no plural** — `fruits` não `fruit`, `users` não `user`, porque o nome comunica que é uma coleção

## How to write

### Criando e acessando arrays

```typescript
// Array é uma lista ordenada — cada item tem um índice
const fruits = ["maçã", "abacaxi", "melancia", "banana", "uva"]
//               [0]       [1]        [2]        [3]      [4]

// Acessar pelo índice usando colchetes
console.log(fruits[0]) // "maçã" — primeiro item
console.log(fruits[2]) // "melancia" — terceiro item
console.log(fruits[4]) // "uva" — último item (length - 1)
```

### Último elemento

```typescript
// 5 frutas = índices 0 a 4
const lastIndex = fruits.length - 1 // 4
console.log(fruits[lastIndex]) // "uva"
```

## Example

**Before (erro comum de iniciante):**
```typescript
const colors = ["red", "green", "blue"]
console.log(colors[1]) // Esperava "red", mas obteve "green"
console.log(colors[3]) // undefined — índice não existe
```

**After (com entendimento correto):**
```typescript
const colors = ["red", "green", "blue"]
//               [0]     [1]      [2]
console.log(colors[0]) // "red" — primeiro item é índice 0
console.log(colors[2]) // "blue" — último item é length - 1
```

## Heuristics

| Situação | Faça |
|----------|------|
| Acessar primeiro item | `array[0]` |
| Acessar último item | `array[array.length - 1]` |
| Saber quantos itens existem | `array.length` |
| Índice retorna `undefined` | O índice está fora do range `0` a `length - 1` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `array[1]` para pegar o primeiro | `array[0]` |
| `array[array.length]` para o último | `array[array.length - 1]` |
| `const fruit = ["a", "b"]` (singular) | `const fruits = ["a", "b"]` (plural) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-aprendendo-sobre-arrays/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-aprendendo-sobre-arrays/references/code-examples.md)
