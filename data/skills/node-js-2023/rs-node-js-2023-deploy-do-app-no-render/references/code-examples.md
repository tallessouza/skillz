# Code Examples: Deploy no Render

## Env Schema completo

```typescript
// src/env/index.ts
import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

## Database config com dual-client

```typescript
// src/database.ts
import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
```

### Como funciona a logica de connection

- **SQLite**: precisa de um objeto `{ filename: './db/app.db' }` — caminho do arquivo local
- **PostgreSQL**: recebe a connection string diretamente como string: `postgresql://user:pass@host:5432/db`

O ternario resolve isso em uma linha.

## Server com host condicional

```typescript
// src/server.ts
import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: ('RENDER' in process.env) ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('HTTP server running!')
  })
```

O Render injeta a variavel `RENDER` no environment. Quando presente, o app escuta em `0.0.0.0` (todas as interfaces). Em dev, escuta apenas em `localhost`.

## Package.json — engines e dependencias

```json
{
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "pg": "^8.11.0",
    "knex": "^2.5.0",
    "zod": "^3.21.0",
    "fastify": "^4.17.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "better-sqlite3": "^9.0.0",
    "tsup": "^7.1.0",
    "typescript": "^5.1.0"
  }
}
```

Note: `better-sqlite3` esta em devDependencies porque SQLite so e usado em desenvolvimento.

## Arquivos .env por ambiente

### .env (desenvolvimento)
```env
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
PORT=3333
```

### .env.test
```env
NODE_ENV=test
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/test.db
PORT=3333
```

### Variaveis no Render (producao)
```
DATABASE_CLIENT=pg
DATABASE_URL=postgresql://user:pass@host:5432/ignite_nodejs_02_db
# PORT — NAO definir, o Render injeta automaticamente
```

## Build e Start commands no Render

```bash
# Build Command (roda uma vez no deploy)
npm install && npm run knex -- migrate:latest && npm run build

# Start Command (roda o servidor)
node build/server.js
```

A ordem importa:
1. `npm install` — instala dependencias (inclusive pg)
2. `npm run knex -- migrate:latest` — cria/atualiza tabelas no Postgres
3. `npm run build` — compila TypeScript para JavaScript via tsup