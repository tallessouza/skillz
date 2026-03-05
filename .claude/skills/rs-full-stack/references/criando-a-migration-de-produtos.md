---
name: rs-full-stack-migration-produtos
description: "Applies Knex.js migration patterns when creating database tables for products or similar entities. Use when user asks to 'create a migration', 'create a table', 'add a product table', 'setup database schema with Knex', or 'write a migration file'. Enforces correct column types, auto-increment primary keys, timestamps with defaultTo(knex.fn.now()), decimal for prices, and proper up/down structure. Make sure to use this skill whenever generating Knex migrations. Not for Prisma, TypeORM, Drizzle, or raw SQL migrations."
---

# Criando Migrations de Produtos com Knex.js

> Toda migration Knex segue o padrao up (cria) / down (desfaz), com tipos de coluna corretos e timestamps automaticos.

## Rules

1. **Use `increments` para primary key** — `table.increments('id').primary()`, porque o auto-incremento elimina a necessidade de gerar IDs manualmente ao inserir registros
2. **Use `decimal` para precos** — `table.decimal('price')`, porque valores monetarios tem casas decimais (ex: 10.75) e integer truncaria
3. **Use `notNullable` em campos obrigatorios** — `table.text('name').notNullable()`, porque campos sem restricao aceitam null silenciosamente e corrompem dados
4. **Timestamps com `defaultTo(knex.fn.now())`** — porque o banco preenche automaticamente a data/hora atual, sem depender da aplicacao
5. **`down` sempre desfaz o `up`** — se up cria tabela, down faz `dropTable`, porque migrations precisam ser reversiveis
6. **Execute com `npx knex migrate:latest`** — para aplicar todas as migrations pendentes no banco

## How to write

### Migration completa de produto

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

### Padrao de timestamps reutilizavel

```typescript
// created_at e updated_at recebem o mesmo valor na criacao
// updated_at muda quando o registro e atualizado
table.timestamp('created_at').defaultTo(knex.fn.now())
table.timestamp('updated_at').defaultTo(knex.fn.now())
```

## Example

**Before (erros comuns):**
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product', (table) => {
    table.integer('id')           // sem auto-incremento
    table.string('name')          // permite null
    table.integer('price')        // trunca decimais
    table.timestamp('created_at') // sem valor default
  })
}
// sem funcao down
```

**After (com este skill aplicado):**
```typescript
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo monetario (preco, valor, saldo) | `table.decimal('price')` |
| Identificador unico | `table.increments('id').primary()` |
| Campo de texto obrigatorio | `table.text('name').notNullable()` |
| Rastreio temporal | `table.timestamp('created_at').defaultTo(knex.fn.now())` |
| Executar migration | `npx knex migrate:latest` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `table.integer('id')` | `table.increments('id').primary()` |
| `table.integer('price')` | `table.decimal('price')` |
| `table.timestamp('created_at')` sem default | `table.timestamp('created_at').defaultTo(knex.fn.now())` |
| Migration sem funcao `down` | `down` com `dropTable` correspondente |
| `table.string('name')` sem restricao | `table.text('name').notNullable()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-a-migration-de-produtos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-a-migration-de-produtos/references/code-examples.md)
