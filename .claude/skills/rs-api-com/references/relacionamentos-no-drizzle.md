---
name: rs-api-com-bun-relacionamentos-drizzle
description: "Enforces Drizzle ORM foreign key and cascade strategy patterns when designing schemas with references. Use when user asks to 'add foreign key', 'configure cascade', 'set onDelete strategy', 'connect tables with references', or 'choose cascade vs set null'. Applies explicit cascade, snake_case DB columns, relation-only-where-queried. Make sure to use this skill whenever writing Drizzle schema with FK references. Not for relations() API (see configurando-relacionamentos-no-drizzle), Prisma, or TypeORM."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, foreign-key, cascade, references, schema, postgresql]
---

# Relacionamentos no Drizzle (Foreign Keys)

> FK no banco (references) + relation no ORM (relations) — um nao substitui o outro.

## Rules

1. **Separe FK de relation** — ambos necessarios
2. **snake_case no banco, camelCase no codigo**
3. **Cascade explicito** — nunca default `no action`
4. **`set null` para nullable** — `cascade` so onde a regra exige
5. **Relation so para o lado consultado**
6. **relationName explicito**

## How to write

```typescript
export const restaurants = pgTable('restaurants', {
  managerId: text('manager_id').references(() => users.id, { onDelete: 'set null' }),
})

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  manager: one(users, { fields: [restaurants.managerId], references: [users.id], relationName: 'restaurant_manager' }),
}))
```

## Troubleshooting

### onDelete default bloqueia delecao
**Fix:** Defina `onDelete: 'set null'` ou `'cascade'` explicitamente.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
