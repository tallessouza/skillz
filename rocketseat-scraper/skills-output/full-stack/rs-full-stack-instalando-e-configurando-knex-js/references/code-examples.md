# Code Examples: Instalando e Configurando Knex.js

## 1. Instalacao

```bash
# Versoes fixas conforme a aula
npm i knex@3.1.0 sqlite3@5.1.7
```

## 2. knexfile.ts completo

```typescript
import type { Knex } from "knex"

export default {
  client: "sqlite3",
  connection: {
    filename: "./src/database/database.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations",
  },
  seeds: {
    extension: "ts",
    directory: "./src/database/seeds",
  },
} satisfies Knex.Config
```

## 3. Script no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "knex": "node --import tsx node_modules/.bin/knex"
  }
}
```

## 4. .gitignore

```
node_modules
```

## 5. Estrutura de pastas apos setup

```
projeto/
├── src/
│   └── database/
│       ├── migrations/          # criada pelo knex migrate:make
│       │   └── 20240101_create-product.ts
│       └── seeds/               # criada manualmente ou pelo knex seed:make
├── knexfile.ts
├── package.json
├── .gitignore
└── node_modules/
```

## 6. Comandos Knex mais usados

```bash
# Criar migration
npm run knex -- migrate:make create-product

# Rodar migrations pendentes
npm run knex -- migrate:latest

# Reverter ultima migration
npm run knex -- migrate:rollback

# Criar seed
npm run knex -- seed:make populate-products

# Rodar seeds
npm run knex -- seed:run
```

## 7. Variacao: knexfile com multiplos ambientes

```typescript
import type { Knex } from "knex"

const config: Record<string, Knex.Config> = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/database.db",
    },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      directory: "./src/database/migrations",
    },
    seeds: {
      extension: "ts",
      directory: "./src/database/seeds",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      extension: "ts",
      directory: "./src/database/migrations",
    },
    seeds: {
      extension: "ts",
      directory: "./src/database/seeds",
    },
  },
}

export default config
```

## 8. Migration gerada (template vazio)

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // criar tabela aqui
}

export async function down(knex: Knex): Promise<void> {
  // reverter criacao aqui
}
```

## 9. Exemplo de migration preenchida (proximo passo)

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("product", (table) => {
    table.increments("id").primary()
    table.text("name").notNullable()
    table.text("description")
    table.decimal("price", 10, 2).notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("product")
}
```