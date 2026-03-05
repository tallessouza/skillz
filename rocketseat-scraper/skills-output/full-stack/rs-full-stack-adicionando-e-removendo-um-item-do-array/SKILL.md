---
name: rs-full-stack-add-remove-array
description: "Applies correct array mutation methods (push, unshift, shift, pop) when manipulating arrays in JavaScript/TypeScript. Use when user asks to 'add item to array', 'remove from array', 'append to list', 'prepend element', or any array manipulation task. Ensures positional correctness: push/pop for end, unshift/shift for beginning. Make sure to use this skill whenever generating code that adds or removes elements from arrays. Not for array searching, filtering, sorting, or transformation methods like map/filter/reduce."
---

# Adicionando e Removendo Itens do Array

> Use o metodo correto para a posicao correta: push/pop para o final, unshift/shift para o inicio.

## Rules

1. **Use `push` para adicionar no final** — `users.push("Ana")`, porque e o metodo padrao e mais performatico para append
2. **Use `unshift` para adicionar no inicio** — `users.unshift("Ana")`, porque reposiciona todos os indices automaticamente
3. **Use `pop` para remover do final** — `users.pop()`, porque remove e retorna o ultimo elemento
4. **Use `shift` para remover do inicio** — `users.shift()`, porque remove e retorna o primeiro elemento
5. **Nunca use splice para operacoes simples de inicio/fim** — os quatro metodos dedicados sao mais claros e comunicam a intencao

## How to write

### Adicionar elementos

```javascript
const users = []

// Adicionar no final
users.push("Rodrigo")
users.push("João")
users.push("Marcos")
// users → ["Rodrigo", "João", "Marcos"]

// Adicionar no início
users.unshift("Ana")
// users → ["Ana", "Rodrigo", "João", "Marcos"]
```

### Remover elementos

```javascript
// Remover do início (retorna o elemento removido)
const first = users.shift()
// first → "Ana", users → ["Rodrigo", "João", "Marcos"]

// Remover do final (retorna o elemento removido)
const last = users.pop()
// last → "Marcos", users → ["Rodrigo", "João"]
```

## Example

**Before (metodo errado para a posicao):**
```javascript
// Quer adicionar no início mas usa push
items.push(newItem) // vai para o final, não o início

// Quer remover do final mas usa shift
items.shift() // remove do início, não do final
```

**After (metodo correto):**
```javascript
// Adicionar no início
items.unshift(newItem)

// Remover do final
items.pop()
```

## Heuristics

| Situacao | Metodo |
|----------|--------|
| Adicionar no final (append) | `push()` |
| Adicionar no inicio (prepend) | `unshift()` |
| Remover do final | `pop()` |
| Remover do inicio | `shift()` |
| Capturar o elemento removido | Usar retorno de `pop()` ou `shift()` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `arr.splice(0, 0, item)` para prepend | `arr.unshift(item)` |
| `arr.splice(arr.length, 0, item)` para append | `arr.push(item)` |
| `arr.splice(0, 1)` para remover primeiro | `arr.shift()` |
| `arr.splice(arr.length - 1, 1)` para remover ultimo | `arr.pop()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes