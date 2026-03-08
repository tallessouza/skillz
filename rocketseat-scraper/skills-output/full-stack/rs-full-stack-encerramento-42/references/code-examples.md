# Code Examples: Query Builder — Resumo do Módulo

## SQL puro vs Query Builder (Knex)

### Consulta simples

**SQL puro (vulnerável):**
```javascript
// Perigoso — concatenação de string abre porta para SQL injection
const result = await db.raw(`SELECT * FROM users WHERE name = '${name}'`)
```

**Com Knex (seguro por padrão):**
```javascript
// Parâmetros são escapados automaticamente
const users = await knex('users').where({ name })
```

### Inserção de dados

**SQL puro:**
```sql
INSERT INTO users (name, email) VALUES ('João', 'joao@email.com');
```

**Com Knex:**
```javascript
await knex('users').insert({
  name: 'João',
  email: 'joao@email.com'
})
```

### Query dinâmica com composição condicional

**SQL puro (difícil de compor):**
```javascript
let query = 'SELECT * FROM products WHERE 1=1'
if (category) query += ` AND category = '${category}'`
if (minPrice) query += ` AND price >= ${minPrice}`
// Vulnerável e difícil de manter
```

**Com Knex (composição natural):**
```javascript
const query = knex('products')

if (category) {
  query.where({ category })
}

if (minPrice) {
  query.where('price', '>=', minPrice)
}

const products = await query
```

## Migrations — Estrutura básica

### Criar tabela
```javascript
// migrations/20240101_create_users.js
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
```

### Adicionar coluna
```javascript
// migrations/20240201_add_role_to_users.js
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('role').defaultTo('user')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('role')
  })
}
```

## Comandos de migrations

```bash
# Criar nova migration
npx knex migrate:make create_users

# Executar migrations pendentes
npx knex migrate:latest

# Reverter última migration
npx knex migrate:rollback

# Ver status das migrations
npx knex migrate:status
```

## Setup básico do Knex com Node

```javascript
// knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/database.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  }
}
```

```javascript
// src/database.js
const knex = require('knex')
const config = require('../knexfile')

const db = knex(config.development)

module.exports = db
```