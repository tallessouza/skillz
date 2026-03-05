---
name: rs-full-stack-metodo-find
description: "Applies Array.find() patterns when searching for elements in arrays. Use when user asks to 'find an item', 'search in array', 'get first match', 'lookup by property', or 'find element by condition'. Enforces find() for first-match retrieval, findIndex() for position retrieval, and proper undefined handling. Make sure to use this skill whenever user needs to locate a single element in an array or collection. Not for filtering multiple elements (use filter), transforming arrays (use map), or aggregating values (use reduce)."
---

# Método find()

> Use `find()` para retornar o primeiro elemento de um array que satisfaz uma condição — retorna `undefined` se nenhum atende.

## Rules

1. **Use `find()` para buscar UM elemento** — retorna o primeiro match, não todos, porque a intenção é localizar, não filtrar
2. **Trate o retorno `undefined`** — quando nenhum elemento atende a condição, `find()` retorna `undefined`, porque ignorar isso causa TypeError em acessos encadeados
3. **Nomeie o callback pelo conteúdo do array** — `fruits.find(fruit => ...)` não `fruits.find(x => ...)`, porque legibilidade importa
4. **Use `find()` para valor, `findIndex()` para posição** — são complementares, cada um retorna o que o nome diz
5. **Compare strings com cuidado** — `fruit.name === "banana"` exige match exato (case-sensitive), porque `"Banana" !== "banana"`

## How to write

### Busca simples em array de primitivos

```typescript
const values = [5, 12, 8, 130, 44]
const firstAboveTen = values.find(value => value > 10)
// 12 (primeiro que atende, não 130 ou 44)
```

### Busca em array de objetos por propriedade

```typescript
const fruits = [
  { name: "apple", quantity: 23 },
  { name: "banana", quantity: 25 },
  { name: "orange", quantity: 52 },
]

const result = fruits.find(fruit => fruit.name === "banana")
// { name: "banana", quantity: 25 }
```

### Tratamento de undefined

```typescript
const notFound = fruits.find(fruit => fruit.name === "watermelon")
// undefined — fruta não existe no array
```

## Example

**Before (busca manual com loop):**
```typescript
let found = null
for (let i = 0; i < users.length; i++) {
  if (users[i].email === targetEmail) {
    found = users[i]
    break
  }
}
```

**After (com find):**
```typescript
const found = users.find(user => user.email === targetEmail)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa do primeiro elemento que atende condição | `find()` |
| Precisa da posição (índice) do elemento | `findIndex()` |
| Precisa de todos os elementos que atendem | `filter()` |
| Precisa saber apenas se existe | `some()` |
| Array de objetos, busca por propriedade | `find(item => item.prop === value)` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `filter(x => x.id === id)[0]` | `find(x => x.id === id)` |
| `for + break` para buscar um item | `find()` com condição |
| `find()` sem tratar `undefined` em acesso encadeado | `find()` + optional chaining ou verificação |
| `arr.find(x => x)` para pegar primeiro truthy | `arr.find(Boolean)` ou reavalie a lógica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações