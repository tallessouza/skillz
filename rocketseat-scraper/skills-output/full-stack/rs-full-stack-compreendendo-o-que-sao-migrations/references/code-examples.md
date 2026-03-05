# Code Examples: Compreendendo Migrations

> Nota: Esta aula e conceitual — o instrutor nao mostra codigo. Os exemplos abaixo ilustram os conceitos usando Knex.js (Query Builder usado no curso full-stack da Rocketseat).

## Exemplo 1: Criando uma tabela (Migration Up/Down)

```typescript
// migrations/20240101_create_products.ts
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.integer('price_in_cents').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products')
}
```

**Conceitos aplicados:**
- `up()` — o que a migration faz ao ser aplicada
- `down()` — o que acontece no rollback (desfaz o up)
- Metodos do Query Builder em vez de SQL direto
- Nome da tabela, colunas, tipos, nullable, chave primaria

## Exemplo 2: Modificando uma tabela existente

```typescript
// migrations/20240115_add_category_to_products.ts
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.text('category').defaultTo('general')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('category')
  })
}
```

**Conceito:** Nao editar a migration original. Criar nova migration para alteracoes.

## Exemplo 3: Criando tabela de fornecedores (outro dev)

```typescript
// migrations/20240110_create_suppliers.ts
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('suppliers', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('contact_email')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('suppliers')
}
```

## Timeline resultante

```
20240101_create_products      → Tabela products criada
20240110_create_suppliers     → Tabela suppliers criada (outro dev)
20240115_add_category         → Coluna category em products
```

## Comandos tipicos de migration

```bash
# Aplicar todas migrations pendentes (up)
npx knex migrate:latest

# Desfazer ultima migration (rollback)
npx knex migrate:rollback

# Desfazer TODAS migrations
npx knex migrate:rollback --all

# Ver status das migrations
npx knex migrate:status

# Criar nova migration
npx knex migrate:make create_products
```

## SQL gerado pelo Query Builder (o que voce NAO escreve)

O Query Builder gera automaticamente:

```sql
-- Para PostgreSQL:
CREATE TABLE "products" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "price_in_cents" integer NOT NULL,
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Para SQLite:
CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `name` text NOT NULL,
  `price_in_cents` integer NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
);
```

**Conceito:** Mesmo codigo TypeScript, SQL diferente por banco. O Query Builder resolve.