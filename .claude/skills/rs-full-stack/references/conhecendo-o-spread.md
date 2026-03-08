---
name: rs-full-stack-conhecendo-o-spread
description: "Applies JavaScript/TypeScript spread operator patterns when writing code that manipulates arrays, objects, or iterables. Use when user asks to 'merge arrays', 'copy objects', 'expand elements', 'combine data', or 'spread operator'. Enforces correct spread usage for expanding iterables, cloning, and merging. Make sure to use this skill whenever generating code that combines or expands arrays/objects. Not for rest parameters, destructuring assignment, or function parameter definitions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-modern
  tags: [javascript, spread-operator, arrays, objects, immutability]
---

# Spread Operator

> Usar spread para expandir iteráveis em seus elementos individuais, permitindo manipulação flexível de arrays e objetos.

## Rules

1. **Use spread para expandir iteráveis** — `...array` expande cada elemento individualmente, porque permite passar elementos como argumentos separados ou combiná-los em novas estruturas
2. **Prefira spread para clonar** — `const clone = [...original]` ou `{ ...original }`, porque mutação acidental do original causa bugs silenciosos
3. **Use spread para merge de objetos** — `{ ...defaults, ...overrides }`, porque a ordem determina precedência e o resultado é previsível
4. **Spread funciona com qualquer iterável** — arrays, strings, Maps, Sets, porque o operador chama o protocolo de iteração internamente
5. **Spread cria cópia rasa (shallow)** — objetos aninhados ainda compartilham referência, porque spread só expande o primeiro nível

## How to write

### Expandir array em argumentos

```typescript
const numbers = [1, 2, 3]
console.log(...numbers) // 1 2 3 (elementos separados, não array)

const max = Math.max(...numbers) // equivale a Math.max(1, 2, 3)
```

### Clonar e combinar arrays

```typescript
const original = [1, 2, 3]
const clone = [...original]
const combined = [...arrayA, ...arrayB, newElement]
```

### Merge de objetos

```typescript
const defaults = { theme: 'light', lang: 'pt-BR' }
const userPrefs = { theme: 'dark' }
const config = { ...defaults, ...userPrefs }
// { theme: 'dark', lang: 'pt-BR' }
```

### Spread com array de objetos

```typescript
const users = [
  { name: 'rodrigo', email: 'rodrigo@email.com', avatar: 'r.png' },
  { name: 'joao', email: 'joao@email.com', avatar: 'j.png' },
]
console.log(...users) // cada objeto como argumento separado
```

## Example

**Before (manipulação manual):**
```typescript
const arr1 = [1, 2]
const arr2 = [3, 4]
const merged = arr1.concat(arr2)
const copy = arr1.slice()
const configFinal = Object.assign({}, defaults, overrides)
```

**After (com spread):**
```typescript
const arr1 = [1, 2]
const arr2 = [3, 4]
const merged = [...arr1, ...arr2]
const copy = [...arr1]
const configFinal = { ...defaults, ...overrides }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Combinar dois arrays | `[...a, ...b]` |
| Clonar array | `[...original]` |
| Clonar objeto | `{ ...original }` |
| Merge com precedência | `{ ...defaults, ...overrides }` — último vence |
| Passar array como argumentos | `fn(...args)` |
| Adicionar elemento ao array | `[...existing, newItem]` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `arr1.concat(arr2)` | `[...arr1, ...arr2]` |
| `Object.assign({}, obj)` | `{ ...obj }` |
| `arr.slice()` para clonar | `[...arr]` |
| `apply(null, args)` para expandir | `fn(...args)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Objeto aninhado ainda compartilha referencia | Spread faz copia rasa (shallow copy) | Para objetos aninhados, faca spread em cada nivel ou use `structuredClone()` |
| Ordem do merge esta errada | Propriedades posteriores sobrescrevem anteriores | Coloque defaults primeiro: `{ ...defaults, ...overrides }` |
| Spread em non-iterable causa erro | Tentando spread em `null`, `undefined` ou numero | Verifique o tipo antes: `...(arr ?? [])` |
| Array clonado modifica o original | Elementos do array sao objetos (referencia compartilhada) | Use `.map(item => ({ ...item }))` para clonar objetos internos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações