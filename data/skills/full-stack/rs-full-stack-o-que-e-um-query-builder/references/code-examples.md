# Code Examples: Query Builder

## Exemplo conceitual: a mesma operacao em diferentes bancos

### Sem Query Builder (SQL cru por banco)

```typescript
// Postgres
const result = await pg.query(
  'SELECT * FROM users WHERE active = $1 LIMIT 10;',
  [true]
)

// MySQL
const [rows] = await mysql.execute(
  'SELECT * FROM users WHERE active = ? LIMIT 10',
  [true]
)

// SQLite
const rows = db.prepare(
  'SELECT * FROM users WHERE active = ? LIMIT 10'
).all(1) // SQLite nao tem boolean nativo
```

Note as diferencas: placeholders (`$1` vs `?`), ponto e virgula, tratamento de booleanos.

### Com Query Builder (Knex como exemplo)

```typescript
// Funciona identicamente para Postgres, MySQL e SQLite
const users = await knex('users')
  .select('*')
  .where('active', true)
  .limit(10)
```

O Query Builder gera o SQL correto para cada banco configurado.

## CRUD completo com Query Builder

### Select com filtros

```typescript
// Selecionar usuarios ativos maiores de 18
const users = await knex('users')
  .select('id', 'name', 'email')
  .where('active', true)
  .andWhere('age', '>=', 18)
  .orderBy('name', 'asc')
```

### Insert

```typescript
// Inserir novo usuario
const [newUser] = await knex('users')
  .insert({
    name: 'João Silva',
    email: 'joao@email.com',
    active: true
  })
  .returning('*') // Postgres retorna o registro; MySQL ignora silenciosamente
```

### Update

```typescript
// Atualizar email do usuario
await knex('users')
  .where('id', userId)
  .update({ email: 'novo@email.com' })
```

### Delete

```typescript
// Deletar usuarios inativos
await knex('users')
  .where('active', false)
  .delete()
```

## Legibilidade comparada

### SQL cru concatenado (fragil e dificil de ler)

```typescript
const sql = `
  SELECT u.id, u.name, o.total
  FROM users u
  INNER JOIN orders o ON o.user_id = u.id
  WHERE u.active = $1
  AND o.created_at >= $2
  ORDER BY o.total DESC
  LIMIT $3
`
const result = await pg.query(sql, [true, startDate, 10])
```

### Query Builder (legivel e encadeavel)

```typescript
const result = await knex('users as u')
  .select('u.id', 'u.name', 'o.total')
  .innerJoin('orders as o', 'o.user_id', 'u.id')
  .where('u.active', true)
  .andWhere('o.created_at', '>=', startDate)
  .orderBy('o.total', 'desc')
  .limit(10)
```

## Configuracao do Query Builder (contexto pratico)

```typescript
// knexfile.ts — configuracao unica que define o banco
import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'pg', // Troque para 'mysql2' ou 'sqlite3' — o resto do codigo nao muda
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
}

export default config
```

A mudanca de banco acontece aqui, na configuracao. Nenhuma query no codigo da aplicacao precisa mudar.