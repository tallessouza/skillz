# Code Examples: Migrations com Tabelas de Sessão

## Exemplo completo da aula

### Comando para criar a migration

```bash
npm run knex -- migrate:make createTablesSessions
```

### Migration completa

```typescript
import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables_sessions", (table) => {
    table.increments("id").primary()
    table
      .integer("table_id")
      .notNullable()
      .references("id")
      .inTable("tables")
    table.timestamp("opened_at").defaultTo(knex.fn.now())
    table.timestamp("closed_at").nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables_sessions")
}
```

### Executar a migration

```bash
npm run knex -- migrate:latest
```

## Variações do padrão

### Sessão com múltiplas FKs (ex: sessão atendida por garçom)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables_sessions", (table) => {
    table.increments("id").primary()
    table
      .integer("table_id")
      .notNullable()
      .references("id")
      .inTable("tables")
    table
      .integer("waiter_id")
      .nullable()
      .references("id")
      .inTable("waiters")
    table.timestamp("opened_at").defaultTo(knex.fn.now())
    table.timestamp("closed_at").nullable()
  })
}
```

### Tabela de sessão com onDelete cascade

```typescript
table
  .integer("table_id")
  .notNullable()
  .references("id")
  .inTable("tables")
  .onDelete("CASCADE")  // ao deletar mesa, deleta sessões
```

### Tabela de sessão com onDelete restrict (mais seguro para produção)

```typescript
table
  .integer("table_id")
  .notNullable()
  .references("id")
  .inTable("tables")
  .onDelete("RESTRICT")  // impede deletar mesa com sessões
```

### Query: encontrar mesas abertas

```typescript
const openSessions = await knex("tables_sessions")
  .whereNull("closed_at")
  .select("*")
```

### Query: fechar uma mesa

```typescript
await knex("tables_sessions")
  .where({ id: sessionId })
  .update({ closed_at: knex.fn.now() })
```

### Query: verificar se mesa específica está aberta

```typescript
const isOpen = await knex("tables_sessions")
  .where({ table_id: tableId })
  .whereNull("closed_at")
  .first()

if (isOpen) {
  throw new Error("Mesa já está aberta")
}
```

## Contexto: migrations anteriores no projeto

### Migration de products (primeira)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary()
    table.text("name").notNullable()
    table.text("description").nullable()
    table.float("price").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}
```

### Migration de tables (segunda)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary()
    table.text("table_number").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}
```

Note que `tables.id` usa `increments()` (integer) — por isso `tables_sessions.table_id` deve ser `integer()`.