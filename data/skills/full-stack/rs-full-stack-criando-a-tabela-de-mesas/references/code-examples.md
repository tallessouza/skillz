# Code Examples: Criando a Tabela de Mesas

## Exemplo 1: Migration completa da aula

```typescript
// database/migrations/XXXXXX_create_tables.ts

export async function up(knex) {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary()
    table.integer("table_number").notNullable()
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTable("tables")
}
```

## Exemplo 2: Comandos CLI utilizados

```bash
# Criar a migration
npm run knex -- migrate:make create_tables

# Executar todas as migrations pendentes
npm run knex -- migrate:latest

# Reverter a ultima migration (usa o metodo down)
npm run knex -- migrate:rollback
```

## Exemplo 3: Variacao — tabela com mais campos de dominio

```typescript
export async function up(knex) {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary()
    table.integer("table_number").notNullable()
    table.integer("seats").notNullable().defaultTo(4)
    table.text("location").nullable() // "varanda", "salao", "terraco"
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTable("tables")
}
```

## Exemplo 4: Verificacao pos-migration

```sql
-- Confirmar que a tabela foi criada
SELECT * FROM tables;

-- Ver estrutura da tabela (SQLite)
PRAGMA table_info(tables);

-- Ver estrutura da tabela (PostgreSQL)
\d tables
```

## Exemplo 5: Padrao de timestamps reutilizavel

```typescript
// Helper para adicionar timestamps padrao em qualquer migration
function addTimestamps(table) {
  table.timestamp("created_at").nullable().defaultTo(knex.fn.now())
  table.timestamp("updated_at").nullable().defaultTo(knex.fn.now())
}

// Uso:
export async function up(knex) {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary()
    table.integer("table_number").notNullable()
    addTimestamps(table)
  })
}
```

## Exemplo 6: Padrao up/down para diferentes operacoes

```typescript
// Criar tabela → Deletar tabela
up: createTable("tables", ...) → down: dropTable("tables")

// Adicionar coluna → Remover coluna
up: table.integer("capacity") → down: table.dropColumn("capacity")

// Renomear coluna → Renomear de volta
up: renameColumn("old", "new") → down: renameColumn("new", "old")
```