---
name: rs-full-stack-metodo-map
description: "Applies correct Array.map() patterns when transforming arrays in JavaScript/TypeScript. Use when user asks to 'transform an array', 'convert array items', 'format array elements', 'create new array from existing', or 'map over a list'. Enforces return-new-array semantics, singular/plural naming, concise arrow syntax, and object construction patterns. Make sure to use this skill whenever code involves .map() or array transformation. Not for filtering (use filter), aggregation (use reduce), or side-effects-only iteration (use forEach)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-array-methods
  tags: [javascript, array, map, transformation, iteration]
---

# Método map()

> Use map() exclusivamente para transformar arrays, retornando sempre um novo array — nunca para efeitos colaterais.

## Rules

1. **map() sempre retorna um novo array** — armazene o resultado em uma variável, porque ignorar o retorno significa que voce deveria usar forEach
2. **Nomeie plural/singular** — array em plural (`products`), item do callback em singular (`product`), porque comunica claramente "muitos vs um"
3. **Use arrow function** — `items.map(item => ...)` e nao `items.map(function(item) { ... })`, porque arrow functions sao mais concisas e mantém o contexto léxico
4. **Sintese reduzida para retorno direto** — `items.map(item => item.toUpperCase())` sem chaves quando o corpo é uma unica expressao, porque elimina boilerplate
5. **Chaves apenas quando ha logica** — use `{ }` e `return` explicito quando precisa de manipulacao, condicoes ou multiplas operacoes antes do retorno
6. **Nunca use map() para side-effects** — se nao precisa do array retornado, use `forEach`, porque map() semanticamente indica transformacao

## How to write

### Transformacao simples (sintese reduzida)

```typescript
const upperNames = names.map(name => name.toUpperCase())
```

### Transformacao com logica (chaves + return)

```typescript
const formatted = products.map(product => {
  const label = product.toUpperCase()
  return `Produto: ${label}`
})
```

### Construindo array de objetos

```typescript
const catalog = products.map(product => ({
  description: product,
  id: Math.random(),
}))
```

## Example

**Before (problemas comuns):**

```typescript
// Side-effect com map (errado — use forEach)
products.map(p => console.log(p))

// Retorno ignorado
products.map(p => p.toUpperCase())
// resultado nao armazenado em nenhuma variavel

// Nomes genericos
arr.map(x => x.toUpperCase())
```

**After (com esta skill aplicada):**

```typescript
// Side-effect → forEach
products.forEach(product => console.log(product))

// Retorno armazenado em variavel descritiva
const upperProducts = products.map(product => product.toUpperCase())

// Nomes semanticos plural/singular
products.map(product => product.toUpperCase())
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Transformar cada item em outro valor | `map()` com retorno armazenado |
| Apenas iterar sem precisar do retorno | `forEach()` |
| Retorno é expressao unica | Sintese reduzida sem chaves |
| Precisa de logica antes do retorno | Chaves + `return` explicito |
| Retornar objeto literal na sintese reduzida | Envolva em parenteses: `item => ({ key: value })` |
| Nomear callback parameter | Singular do nome do array |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `arr.map(x => console.log(x))` | `arr.forEach(item => console.log(item))` |
| `items.map(function(i) { return i * 2 })` | `items.map(item => item * 2)` |
| `products.map(p => p.name)` (abreviado) | `products.map(product => product.name)` |
| `data.map(d => ...)` (generico) | `users.map(user => ...)` (semantico) |
| `items.map(i => ({ id: i }))` sem armazenar | `const mapped = items.map(item => ({ id: item }))` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `map()` retorna array de `undefined` | Esqueceu o `return` dentro das chaves | Use sintaxe reduzida sem chaves ou adicione `return` explicito |
| Array de objetos retorna `[object Object]` | Tentou retornar objeto sem parenteses na arrow function | Envolva em parenteses: `item => ({ key: value })` |
| Resultado do `map()` nao e usado | Usando `map()` para side-effects | Substitua por `forEach()` se nao precisa do array retornado |
| Array original foi modificado | Mutou o objeto dentro do callback | Crie um novo objeto no retorno em vez de modificar o original |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do map()
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes