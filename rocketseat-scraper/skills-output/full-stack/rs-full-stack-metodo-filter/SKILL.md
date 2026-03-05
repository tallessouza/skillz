---
name: rs-full-stack-metodo-filter
description: "Applies Array.filter() patterns when writing JavaScript/TypeScript code that filters arrays. Use when user asks to 'filter an array', 'select items from a list', 'get only matching elements', 'remove items that dont match', or any array filtering task. Enforces: always return condition from callback, use singular naming for callback parameter, prefer explicit comparisons. Make sure to use this skill whenever filtering arrays of primitives or objects. Not for array transformation (use map), aggregation (use reduce), or searching single items (use find)."
---

# Método filter()

> filter() cria um novo array contendo apenas os elementos que satisfazem uma condição — nunca modifica o array original.

## Rules

1. **filter() sempre retorna um novo array** — nunca modifica o original, porque imutabilidade previne bugs em cascata
2. **Nomeie o callback no singular do array** — `words.filter(word => ...)`, `products.filter(product => ...)`, porque cria leitura natural como frase em português/inglês
3. **Retorne uma expressão booleana explícita** — `product.promotion === true` não apenas `product.promotion`, porque deixa clara a intenção da condição
4. **Nomeie o resultado pelo que foi filtrado** — `activeProducts` não `filtered` ou `result`, porque descreve o conteúdo
5. **Uma condição por filter** — se precisa de lógica complexa, extraia para função nomeada, porque mantém legibilidade

## How to write

### Filtrando primitivos
```typescript
const words = ["JavaScript", "HTML", "CSS", "web"]
const longWords = words.filter(word => word.length > 3)
// ["JavaScript", "HTML"]
```

### Filtrando objetos por propriedade booleana
```typescript
const products = [
  { description: "teclado", price: 150, promotion: true },
  { description: "mouse", price: 70, promotion: false },
  { description: "monitor", price: 900, promotion: true },
]

const productsOnPromotion = products.filter(product => product.promotion === true)
// [{ description: "teclado", ... }, { description: "monitor", ... }]
```

### Filtrando objetos por valor numérico
```typescript
const affordableProducts = products.filter(product => product.price < 100)
// [{ description: "mouse", price: 70, ... }]
```

## Example

**Before (nomes genéricos, condição implícita):**
```typescript
const data = items.filter(x => x.active)
const res = list.filter(i => i.price > 50)
```

**After (com esta skill aplicada):**
```typescript
const activeItems = items.filter(item => item.active === true)
const expensiveProducts = products.filter(product => product.price > 50)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Filtrar por propriedade booleana | `array.filter(item => item.prop === true)` — explícito |
| Filtrar por comparação numérica | `array.filter(item => item.value > threshold)` |
| Filtrar por string/length | `array.filter(item => item.length > n)` |
| Condição complexa (2+ checks) | Extraia para função: `array.filter(isEligibleProduct)` |
| Precisa do primeiro match apenas | Use `find()`, não `filter()[0]` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `arr.filter(x => ...)` | `users.filter(user => ...)` — singular do array |
| `const filtered = arr.filter(...)` | `const activeUsers = users.filter(...)` — nome descritivo |
| `arr.filter(i => i.flag)` | `arr.filter(item => item.flag === true)` — comparação explícita |
| `arr.filter(...)[0]` | `arr.find(...)` — método correto para busca única |
| Mutar array original com splice | `filter()` para criar novo array filtrado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações