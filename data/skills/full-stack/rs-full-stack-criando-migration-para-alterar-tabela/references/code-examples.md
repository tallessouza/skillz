# Code Examples: Criando Migration para Alterar Tabela

## Exemplo da aula — Adicionar `updated_at` na tabela courses

### Criando a migration

```bash
npm run knex -- migrate:make add-updated-at-courses
```

### Codigo da migration

```typescript
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.timestamp('updated_at').defaultTo(knex.fn.now()).after('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('updated_at')
  })
}
```

### Executando

```bash
npm run knex -- migrate:latest
```

---

## Variacoes comuns

### Adicionar coluna string com restricao

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('phone', 20).nullable().after('email')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('phone')
  })
}
```

### Adicionar multiplas colunas

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.decimal('weight', 8, 2).nullable()
    table.string('sku', 50).unique().notNullable()
    table.boolean('is_active').defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('weight')
    table.dropColumn('sku')
    table.dropColumn('is_active')
  })
}
```

### Remover coluna (inverso)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('deprecated_field')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.string('deprecated_field', 255).nullable()
  })
}
```

### Adicionar foreign key em tabela existente

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.integer('category_id').unsigned().references('id').inTable('categories').after('name')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('category_id')
  })
}
```

### Renomear coluna

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.renameColumn('title', 'name')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.renameColumn('name', 'title')
  })
}
```

### Alterar tipo de coluna existente

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.text('description').alter() // string → text
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.string('description', 255).alter() // text → string
  })
}
```