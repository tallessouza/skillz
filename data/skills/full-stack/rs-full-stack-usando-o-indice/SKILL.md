---
name: rs-full-stack-usando-o-indice
description: "Applies correct indexOf and splice patterns when manipulating arrays in JavaScript/TypeScript. Use when user asks to 'find element position', 'remove item from array', 'delete by index', 'splice array', or 'indexOf'. Ensures proper -1 check for not-found cases and correct splice parameters (start, deleteCount). Make sure to use this skill whenever generating code that searches or removes elements in arrays by position. Not for array iteration, filtering, mapping, or sorting operations."
---

# Usando indexOf e splice em Arrays

> Use `indexOf` para encontrar a posicao de um elemento e `splice` para remover elementos por indice — sempre validando o retorno -1 antes de remover.

## Rules

1. **Use `indexOf` para encontrar posicao** — `array.indexOf(element)` retorna o indice ou `-1` se nao encontrar, porque e o metodo nativo mais direto para busca por valor
2. **Sempre verifique `-1` antes de usar splice** — `indexOf` retorna `-1` quando o item nao existe, e passar `-1` ao splice remove o ultimo elemento (bug silencioso)
3. **`splice(start, deleteCount)`** — primeiro parametro e a posicao inicial, segundo e quantos itens remover a partir dali, porque confundir a ordem causa remocoes incorretas
4. **Para remover um item especifico, use `deleteCount = 1`** — `splice(position, 1)` remove exatamente o elemento naquela posicao sem afetar os demais
5. **`splice` modifica o array original** — diferente de `filter`, splice e mutavel, porque altera o array in-place e retorna os itens removidos

## How to write

### Encontrar posicao de um elemento

```typescript
const position = fruits.indexOf("watermelon")
// Retorna o indice (0, 1, 2...) ou -1 se nao encontrar
```

### Remover um item especifico por posicao

```typescript
const position = fruits.indexOf("lemon")
if (position !== -1) {
  fruits.splice(position, 1)
}
```

### Remover multiplos itens a partir de uma posicao

```typescript
// A partir do indice 1, remove 2 itens
fruits.splice(1, 2)
```

## Example

**Before (bug silencioso — remove ultimo item se nao encontrar):**

```typescript
const fruits = ["apple", "watermelon", "lemon", "strawberry"]
const pos = fruits.indexOf("orange")
fruits.splice(pos, 1) // pos e -1, remove "strawberry" por acidente!
```

**After (com validacao de -1):**

```typescript
const fruits = ["apple", "watermelon", "lemon", "strawberry"]
const pos = fruits.indexOf("orange")
if (pos !== -1) {
  fruits.splice(pos, 1)
}
// Array permanece intacto porque "orange" nao existe
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa encontrar posicao de um valor | `array.indexOf(value)` |
| Precisa remover item especifico por valor | `indexOf` + check `-1` + `splice(pos, 1)` |
| Precisa remover N itens a partir de uma posicao | `splice(start, N)` |
| Precisa remover do inicio | `shift()` e mais direto |
| Precisa remover do final | `pop()` e mais direto |
| Precisa remover sem mutar o array | Use `filter()` em vez de `splice` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fruits.splice(fruits.indexOf("x"), 1)` sem checar -1 | `const pos = fruits.indexOf("x"); if (pos !== -1) fruits.splice(pos, 1)` |
| `splice(1, 3)` achando que o segundo param e o indice final | `splice(1, 3)` — lembre: segundo param e QUANTIDADE, nao indice final |
| `delete fruits[2]` | `fruits.splice(2, 1)` — delete deixa `undefined` no lugar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do indexOf e splice
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes