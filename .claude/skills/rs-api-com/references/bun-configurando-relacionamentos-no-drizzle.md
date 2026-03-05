---
name: rs-api-com-bun-relacionamentos-drizzle
description: "Applies Drizzle ORM relationship patterns when defining database schemas with one-to-one, one-to-many relations. Use when user asks to 'create a schema', 'define relationships', 'setup drizzle relations', 'connect tables', or 'configure ORM relations'. Enforces correct usage of relations(), one(), many() helpers and fields/references config. Make sure to use this skill whenever writing Drizzle ORM schema files with table relationships. Not for raw SQL foreign keys, Prisma schemas, or TypeORM entity definitions."
---

# Relacionamentos no Drizzle ORM

> Relacionamentos no Drizzle sao declaracoes para o ORM, nao para o banco — o Postgres so precisa do `references`, mas o Drizzle precisa de `relations()` para habilitar queries relacionais.

## Rules

1. **Separe foreign key de relationship** — `references` cria a FK no Postgres, `relations()` ensina o Drizzle a fazer queries relacionais, porque sao camadas diferentes com propositos diferentes
2. **`many()` nao precisa de config** — quando o relacionamento e one-to-many do lado "many", o Drizzle infere automaticamente pelos `references` da outra tabela
3. **`one()` sempre recebe fields/references** — o lado "one" precisa declarar explicitamente quais colunas conectam as tabelas, porque e ele que possui a foreign key
4. **Nomeie relacionamentos ambiguos** — quando uma tabela tem multiplos relacionamentos para a mesma tabela destino, use `relationName` para diferenciar
5. **Relations nao geram migrations** — rodar `drizzle-kit generate` apos adicionar apenas `relations()` nao produz mudancas, porque nao afeta o schema do banco
6. **Exporte relations junto com a tabela** — declare `relations()` no mesmo arquivo da tabela correspondente para manter coesao

## How to write

### One-to-many (lado "one" — quem tem a FK)

```typescript
import { relations } from 'drizzle-orm'
import { orders } from './orders'
import { restaurants } from './restaurants'
import { users } from './users'

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: 'orderCustomer',
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
}))
```

### One-to-many (lado "many" — quem nao tem FK)

```typescript
import { relations } from 'drizzle-orm'
import { orders } from './orders'
import { products } from './products'
import { restaurants } from './restaurants'

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
  }),
  orders: many(orders),
  products: many(products),
}))
```

### One-to-one com relationName (desambiguacao)

```typescript
export const usersRelations = relations(users, ({ one, many }) => ({
  managedRestaurant: one(restaurants, {
    fields: [users.id],
    references: [restaurants.managerId],
    relationName: 'managedRestaurant',
  }),
  orders: many(orders),
}))
```

## Example

**Before (so foreign keys, sem relations):**

```typescript
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').references(() => users.id),
  restaurantId: text('restaurant_id').references(() => restaurants.id),
})
// Drizzle NAO consegue fazer query relacional sem relations()
```

**After (com relations declaradas):**

```typescript
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').references(() => users.id),
  restaurantId: text('restaurant_id').references(() => restaurants.id),
})

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: 'orderCustomer',
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
}))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Tabela tem coluna com `.references()` | Declare `one()` com fields/references nessa tabela |
| Tabela e referenciada por outra | Declare `many()` sem config |
| Duas FKs apontam pra mesma tabela | Use `relationName` em ambos os lados |
| Adicionou apenas relations | Nao rode migration — nada muda no banco |
| Relacao 1:1 (user gerencia 1 restaurante) | Use `one()` dos dois lados com fields/references |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `many(orders, { fields: [...] })` | `many(orders)` — many nao aceita fields/references |
| Relations sem importar `relations` de `drizzle-orm` | `import { relations } from 'drizzle-orm'` |
| Dois `one()` pra mesma tabela sem relationName | Adicione `relationName` para desambiguar |
| Esperar que `references` baste pro Drizzle fazer queries | Declare `relations()` explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-configurando-relacionamentos-no-drizzle/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-configurando-relacionamentos-no-drizzle/references/code-examples.md)
