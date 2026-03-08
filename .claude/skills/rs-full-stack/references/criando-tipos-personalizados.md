---
name: rs-full-stack-criando-tipos-personalizados
description: "Enforces creation of custom TypeScript types to represent domain-specific data instead of using only primitives. Use when user asks to 'create a type', 'define a product type', 'model domain data', 'represent an entity', or any TypeScript data modeling task. Applies rules: use type aliases for domain objects, go beyond primitives for complex data, name types by domain concept. Make sure to use this skill whenever modeling application data in TypeScript. Not for primitive type annotations, utility types, or generic type manipulation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-fundamentals
  tags: [typescript, types, type-alias, domain-modeling, custom-types]
---

# Criando Tipos Personalizados

> Criar tipos customizados para representar dados específicos do domínio da aplicação, indo além dos tipos primitivos.

## Rules

1. **Crie tipos customizados para entidades do domínio** — `type Product = { name: string; price: number }` não apenas `string` e `number` separados, porque tipos primitivos sozinhos não expressam a estrutura da informação
2. **Nomeie tipos pelo conceito de domínio** — `Product`, `Order`, `User` não `DataObject` ou `Info`, porque o tipo representa uma entidade real da aplicação
3. **Use `type` para definir estruturas de dados** — agrupe propriedades relacionadas num tipo coeso, porque cada aplicação tem necessidades específicas que tipos primitivos não atendem
4. **Comece pelos dados que a aplicação precisa representar** — identifique as entidades antes de codar, porque o tipo customizado nasce da necessidade do domínio

## How to write

### Tipo customizado para entidade de domínio

```typescript
type Product = {
  id: number
  name: string
  price: number
  description: string
  inStock: boolean
}

const product: Product = {
  id: 1,
  name: "Camiseta",
  price: 4990,
  description: "Camiseta 100% algodão",
  inStock: true,
}
```

### Composição de tipos customizados

```typescript
type Address = {
  street: string
  city: string
  zipCode: string
}

type Customer = {
  name: string
  email: string
  address: Address
}
```

## Example

**Before (apenas primitivos soltos):**
```typescript
const productName: string = "Notebook"
const productPrice: number = 3500
const productInStock: boolean = true
```

**After (tipo customizado representando a entidade):**
```typescript
type Product = {
  name: string
  priceInCents: number
  inStock: boolean
}

const notebook: Product = {
  name: "Notebook",
  priceInCents: 350000,
  inStock: true,
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dados com 2+ propriedades relacionadas | Crie um tipo customizado |
| Entidade reutilizada em múltiplos lugares | Tipo customizado obrigatório |
| Valor único e isolado | Tipo primitivo é suficiente |
| Tipo usado como parâmetro de função | Defina o tipo separadamente para reutilização |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| Variáveis primitivas soltas representando uma entidade | Um `type` agrupando as propriedades |
| `any` para dados estruturados | Tipo customizado com propriedades tipadas |
| Objetos sem tipo definido | Objeto anotado com tipo customizado |
| `type Data = { ... }` | `type Product = { ... }` (nome pelo domínio) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Type '{ name: string }' is not assignable to type 'Product'` | Objeto incompleto para o tipo definido | Adicione todas as propriedades obrigatorias do tipo |
| Tipo nao aparece no autocomplete | Tipo definido mas nao exportado | Adicione `export` antes de `type` |
| `any` aceito sem erro | tsconfig com `strict: false` | Habilite `"strict": true` no tsconfig.json |
| Propriedade opcional causa erro em acesso | Falta verificacao de nulabilidade | Use optional chaining `obj?.prop` ou verifique antes de acessar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando e por que criar tipos customizados
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de tipos customizados