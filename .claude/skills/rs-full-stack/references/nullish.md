---
name: rs-full-stack-nullish
description: "Applies Zod nullish() for optional schema fields when validating request data with Zod. Use when user asks to 'create a schema', 'validate request body', 'make field optional', 'zod validation', or 'optional property'. Enforces rule: Zod fields are required by default, use .nullish() to accept null or undefined. Make sure to use this skill whenever writing Zod schemas with optional fields. Not for general TypeScript optional types, database nullability, or non-Zod validation libraries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-validation
  tags: [zod, nullish, optional, schema, validation]
---

# Zod Nullish — Campos Opcionais em Schemas

> Ao definir schemas Zod, todo campo e obrigatorio por padrao. Use `.nullish()` para aceitar `null | undefined` e tornar o campo opcional.

## Rules

1. **Campo no schema = obrigatorio** — ao adicionar uma propriedade no objeto Zod, ela e requerida automaticamente, porque o Zod valida presenca por padrao
2. **Use `.nullish()` para opcional** — `z.string().nullish()` aceita `string | null | undefined`, porque cobre tanto ausencia quanto valor nulo explicitamente
3. **Prefira `.nullish()` sobre `.optional()`** — `.nullish()` aceita `null` E `undefined`, enquanto `.optional()` so aceita `undefined`, porque APIs frequentemente enviam `null` explicitamente
4. **Decisao consciente** — todo campo opcional deve ser uma escolha deliberada, nao um atalho para evitar validacao, porque campos obrigatorios protegem a integridade dos dados

## How to write

### Schema com campos obrigatorios (padrao)

```typescript
const createProductSchema = z.object({
  name: z.string(),   // obrigatorio
  price: z.number(),  // obrigatorio
})
```

### Tornando um campo opcional com nullish

```typescript
const createProductSchema = z.object({
  name: z.string(),            // obrigatorio
  price: z.number().nullish(), // opcional: number | null | undefined
})
```

## Example

**Before (campo obrigatorio causa erro quando ausente):**

```typescript
// Schema
const schema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

// Request sem description → ERRO: "description is required"
```

**After (campo opcional com nullish):**

```typescript
// Schema
const schema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().nullish(), // aceita null, undefined ou string
})

// Request sem description → OK, passa validacao
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo essencial para a entidade (name, email) | Deixe obrigatorio (padrao) |
| Campo complementar (description, avatar) | Use `.nullish()` |
| API pode enviar `null` explicitamente | Use `.nullish()` (nao `.optional()`) |
| Campo com valor padrao no banco | Use `.nullish()` no schema, aplique default depois |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `price: z.number().optional()` (quando API envia null) | `price: z.number().nullish()` |
| Remover campo do schema para torna-lo opcional | Manter no schema com `.nullish()` |
| `price: z.number().nullable().optional()` | `price: z.number().nullish()` (equivalente e mais conciso) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Campo opcional ainda causa erro de validacao | Usou `.optional()` mas API envia `null` | Troque para `.nullish()` que aceita ambos |
| Tipo inferido nao inclui `null` | Usou `.optional()` em vez de `.nullish()` | `.nullish()` infere `T \| null \| undefined` |
| Schema rejeita payload valido | Campo obrigatorio quando deveria ser opcional | Adicione `.nullish()` ao campo no schema |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre obrigatoriedade padrao no Zod e diferenca entre optional, nullable e nullish
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes