# Code Examples: Use Case Pattern — Caso de Uso de Registro

## Exemplo completo do commit da aula

### src/use-cases/register.ts

```typescript
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
```

### src/http/controllers/register.ts (atualizado)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
```

## Estrutura de pastas resultante

```
src/
├── http/
│   └── controllers/
│       └── register.ts      # Adaptador HTTP (Fastify-specific)
├── use-cases/
│   └── register.ts          # Logica de negocio (framework-agnostic)
├── lib/
│   └── prisma.ts            # Instancia do Prisma
└── app.ts                   # Setup do Fastify + rotas
```

## Variacao: Mesmo use case chamado de diferentes meios

### Via rota HTTP (controller)

```typescript
// src/http/controllers/register.ts
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
```

### Via consumer de mensageria

```typescript
// src/consumers/user-registration.ts
import { registerUseCase } from '@/use-cases/register'

export async function handleUserRegistrationMessage(message: QueueMessage) {
  const { name, email, password } = JSON.parse(message.body)

  try {
    await registerUseCase({ name, email, password })
    message.ack()
  } catch (err) {
    message.nack() // requeue
  }
}
```

### Via CLI

```typescript
// src/cli/register-user.ts
import { registerUseCase } from '@/use-cases/register'

const [name, email, password] = process.argv.slice(2)

try {
  await registerUseCase({ name, email, password })
  console.log('User created successfully')
} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
}
```

Todos os tres exemplos usam o **mesmo use case** — a logica de negocio nao foi duplicada. Apenas o adaptador muda.

## O que NAO fazer (anti-exemplo da aula)

```typescript
// ERRADO: use case recebendo reply do Fastify
export async function registerUseCase(
  { name, email, password }: RegisterUseCaseRequest,
  reply: FastifyReply, // NUNCA FACA ISSO
) {
  const userExists = await prisma.user.findUnique({ where: { email } })

  if (userExists) {
    return reply.status(409).send() // Acoplamento ao framework
  }

  // ...
}
```

O instrutor e enfatico: **"nao faca isso, pelo amor de Deus"**. O `reply` e especifico do Fastify e nao existiria se o use case fosse chamado de outro contexto.