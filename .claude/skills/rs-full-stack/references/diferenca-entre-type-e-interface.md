---
name: rs-full-stack-diferenca-type-interface
description: "Enforces correct choice between Type and Interface in TypeScript code. Use when user asks to 'create a type', 'define an interface', 'extend a type', 'merge declarations', or any TypeScript type definition task. Applies rules: use interface for declaration merging and object shapes, use type for primitives aliases and intersections. Make sure to use this skill whenever defining TypeScript types or reviewing type definitions. Not for runtime JavaScript code, documentation, or non-TypeScript projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript
  tags: [TypeScript, type, interface, declaration-merging, extends, intersection]
---

# Diferença entre Type e Interface no TypeScript

> Escolha entre `type` e `interface` com base nas capacidades exclusivas de cada um, nao por preferencia cega.

## Rules

1. **Use `interface` quando precisar de declaration merging** — interfaces com mesmo nome sao unificadas automaticamente pelo TypeScript, porque bibliotecas e modulos usam isso para extensibilidade
2. **Use `type` para alias de primitivos** — `type UserId = string` funciona, `interface UserId extends string {}` nao compila, porque interfaces so descrevem formas de objetos
3. **Use `type` com intersecao (`&`) para composicao pontual** — `type Product = BaseProduct & { name: string }`, porque e mais conciso que `extends` para uniao rapida
4. **Use `interface extends` para hierarquias de objetos** — `interface Product extends BaseProduct {}`, porque deixa explicita a relacao pai-filho
5. **Nunca redeclare um `type` esperando merge** — o TypeScript bloqueia identificadores duplicados para types, diferente de interfaces
6. **Siga a convencao do time** — no mercado brasileiro, interfaces sao mais comuns; o importante e consistencia dentro do projeto

## How to write

### Extensao com interface (extends)

```typescript
interface BaseProduct {
    price: number
}

interface Product extends BaseProduct {
    id: number
    name: string
}
```

### Composicao com type (intersecao)

```typescript
type BaseProduct = {
    price: number
}

type Product = BaseProduct & {
    id: number
    name: string
}
```

### Alias de primitivo (so type)

```typescript
type UserId = string
type PriceInCents = number
```

### Declaration merging (so interface)

```typescript
interface Product {
    id: number
    name: string
}

// Mesmo nome — TypeScript unifica automaticamente
interface Product {
    quantity: number
}

// Resultado: Product tem id, name E quantity
```

## Example

**Antes (escolha incorreta):**
```typescript
// Tentando alias de primitivo com interface — ERRO
interface TypeString extends string {}

// Tentando merge com type — ERRO
type Product = { id: number }
type Product = { name: string } // Duplicate identifier
```

**Depois (com esta skill aplicada):**
```typescript
// Alias de primitivo: use type
type TypeString = string

// Merge de declaracoes: use interface
interface Product { id: number }
interface Product { name: string } // OK, unificado
```

## Heuristics

| Situacao | Use |
|----------|-----|
| Definir forma de objeto simples | `interface` ou `type` — ambos funcionam |
| Hierarquia pai-filho de objetos | `interface extends` |
| Composicao rapida de tipos | `type` com `&` |
| Alias para tipo primitivo | `type` (unica opcao) |
| Biblioteca que precisa ser extensivel | `interface` (declaration merging) |
| Union types (`A \| B`) | `type` (unica opcao) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `interface X extends string {}` | `type X = string` |
| `type T = {...}` + `type T = {...}` (merge) | `interface T {...}` + `interface T {...}` |
| Misturar `type` e `interface` sem criterio no mesmo projeto | Escolher um padrao e seguir consistentemente |
| Prefixo `I` obrigatorio em interfaces (`IProduct`) | Usar apenas se for convencao do time |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Duplicate identifier` ao declarar type duas vezes | Types nao suportam declaration merging | Use `interface` se precisa de merge, ou renomeie |
| `interface X extends string` nao compila | Interfaces nao podem extender primitivos | Use `type X = string` para alias de primitivos |
| Confusao entre `&` e `extends` | Ambos compoe tipos, mas de formas diferentes | Use `&` para composicao rapida, `extends` para hierarquia |
| Inconsistencia no projeto (mistura type/interface) | Falta de convencao | Defina padrao com o time e siga consistentemente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes