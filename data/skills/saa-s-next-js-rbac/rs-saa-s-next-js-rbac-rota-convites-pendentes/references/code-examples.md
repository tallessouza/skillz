# Code Examples: Rota Convites Pendentes

## Exemplo completo da rota

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all user pending invites',
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  email: z.string().email(),
                  role: roleSchema,
                  createdAt: z.date(),
                  organization: z.object({
                    name: z.string(),
                  }),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                      avatarUrl: z.string().url().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        const invites = await prisma.invite.findMany({
          where: {
            email: user.email,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        })

        return { invites }
      },
    )
}
```

## Padrao: buscar usuario antes de filtrar por email

```typescript
// Este padrao aparece sempre que a entidade alvo usa email como FK
const userId = await request.getCurrentUserId()

const user = await prisma.user.findUnique({
  where: { id: userId },
})

if (!user) {
  throw new BadRequestError('User not found.')
}

// Agora use user.email para filtrar
const results = await prisma.someModel.findMany({
  where: { email: user.email },
})
```

## Comparacao: getInvite vs getPendingInvites

### getInvite (invite individual, scoped a org)
```typescript
// Recebe parametros
app.get('/organizations/:orgSlug/invites/:inviteId', ...)

// Busca um unico invite
const invite = await prisma.invite.findUnique({
  where: { id: inviteId, organization: { slug: orgSlug } },
  select: { id: true, email: true, role: true, createdAt: true, ... },
})
```

### getPendingInvites (todos os convites do usuario)
```typescript
// Sem parametros de rota
app.get('/pending-invites', ...)

// Busca multiplos invites por email
const invites = await prisma.invite.findMany({
  where: { email: user.email },
  select: { id: true, email: true, role: true, createdAt: true, ... },
})
```

## Registrando a rota no servidor

```typescript
// No arquivo de setup do servidor (server.ts ou routes.ts)
import { getPendingInvites } from './routes/invites/get-pending-invites'

app.register(getPendingInvites)
```