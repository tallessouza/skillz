---
name: rs-full-stack-interface-3
description: "Enforces correct TypeScript interface usage when defining custom types for objects. Use when user asks to 'create a type', 'define an interface', 'type an object', 'add typing to a function parameter', or any task involving custom object shapes. Applies rules: PascalCase naming, no I-prefix, interfaces for object shapes, typed function parameters. Make sure to use this skill whenever generating TypeScript code that involves object structures or function parameters with multiple properties. Not for primitive types, union types, or type aliases for non-object shapes."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-interfaces
  tags: [typescript, interface, types, typing, functions]
---

# Interfaces no TypeScript

> Usar interfaces para criar tipagens customizadas que descrevem a forma exata dos dados que uma variavel ou parametro precisa ter.

## Rules

1. **PascalCase para nomes de interface** — `Product` nao `product` ou `PRODUCT`, porque interfaces sao tipos e seguem a convencao de tipos do TypeScript
2. **Sem prefixo I** — `Product` nao `IProduct`, porque o prefixo e redundante e o ecossistema moderno do TypeScript abandonou essa convencao
3. **Interface para objetos com multiplas propriedades** — quando um parametro precisa de mais de uma informacao (id, nome, valor), crie uma interface ao inves de passar parametros soltos, porque garante tipagem completa e autocomplete
4. **Propriedades com tipos explicitos** — cada propriedade da interface deve ter seu tipo declarado (`id: number`, `name: string`), porque o TypeScript valida em tempo de compilacao
5. **Use interface como tipo de parametro** — `function fn(param: Product)` nao `function fn(id: number, name: string)`, porque agrupa dados relacionados e o IntelliSense mostra as propriedades esperadas

## How to write

### Declarando uma interface

```typescript
interface Product {
  id: number
  name: string
}
```

### Usando como tipo de parametro

```typescript
function createProduct(product: Product) {
  console.log(product.id, product.name)
}

createProduct({ id: 1, name: "Produto X" })
```

## Example

**Before (sem interface):**
```typescript
function createProduct(id: number, name: string, price: number) {
  // parametros soltos, sem agrupamento
}

createProduct(1, "Produto X", 29.90)
```

**After (com interface):**
```typescript
interface Product {
  id: number
  name: string
  price: number
}

function createProduct(product: Product) {
  console.log(product.name)
}

createProduct({ id: 1, name: "Produto X", price: 29.90 })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao recebe objeto com 2+ propriedades | Criar interface para o tipo |
| Tipo sera reutilizado em multiplas funcoes | Interface no topo do arquivo ou em arquivo separado |
| Objeto tem apenas 1 propriedade | Parametro simples e suficiente |
| Precisa de union type ou tipo primitivo | Use `type` alias ao inves de interface |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function fn(id: number, name: string, price: number)` | `function fn(product: Product)` |
| `interface product { }` | `interface Product { }` |
| `interface IProduct { }` | `interface Product { }` |
| `function fn(product: any)` | `function fn(product: Product)` |
| `function fn(product: object)` | `function fn(product: Product)` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Erro "Property does not exist on type" | Propriedade nao declarada na interface | Adicionar a propriedade com tipo correto na interface |
| Interface nao reconhecida em outro arquivo | Interface nao exportada | Adicionar `export` antes de `interface` |
| Erro ao passar objeto com propriedades extras | TypeScript rejeita propriedades nao declaradas | Remover propriedades extras ou adicionar na interface |
| Autocomplete nao funciona para propriedades | Tipo do parametro e `any` ou `object` | Usar a interface tipada como tipo do parametro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar interfaces, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes