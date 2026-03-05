---
name: rs-full-stack-type-3
description: "Enforces correct usage of TypeScript type aliases and union types when defining custom types. Use when user asks to 'create a type', 'define a custom type', 'type alias', 'union type', or 'type for API response'. Applies rules: PascalCase naming, prefer type for unions and computed types, use union with null for nullable responses. Make sure to use this skill whenever creating TypeScript type aliases or union types. Not for interface usage, class definitions, or enum declarations."
---

# Usando Type (Type Alias) em TypeScript

> Utilize `type` para criar tipagens customizadas que descrevem a forma dos dados e para unir tipos quando múltiplos retornos são possíveis.

## Rules

1. **Sempre PascalCase no nome do type** — `Product` não `product`, porque TypeScript convenções tratam tipos como entidades de primeira classe e o editor diferencia visualmente
2. **Use `=` após o nome** — `type Product = { ... }`, porque type alias usa atribuição, diferente de interface que usa declaração direta
3. **Separe propriedades com vírgula ou ponto-e-vírgula** — `id: number, name: string` ou `id: number; name: string`, porque ambos são válidos mas escolha um padrão
4. **Use union types para retornos que podem ser nulos** — `Product[] | null` não `Product[]`, porque consultas ao banco podem não retornar dados
5. **Reutilize types existentes em composições** — `type SelectResponse = Product[] | null` reaproveita `Product`, porque evita duplicação e mantém consistência
6. **Use `type` para unions e composições, `interface` para objetos extensíveis** — porque type suporta union (`|`), intersection (`&`) e tipos computados que interface não suporta

## How to write

### Type para objetos de domínio

```typescript
type Product = {
  id: number,
  name: string
}

function newProduct(product: Product) {
  // ...
}

newProduct({ id: 1, name: "Produto X" })
```

### Union type para respostas nullable

```typescript
type SelectResponse = Product[] | null

function selectProducts(): SelectResponse {
  return null
}
```

### Union type para múltiplos retornos

```typescript
type ApiResponse = Product[] | Error | null
```

## Example

**Before (sem type alias):**
```typescript
function newProduct(product: { id: number, name: string }) {
  // tipo inline, não reutilizável
}

function selectProducts(): { id: number, name: string }[] | null {
  // duplicação da estrutura
  return null
}
```

**After (com type alias):**
```typescript
type Product = {
  id: number,
  name: string
}

type SelectResponse = Product[] | null

function newProduct(product: Product) {}

function selectProducts(): SelectResponse {
  return null
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Objeto usado em mais de um lugar | Extraia para um `type` nomeado |
| Retorno pode ser nulo | Use union: `Type \| null` |
| Retorno pode ter múltiplas formas | Use union: `Type[] \| Error \| null` |
| Objeto que será estendido via `extends` | Prefira `interface` |
| Union, intersection ou tipo computado | Use `type` (interface não suporta) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `type product = { ... }` | `type Product = { ... }` (PascalCase) |
| Tipo inline repetido em 3+ funções | Extraia para `type` nomeado |
| `any` para retorno de consulta | `Product[] \| null` com union explícita |
| `Product[] \| undefined \| null` sem necessidade | `Product[] \| null` (escolha um para nullable) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre type vs interface, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-type-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-type-3/references/code-examples.md)
