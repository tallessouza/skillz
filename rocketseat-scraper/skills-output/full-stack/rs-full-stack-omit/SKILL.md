---
name: rs-full-stack-omit
description: "Applies TypeScript Omit utility type when reusing interfaces with excluded properties. Use when user asks to 'create a type without some fields', 'reuse an interface', 'exclude properties from a type', 'omit fields', or any type manipulation task. Enforces correct Omit syntax with union operator for multiple exclusions. Make sure to use this skill whenever generating TypeScript types that derive from existing ones by removing fields. Not for Pick, Partial, Required, or other utility types."
---

# Omit — Reutilizar Tipagem Excluindo Propriedades

> Ao derivar tipos removendo propriedades, use `Omit<Type, Keys>` para reaproveitar a tipagem original sem duplicar definicoes.

## Rules

1. **Use Omit para excluir propriedades de tipos existentes** — `Omit<Book, "description">` nao uma nova interface manual, porque evita duplicacao e mantém sincronia com o tipo original
2. **Una multiplas exclusoes com pipe `|`** — `Omit<Book, "description" | "pages">` nao chamadas aninhadas, porque e a sintaxe correta do TypeScript para union de string literals
3. **Mantenha o tipo original intacto** — nunca modifique a interface base para atender um caso especifico, porque outros consumidores dependem dela completa
4. **Prefira Omit quando exclui poucos campos** — se exclui mais campos do que mantém, considere `Pick` em vez de `Omit`, porque a intencao fica mais clara

## How to write

### Omit basico (uma propriedade)

```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Reusa Book sem description
const book: Omit<Book, "description"> = {
  title: "TypeScript",
  pages: 100,
  author: "Rodrigo",
}
```

### Omit multiplo (varias propriedades com pipe)

```typescript
// Reusa Book sem description e sem pages
const book: Omit<Book, "description" | "pages"> = {
  title: "TypeScript",
  author: "Rodrigo",
}
```

## Example

**Before (duplicacao manual):**
```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Criou interface nova duplicando campos
interface BookSummary {
  title: string
  author: string
}
```

**After (com Omit):**
```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

type BookSummary = Omit<Book, "description" | "pages">
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Excluir 1-2 campos de um tipo | `Omit<Type, "field1" \| "field2">` |
| Manter apenas 1-2 campos de um tipo | Use `Pick` em vez de `Omit` |
| Tipo para criacao (sem id/timestamps) | `Omit<Entity, "id" \| "createdAt" \| "updatedAt">` |
| Tipo para form sem campos computados | `Omit<Model, "computedField">` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Interface duplicada sem campos | `Omit<Original, "excluded">` |
| `Omit<T, "a">` + `Omit<..., "b">` aninhado | `Omit<T, "a" \| "b">` |
| Modificar interface original para caso especifico | Criar type derivado com `Omit` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do Omit
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes