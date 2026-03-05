---
name: rs-full-stack-migration-alterar-tabela
description: "Applies Knex migration patterns for altering existing database tables when writing migrations, schema changes, or adding columns. Use when user asks to 'add a column', 'alter table', 'create migration', 'modify schema', or 'update database structure'. Enforces alter vs create separation, proper up/down symmetry, and column positioning. Make sure to use this skill whenever generating Knex migrations that modify existing tables. Not for creating new tables, seed files, or query building."
---

# Criando Migration para Alterar Tabela

> Migrations nao servem apenas para criar tabelas — use `alterTable` para modificar tabelas existentes, sempre com rollback simetrico no `down`.

## Rules

1. **Use `alterTable` para modificar tabelas existentes** — `createTable` cria, `alterTable` modifica, porque misturar os dois causa erros silenciosos em rollback
2. **Sempre desfaca no `down` o que o `up` faz** — se `up` adiciona coluna, `down` remove com `dropColumn`, porque migrations sem rollback simetrico quebram o fluxo de deploy
3. **Posicione colunas explicitamente com `.after()`** — `table.timestamp('updated_at').after('created_at')`, porque ordem logica das colunas facilita leitura do schema
4. **Use `knex.fn.now()` como default para timestamps** — porque valores default garantem consistencia sem depender da aplicacao
5. **Nomeie migrations descritivamente** — `add-updated-at-courses` nao `fix-table`, porque o nome aparece no historico de migrations e precisa ser autoexplicativo

## How to write

### Migration para adicionar coluna

```typescript
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

### Criando a migration via CLI

```bash
npm run knex -- migrate:make add-updated-at-courses
```

### Executando a migration

```bash
npm run knex -- migrate:latest
```

## Example

**Before (errado — usando createTable para alterar):**
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('courses', (table) => {
    table.timestamp('updated_at')
  })
}
```

**After (correto — usando alterTable):**
```typescript
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Esqueceu uma coluna na criacao original | Nova migration com `alterTable`, nunca edite a migration antiga |
| Precisa de ordem especifica de colunas | Use `.after('column_name')` |
| Coluna timestamp precisa de valor padrao | Use `.defaultTo(knex.fn.now())` |
| Precisa remover coluna | `alterTable` com `dropColumn` no `up`, re-adicionar no `down` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Editar migration ja executada | Criar nova migration para alterar |
| `createTable` para adicionar coluna | `alterTable` com a coluna nova |
| `down` vazio em migration de alteracao | `down` com `dropColumn` simetrico |
| Migration sem nome descritivo | `add-{coluna}-{tabela}` como nome |
| Timestamp sem default | `.defaultTo(knex.fn.now())` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-migration-para-alterar-tabela/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-migration-para-alterar-tabela/references/code-examples.md)
