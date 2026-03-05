# Code Examples: Rota de Cadastro de Usuario

## 1. Prisma Client Singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})
```

## 2. Configuracao de alias no tsconfig

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./source/*"]
    }
  }
}
```

**Antes do alias:**
```typescript
import { prisma } from '../../../lib/prisma'
```

**Depois do alias:**
```typescript
import { prisma } from '@/lib/prisma'
```

## 3. Instalacao do bcrypt.js com tipos

```bash
# Instalar bcrypt.js
npm install bcryptjs

# Instalar tipos TypeScript (bcrypt.js e escrito em JS puro)
npm install -D @types/bcryptjs
```

## 4. Rota completa de criacao de conta

```typescript
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Assumindo que o schema Zod ja esta configurado na rota do Fastify
app.post('/users', async (request, reply) => {
  // Zod ja validou — tipos inferidos automaticamente
  const { name, email, password } = request.body

  // Verificar duplicidade antes de criar
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    return reply.status(400).send({
      message: 'User with same email already exists.',
    })
  }

  // Hash da senha com 6 rounds
  const passwordHash = await hash(password, 6)

  // Criar usuario no banco
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  })

  // 201 = recurso criado com sucesso
  return reply.status(201).send()
})
```

## 5. Testando a rota com httpie

```bash
# Criar usuario
http POST localhost:3333/users \
  name="John Doe" \
  email="john@example.com" \
  password="123456"

# Verificar no Prisma Studio
pnpm prisma studio
```

## 6. Variacoes e cenarios adicionais

### Com retorno do ID do usuario criado

```typescript
const user = await prisma.user.create({
  data: { name, email, passwordHash },
  select: { id: true }, // Retorna apenas o ID, nunca o hash
})

return reply.status(201).send({ userId: user.id })
```

### Com rounds configuravel por ambiente

```typescript
const BCRYPT_ROUNDS = process.env.NODE_ENV === 'production' ? 10 : 6

const passwordHash = await hash(password, BCRYPT_ROUNDS)
```

### Schema Zod para referencia

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
```