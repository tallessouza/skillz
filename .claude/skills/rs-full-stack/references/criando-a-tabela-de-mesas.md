---
name: rs-full-stack-criando-tabela-de-mesas
description: "Generates Knex migration files for restaurant table management schemas. Use when user asks to 'create a migration', 'add a tables table', 'create mesa schema', 'restaurant table management', or 'knex migration for tables'. Applies patterns: incremental primary key, not-null constraints, timestamps with defaultTo(knex.fn.now()), and proper rollback with dropTable. Make sure to use this skill whenever generating Knex migrations for entity tables with numeric identifiers. Not for seed files, query building, or non-Knex ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-knex
  tags: [knex, migration, database, schema, restaurant]
---

# Criando Migration de Tabelas (Mesas)

> Toda migration define uma transformacao (up) e sua reversao (down), garantindo que o schema seja versionado e reversivel.

## Rules

1. **Use `increments` para IDs** — gera auto-increment + primary key em uma unica chamada, porque elimina a necessidade de `.primary()` separado
2. **Aplique `.notNullable()` em campos obrigatorios** — `table_number` nao pode ser nulo, porque mesa sem numero nao tem significado no dominio
3. **Use `timestamp` com `defaultTo(knex.fn.now())`** — para `created_at` e `updated_at`, porque elimina a necessidade do cliente informar datas manualmente
4. **Marque timestamps como `.nullable()`** — o valor default preenche automaticamente, entao o campo nao precisa ser exigido na insercao
5. **Implemente sempre o `down`** — use `dropTable` para reverter a migration, porque migrations sem rollback quebram o fluxo de desenvolvimento
6. **Nomeie a migration com prefixo descritivo** — `create_tables` indica criacao, porque facilita identificar o proposito no historico de migrations

## How to write

### Migration completa para tabela de mesas

```typescript
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

## Example

**Before (migration incompleta):**
```typescript
export async function up(knex) {
  await knex.schema.createTable("tables", (table) => {
    table.integer("id")
    table.integer("table_number")
    table.timestamp("created_at")
  })
}
// sem metodo down
```

**After (com esta skill aplicada):**
```typescript
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo e identificador unico | `increments("id").primary()` |
| Campo obrigatorio do dominio | `.notNullable()` |
| Campo de data automatica | `.nullable().defaultTo(knex.fn.now())` |
| Reverter criacao de tabela | `dropTable("nome_tabela")` no `down` |
| Gerar migration via CLI | `npm run knex -- migrate:make create_nome` |
| Executar migrations | `npm run knex -- migrate:latest` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `table.integer("id")` sem primary key | `table.increments("id").primary()` |
| Migration sem metodo `down` | `down` com `dropTable` correspondente |
| `created_at` sem valor default | `.defaultTo(knex.fn.now())` |
| `table_number` sem `.notNullable()` | `.notNullable()` em campos obrigatorios |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `table already exists` ao rodar migration | Migration ja foi aplicada anteriormente | Execute `npx knex migrate:rollback` antes ou verifique com `migrate:status` |
| `table_number` aceita null mesmo com `.notNullable()` | Migration antiga ainda aplicada sem a restricao | Rollback e re-execute a migration atualizada |
| `knex.fn.now()` gera formato de data inesperado | Comportamento varia por banco (SQLite vs PostgreSQL) | Verifique a documentacao do driver do banco em uso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre migrations, timestamps e rollback
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes