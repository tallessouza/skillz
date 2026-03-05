# Code Examples: Revertendo Migrations (Knex)

## Migration de referencia usada na aula

A migration que o instrutor usou como exemplo adiciona a coluna `updated_at` na tabela `courses`:

```typescript
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('updated_at')
  })
}
```

## Sequencia completa de comandos da aula

### Listar migrations

```bash
npm run knex -- migrate:list
```

Saida esperada:
```
Found 2 Migrations:
  ✓ 20240115_create_courses.ts
  ✓ 20240116_add_updated_at_to_courses.ts
```

### Desfazer migration especifica

```bash
npm run knex -- migrate:down 20240116_add_updated_at_to_courses.ts
```

Saida esperada:
```
Using environment: development
migration file "20240116_add_updated_at_to_courses.ts" was successfully reverted.
```

### Reexecutar todas as migrations pendentes

```bash
npm run knex -- migrate:latest
```

### Rollback do ultimo batch

```bash
npm run knex -- migrate:rollback
```

Saida esperada:
```
Batch 2 rolled back: 1 migrations
```

### Rollback completo

```bash
npm run knex -- migrate:rollback --all
```

Saida esperada:
```
Batch 2 rolled back: 1 migrations
Batch 1 rolled back: 1 migrations
```

Apos isso, a tabela `knex_migrations` fica vazia e as tabelas criadas pelas migrations sao removidas.

### Reconstruir tudo

```bash
npm run knex -- migrate:latest
```

## Variacoes de configuracao do script npm

Se o projeto usa scripts npm customizados:

```json
{
  "scripts": {
    "knex": "knex --knexfile knexfile.ts",
    "knex-migrate:list": "knex migrate:list",
    "knex-migrate:latest": "knex migrate:latest",
    "knex-migrate:rollback": "knex migrate:rollback",
    "knex-migrate:down": "knex migrate:down"
  }
}
```

Uso com script customizado:
```bash
npm run knex-migrate:down -- 20240116_add_updated_at_to_courses.ts
```

## Exemplo de migration que cria tabela (para contraste)

```typescript
import type { Knex } from 'knex'

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

Quando essa migration e revertida com `migrate:down` ou `rollback`, a tabela inteira e removida — incluindo todos os dados.

## Consultando a tabela de controle

```sql
SELECT * FROM knex_migrations;
```

Resultado tipico:
```
| id | name                                     | batch | migration_time          |
|----|------------------------------------------|-------|-------------------------|
| 1  | 20240115_create_courses.ts                | 1     | 2024-01-15 10:00:00.000 |
| 2  | 20240116_add_updated_at_to_courses.ts     | 1     | 2024-01-15 10:00:00.000 |
```

Apos `rollback --all`, essa tabela fica vazia.