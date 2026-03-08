---
name: rs-full-stack-desestruturacao-de-objetos
description: "Applies JavaScript/TypeScript object destructuring patterns when writing functions, accessing object properties, or refactoring code. Use when user asks to 'create a function', 'extract properties', 'refactor parameters', 'destructure', or works with objects. Enforces destructured parameters in functions to avoid positional bugs, clean property extraction, and named arguments. Make sure to use this skill whenever generating functions that receive objects or accessing multiple object properties. Not for array destructuring, spread operator, or rest parameters."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-modern
  tags: [JavaScript, destructuring, objects, ES6, named-parameters, functions]
---

# Desestruturação de Objetos

> Ao acessar propriedades de objetos ou definir parâmetros de funções, sempre desestruture para ganhar clareza, independência de ordem e código mais limpo.

## Rules

1. **Desestruture propriedades ao acessar objetos** — `const { name, price } = product` não `const name = product.name`, porque reduz repetição e deixa explícito quais propriedades são usadas
2. **Use parâmetros desestruturados em funções** — `function create({ name, price })` não `function create(name, price)`, porque elimina bugs de ordem dos argumentos
3. **Passe objetos nomeados ao chamar funções** — `create({ price: 70, description: "mouse" })` não `create("mouse", 70)`, porque a ordem não importa quando propriedades são nomeadas
4. **Prefira const na desestruturação** — `const { x, y } = obj` não `let { x, y } = obj`, porque valores extraídos raramente precisam ser reatribuídos
5. **Extraia apenas o que usar** — desestruture somente as propriedades necessárias, porque propriedades não extraídas são ignoradas sem custo

## How to write

### Extraindo propriedades de objetos

```typescript
const product = { description: "Teclado", price: 150 }

// Desestruturação direta em constantes
const { description, price } = product

console.log(`Descrição: ${description}`) // "Teclado"
console.log(`Preço: ${price}`)           // 150
```

### Parâmetros desestruturados em funções

```typescript
// Função recebe objeto desestruturado — ordem não importa
function createProduct({ description, price }: { description: string; price: number }) {
  console.log(`Descrição: ${description}`)
  console.log(`Preço: ${price}`)
}

// Chamadas equivalentes — ordem não altera resultado
createProduct({ description: "Mouse", price: 70 })
createProduct({ price: 70, description: "Mouse" }) // mesmo resultado
```

## Example

**Before (parâmetros posicionais — bug de ordem):**

```typescript
function createProduct(description, price) {
  console.log(`Descrição: ${description}`)
  console.log(`Preço: ${price}`)
}

// Se trocar a ordem, quebra silenciosamente
createProduct(70, "Mouse") // Descrição: 70, Preço: Mouse — BUG
```

**After (desestruturação — imune à ordem):**

```typescript
function createProduct({ description, price }) {
  console.log(`Descrição: ${description}`)
  console.log(`Preço: ${price}`)
}

// Ordem não importa — sempre correto
createProduct({ price: 70, description: "Mouse" }) // Descrição: Mouse, Preço: 70
```

## Heuristics

| Situação | Faça |
|----------|------|
| Função recebe 2+ parâmetros relacionados | Desestruture em um objeto |
| Acessa 2+ propriedades do mesmo objeto | Desestruture no topo |
| Função recebe 1 parâmetro primitivo | Parâmetro simples é OK |
| Callback curto inline (map/filter) | `(item) => item.name` é OK — não precisa desestruturar |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `const name = product.name; const price = product.price;` | `const { name, price } = product` |
| `function create(name, desc, price, qty)` | `function create({ name, desc, price, qty })` |
| `create("Mouse", "Periférico", 70, 5)` | `create({ name: "Mouse", desc: "Periférico", price: 70, qty: 5 })` |
| `let { x } = obj` (sem reatribuição) | `const { x } = obj` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Propriedade retorna `undefined` apos desestruturar | Nome da variavel nao bate com a chave do objeto | Use exatamente o mesmo nome da propriedade |
| Bug silencioso com parametros posicionais | Ordem dos argumentos trocada | Refatore para receber objeto desestruturado |
| TypeScript reclama tipo do parametro | Falta tipagem no objeto desestruturado | Adicione tipo inline: `{ name, price }: { name: string; price: number }` |
| `Cannot destructure property of undefined` | Objeto passado e `undefined` ou `null` | Adicione valor padrao: `function fn({ name } = {})` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações