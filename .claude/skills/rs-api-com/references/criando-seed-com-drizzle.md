---
name: rs-api-com-bun-criando-seed-drizzle
description: "Generates database seed files using Drizzle ORM and FakerJS. Use when user asks to 'create a seed', 'populate database', 'seed database', 'generate test data', or 'create fake data'. Applies reset before insert, FK order on delete, .returning() for chaining, fixed test credentials. Make sure to use this skill whenever creating seed scripts for Drizzle. Not for migrations (see migrations-no-drizzle), schema (see configurando-drizzle-orm), or production data."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, seed, faker, database, test-data, bun]
---

# Criando Seed com Drizzle

> Reset antes de inserir, respeitar FK order, dados fixos para test users.

## Rules

1. **Reset antes de inserir** — delete todas as tabelas
2. **Ordem das FK ao deletar** — dependentes primeiro
3. **Sem Promise.all para deletes com FK** — sequencial
4. **Email fixo para test user** — `admin@admin.com`
5. **`.returning()` para IDs** — encadear inserts
6. **Desestruturar array** — `const [item] = await ...`
7. **`process.exit()`** no final

## How to write

```typescript
await db.delete(restaurants)
await db.delete(users)

const [manager] = await db.insert(users)
  .values({ name: faker.person.fullName(), email: 'admin@admin.com', role: 'manager' })
  .returning({ id: users.id })

await db.insert(restaurants).values({
  name: faker.company.name(), managerId: manager.id,
})

process.exit()
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Promise.all([delete(a), delete(b)])` com FK | Sequencial |
| `crypto.randomUUID()` para encadear | `.returning({ id })` |
| `email: faker.internet.email()` para test | `'admin@admin.com'` |

## Troubleshooting

### Unique constraint violation
**Fix:** Adicione `db.delete()` para todas as tabelas no inicio.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
