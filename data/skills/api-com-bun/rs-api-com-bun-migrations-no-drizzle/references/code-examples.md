# Code Examples: Migrations no Drizzle

## Exemplo completo do migrate.ts

```typescript
// src/db/migrate.ts
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"

// Conexao nativa com Postgres — max: 1 desabilita pooling
const connection = postgres(
  "postgresql://docker:docker@localhost:5432/pizzashop",
  { max: 1 }
)

// Drizzle recebe a conexao nativa e a usa diretamente
const db = drizzle(connection)

// Executa todas migrations pendentes da pasta "drizzle"
await migrate(db, { migrationsFolder: "drizzle" })

// Encerra conexao com o banco
await connection.end()

// Encerra o processo Node/Bun
process.exit()
```

## Package.json script

```json
{
  "scripts": {
    "migrate": "bun src/db/migrate.ts"
  }
}
```

## Execucao

```bash
# Rodar migrations
bun migrate

# Iniciar Drizzle Studio para visualizar banco
npx drizzle-kit studio --config drizzle.config.ts
```

## Variacao: com variavel de ambiente (producao)

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

## Docker Compose — volume unico por projeto

```yaml
# ERRADO: volume generico compartilhado
volumes:
  pg_data:

# CORRETO: volume nomeado por projeto
volumes:
  pizzashop_pg_data:
```

## Testando no Drizzle Studio

Apos abrir o Studio no navegador, use a aba Query:

```typescript
// Sintaxe Drizzle Query Builder — funciona direto no Studio
db.select().from(users)
db.select().from(restaurants)
```

## Imports do Drizzle por driver

```typescript
// PostgresJS (usado neste projeto)
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"

// Neon (serverless)
import { drizzle } from "drizzle-orm/neon-http"

// Bun SQLite (em memoria)
import { drizzle } from "drizzle-orm/bun-sqlite"
```