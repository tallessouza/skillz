# Code Examples: Criando Migrations de Produtos com Knex.js

## Exemplo 1: Migration completa da aula

Este e o codigo exato construido durante a aula:

```typescript
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.decimal('price').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('product')
}
```

## Exemplo 2: Variacao — tabela de categorias

Aplicando o mesmo padrao para outra entidade:

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('category', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('category')
}
```

## Exemplo 3: Variacao — tabela com foreign key

Produto pertencendo a uma categoria:

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.decimal('price').notNullable()
    table.integer('category_id').references('id').inTable('category')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('product')
}
```

## Exemplo 4: Comando para executar

```bash
# Executar todas as migrations pendentes
npx knex migrate:latest

# Reverter a ultima migration
npx knex migrate:rollback

# Criar uma nova migration
npx knex migrate:make nome_da_migration
```

## Exemplo 5: Tipos de coluna comuns no Knex

```typescript
table.increments('id')              // INTEGER auto-incremento + PK
table.text('name')                  // TEXT sem limite
table.string('email', 255)          // VARCHAR(255)
table.decimal('price', 10, 2)       // DECIMAL com precisao
table.integer('quantity')           // INTEGER
table.boolean('is_active')          // BOOLEAN
table.timestamp('created_at')       // TIMESTAMP
table.date('birth_date')            // DATE
table.json('metadata')              // JSON
```