---
name: rs-node-js-2023-criando-tabela-de-transacoes
description: "Enforces Knex migration patterns when creating or altering database tables in Node.js. Use when user asks to 'create a migration', 'add a column', 'create a table', 'alter table', 'rollback migration', or 'setup database schema'. Applies rules: always pair up/down methods, use UUID over auto-increment, use knex.fn.now() for timestamps, never edit shipped migrations. Make sure to use this skill whenever generating Knex migration code or discussing database schema changes. Not for Prisma, TypeORM, Sequelize, or raw SQL migrations."
---

# Migrations com Knex

> Toda migration tem up (executa) e down (desfaz) — o down faz o inverso exato do up.

## Rules

1. **Sempre implemente up E down** — `up` cria/altera, `down` desfaz exatamente o inverso, porque rollback depende disso
2. **Use UUID como chave primaria** — `table.uuid('id').primary()` em vez de `table.increments()`, porque IDs sequenciais sao previsíveis e inseguros
3. **Use `knex.fn.now()` para timestamps** — nunca `CURRENT_TIMESTAMP` ou `NOW()` literal, porque cada banco tem sintaxe diferente e Knex abstrai isso
4. **Nunca edite migration ja compartilhada** — se ja foi para o time ou producao, crie uma nova migration para corrigir, porque o Knex marca migrations executadas e nao re-executa
5. **Nomeie migrations descritivamente** — `create-transactions`, `add-session-id-to-transactions`, porque o nome documenta a intencao
6. **Marque campos obrigatorios com `.notNullable()`** — explicite a constraint, porque o default pode variar entre bancos

## How to write

### Criar tabela

```typescript
export async function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('transactions')
}
```

### Alterar tabela (adicionar coluna)

```typescript
export async function up(knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}
```

## Example

**Before (erros comuns):**
```typescript
export async function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id')  // auto-increment inseguro
    table.text('title')     // nullable por default
    table.timestamp('created_at').defaultTo('CURRENT_TIMESTAMP') // literal SQL
  })
}
// sem metodo down
```

**After (com esta skill):**
```typescript
export async function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('transactions')
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criar tabela nova | `createTable` no up, `dropTable` no down |
| Adicionar coluna | `alterTable` + coluna no up, `dropColumn` no down |
| Remover coluna | `dropColumn` no up, recriar coluna no down |
| Campo sera usado em WHERE frequente | Adicione `.index()` |
| Campo numerico com decimais | Use `decimal(precisao, escala)` — ex: `decimal(10, 2)` |
| Migration com erro ja compartilhada | Crie nova migration corrigindo, nunca edite a original |
| Migration com erro ainda local | `migrate:rollback`, edite, `migrate:latest` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `table.increments('id')` | `table.uuid('id').primary()` |
| `.defaultTo('CURRENT_TIMESTAMP')` | `.defaultTo(knex.fn.now())` |
| `up` sem `down` correspondente | Sempre implemente ambos |
| Editar migration ja enviada | Criar nova migration |
| `table.text('title')` sem constraint | `table.text('title').notNullable()` |

## Comandos

| Comando | Funcao |
|---------|--------|
| `npx knex migrate:make nome-da-migration` | Criar nova migration |
| `npx knex migrate:latest` | Executar todas as migrations pendentes |
| `npx knex migrate:rollback` | Desfazer ultima batch de migrations |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
