# Code Examples: ORM — Object Relational Mapper

## Exemplo central da aula: mapeamento usuario

### Representacao no codigo (objeto)

```typescript
// O usuario como objeto na aplicacao
const user = {
  id: 12,
  name: "Rodrigo",
  email: "rodrigo@example.com"
}
```

### Representacao no banco (tabela)

```sql
-- Tabela users no banco de dados
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

-- O registro correspondente
-- | id | name    | email               |
-- | 12 | Rodrigo | rodrigo@example.com |
```

### O ORM faz a conversao automatica

```typescript
// Com ORM (exemplo Prisma)
const user = await prisma.user.findUnique({ where: { id: 12 } })
// Retorna: { id: 12, name: "Rodrigo", email: "rodrigo@example.com" }

// Sem ORM (SQL direto)
const result = await db.query("SELECT * FROM users WHERE id = $1", [12])
const user = result.rows[0]
```

## Comparativo: ORM vs Query Builder vs SQL puro

### Buscar usuario por ID

```typescript
// ORM (Prisma)
const user = await prisma.user.findUnique({ where: { id: 12 } })

// Query Builder (Knex)
const user = await knex("users").where({ id: 12 }).first()

// SQL puro
const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [12])
```

### Criar usuario

```typescript
// ORM (Prisma)
const user = await prisma.user.create({
  data: { name: "Rodrigo", email: "rodrigo@example.com" }
})

// Query Builder (Knex)
const [user] = await knex("users")
  .insert({ name: "Rodrigo", email: "rodrigo@example.com" })
  .returning("*")

// SQL puro
const { rows } = await pool.query(
  "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
  ["Rodrigo", "rodrigo@example.com"]
)
```

### Buscar usuarios filtrados

```typescript
// ORM (Prisma)
const activeUsers = await prisma.user.findMany({
  where: { isActive: true },
  orderBy: { name: "asc" }
})

// Query Builder (Knex)
const activeUsers = await knex("users")
  .where({ is_active: true })
  .orderBy("name", "asc")

// SQL puro
const { rows } = await pool.query(
  "SELECT * FROM users WHERE is_active = true ORDER BY name ASC"
)
```

## Exemplo da vantagem: troca de banco

```typescript
// prisma/schema.prisma — trocar de SQLite para PostgreSQL

// ANTES (SQLite)
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// DEPOIS (PostgreSQL) — so muda a config
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// O codigo da aplicacao NAO MUDA
// Todas as chamadas prisma.user.findMany() etc continuam iguais
```

## ORMs populares no ecossistema Node.js/TypeScript

```typescript
// Prisma (ORM) — type-safe, schema-first
const users = await prisma.user.findMany()

// TypeORM (ORM) — decorator-based, class-first
const users = await userRepository.find()

// Drizzle (Query Builder com tipos) — SQL-like, type-safe
const users = await db.select().from(usersTable)

// Knex (Query Builder) — flexivel, SQL-like
const users = await knex("users").select("*")
```