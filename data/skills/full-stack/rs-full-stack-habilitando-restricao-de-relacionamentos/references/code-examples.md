# Code Examples: Foreign Keys no Knex.js com SQLite

## Exemplo basico do knexfile.ts

```typescript
import type { Knex } from "knex"

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run("PRAGMA foreign_keys = ON", done)
    },
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
}

export default config
```

## Migration com foreign key

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary()
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE")
    table.integer("quantity").notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders")
}
```

## Demonstracao: com vs sem pragma

### Sem pragma (dados inconsistentes aceitos)

```typescript
// Sem pool.afterCreate configurado
// Produto com id 999 NAO existe no banco
await knex("orders").insert({
  product_id: 999, // Aceito sem erro!
  quantity: 2,
})
// O registro e criado normalmente, dados inconsistentes
```

### Com pragma (erro de constraint)

```typescript
// Com pool.afterCreate configurado
// Produto com id 999 NAO existe no banco
await knex("orders").insert({
  product_id: 999,
  quantity: 2,
})
// SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
```

## Variacao: banco in-memory para testes

```typescript
const testConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: ":memory:",
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run("PRAGMA foreign_keys = ON", done)
    },
  },
  useNullAsDefault: true,
}
```

## Variacao: verificando se pragma esta ativo

```typescript
const result = await knex.raw("PRAGMA foreign_keys")
console.log(result) // [{ foreign_keys: 1 }] se habilitado
```

## Variacao: multiplos pragmas no afterCreate

```typescript
pool: {
  afterCreate: (connection: any, done: Function) => {
    connection.run("PRAGMA foreign_keys = ON", (err: Error) => {
      if (err) {
        done(err)
        return
      }
      connection.run("PRAGMA journal_mode = WAL", done)
    })
  },
}
```