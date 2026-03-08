---
name: rs-full-stack-0404-listando-solicitacoes
description: "Enforces Prisma query patterns for listing, filtering, and including relations when building API endpoints. Use when user asks to 'list records', 'filter by name', 'search with Prisma', 'include relations', 'order results', or 'build a list endpoint'. Applies findMany with where/contains, include for relations, orderBy, and Zod query validation. Make sure to use this skill whenever implementing list/search endpoints with Prisma. Not for creating, updating, or deleting records, nor for raw SQL queries."
---

# Listando e Filtrando Dados com Prisma

> Ao listar dados com Prisma, combine findMany com where/contains para busca, include para relacoes e orderBy para ordenacao, validando query params com Zod.

## Rules

1. **Use `findMany` para listagens** — retorna array de registros, nunca `findFirst` ou `findUnique` para listas, porque listagens sempre esperam arrays
2. **Valide query params com Zod antes de usar** — defina schema com `z.object()`, marque filtros como `.optional()` com `.default("")`, porque params de URL sao sempre strings e podem estar ausentes
3. **Use `contains` para buscas parciais** — `where: { field: { contains: value } }` equivale a SQL LIKE, porque usuarios esperam busca por trecho, nao match exato
4. **Filtre por relacao navegando o objeto** — `where: { user: { name: { contains } } }` filtra pelo campo da tabela relacionada, porque Prisma resolve JOINs automaticamente
5. **Use `include` para trazer dados relacionados** — `include: { user: true }` retorna o objeto completo da relacao, porque o frontend precisa exibir dados do usuario vinculado
6. **Ordene com `orderBy` usando `desc` para mais recente primeiro** — `orderBy: { createdAt: "desc" }`, porque usuarios esperam ver registros mais recentes no topo

## How to write

### Schema Zod para query params

```typescript
const querySchema = z.object({
  name: z.string().optional().default(""),
})

const { name } = querySchema.parse(request.query)
```

### Listagem com filtro, include e ordenacao

```typescript
const refunds = await prisma.refund.findMany({
  where: {
    user: {
      name: {
        contains: name.trim(),
      },
    },
  },
  include: {
    user: true,
  },
  orderBy: {
    createdAt: "desc",
  },
})
```

## Example

**Before (sem filtro, sem relacao, sem ordem):**
```typescript
async function index(request, response) {
  const refunds = await prisma.refund.findMany()
  return response.json({ message: "listing refunds" })
}
```

**After (com filtro por nome, include de usuario, ordenacao):**
```typescript
async function index(request, response) {
  const querySchema = z.object({
    name: z.string().optional().default(""),
  })

  const { name } = querySchema.parse(request.query)

  const refunds = await prisma.refund.findMany({
    where: {
      user: {
        name: {
          contains: name.trim(),
        },
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return response.json(refunds)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem sem filtro | `findMany()` sem `where`, mas mantenha `orderBy` |
| Filtro opcional vazio | Default para string vazia — `contains: ""` retorna tudo |
| Precisa dados de tabela relacionada | `include: { relation: true }` |
| Multiplas ordenacoes | `orderBy: [{ createdAt: "desc" }, { name: "asc" }]` |
| Filtro por campo da propria tabela | `where: { status: "pending" }` direto |
| Filtro por campo de relacao | `where: { user: { name: { contains } } }` navegando objeto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findMany()` e filtrar no JS | `findMany({ where })` — filtre no banco |
| `request.query.name` sem validacao | `z.object({ name: z.string().optional().default("") }).parse(request.query)` |
| `contains` sem `.trim()` | `contains: name.trim()` — remova espacos |
| Retornar objeto com mensagem em vez dos dados | `return response.json(refunds)` — retorne os dados diretamente |
| `orderBy: { createdAt: "asc" }` para listagens recentes | `orderBy: { createdAt: "desc" }` — mais recente primeiro |
| Fazer query separada para buscar usuario | `include: { user: true }` — Prisma resolve o JOIN |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre filtros Prisma, relações e validação de query params
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações