# Code Examples: Estrategias de Acesso ao Banco de Dados

## 1. Driver Nativo — mysql2

Exemplo mostrado na aula (adaptado do README do mysql2):

```javascript
// Driver nativo: voce escreve SQL cru
const mysql = require('mysql2/promise')

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
})

// Query escrita manualmente — zero abstracao
const [rows, fields] = await connection.execute(
  'SELECT * FROM users WHERE first_name = ? AND last_name = ?',
  ['test', 'user']
)
```

**Ponto chave:** voce e responsavel por cada caractere do SQL. O driver apenas envia e recebe.

## 2. Query Builder — Knex.js

Exemplo demonstrado ao vivo na aula:

```javascript
// Query Builder: JavaScript que gera SQL
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './dev.db'  // SQLite salva em arquivo local
  }
})

// Buscar usuarios com WHERE usando metodos encadeados
const users = await knex('users')
  .where({ first_name: 'test', last_name: 'user' })
  .select('id')
```

SQL gerado pelo Knex:
```sql
SELECT id FROM users WHERE first_name = 'test' AND last_name = 'user'
```

### Portabilidade do Knex

Para trocar de SQLite para Postgres, mude apenas a configuracao:

```javascript
// ANTES: SQLite
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './dev.db' }
})

// DEPOIS: Postgres — mesmo codigo de queries funciona
const knex = require('knex')({
  client: 'pg',
  connection: 'postgresql://user:pass@localhost:5432/mydb'
})

// Esta query funciona identica em ambos:
const users = await knex('users').where({ active: true }).select('*')
```

## 3. ORM (mencionado, nao demonstrado na aula)

Diego menciona que ORMs serao abordados em modulos futuros. Exemplo conceitual:

```javascript
// ORM: sintaxe totalmente da linguagem, quase zero SQL
// Exemplo com Prisma (nao mostrado na aula, mas e o ORM mais usado no ecossistema Node)
const users = await prisma.user.findMany({
  where: { firstName: 'test' },
  select: { id: true }
})
```

## Comparacao visual dos 3 niveis

A mesma operacao nos tres niveis:

```javascript
// NIVEL 1: Driver Nativo
const [rows] = await connection.execute(
  'SELECT id FROM users WHERE first_name = ? AND last_name = ?',
  ['test', 'user']
)

// NIVEL 2: Query Builder (Knex)
const rows = await knex('users')
  .where({ first_name: 'test', last_name: 'user' })
  .select('id')

// NIVEL 3: ORM (Prisma)
const rows = await prisma.user.findMany({
  where: { firstName: 'test', lastName: 'user' },
  select: { id: true }
})
```

Todos geram o mesmo resultado. A diferenca e o quanto de SQL voce precisa conhecer.