---
name: rs-full-stack-metodo-find-index
description: "Applies correct Array.findIndex() usage patterns when writing JavaScript/TypeScript array search code. Use when user asks to 'find index', 'find position', 'locate element in array', 'search array position', or uses findIndex in code. Enforces index-based search over value-based, proper -1 handling, and callback patterns. Make sure to use this skill whenever generating code that searches for element positions in arrays. Not for finding element values (use find), filtering arrays (use filter), or transforming arrays (use map)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-array-methods
  tags: [javascript, array, findIndex, search, iteration]
---

# Método findIndex()

> Use findIndex() para obter a POSIÇÃO (índice) do primeiro elemento que satisfaz uma condição — nunca o valor em si.

## Rules

1. **findIndex retorna índice, não valor** — use `find()` para obter o elemento, `findIndex()` para obter a posição, porque confundir os dois causa bugs silenciosos
2. **Índice começa em 0** — o primeiro elemento é posição 0, porque JavaScript usa zero-based indexing
3. **Retorna -1 quando não encontra** — sempre trate o caso de retorno -1 antes de usar o índice, porque acessar `array[-1]` retorna `undefined` silenciosamente
4. **Retorna o PRIMEIRO match** — findIndex para no primeiro elemento que satisfaz a condição, porque o callback não percorre o array inteiro
5. **Use callback descritivo** — nomeie o parâmetro pelo conteúdo (`user`, `value`, `product`), não por `item` ou `el`, porque clareza importa

## How to write

### Busca básica por índice

```typescript
const values = [4, 6, 8, 12]
const index = values.findIndex(value => value > 4)
// index = 1 (o 6 é o primeiro maior que 4)
```

### Acessar o elemento pelo índice encontrado

```typescript
const values = [4, 6, 8, 12]
const index = values.findIndex(value => value > 4)
const element = values[index] // 6
```

### Tratar caso não encontrado

```typescript
const values = [4, 6, 8, 12]
const index = values.findIndex(value => value > 12)
// index = -1 (nenhum elemento satisfaz)

if (index === -1) {
  console.log('Elemento não encontrado')
}
```

## Example

**Before (erro comum — usar findIndex quando quer o valor):**
```typescript
const users = [{ name: 'Ana', age: 25 }, { name: 'Bob', age: 30 }]
const result = users.findIndex(user => user.age > 25)
console.log(result.name) // TypeError! result é 1, não o objeto
```

**After (com este skill aplicado):**
```typescript
const users = [{ name: 'Ana', age: 25 }, { name: 'Bob', age: 30 }]
const adultIndex = users.findIndex(user => user.age > 25)

if (adultIndex !== -1) {
  const adult = users[adultIndex]
  console.log(adult.name) // 'Bob'
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa da posição para splice/remover | `findIndex()` → depois `array.splice(index, 1)` |
| Precisa do valor em si | Use `find()`, não `findIndex()` |
| Precisa de todos que satisfazem | Use `filter()`, não `findIndex()` |
| Precisa saber se existe (boolean) | Use `some()`, não `findIndex() !== -1` |
| Precisa do índice para atualizar in-place | `findIndex()` → depois `array[index] = newValue` |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `findIndex(x => x > 4)` (parâmetro genérico) | `findIndex(value => value > 4)` |
| `if (index)` (0 é falsy!) | `if (index !== -1)` |
| `array[array.findIndex(...)]` sem checar -1 | Cheque `-1` antes de acessar |
| `findIndex()` quando quer o valor | `find()` para obter o elemento |
| `findIndex() !== -1` para checar existência | `some()` para boolean |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `findIndex` retorna sempre -1 | Condicao do callback nunca e satisfeita | Verifique os valores do array e a logica da comparacao |
| `TypeError: Cannot read property` ao usar resultado | Usou o indice como se fosse o elemento | Use `array[index]` para acessar o elemento, ou use `find()` |
| `findIndex` retorna 0 mas `if (index)` nao entra | 0 e falsy em JavaScript | Use `if (index !== -1)` em vez de `if (index)` |
| Encontra o elemento errado | `findIndex` retorna o PRIMEIRO match | Revise a condicao ou use `filter()` para todos os matches |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações