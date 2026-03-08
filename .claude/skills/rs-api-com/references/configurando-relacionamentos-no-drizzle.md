---
name: rs-api-com-bun-relacionamentos-drizzle-config
description: "Enforces Drizzle ORM relationship configuration patterns with relations(), one(), many() helpers. Use when user asks to 'configure drizzle relations', 'setup one-to-many', 'connect tables in drizzle', 'add relations to schema', or 'define relationships'. Applies fields/references, relationName disambiguation, separation between FK and ORM relations. Make sure to use this skill whenever writing Drizzle relations() declarations. Not for raw SQL FK only (see schema-de-produtos-e-pedidos), Prisma, or TypeORM."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, relations, one-to-many, one-to-one, foreign-key, orm]
---

# Configurando Relacionamentos no Drizzle ORM

> `references` cria FK no Postgres, `relations()` ensina o Drizzle a fazer queries relacionais — ambos necessarios.

## Rules

1. **Separe FK de relationship** — camadas diferentes com propositos diferentes
2. **`many()` sem config** — infere pelos references da outra tabela
3. **`one()` com fields/references** — declara quais colunas conectam
4. **relationName para ambiguos** — multiplas refs a mesma tabela
5. **Relations nao geram migrations** — nao afeta schema do banco
6. **Exporte junto com a tabela** — coesao no mesmo arquivo

## How to write

```typescript
import { relations } from 'drizzle-orm'

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, { fields: [orders.customerId], references: [users.id], relationName: 'orderCustomer' }),
  restaurant: one(restaurants, { fields: [orders.restaurantId], references: [restaurants.id] }),
}))

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  manager: one(users, { fields: [restaurants.managerId], references: [users.id] }),
  orders: many(orders),
}))
```

## Example

**Before:** FK sem relations — Drizzle nao faz query relacional
**After:** FK + `relations()` — `db.query.orders.findFirst({ with: { customer: true } })` funciona

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `many(orders, { fields: [...] })` | `many(orders)` |
| Dois `one()` mesma tabela sem relationName | Adicione `relationName` |

## Troubleshooting

### Query relacional retorna undefined
**Fix:** Crie `relations()` e exporte no index.ts.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
