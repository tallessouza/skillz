---
name: rs-api-com-bun-configurando-drizzle-orm
description: "Applies Drizzle ORM initial setup patterns when configuring a Bun API project with PostgreSQL. Use when user asks to 'setup drizzle', 'configure ORM', 'create database schema', 'setup drizzle config', or 'initialize drizzle in bun project'. Covers schema definition with pgTable, pgEnum, CUID2 IDs, drizzle.config.ts, and migration generation scripts. Make sure to use this skill whenever setting up Drizzle ORM from scratch in a Bun project. Not for Prisma (use rs-node-js), TypeORM, or Drizzle relations (see configurando-relacionamentos-no-drizzle)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, orm, schema, postgresql, bun, cuid2, pgEnum]
---

# Configurando Drizzle ORM

> Configurar Drizzle ORM com schema TypeScript, enums nativos do Postgres, IDs com CUID2 e migrations automatizadas.

## Rules

1. **Schema em TypeScript puro** — `pgTable` importado de `drizzle-orm/pg-core`
2. **Um arquivo por tabela** — pasta `src/db/schema/` com `index.ts` reexportando
3. **IDs com CUID2** — `text().$defaultFn(createId).primaryKey()`
4. **Enums nativos** — `pgEnum` para validacao no banco
5. **Tabelas no plural** — `users`, `restaurants`
6. **createdAt e updatedAt** — `timestamp().notNull().defaultNow()`

## How to write

### Schema com enum

```typescript
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"])

export const users = pgTable("users", {
  id: text("id").$defaultFn(createId).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

### drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit"
export default { schema: "./src/db/schema/index.ts", out: "./drizzle", dialect: "postgresql" } satisfies Config
```

## Example

**Before:** `serial("id").primaryKey()` + `text("role").$type<"admin">()`
**After:** `text("id").$defaultFn(createId).primaryKey()` + `pgEnum("user_role", [...])`

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `serial("id")` | `text("id").$defaultFn(createId).primaryKey()` |
| `$type<"admin">()` | `pgEnum(...)` |
| Todo schema num arquivo | Um por tabela + index.ts |

## Troubleshooting

### createId nao e funcao
**Symptom:** Erro ao inserir
**Fix:** Use `$defaultFn(createId)` sem parenteses.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
