---
name: rs-api-com-bun-ordenacao-pedidos
description: "Applies Drizzle ORM orderBy patterns with SQL CASE expressions when implementing custom sorting logic. Use when user asks to 'sort results', 'order by status priority', 'custom ordering in drizzle', 'drizzle orderBy callback', or 'priority-based sorting'. Enforces subquery field access via callback and SQL CASE for non-alphabetical ordering. Make sure to use this skill whenever implementing sorted queries with Drizzle ORM. Not for filtering (see rota-listagem-de-pedidos), pagination, or non-Drizzle ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: orders
  tags: [drizzle, orderBy, sql-case, sorting, subquery, priority, bun]
---

# Ordenacao com Drizzle ORM

> Use callbacks para acessar campos de subqueries e SQL CASE para ordenacao customizada por prioridade.

## Rules

1. **Use callback no orderBy de subqueries** — `orderBy: (fields) => [desc(fields.createdAt)]`, porque subqueries criam nova tabela
2. **Nunca ordene strings por ordem alfabetica para prioridade** — use `sql` com CASE/WHEN para atribuir valores numericos
3. **Use array no orderBy** — primeira posicao tem prioridade maior
4. **Interpole campos no sql template** — `${fields.status}` nao `"status"`, porque se o campo mudar a query quebra
5. **Numeros nao-sequenciais para status futuro** — `cancelled = 99` permite inserir novos status sem renumerar

## How to write

### SQL CASE para prioridade de status

```typescript
orderBy: (fields) => [
  sql`CASE
    WHEN ${fields.status} = 'pending' THEN 1
    WHEN ${fields.status} = 'processing' THEN 2
    WHEN ${fields.status} = 'delivering' THEN 3
    WHEN ${fields.status} = 'delivered' THEN 4
    WHEN ${fields.status} = 'cancelled' THEN 99
  END`,
  desc(fields.createdAt),
]
```

## Example

**Before (alfabetica):**
```typescript
db.select().from(baseQuery).orderBy(desc(orders.status))
// "cancelled" vem antes de "pending" alfabeticamente
```

**After (prioridade de negocio):**
```typescript
db.select().from(baseQuery).orderBy((fields) => [
  sql`CASE WHEN ${fields.status} = 'pending' THEN 1 ... END`,
  desc(fields.createdAt),
])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ordenar subquery/CTE | Callback `(fields) => [...]` |
| Status com prioridade | SQL CASE com numericos |
| Multiplos criterios | Array: prioridade primeiro, desempate depois |
| Novos status futuros | Gaps na numeracao (1,2,3,4,99) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `orderBy: desc(orders.createdAt)` em subquery | `orderBy: (fields) => [desc(fields.createdAt)]` |
| `sql'CASE WHEN "status" = ...'` | `sql'CASE WHEN ${fields.status} = ...'` |
| `cancelled = 5` (sequencial) | `cancelled = 99` (com gap) |
| `desc(fields.status)` para prioridade | SQL CASE com valores numericos |

## Troubleshooting

### OrderBy nao funciona em subquery
**Symptom:** Ordenacao ignorada ou erro de coluna nao encontrada
**Cause:** Acessando campos da tabela original ao inves dos campos da subquery
**Fix:** Use callback: `orderBy: (fields) => [desc(fields.createdAt)]` para acessar campos da subquery.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
