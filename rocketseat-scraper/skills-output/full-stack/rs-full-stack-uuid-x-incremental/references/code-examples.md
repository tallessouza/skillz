# Code Examples: UUID x Incremental

## 1. Prisma — Schema com UUID como PK

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
```

## 2. Prisma — Dual ID (incremental interno + UUID publico)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  publicId  String   @unique @default(uuid())
  name      String
  email     String   @unique
  
  orders    Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  publicId  String   @unique @default(uuid())
  userId    Int      // FK interna usa incremental
  user      User     @relation(fields: [userId], references: [id])
  total     Float
}
```

## 3. Drizzle ORM — UUID

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

## 4. Knex Migration — UUID com gen_random_uuid()

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNull()
    table.string('email').notNull().unique()
    table.timestamps(true, true)
  })
}
```

## 5. Rota Fastify — Validacao de UUID no parametro

```typescript
import { z } from 'zod'

app.get('/users/:userId', async (request, reply) => {
  const paramsSchema = z.object({
    userId: z.string().uuid('ID must be a valid UUID'),
  })

  const { userId } = paramsSchema.parse(request.params)
  
  const user = await prisma.user.findUnique({
    where: { publicId: userId },
  })

  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  return reply.send({ user })
})
```

## 6. Express — Comparacao incremental vs UUID

### Incremental (vulneravel a enumeracao)
```typescript
// Atacante pode tentar: /users/1, /users/2, /users/3...
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id) // facil de iterar
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
  res.json(user)
})
```

### UUID (resistente a enumeracao)
```typescript
// Atacante nao consegue adivinhar: /users/f47ac10b-58cc-4372-a567-0e02b2c3d479
app.get('/users/:id', async (req, res) => {
  const id = req.params.id // UUID nao e previsivel
  if (!isValidUUID(id)) return res.status(400).json({ error: 'Invalid ID format' })
  const user = await db.query('SELECT * FROM users WHERE public_id = $1', [id])
  res.json(user)
})
```

## 7. Geracao de UUID no JavaScript (sem banco)

```typescript
// Node.js nativo (v14.17+)
import { randomUUID } from 'node:crypto'
const id = randomUUID() // "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// Browser nativo
const id = crypto.randomUUID()

// Nunca faca isso:
const badId = Math.random().toString(36).substring(2) // NAO e UUID, baixa entropia
```

## 8. SQL direto — Criar tabela com UUID

```sql
-- PostgreSQL
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- MySQL 8+
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```