---
name: rs-full-stack-pick
description: "Applies TypeScript Pick utility type when creating partial types from existing interfaces. Use when user asks to 'create a preview type', 'select specific properties', 'reuse part of an interface', 'pick fields from a type', or any type subsetting task. Ensures Pick is used instead of duplicating interfaces. Make sure to use this skill whenever the user creates a new interface that duplicates properties from an existing one. Not for Omit, Partial, or other utility types."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-fundamentals
  tags:
    - typescript
    - utility-types
    - pick
    - interfaces
---

# TypeScript Pick Utility Type

> Ao precisar de um subconjunto de propriedades de um tipo existente, use `Pick<Type, Keys>` em vez de criar um novo tipo manualmente.

## Rules

1. **Use Pick para subconjuntos** — `Pick<Book, "title">` nao `interface BookPreview { title: string }`, porque evita duplicacao e mantém sincronia com o tipo original
2. **Combine propriedades com pipe** — `Pick<Book, "title" | "pages">` para selecionar multiplas propriedades, porque Pick aceita union de chaves
3. **Nunca duplique interfaces** — se as propriedades ja existem em outro tipo, reuse com Pick, porque alteracoes no tipo original se propagam automaticamente
4. **Pick referencia o tipo fonte** — se o tipo fonte ganha novas propriedades, o Pick nao e afetado, garantindo estabilidade

## How to write

### Selecionar uma propriedade

```typescript
// Cria um tipo com apenas title, reaproveitando Book
const bookPreview: Pick<Book, "title"> = { title: "TypeScript" }
```

### Selecionar multiplas propriedades

```typescript
// Use | (pipe) para combinar propriedades
const bookSummary: Pick<Book, "title" | "pages"> = {
  title: "TypeScript",
  pages: 150
}
```

## Example

**Before (interface duplicada manualmente):**
```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Duplicacao — se Book mudar, BookPreview pode ficar dessincronizado
interface BookPreview {
  title: string
}

const preview: BookPreview = { title: "TypeScript" }
```

**After (com Pick):**
```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Reaproveitamento — sempre sincronizado com Book
const preview: Pick<Book, "title"> = { title: "TypeScript" }
const summary: Pick<Book, "title" | "pages"> = { title: "TypeScript", pages: 150 }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de 1-3 propriedades de um tipo existente | Use `Pick<Type, Keys>` |
| Precisa de quase todas menos 1-2 | Considere `Omit` em vez de Pick |
| Propriedades nao existem em nenhum tipo | Crie uma interface nova normalmente |
| Tipo usado em API response parcial | Pick e ideal para tipar respostas parciais |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `interface BookPreview { title: string }` (duplicando Book) | `Pick<Book, "title">` |
| `interface BookSummary { title: string; pages: number }` | `Pick<Book, "title" \| "pages">` |
| Criar tipo manual quando fonte existe | Reaproveitar com Pick |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro "Type X is not assignable to type Pick" | Propriedades obrigatorias do tipo original ausentes no objeto | Verifique que todas as chaves listadas no Pick estao presentes no objeto |
| Pick nao atualiza quando tipo original muda | Chave removida do tipo original mas ainda referenciada no Pick | Remova a chave inexistente do segundo parametro do Pick |
| Intellisense nao mostra propriedades do Pick | IDE nao resolveu o tipo corretamente | Reinicie o TypeScript server (Ctrl+Shift+P → Restart TS Server) |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-pick/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-pick/references/code-examples.md)
