---
name: rs-full-stack-consulta
description: "Applies Prisma ORM query patterns when writing database queries with filtering and sorting. Use when user asks to 'query database', 'filter results', 'search by field', 'sort results', 'find records', or 'list with search'. Enforces contains over equals for text search, insensitive mode for case handling, trim inputs, and orderBy placement. Make sure to use this skill whenever writing Prisma findMany with filters or sorting. Not for raw SQL queries, database migrations, or schema design."
---

# Consultas com Prisma ORM

> Ao consultar dados com Prisma, use `contains` para buscas textuais, `mode: 'insensitive'` para ignorar maiusculas/minusculas, e `orderBy` fora do `where`.

## Rules

1. **Nunca use igualdade exata para busca textual** — use `contains` em vez de passar o valor direto no `where`, porque igualdade exata falha com qualquer diferenca minima (espaco, casing, substring)
2. **Sempre use `mode: 'insensitive'`** — em buscas textuais, porque usuarios digitam em qualquer casing e a busca deve funcionar independente disso
3. **Sempre faca trim nos parametros de busca** — use `.trim()` antes de passar para o Prisma, porque espacos invisíveis quebram a consulta silenciosamente
4. **Converta query params para string** — use `.toString()` em query parameters opcionais, porque eles podem vir como `undefined` e o Prisma espera string
5. **Coloque `orderBy` fora do `where`** — sao propriedades irmãs no objeto do `findMany`, porque colocar `orderBy` dentro do `where` causa erro silencioso
6. **Use `asc` como padrao para ordenacao alfabetica** — porque e a expectativa natural do usuario ao listar itens

## How to write

### Busca textual com contains + insensitive

```typescript
const results = await prisma.question.findMany({
  where: {
    title: {
      contains: search?.toString().trim(),
      mode: 'insensitive',
    },
  },
  orderBy: {
    title: 'asc',
  },
})
```

### Query parameter opcional com fallback seguro

```typescript
const title = request.query.title?.toString().trim()

const questions = await prisma.question.findMany({
  ...(title && {
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    },
  }),
  orderBy: {
    title: 'asc',
  },
})
```

## Example

**Before (busca quebrada):**
```typescript
const questions = await prisma.question.findMany({
  where: {
    title: request.query.title,
  },
})
```

**After (busca robusta):**
```typescript
const title = request.query.title?.toString().trim()

const questions = await prisma.question.findMany({
  where: title
    ? { title: { contains: title, mode: 'insensitive' } }
    : undefined,
  orderBy: { title: 'asc' },
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Busca por texto do usuario | `contains` + `mode: 'insensitive'` + `.trim()` |
| Query param opcional | Conditional spread ou ternario para `where` |
| Listar sem filtro | Omita `where` ou passe `undefined` |
| Ordenar resultados | `orderBy` como propriedade irma de `where` |
| Multiplos filtros | Combine dentro do mesmo `where` object |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `where: { title: value }` (igualdade exata para busca) | `where: { title: { contains: value, mode: 'insensitive' } }` |
| `orderBy` dentro de `where` | `orderBy` no mesmo nivel que `where` |
| `request.query.title` direto sem tratamento | `request.query.title?.toString().trim()` |
| `contains` sem `mode: 'insensitive'` | Sempre incluir `mode: 'insensitive'` em buscas textuais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre igualdade vs contains, case sensitivity e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-consulta/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-consulta/references/code-examples.md)
