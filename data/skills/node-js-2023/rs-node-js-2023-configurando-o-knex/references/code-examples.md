# Code Examples: Configurando o Knex

## Exemplo completo do database.ts

```typescript
// src/database.ts
import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './temp/app.db',
  },
})
```

## Teste de conexao no server

```typescript
// src/server.ts
import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

Resultado esperado: `[]` (array vazio, porque nenhuma tabela foi criada ainda).

## Variacoes de connection por banco

### PostgreSQL

```typescript
export const knex = setupKnex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
})
```

### PostgreSQL com connection string

```typescript
export const knex = setupKnex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})
```

### MySQL

```typescript
export const knex = setupKnex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
})
```

## .gitignore minimo para o projeto

```gitignore
node_modules
*.db
```

## Comandos de instalacao

```bash
# SQLite (usado neste projeto)
npm install knex sqlite3

# PostgreSQL
npm install knex pg

# MySQL
npm install knex mysql2

# Multiplos drivers (se precisar)
npm install knex sqlite3 pg
```

## Estrutura de pastas apos configuracao

```
projeto/
├── src/
│   ├── database.ts    # Conexao com banco
│   └── server.ts      # Servidor Fastify
├── temp/
│   └── app.db         # Criado automaticamente na primeira query
├── node_modules/
├── .gitignore
├── package.json
└── tsconfig.json
```