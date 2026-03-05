---
name: rs-full-stack-typeof-1
description: "Applies TypeScript typeof operator for type extraction when writing typed code. Use when user asks to 'type a variable based on another', 'reuse types', 'extract type from existing object', 'infer type from value', or 'type from API response'. Ensures typeof is used to derive types from existing values instead of duplicating interfaces. Make sure to use this skill whenever creating variables that should share the same shape as an existing value. Not for typeof in JavaScript runtime type checking or conditional guards."
---

# TypeScript typeof para Extração de Tipos

> Use `typeof` para derivar tipagens a partir de valores existentes, eliminando duplicação de tipos.

## Rules

1. **Use typeof para reaproveitar tipagens de valores existentes** — `typeof existingVar` em vez de redeclarar a interface, porque mantém os tipos sincronizados automaticamente quando a fonte muda
2. **Prefira typeof quando a fonte é uma biblioteca ou API** — extraia o tipo do retorno em vez de criar interfaces manuais, porque bibliotecas podem mudar suas tipagens entre versões
3. **Mudanças na fonte propagam automaticamente** — ao adicionar/remover campos no valor original, todos os `typeof` derivados refletem a mudança, porque typeof cria uma referência ao tipo, não uma cópia

## How to write

### Tipo derivado de variável existente

```typescript
const product1: Product = { id: 1, name: "Produto 1", quantity: 3 }

// Deriva a tipagem diretamente de product1
const product2: typeof product1 = { id: 2, name: "Produto 2", quantity: 5 }
```

### Tipo derivado de retorno de biblioteca/API

```typescript
const apiResponse = await fetchProducts() // retorno já tipado pela lib

// Extrai o tipo do retorno sem importar a interface
type ProductResponse = typeof apiResponse
```

## Example

**Before (tipagem duplicada manualmente):**
```typescript
interface Product {
  id: number
  name: string
  quantity: number
}

const product1: Product = { id: 1, name: "Produto 1", quantity: 3 }

// Duplicação desnecessária — se Product mudar, precisa lembrar de usar aqui também
const product2: Product = { id: 2, name: "Produto 2", quantity: 5 }
```

**After (com typeof):**
```typescript
interface Product {
  id: number
  name: string
  quantity: number
}

const product1: Product = { id: 1, name: "Produto 1", quantity: 3 }

// typeof garante que product2 sempre terá o mesmo tipo de product1
const product2: typeof product1 = { id: 2, name: "Produto 2", quantity: 5 }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Variável deve ter o mesmo formato de outra | `typeof existingVar` |
| Tipo vem de retorno de lib/API já tipada | `typeof apiResult` ou `ReturnType<typeof fn>` |
| Interface é definida no seu código e usada em múltiplos lugares | Use a interface diretamente — typeof é desnecessário |
| Precisa do tipo em nível de tipo (não de valor) | `type X = typeof value` para criar um type alias |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Recriar interface manual para algo que já existe tipado | `typeof existingValue` |
| Copiar tipagem de lib externa para seu código | `typeof libResult` para manter sincronizado |
| Usar `any` porque não sabe o tipo do retorno | `typeof` no valor retornado para extrair o tipo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases do typeof
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações