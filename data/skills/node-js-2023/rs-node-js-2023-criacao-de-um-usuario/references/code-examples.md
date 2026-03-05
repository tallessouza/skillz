# Code Examples: Criacao de Usuario

## Exemplo completo da aula

### 1. Prisma Client isolado

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
```

### 2. Rota de registro (versao inicial da aula — sem hash)

```typescript
// src/app.ts
import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export const app = fastify()

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password, // temporario — substituir por hash
    },
  })

  return reply.status(201).send()
})
```

### 3. Rota de registro (versao correta — com hash)

```typescript
import { hash } from 'bcryptjs'

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })

  return reply.status(201).send()
})
```

## Variacoes do padrao

### Rota de criacao com retorno do ID

```typescript
app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  const passwordHash = await hash(password, 6)

  const user = await prisma.user.create({
    data: { name, email, password_hash: passwordHash },
    select: { id: true },
  })

  return reply.status(201).send({ id: user.id })
})
```

### Validacao de params (mesmo padrao aplicado a GET)

```typescript
app.get('/users/:id', async (request, reply) => {
  const getUserParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserParamsSchema.parse(request.params)

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  })

  return reply.send({ user })
})
```

### Validacao de query params

```typescript
app.get('/users', async (request, reply) => {
  const listUsersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
  })

  const { page, perPage } = listUsersQuerySchema.parse(request.query)

  const users = await prisma.user.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
  })

  return reply.send({ users })
})
```

## Testando com Insomnia/HTTP Client

```http
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "Diego Fernandes",
  "email": "diego@skillz.com.br",
  "password": "123456"
}
```

Resposta esperada: `201 Created` com body vazio.

## Verificando no banco

```bash
# Abre interface visual do Prisma
npx prisma studio
```

Acesse `http://localhost:5555` e navegue ate a tabela `User` para ver o registro criado.