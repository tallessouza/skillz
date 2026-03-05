---
name: rs-api-com-bun-configurando-drizzle-orm
description: "Applies Drizzle ORM setup patterns when configuring a new API project with Bun and PostgreSQL. Use when user asks to 'setup drizzle', 'configure ORM', 'create database schema', 'setup migrations', or 'start a bun API project'. Covers schema definition in TypeScript, pg enums, CUID2 IDs, drizzle.config.ts, and migration generation. Make sure to use this skill whenever setting up Drizzle ORM from scratch. Not for Prisma, TypeORM, or runtime query building."
---

# Configurando Drizzle ORM

> Configurar Drizzle ORM com schema TypeScript, enums nativos do Postgres, IDs com CUID2 e migrations automatizadas.

## Rules

1. **Schema em TypeScript puro** — definir tabelas com `pgTable`, colunas e tipos importados de `drizzle-orm/pg-core`, porque Drizzle nao usa linguagem propria (diferente do Prisma)
2. **Um arquivo por tabela** — criar pasta `src/db/schema/` com um arquivo por tabela e `index.ts` reexportando tudo, porque Drizzle le as exportacoes desse arquivo raiz
3. **IDs com CUID2, nao UUID ou serial** — usar `@paralleldrive/cuid2` com `text().default(createId).primaryKey()`, porque CUIDs sao menores que UUIDs e nao dependem de auto-increment
4. **Enums nativos do Postgres** — usar `pgEnum` ao inves de tipar apenas no TypeScript, porque o banco precisa validar os valores permitidos
5. **Tabelas sempre no plural** — `users`, `restaurants`, nao `user`, `restaurant`
6. **createdAt e updatedAt obrigatorios** — ambos `timestamp().notNull().defaultNow()`

## How to write

### Estrutura de pastas

```
src/db/
  schema/
    index.ts          # Reexporta todas as tabelas
    users.ts          # Uma tabela por arquivo
    restaurants.ts
drizzle.config.ts     # Configuracao do Drizzle Kit
drizzle/              # Pasta gerada com migrations SQL
```

### Schema de tabela com enum

```typescript
// src/db/schema/users.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"])

export const users = pgTable("users", {
  id: text("id").$defaultFn(createId).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

### Schema simples sem enum

```typescript
// src/db/schema/restaurants.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const restaurants = pgTable("restaurants", {
  id: text("id").$defaultFn(createId).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

### Index reexportando

```typescript
// src/db/schema/index.ts
export * from "./users"
export * from "./restaurants"
```

### drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
} satisfies Config
```

### Scripts no package.json

```json
{
  "scripts": {
    "generate": "drizzle-kit generate"
  }
}
```

## Example

**Before (erro comum — tudo num arquivo, UUID, sem enum no banco):**
```typescript
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  role: text("role").$type<"admin" | "user">(),
})
```

**After (com esta skill aplicada):**
```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"])

export const users = pgTable("users", {
  id: text("id").$defaultFn(createId).primaryKey(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Campo com valores fixos (status, role, tipo) | Usar `pgEnum` nativo do Postgres |
| ID de entidade | `text` + `$defaultFn(createId)` + `.primaryKey()` |
| Campo obrigatorio | Sempre adicionar `.notNull()` |
| Banco crescendo com muitas tabelas | Um arquivo por tabela, reexportar no index |
| Gerar migration apos mudar schema | `bun generate` (nao sobe no banco, so gera SQL) |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `serial("id").primaryKey()` | `text("id").$defaultFn(createId).primaryKey()` |
| `text("role").$type<"admin">()` | `pgEnum("role", [...])` para validacao no banco |
| Todo schema num unico arquivo | Um arquivo por tabela + index.ts reexportando |
| `pgTable("user", ...)` (singular) | `pgTable("users", ...)` (plural) |
| Schema sem createdAt/updatedAt | Sempre incluir ambos com `.defaultNow()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
