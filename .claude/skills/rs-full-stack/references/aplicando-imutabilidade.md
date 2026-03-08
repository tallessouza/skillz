---
name: rs-full-stack-aplicando-imutabilidade
description: "Enforces immutability patterns when manipulating objects and arrays in JavaScript/TypeScript. Use when user asks to 'copy an object', 'clone an array', 'update object properties', 'spread operator', or any code involving object/array assignment. Applies rules: never assign objects directly (creates reference, not copy), always use spread operator for shallow copies, place overrides after spread. Make sure to use this skill whenever generating code that copies or derives objects/arrays. Not for deep cloning nested structures, Immer/immutable.js library usage, or Redux state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, immutability, spread-operator, objects, arrays]
---

# Imutabilidade em JavaScript

> Ao copiar ou derivar objetos e arrays, sempre crie novas instancias com spread operator — atribuicao direta cria referencia, nao copia.

## Rules

1. **Nunca atribua objetos/arrays diretamente para "copiar"** — `const obj2 = obj1` cria uma referencia ao mesmo lugar na memoria, nao um objeto novo, porque qualquer mutacao em obj2 altera obj1 tambem
2. **Use spread operator para criar copias** — `const obj2 = { ...obj1 }` cria um objeto novo com as mesmas propriedades, porque sao objetos independentes na memoria
3. **Coloque overrides DEPOIS do spread** — `{ ...obj1, number: 30 }` sobrepoe corretamente, porque propriedades posteriores sobrescrevem anteriores
4. **Nunca coloque overrides ANTES do spread** — `{ number: 30, ...obj1 }` perde o override, porque o spread de obj1 sobrescreve o number que veio antes
5. **Para arrays, use spread ao inves de push no original** — `const list2 = [...list1, 'newItem']` cria array novo, porque push muta o array original e qualquer referencia a ele
6. **Trate todo objeto recebido como imutavel** — crie uma copia antes de modificar, porque o chamador pode depender do estado original

## How to write

### Copiando objetos

```typescript
// Correto: spread cria objeto novo
const address2 = { ...address1 }

// Correto: copia com override de propriedade
const address2 = { ...address1, number: 30 }
```

### Copiando arrays

```typescript
// Correto: spread cria array novo
const list2 = [...list1]

// Correto: copia com item adicional
const list2 = [...list1, 'watermelon']
```

## Example

**Before (referencia — bug silencioso):**
```typescript
const address1 = { street: 'Avenida Brasil', number: 20 }
const address2 = address1 // referencia, NAO copia!
address2.number = 30
console.log(address1.number) // 30 — alterou o original!

const list1 = ['apple', 'banana']
const list2 = list1 // referencia!
list2.push('watermelon')
console.log(list1) // ['apple', 'banana', 'watermelon'] — alterou o original!
```

**After (imutavel — comportamento correto):**
```typescript
const address1 = { street: 'Avenida Brasil', number: 20 }
const address2 = { ...address1, number: 30 } // objeto novo
console.log(address1.number) // 20 — original intacto

const list1 = ['apple', 'banana']
const list2 = [...list1, 'watermelon'] // array novo
console.log(list1) // ['apple', 'banana'] — original intacto
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de copia de objeto | `{ ...original }` |
| Precisa de copia com alteracao | `{ ...original, prop: newValue }` |
| Precisa de copia de array | `[...original]` |
| Precisa de array com item novo | `[...original, newItem]` |
| Objeto/array vem de parametro de funcao | Copie antes de modificar |
| Objetos aninhados (nested) | Spread so copia o primeiro nivel — considere structuredClone ou spread aninhado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const copy = original` (objeto/array) | `const copy = { ...original }` ou `[...original]` |
| `copy.push(item)` no original | `const newList = [...list, item]` |
| `{ number: 30, ...obj }` (override antes) | `{ ...obj, number: 30 }` (override depois) |
| `obj.prop = value` em objeto recebido | `const updated = { ...obj, prop: value }` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Alterar copia muda o original | Atribuicao direta cria referencia, nao copia | Use spread operator `{ ...original }` ou `[...original]` |
| Override no spread nao funciona | Propriedade colocada antes do spread | Coloque overrides DEPOIS do spread: `{ ...obj, prop: value }` |
| Objeto aninhado ainda compartilha referencia | Spread faz apenas shallow copy | Use `structuredClone()` ou spread aninhado para objetos profundos |
| Push no array copia altera o original | Arrays copiados por referencia com `=` | Crie novo array com spread: `[...original, newItem]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre referencias vs copias na memoria
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes