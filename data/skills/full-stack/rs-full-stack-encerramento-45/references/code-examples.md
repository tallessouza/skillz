# Code Examples: Prisma ORM — Fundamentos

## Setup completo de um projeto com Prisma

### 1. Inicializar projeto
```bash
mkdir meu-projeto && cd meu-projeto
npm init -y
npm install typescript ts-node @types/node -D
npm install prisma -D
npm install @prisma/client
npx tsc --init
npx prisma init
```

### 2. Configurar datasource (schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  posts     Post[]

  @@map("users")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String   @map("author_id")
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")

  @@map("posts")
}
```

### 3. Gerar migration e client
```bash
npx prisma migrate dev --name create-users-and-posts
```

### 4. Singleton do PrismaClient
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

## Operacoes CRUD basicas

### Create
```typescript
const user = await prisma.user.create({
  data: {
    name: 'Diego Fernandes',
    email: 'diego@skillz.com.br',
  },
})
```

### Read
```typescript
// Buscar todos
const users = await prisma.user.findMany()

// Buscar por id
const user = await prisma.user.findUnique({
  where: { id: 'some-uuid' },
})

// Buscar com relacao
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'some-uuid' },
  include: { posts: true },
})
```

### Update
```typescript
const updatedUser = await prisma.user.update({
  where: { id: 'some-uuid' },
  data: { name: 'Diego Schell Fernandes' },
})
```

### Delete
```typescript
await prisma.user.delete({
  where: { id: 'some-uuid' },
})
```

## Filtros comuns

```typescript
// Where com condicoes
const activeUsers = await prisma.user.findMany({
  where: {
    email: { contains: '@skillz.com.br' },
    createdAt: { gte: new Date('2024-01-01') },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
})
```

## Variacao: criar com relacao

```typescript
const userWithPost = await prisma.user.create({
  data: {
    name: 'Mayk Brito',
    email: 'mayk@skillz.com.br',
    posts: {
      create: {
        title: 'Primeiro post',
        content: 'Conteudo do post',
      },
    },
  },
  include: { posts: true },
})
```