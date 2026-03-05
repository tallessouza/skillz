# Code Examples: Rotas de Recuperacao e Troca de Senha

## Exemplo completo: Request Password Recover

```typescript
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recover',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        // We don't want people to know if user really exists
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      })

      // Send e-mail with password recover link
      console.log('Recover password token:', code)

      return reply.status(201).send()
    },
  )
}
```

## Exemplo completo: Reset Password

```typescript
import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'Reset password',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      const tokenFromCode = await prisma.token.findUnique({
        where: { id: code },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError()
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.update({
        where: { id: tokenFromCode.userId },
        data: { passwordHash },
      })

      return reply.status(204).send()
    },
  )
}
```

## Registro das rotas no server

```typescript
// server.ts
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'

// ... outras rotas
app.register(requestPasswordRecover)
app.register(resetPassword)
```

## Modelo do Token no Prisma

```prisma
model Token {
  id        String   @id @default(uuid())
  type      TokenType
  createdAt DateTime @default(now()) @map("created_at")

  user   User   @relation(fields: [userId], references: [id])
  userId String @map("user_id")

  @@map("tokens")
}

enum TokenType {
  PASSWORD_RECOVER
}
```

## Variacao: com expiracao do token

```typescript
// Ao criar o token, adicionar expiracao
const token = await prisma.token.create({
  data: {
    type: 'PASSWORD_RECOVER',
    userId: userFromEmail.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutos
  },
})

// Ao validar, verificar expiracao
const tokenFromCode = await prisma.token.findUnique({
  where: { id: code },
})

if (!tokenFromCode || tokenFromCode.expiresAt < new Date()) {
  throw new UnauthorizedError()
}
```

## Variacao: invalidar token apos uso

```typescript
// Apos resetar a senha, deletar o token
await prisma.$transaction([
  prisma.user.update({
    where: { id: tokenFromCode.userId },
    data: { passwordHash },
  }),
  prisma.token.delete({
    where: { id: tokenFromCode.id },
  }),
])
```