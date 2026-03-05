# Code Examples: Configurando o Knex.js

## Exemplo base da aula (TypeScript + SQLite3)

```typescript
// knexfile.ts (raiz do projeto)
export default {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}
```

## Variação: Múltiplos ambientes

```typescript
// knexfile.ts
const sharedConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}

export default {
  development: {
    ...sharedConfig,
    connection: {
      filename: './src/database/development.db',
    },
  },
  test: {
    ...sharedConfig,
    connection: {
      filename: './src/database/test.db',
    },
  },
  production: {
    ...sharedConfig,
    connection: {
      filename: './src/database/production.db',
    },
  },
}
```

## Variação: PostgreSQL (para comparação)

```typescript
// knexfile.ts
export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'myapp',
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}
```

Note que `useNullAsDefault` **não é necessário** para PostgreSQL — é uma recomendação específica do SQLite3.

## Variação: Com seeds configurados

```typescript
// knexfile.ts
export default {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './src/database/seeds',
  },
}
```

## Criando a instância do Knex a partir do config

```typescript
// src/database/connection.ts
import knex from 'knex'
import config from '../../knexfile'

const database = knex(config)

export default database
```

## Comandos CLI úteis após configuração

```bash
# Criar uma nova migration
npx knex migrate:make create_users_table

# Executar migrations pendentes
npx knex migrate:latest

# Reverter última migration
npx knex migrate:rollback

# Ver status das migrations
npx knex migrate:status
```