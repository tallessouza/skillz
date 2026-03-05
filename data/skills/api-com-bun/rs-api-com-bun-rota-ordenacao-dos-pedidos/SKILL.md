---
name: rs-api-com-bun-ordenacao-pedidos
description: "Applies Drizzle ORM orderBy patterns with custom SQL expressions when writing query sorting logic. Use when user asks to 'sort results', 'order by status', 'custom ordering', 'drizzle orderBy', or 'priority-based sorting'. Enforces subquery field access via callback, SQL CASE for non-alphabetical ordering, and multi-field sort arrays. Make sure to use this skill whenever implementing sorted queries with Drizzle ORM. Not for filtering, pagination, or non-Drizzle ORMs."
---

# Ordenacao com Drizzle ORM

> Ao ordenar queries no Drizzle, use callbacks para acessar campos de subqueries e SQL CASE para ordenacao customizada por prioridade.

## Rules

1. **Use callback no orderBy de subqueries** — `orderBy: (fields) => [desc(fields.createdAt)]` nao `orderBy: desc(orders.createdAt)`, porque subqueries criam uma "nova tabela" e os campos originais nao existem mais
2. **Nunca ordene strings com logica de prioridade pela ordem alfabetica** — use `sql` com CASE/WHEN para atribuir valores numericos, porque a ordem alfabetica nao reflete prioridade de negocio
3. **Use array no orderBy para multiplos criterios** — `[sqlExpression, desc(fields.createdAt)]`, porque a primeira posicao tem prioridade maior
4. **Interpole campos dentro do sql template** — `${fields.status}` nao `"status"`, porque se o campo mudar de nome, a query quebra silenciosamente
5. **Atribua numeros nao-sequenciais para status futuro** — `cancelled = 99` nao `5`, porque permite inserir novos status sem renumerar

## How to write

### OrderBy com callback em subquery

```typescript
const baseQuery = db
  .select({ orderId: orders.id, createdAt: orders.createdAt })
  .from(orders)
  .as('baseQuery')

// Campos acessados via callback, NAO pela tabela original
db.select().from(baseQuery).orderBy((fields) => [
  desc(fields.createdAt)
])
```

### SQL CASE para ordenacao por prioridade de status

```typescript
import { sql, desc } from 'drizzle-orm'

// Dentro do orderBy callback
orderBy: (fields) => [
  sql`
    CASE
      WHEN ${fields.status} = 'pending' THEN 1
      WHEN ${fields.status} = 'processing' THEN 2
      WHEN ${fields.status} = 'delivering' THEN 3
      WHEN ${fields.status} = 'delivered' THEN 4
      WHEN ${fields.status} = 'cancelled' THEN 99
    END
  `,
  desc(fields.createdAt),
]
```

### Select com campos explicitos e ordenacao

```typescript
const ordersQuery = db
  .select({
    orderId: orders.id,
    createdAt: orders.createdAt,
    status: orders.status,
    total: orders.totalInCents,
    customerName: users.name,
  })
  .from(orders)
  .innerJoin(users, eq(orders.userId, users.id))
```

## Example

**Before (ordenacao alfabetica de status):**
```typescript
db.select()
  .from(baseQuery)
  .orderBy(desc(orders.status)) // "cancelled" vem antes de "pending" alfabeticamente
```

**After (ordenacao por prioridade de negocio):**
```typescript
db.select()
  .from(baseQuery)
  .orderBy((fields) => [
    sql`
      CASE
        WHEN ${fields.status} = 'pending' THEN 1
        WHEN ${fields.status} = 'processing' THEN 2
        WHEN ${fields.status} = 'delivering' THEN 3
        WHEN ${fields.status} = 'delivered' THEN 4
        WHEN ${fields.status} = 'cancelled' THEN 99
      END
    `,
    desc(fields.createdAt),
  ])
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Ordenar subquery/CTE | Usar callback `(fields) => [...]` para acessar campos |
| Status com prioridade de negocio | SQL CASE com valores numericos |
| Multiplos criterios de ordenacao | Array: prioridade primeiro, desempate depois |
| Novos status podem surgir | Deixar gaps na numeracao (1,2,3,4,99) |
| Misturar SQL raw com Drizzle | Usar `sql` template literal com interpolacao de campos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `orderBy: desc(orders.createdAt)` em subquery | `orderBy: (fields) => [desc(fields.createdAt)]` |
| `sql\`CASE WHEN "status" = ...\`` | `sql\`CASE WHEN ${fields.status} = ...\`` |
| `cancelled = 5` (sequencial) | `cancelled = 99` (com gap para futuros status) |
| `orderBy: desc(fields.status)` para prioridade | `orderBy: sql\`CASE WHEN...\`` com valores numericos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
