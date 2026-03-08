---
name: rs-full-stack-for-of-1
description: "Applies correct for...of loop usage when iterating over values in JavaScript/TypeScript. Use when user asks to 'loop through array', 'iterate values', 'use for of', 'traverse a list', or writes iteration code. Enforces for...of for values vs for...in for properties, singular/plural naming convention, and iterable-only constraint. Make sure to use this skill whenever generating loops over array values. Not for object property enumeration (use for...in), nor for index-based loops (use traditional for)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-loops
  tags: [javascript, for-of, loops, iteration, arrays]
---

# For...of — Iteracao sobre Valores

> Use `for...of` para iterar sobre **valores** de objetos iteraveis; use `for...in` para iterar sobre **propriedades/indices**.

## Rules

1. **Use `for...of` para valores, `for...in` para propriedades** — `for...of` retorna o conteudo de cada posicao, `for...in` retorna o indice/chave, porque sao mecanismos complementares com propositos distintos
2. **Nomeie a variavel auxiliar no singular da colecao** — `for (const student of students)`, porque facilita a leitura: "um student dessa lista de students"
3. **So use `for...of` em objetos iteraveis** — arrays, strings, Maps, Sets sao iteraveis; objetos literais `{}` NAO sao, porque `for...of` chama `Symbol.iterator` que objetos nao possuem
4. **Prefira `const` na variavel auxiliar** — `for (const item of items)`, porque o valor nao deve ser reatribuido dentro do bloco

## How to write

### Iteracao basica sobre array

```javascript
const students = ["Rodrigo", "Amanda", "John"]

for (const student of students) {
  console.log(student) // "Rodrigo", "Amanda", "John"
}
```

### Iteracao sobre array de objetos

```javascript
const users = [
  { name: "Rodrigo", email: "rodrigo@email.com" },
  { name: "Amanda", email: "amanda@email.com" }
]

for (const user of users) {
  console.log(user.name)
  console.log(user.email)
}
```

## Example

**Before (confusao for...in vs for...of):**
```javascript
const fruits = ["banana", "maca", "uva"]

for (const fruit in fruits) {
  console.log(fruit) // "0", "1", "2" — indices, nao valores!
}
```

**After (com esta skill aplicada):**
```javascript
const fruits = ["banana", "maca", "uva"]

for (const fruit of fruits) {
  console.log(fruit) // "banana", "maca", "uva" — valores corretos
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa dos valores de um array | `for...of` |
| Precisa dos indices/chaves de um objeto | `for...in` |
| Precisa de indice E valor | `for...of` com `entries()`: `for (const [i, val] of arr.entries())` |
| Objeto literal precisa ser iterado | Converta primeiro: `Object.values(obj)` ou `Object.entries(obj)` |
| Nomear variavel auxiliar | Singular da colecao: `students` → `student` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `for (const val in array)` quando quer valores | `for (const val of array)` |
| `for (const x of plainObject)` | `for (const x of Object.values(plainObject))` |
| `for (let item of items) { item = ... }` | `for (const item of items)` — nao reatribua |
| `for (const s of students)` com nome generico | `for (const student of students)` — singular descritivo |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `for...of` retorna indices em vez de valores | Usando `for...in` por engano | Troque `in` por `of`: `for (const item of array)` |
| `TypeError: obj is not iterable` | Tentando iterar sobre objeto literal com `for...of` | Converta primeiro: `Object.values(obj)` ou `Object.entries(obj)` |
| Variavel do loop e reatribuida acidentalmente | Declarou com `let` em vez de `const` | Use `const` na declaracao: `for (const item of items)` |
| Loop nao itera sobre Map ou Set | Sintaxe incorreta para destructuring | Para Map use `for (const [key, value] of map)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes