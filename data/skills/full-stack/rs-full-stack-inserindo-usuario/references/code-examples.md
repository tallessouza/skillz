# Code Examples: Inserindo Registros com Prisma ORM

## 1. Setup completo do PrismaClient

```typescript
// src/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})
```

### Variacao: log completo para desenvolvimento

```typescript
export const prisma = new PrismaClient({
  log: ['error', 'info', 'warn', 'query'],
})
```

### Variacao: sem log (producao)

```typescript
export const prisma = new PrismaClient()
```

## 2. Controller de criacao de usuario

```typescript
// src/controllers/user-controller.ts
import { prisma } from '@/prisma'
import { Request, Response } from 'express'

async function createUser(request: Request, response: Response) {
  const { name, email } = request.body

  await prisma.user.create({
    data: {
      name,
      email,
    },
  })

  return response.status(201).send()
}
```

## 3. Schema Prisma correspondente

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
}
```

## 4. Testando no Insomnia/HTTP Client

```json
// POST /users
// Content-Type: application/json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com"
}
// Response: 201 Created
```

Tentativa duplicada com mesmo email:
```json
// POST /users (mesmo email)
{
  "name": "Outro Nome",
  "email": "rodrigo@email.com"
}
// Response: erro de unique constraint
```

## 5. Output do log de queries no terminal

Ao executar o create, o terminal exibe algo como:

```
prisma:query INSERT INTO "User" ("id","name","email") VALUES ($1,$2,$3)
prisma:query SELECT "User"."id", "User"."name", "User"."email" FROM "User" WHERE ...
```

Isso mostra o SQL real gerado pelo Prisma, util para debugging e aprendizado.

## 6. Variacao: capturando o usuario criado

```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
  },
})

return response.status(201).json(user)
// Retorna: { id: "uuid-gerado", name: "Rodrigo Gonçalves", email: "rodrigo@email.com" }
```

## 7. Variacao: tratando erro de constraint

```typescript
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({
    data: { name, email },
  })
  return response.status(201).send()
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return response.status(409).json({ error: 'Email ja cadastrado' })
    }
  }
  throw error
}
```