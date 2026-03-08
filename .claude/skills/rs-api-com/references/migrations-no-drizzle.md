---
name: rs-api-com-bun-migrations-drizzle
description: "Generates Drizzle ORM programmatic migration setup when user asks to 'setup drizzle migrations', 'create migrate file', 'run database migrations', 'configure drizzle with postgres', or 'setup drizzle studio'. Applies dedicated migrate.ts with single connection (max: 1), cleanup, and npm script. Make sure to use this skill whenever setting up Drizzle migration infrastructure. Not for Prisma migrations, raw SQL, or schema definition (see configurando-drizzle-orm)."
compatibility: "Requires Bun runtime and PostgreSQL."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, migrations, postgresql, bun, database]
---

# Migrations no Drizzle

> Drizzle executa migrations programaticamente via TypeScript — crie migrate.ts com conexao unica.

## Steps

### migrate.ts

```typescript
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { env } from "../env"

const connection = postgres(env.DATABASE_URL, { max: 1 })
const db = drizzle(connection)
await migrate(db, { migrationsFolder: "drizzle" })
await connection.end()
process.exit()
```

### Scripts

```json
{ "scripts": { "generate": "drizzle-kit generate", "migrate": "bun src/db/migrate.ts" } }
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Pooling no migrate | `{ max: 1 }` |
| Sem `connection.end()` | Sempre encerrar |
| Sem `process.exit()` | Sempre encerrar processo |

## Troubleshooting

### Processo fica pendurado
**Fix:** Adicione `connection.end()` + `process.exit()`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
