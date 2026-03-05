# Code Examples: Migrations com Knex

## Exemplo 1: Migration completa de criacao de tabela

Direto da aula — a tabela `transactions` com todos os campos:

```typescript
// 20230101120000_create-transactions.ts
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions')
}
```

## Exemplo 2: Migration de alteracao — adicionar coluna

Adiciona `session_id` com indice na tabela `transactions`:

```typescript
// 20230101130000_add-session-id-to-transactions.ts
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}
```

## Exemplo 3: Fluxo de correcao local (rollback + editar)

Quando a migration ainda NAO foi compartilhada:

```bash
# 1. Parar o servidor
# 2. Desfazer a migration
npm run knex -- migrate:rollback

# 3. Editar o arquivo da migration (adicionar/corrigir campos)

# 4. Re-executar
npm run knex -- migrate:latest
```

## Exemplo 4: Tipos de coluna comuns no Knex

```typescript
// Referencia dos tipos usados na aula
table.uuid('id').primary()           // UUID como PK
table.increments('id')               // Auto-increment (evitar)
table.text('title')                  // Campo texto
table.decimal('amount', 10, 2)       // Decimal com precisao
table.timestamp('created_at')        // Timestamp
table.uuid('session_id').index()     // UUID com indice
```

## Exemplo 5: Metodos do schema disponíveis

```typescript
// Criar tabela
knex.schema.createTable('nome', (table) => { ... })

// Alterar tabela
knex.schema.alterTable('nome', (table) => { ... })

// Dropar tabela
knex.schema.dropTable('nome')

// Outros mencionados na aula:
// knex.schema.createSchema()
// knex.schema.createView()
// knex.schema.renameTable()
```

## Exemplo 6: Constraints e modificadores

```typescript
table.text('title').notNullable()                              // Obrigatorio
table.timestamp('created_at').defaultTo(knex.fn.now())         // Default
table.uuid('session_id').after('id').index()                   // Posicao + indice
table.uuid('id').primary()                                     // Chave primaria
```

## Comandos CLI do Knex

```bash
# Criar nova migration
npx knex migrate:make create-transactions

# Executar todas as migrations pendentes
npx knex migrate:latest

# Desfazer ultima batch
npx knex migrate:rollback
```