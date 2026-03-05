# Code Examples: Criando Tabelas com Knex Migrations

## Exemplo completo da aula

A migration criada pelo instrutor para uma tabela de cursos:

```typescript
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('courses')
}
```

### Anatomia de cada coluna

```typescript
// Coluna 1: ID auto-incremento + chave primaria
table.increments('id').primary()
// increments() = tipo INTEGER com auto-increment
// .primary() = define como PRIMARY KEY

// Coluna 2: Nome do curso, obrigatorio
table.text('name').notNullable()
// text() = tipo TEXT (string longa)
// .notNullable() = NOT NULL constraint

// Coluna 3: Data de criacao com valor padrao automatico
table.timestamp('created_at').defaultTo(knex.fn.now())
// timestamp() = tipo TIMESTAMP/DATETIME
// .defaultTo() = define DEFAULT value
// knex.fn.now() = funcao NOW() do banco
```

## Variacoes de tipos de coluna

### Tipos de texto
```typescript
table.text('description')           // TEXT (ilimitado)
table.string('email', 255)          // VARCHAR(255)
table.string('phone', 20)           // VARCHAR(20)
```

### Tipos numericos
```typescript
table.increments('id')              // INTEGER auto-increment
table.integer('quantity')           // INTEGER
table.float('price', 8, 2)         // FLOAT(8,2)
table.decimal('amount', 10, 2)     // DECIMAL(10,2)
```

### Tipos de data/hora
```typescript
table.timestamp('created_at')       // TIMESTAMP
table.datetime('scheduled_for')     // DATETIME
table.date('birth_date')           // DATE
```

### Tipos booleanos
```typescript
table.boolean('active').defaultTo(true)
table.boolean('deleted').defaultTo(false)
```

## Variacoes de restricoes

```typescript
// Obrigatorio
table.text('name').notNullable()

// Com valor padrao
table.boolean('active').defaultTo(true)
table.integer('views').defaultTo(0)

// Unico
table.string('email').unique()

// Combinando restricoes
table.string('slug').notNullable().unique()
```

## Exemplo expandido: tabela de usuarios

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable().unique()
    table.text('password_hash').notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
```

## Comando para executar

```bash
# Executar todas as migrations pendentes
npm run knex -- migrate:latest

# Desfazer a ultima migration (executa o down)
npm run knex -- migrate:rollback
```

O instrutor demonstrou que ao rodar `migrate:latest`, o banco SQLite e criado automaticamente se nao existir. O arquivo `.db` aparece no diretorio do projeto.