# Code Examples: Criando Relacionamentos com Knex.js

## Exemplo 1: Migration completa da aula

```typescript
// migrations/XXXXXX_create-course-modules.js

export async function up(knex) {
  await knex.schema.createTable('course_modules', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.integer('course_id')
      .references('id')
      .inTable('courses')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('course_modules')
}
```

## Exemplo 2: Criando a migration via CLI

```bash
# Criar o arquivo de migration
npm run knex migrate:make create-course-modules

# Executar todas as migrations pendentes
npm run knex migrate:latest
```

## Exemplo 3: Variacoes de relacionamento

### Com onDelete cascade

```typescript
table.integer('course_id')
  .references('id')
  .inTable('courses')
  .onDelete('CASCADE')  // ao deletar o curso, deleta os modulos
```

### Com onDelete set null

```typescript
table.integer('course_id')
  .references('id')
  .inTable('courses')
  .onDelete('SET NULL')  // ao deletar o curso, course_id vira null
```

### FK notNullable (modulo DEVE ter curso)

```typescript
table.integer('course_id')
  .notNullable()
  .references('id')
  .inTable('courses')
```

## Exemplo 4: Relacionamento com UUID

Se a tabela referenciada usa UUID em vez de increments:

```typescript
// Tabela pai
await knex.schema.createTable('courses', (table) => {
  table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
  table.text('name').notNullable()
})

// Tabela filha — FK tambem deve ser uuid
await knex.schema.createTable('course_modules', (table) => {
  table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
  table.text('name').notNullable()
  table.uuid('course_id')      // uuid, nao integer!
    .references('id')
    .inTable('courses')
})
```

## Exemplo 5: Multiplos relacionamentos na mesma tabela

```typescript
await knex.schema.createTable('lessons', (table) => {
  table.increments('id').primary()
  table.text('title').notNullable()
  
  table.integer('course_id')
    .references('id')
    .inTable('courses')
  
  table.integer('module_id')
    .references('id')
    .inTable('course_modules')
})
```

## Exemplo 6: Verificando o relacionamento no banco

```sql
-- Listar todas as foreign keys de uma tabela (PostgreSQL)
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'course_modules';
```