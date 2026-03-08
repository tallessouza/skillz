---
name: rs-full-stack-metodo-reduce
description: "Applies correct reduce() patterns when transforming arrays into single values in JavaScript/TypeScript. Use when user asks to 'sum array values', 'aggregate a list', 'calculate total', 'reduce array', or 'accumulate values'. Enforces proper accumulator naming, initial value usage, and return statement. Make sure to use this skill whenever code involves Array.reduce() or aggregation of array elements. Not for map/filter/forEach operations or array transformations that return arrays."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-array-methods
  tags: [javascript, array, reduce, aggregation, accumulator]
---

# Método reduce()

> Usar reduce() para transformar um array em um unico valor, sempre com acumulador nomeado, valor inicial explicito e retorno obrigatorio.

## Rules

1. **Sempre defina o valor inicial** — `reduce((acc, item) => ..., 0)` nunca omita o segundo argumento, porque sem valor inicial o reduce usa o primeiro elemento e pula a primeira iteracao, causando bugs sutis com arrays vazios
2. **Sempre retorne o acumulador** — o return dentro do callback e o que alimenta o acumulador na proxima iteracao, esquecer o return resulta em `undefined` acumulado
3. **Nomeie o acumulador pelo que ele acumula** — `totalPrice` nao `acc`, `userMap` nao `accumulator`, porque o nome comunica a intencao
4. **Use reduce apenas para reduzir a um valor** — se o resultado e um array transformado, use map/filter; reduce e para quando N itens viram 1 valor (soma, contagem, objeto agrupado)
5. **Valor inicial deve ter o mesmo tipo do resultado** — se o resultado e numero use `0`, se e objeto use `{}`, se e array use `[]`, porque evita erros de tipo

## How to write

### Soma de valores

```typescript
const totalPrice = products.reduce((total, product) => {
  return total + product.price
}, 0)
```

### Agrupamento em objeto

```typescript
const productsByCategory = products.reduce((grouped, product) => {
  const category = product.category
  grouped[category] = grouped[category] || []
  grouped[category].push(product)
  return grouped
}, {})
```

### Contagem de ocorrencias

```typescript
const wordCount = words.reduce((count, word) => {
  count[word] = (count[word] || 0) + 1
  return count
}, {})
```

## Example

**Before (problemas comuns):**
```typescript
// Sem valor inicial — quebra com array vazio
const sum = values.reduce((acc, val) => acc + val)

// Sem return — acumulador vira undefined
const total = prices.reduce((acc, price) => {
  acc + price
}, 0)

// Nome generico — nao comunica intencao
const result = items.reduce((a, b) => a + b.value, 0)
```

**After (com esta skill aplicada):**
```typescript
// Valor inicial explicito — seguro com array vazio
const sum = values.reduce((total, value) => total + value, 0)

// Return explicito — acumulador alimentado corretamente
const totalPrice = prices.reduce((total, price) => {
  return total + price
}, 0)

// Nome descritivo — comunica o que esta sendo acumulado
const totalValue = items.reduce((total, item) => total + item.value, 0)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Somar valores de uma lista | `reduce` com valor inicial `0` |
| Agrupar itens por propriedade | `reduce` com valor inicial `{}` |
| Transformar array em outro array | Use `map` ou `filter`, nao `reduce` |
| Array pode estar vazio | Valor inicial e obrigatorio |
| Precisa do indice na iteracao | Use o terceiro parametro `(acc, item, index)` |
| Reduce ficou complexo (>5 linhas) | Extraia a logica para funcao nomeada |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `.reduce((acc, val) => acc + val)` (sem valor inicial) | `.reduce((total, val) => total + val, 0)` |
| `.reduce((a, b) => ...)` (nomes genericos) | `.reduce((total, item) => ...)` (nomes descritivos) |
| `acc + price` sem return | `return total + price` |
| `.reduce()` para filtrar/transformar array | `.filter()` ou `.map()` |
| Valor inicial `0` quando resultado e objeto | Valor inicial `{}` ou `[]` conforme tipo esperado |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `TypeError: Reduce of empty array with no initial value` | Array vazio sem valor inicial | Sempre passe o segundo argumento (valor inicial) |
| Resultado e `undefined` | Esqueceu o `return` no callback | Adicione `return` explicito do acumulador |
| Resultado e `NaN` | Valor inicial incompativel ou propriedade inexistente | Verifique se o valor inicial e do mesmo tipo do resultado esperado |
| Acumulador perde valores anteriores | Nao retornou o acumulador atualizado | Garanta que o `return` inclui o acumulador modificado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o fluxo do acumulador, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes