# Code Examples: ORM vs SQL Raw

## Comparação fundamental: CRUD sem ORM vs com Prisma

### Criar um usuário

**Sem ORM (SQL raw com driver pg):**
```typescript
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Risco: se esquecer de parametrizar, SQL injection
const result = await pool.query(
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
  [name, email]
)

// result.rows[0] é `any` — sem type-safety
const user = result.rows[0]
```

**Com Prisma ORM:**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type-safe: name e email são validados pelo tipo gerado
// SQL injection impossível: Prisma parametriza automaticamente
const user = await prisma.user.create({
  data: { name, email }
})

// user tem tipo completo: { id: string, name: string, email: string, ... }
```

### Buscar com filtros

**Sem ORM:**
```typescript
// Concatenar condições SQL é trabalhoso e propenso a erros
const conditions = []
const values = []
let paramIndex = 1

if (name) {
  conditions.push(`name LIKE $${paramIndex++}`)
  values.push(`%${name}%`)
}
if (active !== undefined) {
  conditions.push(`active = $${paramIndex++}`)
  values.push(active)
}

const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
const result = await pool.query(`SELECT * FROM users ${where}`, values)
```

**Com Prisma:**
```typescript
const users = await prisma.user.findMany({
  where: {
    name: name ? { contains: name } : undefined,
    active: active,
  }
})
// Prisma ignora campos undefined automaticamente
```

### Relacionamentos

**Sem ORM:**
```typescript
// Precisa de JOIN manual e mapeamento manual do resultado
const result = await pool.query(`
  SELECT u.*, p.id as post_id, p.title
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  WHERE u.id = $1
`, [userId])

// Resultado é flat — precisa agrupar manualmente
// result.rows terá uma linha por post, com dados do user repetidos
```

**Com Prisma:**
```typescript
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true }
})

// userWithPosts.posts é um array tipado automaticamente
```

## Setup inicial do Prisma

```bash
# Instalar Prisma como dependência de desenvolvimento
npm install prisma -D

# Instalar o client como dependência de produção
npm install @prisma/client

# Inicializar (cria schema.prisma e .env)
npx prisma init
```

### Schema exemplo (`prisma/schema.prisma`):
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
  posts Post[]
}

model Post {
  id       String @id @default(uuid())
  title    String
  content  String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

### Fluxo de trabalho com migrations:
```bash
# Criar migration a partir do schema
npx prisma migrate dev --name init

# Gerar o client (acontece automaticamente no migrate dev)
npx prisma generate

# Visualizar dados no browser
npx prisma studio
```