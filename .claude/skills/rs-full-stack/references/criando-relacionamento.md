---
name: rs-full-stack-criando-relacionamento
description: "Enforces correct foreign key relationship patterns when creating Knex.js migrations with table relationships. Use when user asks to 'create a migration', 'add foreign key', 'create relationship', 'relate tables', or 'create a new table with references'. Applies rules: foreign key type must match primary key type, use .references().inTable() chain, always include down migration. Make sure to use this skill whenever generating Knex migrations that involve table relationships. Not for Prisma, TypeORM, or other ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: knex-migrations
  tags: [knex, migrations, foreign-key, relationships, database]
---

# Criando Relacionamentos com Knex.js

> Ao criar relacionamentos entre tabelas, a chave estrangeira deve ter o mesmo tipo de dado da chave primaria referenciada, e a referencia deve ser explicita via .references().inTable().

## Rules

1. **Tipo da FK = tipo da PK** — se o `id` da tabela referenciada e `increments()` (integer), a FK deve ser `integer()`, porque tipos incompativeis causam erros silenciosos ou falhas de constraint
2. **Use a cadeia .references().inTable()** — declare explicitamente qual coluna e qual tabela a FK referencia, porque isso cria a constraint no banco e permite visualizacao do relacionamento
3. **Nomeie a FK como `{tabela_singular}_id`** — `course_id`, `user_id`, `module_id`, porque segue a convencao universal e torna o relacionamento auto-documentado
4. **Sempre implemente o down** — use `dropTable` no down para reverter a migration, porque migrations sem down quebram rollbacks
5. **Declare .notNullable() em colunas obrigatorias** — nome, titulo e campos de dominio nao devem aceitar nulo, porque dados incompletos corrompem a integridade

## How to write

### Migration com relacionamento

```typescript
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

### Cadeia de referencia

```typescript
// A FK aponta para a PK da outra tabela
table.integer('course_id')    // mesmo tipo do id (increments = integer)
  .references('id')            // coluna referenciada
  .inTable('courses')          // tabela referenciada
```

## Example

**Before (erro comum — tipo incompativel e sem referencia):**
```typescript
await knex.schema.createTable('course_modules', (table) => {
  table.increments('id')
  table.text('name')
  table.text('course_id') // ERRADO: text != integer
})
```

**After (com esta skill aplicada):**
```typescript
await knex.schema.createTable('course_modules', (table) => {
  table.increments('id').primary()
  table.text('name').notNullable()
  table.integer('course_id')  // integer = mesmo tipo do increments
    .references('id')
    .inTable('courses')
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Tabela referenciada usa `increments()` | FK deve ser `integer()` |
| Tabela referenciada usa `uuid()` | FK deve ser `uuid()` |
| Relacao 1:N (curso tem muitos modulos) | FK fica na tabela "muitos" (course_modules) |
| Precisa verificar tipo da PK | Consulte a migration original ou inspecione o banco |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `table.text('course_id')` (tipo errado) | `table.integer('course_id').references('id').inTable('courses')` |
| FK sem `.references().inTable()` | Sempre declare a cadeia completa de referencia |
| Migration sem `down` | `await knex.schema.dropTable('nome_tabela')` |
| `table.integer('curso')` (nome generico) | `table.integer('course_id')` (convencao `{tabela}_id`) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro ao rodar migration com FK | Tipo da FK diferente do tipo da PK referenciada | Use `integer()` se a PK e `increments()`, `uuid()` se a PK e `uuid()` |
| Tabela referenciada nao existe | Migration da tabela pai nao rodou ainda | Verifique a ordem das migrations; a tabela pai deve existir primeiro |
| Rollback falha com erro de constraint | Tabela filha tem registros referenciando a tabela pai | Delete registros dependentes antes do rollback ou adicione `onDelete('CASCADE')` |
| Relacionamento nao aparece no Beekeeper | FK sem `.references().inTable()` | Adicione a cadeia completa de referencia na coluna FK |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre chaves estrangeiras, tipos de dados e visualizacao no Beekeeper
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes