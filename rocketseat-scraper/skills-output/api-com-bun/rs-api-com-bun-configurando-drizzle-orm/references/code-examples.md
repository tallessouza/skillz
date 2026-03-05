# Code Examples: Configurando Drizzle ORM

## Instalacao completa

```bash
# Instalar Drizzle Kit (CLI para migrations)
bun add drizzle-kit

# Instalar Drizzle ORM + driver Postgres
bun add drizzle-orm postgres

# Instalar CUID2 para geracao de IDs
bun add @paralleldrive/cuid2
```

## Schema completo: users.ts

```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Enum nativo do Postgres — valida no nivel do banco
export const userRoleEnum = pgEnum("user_role", ["manager", "customer"])

export const users = pgTable("users", {
  // CUID2: menor que UUID, igualmente unico
  id: text("id").$defaultFn(createId).primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),

  // Enum com default — todo usuario novo e customer
  role: userRoleEnum("role").default("customer").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

## Schema completo: restaurants.ts

```typescript
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

## Arquivo index.ts (reexportacao)

```typescript
// src/db/schema/index.ts
// Tudo que e exportado aqui sera lido pelo Drizzle Kit
// Se uma tabela NAO for exportada, ela NAO sera criada no banco
export * from "./users"
export * from "./restaurants"
```

## drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
} satisfies Config
```

**Campos do config:**
- `schema`: caminho para o arquivo raiz do schema (que reexporta todas as tabelas)
- `out`: pasta onde serao gerados os arquivos SQL de migration
- `dialect`: tipo do banco de dados (`postgresql`, `mysql`, `sqlite`)

## package.json scripts

```json
{
  "scripts": {
    "generate": "drizzle-kit generate"
  }
}
```

## Gerando migrations

```bash
# Gera o arquivo SQL (NAO executa no banco)
bun generate
```

Resultado: pasta `drizzle/` com arquivos como:
```
drizzle/
  0000_some_random_name.sql
  0001_another_random_name.sql
```

## SQL gerado (exemplo da primeira migration)

```sql
-- Criacao do enum nativo do Postgres
CREATE TYPE "user_role" AS ENUM ('manager', 'customer');

-- Criacao da tabela users
CREATE TABLE "users" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "role" "user_role" DEFAULT 'customer' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

## Variacao: campo com serial (abordagem que o instrutor EVITOU)

```typescript
// NAO recomendado neste curso — apenas para referencia
import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(), // auto-increment
  name: text("name"),
})
```

O instrutor prefere CUID2 sobre serial/auto-increment para padronizar IDs como strings unicas.

## Variacao: tipagem apenas no TypeScript (abordagem INSUFICIENTE)

```typescript
// Tipa no TypeScript mas NAO valida no banco
role: text("role").$type<"manager" | "customer">()
```

Isso permite inserir qualquer string no banco via SQL direto. A abordagem correta e usar `pgEnum` para validacao no nivel do banco de dados.