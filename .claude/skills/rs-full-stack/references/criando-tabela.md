---
name: rs-full-stack-criando-tabela
description: "Applies Knex.js migration patterns when creating database tables with schema builder. Use when user asks to 'create a migration', 'create a table', 'add columns', 'setup database schema', or 'write knex migration'. Enforces correct up/down structure, column types, constraints, and default values using Knex schema builder API. Make sure to use this skill whenever generating Knex migrations or database table definitions. Not for raw SQL queries, Prisma, Drizzle, or other ORMs."
---

# Criando Tabelas com Knex Migrations

> Toda migration define `up` para criar e `down` para desfazer — ambas devem ser simétricas e completas.

## Rules

1. **Sempre implemente `up` E `down`** — `up` cria a tabela, `down` faz `dropTable` com o mesmo nome, porque migrations devem ser reversiveis
2. **Use `schema.createTable` no `up`** — nunca SQL raw para criacao de tabelas, porque o schema builder e portavel entre bancos
3. **Use `schema.dropTable` no `down`** — o `down` deve desfazer exatamente o que o `up` fez, porque consistencia garante rollback seguro
4. **Nomes de tabelas no plural** — `courses`, `users`, `transactions`, porque representa colecoes de registros
5. **Chave primaria sempre auto-incremento** — `table.increments('id').primary()`, porque e o padrao mais comum e seguro
6. **Campos obrigatorios usam `.notNullable()`** — explicite a restricao, porque o default do SQL permite null
7. **Timestamps com `defaultTo(knex.fn.now())`** — campos como `created_at` nao devem depender do usuario, porque o banco gera automaticamente

## How to write

### Estrutura basica de migration

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

### Tipos de coluna comuns

```typescript
table.increments('id').primary()        // INTEGER auto-increment + PK
table.text('name').notNullable()         // TEXT obrigatorio
table.integer('age')                     // INTEGER nullable
table.boolean('active').defaultTo(true)  // BOOLEAN com default
table.timestamp('created_at').defaultTo(knex.fn.now()) // TIMESTAMP automatico
```

## Example

**Before (migration incompleta):**
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('course', (table) => {
    table.integer('id')
    table.text('name')
  })
}

export async function down(knex: Knex): Promise<void> {
  // TODO
}
```

**After (com this skill applied):**
```typescript
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova tabela no banco | Migration com `createTable` + `dropTable` |
| Campo que usuario nao preenche | `defaultTo()` com valor automatico |
| Campo obrigatorio | Encadear `.notNullable()` |
| Identificador unico | `increments('id').primary()` |
| Data de criacao | `timestamp('created_at').defaultTo(knex.fn.now())` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `table.integer('id')` sem PK | `table.increments('id').primary()` |
| `down` vazio ou com TODO | `knex.schema.dropTable('table_name')` |
| Nome de tabela no singular `course` | Plural `courses` |
| `created_at` sem default | `.defaultTo(knex.fn.now())` |
| SQL raw para criar tabela | `knex.schema.createTable()` |

## Executar migrations

```bash
npm run knex -- migrate:latest    # Executa todas as migrations pendentes
npm run knex -- migrate:rollback  # Desfaz a ultima migration (chama down)
```

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre up/down, simetria de migrations e ciclo de vida
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes de tipos de coluna

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-tabela/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-tabela/references/code-examples.md)
