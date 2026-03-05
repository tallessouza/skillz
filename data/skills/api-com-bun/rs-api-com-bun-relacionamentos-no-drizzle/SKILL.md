---
name: rs-api-com-bun-relacionamentos-drizzle
description: "Enforces Drizzle ORM relationship patterns when defining database schemas with foreign keys and relations. Use when user asks to 'create a relationship', 'add foreign key', 'configure relations in Drizzle', 'connect tables', or 'setup one-to-many'. Applies rules: always define both DB-level foreign keys AND Drizzle relations, use explicit cascade strategies, only create relation objects for sides you actually query. Make sure to use this skill whenever writing Drizzle schema files with related tables. Not for Prisma, TypeORM, Sequelize, or raw SQL migrations."
---

# Relacionamentos no Drizzle ORM

> Relacionamentos no Drizzle exigem duas camadas: a foreign key no banco (references) e o relation object no código (relations) — um não substitui o outro.

## Rules

1. **Separe foreign key de relation** — `references()` cria a constraint no banco; `relations()` ensina o Drizzle a fazer joins no código. Ambos são necessários, porque o Drizzle não infere relacionamentos apenas pela foreign key
2. **Use nomes snake_case no banco, camelCase no código** — `managerId` no schema JS mapeia para `manager_id` na coluna, porque JavaScript usa camelCase e SQL usa snake_case
3. **Configure cascade explicitamente** — nunca deixe o default `no action`. Defina `onDelete` e `onUpdate` conforme a regra de negócio, porque cascades implícitos geram problemas em importações e atualizações em massa
4. **Evite cascade agressivo** — prefira `set null` para campos nullable e `cascade` apenas onde a regra de negócio exige, porque cascades a nível de banco podem travar operações em massa
5. **Crie relation apenas para o lado que você consulta** — se não existe operação que liste usuários com seus restaurantes, não crie a relation no lado de users, porque relations sem uso são código morto
6. **Nomeie relations explicitamente** — passe `relationName` para evitar nomes auto-gerados, porque nomes explícitos facilitam debug e queries

## How to write

### Foreign key com references

```typescript
// Campo que referencia outra tabela
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
})
```

### Relation object (lado que consulta)

```typescript
import { relations } from 'drizzle-orm'

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
    relationName: 'restaurant_manager',
  }),
}))
```

### Relation many (lado inverso, apenas se necessário)

```typescript
// Só crie se existir operação que liste usuários com seus restaurantes
export const usersRelations = relations(users, ({ many }) => ({
  restaurants: many(restaurants, {
    relationName: 'restaurant_manager',
  }),
}))
```

## Example

**Before (foreign key sem relation e sem cascade):**
```typescript
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey(),
  managerId: text('manager_id').references(() => users.id),
})
// Drizzle não sabe fazer join — queries com relations vão falhar
```

**After (com relation e cascade explícito):**
```typescript
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey(),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
})

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
    relationName: 'restaurant_manager',
  }),
}))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo nullable referenciando outra tabela | `onDelete: 'set null'` — mantém o registro, remove a referência |
| Campo NOT NULL referenciando outra tabela | `onDelete: 'cascade'` ou `'restrict'` conforme regra de negócio |
| Precisa listar entidade com dados da relação | Crie `relations()` nesse lado |
| Não tem operação que consulte a relação | Não crie `relations()` — adicione quando precisar |
| Importações ou atualizações em massa previstas | Evite `cascade` no onUpdate e onDelete |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `.references(() => users.id)` sem cascade | `.references(() => users.id, { onDelete: 'set null' })` |
| Relation nos dois lados "por garantia" | Relation apenas no lado que tem query real |
| `relationName` omitido com múltiplas refs à mesma tabela | `relationName: 'nome_explicito'` sempre |
| Foreign key achando que Drizzle já entende o join | Foreign key + `relations()` — são complementares |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
