---
name: rs-full-stack-boas-vindas-metodos-array
description: "Introduces JavaScript array methods as a mental model for data transformation. Use when user asks to 'iterate an array', 'transform a list', 'filter items', 'map values', or 'reduce data' in JavaScript. Provides decision framework for choosing the right array method. Make sure to use this skill whenever the user works with arrays in JS/TS and needs guidance on which method to pick. Not for specific method implementation details — see dedicated method skills for forEach, map, filter, reduce, etc."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, arrays, map, filter, reduce, foreach, methods]
---

# Métodos de Array — Visão Geral

> Métodos de array são ferramentas para percorrer, manipular e transformar dados — escolha o método pela intenção, não pelo hábito.

## Key concepts

Arrays em JavaScript possuem métodos nativos que substituem loops manuais com operações declarativas. Cada método expressa uma intenção diferente: percorrer, transformar, filtrar, acumular ou buscar.

## Framework de decisão

| Intenção | Método | Retorna |
|----------|--------|---------|
| Percorrer sem retorno | `forEach` | `undefined` |
| Transformar cada item | `map` | Novo array (mesmo tamanho) |
| Filtrar por condição | `filter` | Novo array (mesmo ou menor) |
| Acumular em um valor | `reduce` | Qualquer tipo |
| Buscar um item | `find` | Item ou `undefined` |
| Verificar condição | `some` / `every` | `boolean` |
| Achatar arrays aninhados | `flat` / `flatMap` | Novo array |

## Quando aplicar

- Sempre que um `for` loop manipula arrays — substitua pelo método declarativo correto
- Ao encadear operações: `filter` → `map` é mais legível que um `for` com `if` e `push`
- Ao receber dados de APIs e precisar transformar antes de renderizar

## Code example

```javascript
// Escolha o metodo pela intencao
const numbers = [1, 2, 3, 4, 5]

// Transformar: map
const doubled = numbers.map(n => n * 2) // [2, 4, 6, 8, 10]

// Filtrar: filter
const evens = numbers.filter(n => n % 2 === 0) // [2, 4]

// Acumular: reduce
const sum = numbers.reduce((acc, n) => acc + n, 0) // 15

// Encadear: filter + map
const doubledEvens = numbers.filter(n => n % 2 === 0).map(n => n * 2) // [4, 8]
```

## Limitações

- Esta skill é uma visão geral — cada método tem nuances próprias cobertas em skills dedicadas
- `forEach` não suporta `break`/`continue` — use `for...of` quando precisar interromper
- Encadear muitos métodos em arrays grandes pode impactar performance — considere `reduce` único


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Using forEach when map is needed** | If you need a new array from the transformation, use `map` — `forEach` returns `undefined` and is for side effects only. |
| **Filter not removing items** | Verify the callback returns a boolean — falsy values like `0` or `''` are filtered out, which may not be intended. |
| **Reduce result is NaN** | Ensure the initial value (second argument) is provided and matches the expected type — missing it uses the first element as accumulator. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada método
- [code-examples.md](references/code-examples.md) — Exemplos comparativos: loop imperativo vs método declarativo