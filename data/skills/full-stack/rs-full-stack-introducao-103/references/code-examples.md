# Code Examples: Query Builder — Fundamentos

## Setup basico (Knex.js como referencia)

```typescript
import knex from 'knex'

const db = knex({
  client: 'pg', // ou 'sqlite3', 'mysql2'
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'secret',
    database: 'myapp',
  },
})
```

## CRUD Completo

### Select (leitura)

```typescript
// Todos os registros
const allUsers = await db('users').select('*')

// Com filtro
const activeUsers = await db('users')
  .select('id', 'name', 'email')
  .where('active', true)

// Com ordenacao e limite
const recentUsers = await db('users')
  .select('id', 'name')
  .orderBy('created_at', 'desc')
  .limit(10)

// Com condicoes compostas
const filteredUsers = await db('users')
  .where('active', true)
  .andWhere('role', 'admin')
  .orWhere('role', 'superadmin')
```

### Insert (criacao)

```typescript
// Inserir um registro
await db('users').insert({
  name: 'Maria',
  email: 'maria@email.com',
  active: true,
})

// Inserir e retornar o ID
const [userId] = await db('users')
  .insert({
    name: 'Maria',
    email: 'maria@email.com',
  })
  .returning('id')

// Inserir multiplos registros
await db('users').insert([
  { name: 'Ana', email: 'ana@email.com' },
  { name: 'Pedro', email: 'pedro@email.com' },
])
```

### Update (atualizacao)

```typescript
// Atualizar com condicao
await db('users')
  .where('id', userId)
  .update({ name: 'Maria Silva', active: false })

// Atualizar multiplos registros
await db('users')
  .where('active', false)
  .update({ deleted_at: new Date() })
```

### Delete (remocao)

```typescript
// Remover com condicao
await db('users').where('id', userId).delete()

// Soft delete (preferivel)
await db('users')
  .where('id', userId)
  .update({ deleted_at: new Date() })
```

## Migration — Exemplo completo

```typescript
// migrations/20240101_create_users.ts
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
```

## Seed — Exemplo completo

```typescript
// seeds/01_users.ts
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Limpa a tabela antes de popular
  await knex('users').del()

  // Insere dados iniciais
  await knex('users').insert([
    { name: 'Admin', email: 'admin@app.com', active: true },
    { name: 'Test User', email: 'test@app.com', active: true },
    { name: 'Inactive', email: 'old@app.com', active: false },
  ])
}
```

## Comparacao lado a lado: SQL vs Query Builder

| Operacao | SQL | Query Builder |
|----------|-----|---------------|
| Select all | `SELECT * FROM users` | `db('users').select('*')` |
| Select com where | `SELECT name FROM users WHERE active = true` | `db('users').select('name').where('active', true)` |
| Insert | `INSERT INTO users (name) VALUES ('Ana')` | `db('users').insert({ name: 'Ana' })` |
| Update | `UPDATE users SET active = false WHERE id = 1` | `db('users').where('id', 1).update({ active: false })` |
| Delete | `DELETE FROM users WHERE id = 1` | `db('users').where('id', 1).delete()` |
| Order + Limit | `SELECT * FROM users ORDER BY name LIMIT 10` | `db('users').orderBy('name').limit(10)` |