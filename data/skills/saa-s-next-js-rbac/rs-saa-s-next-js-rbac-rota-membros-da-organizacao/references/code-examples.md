# Code Examples: Rota de Listagem de Membros da Organizacao

## Exemplo completo da rota GetMembers

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get all organization members',
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to see organization members.',
          )
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = members.map(
          ({ user, ...member }) => {
            const { id: userId, ...userData } = user
            return {
              ...userData,
              ...member,
              userId,
            }
          },
        )

        return { members: membersWithRoles }
      },
    )
}
```

## Tecnica de desestruturacao com rename — passo a passo

```typescript
// Dado do Prisma:
const memberFromDb = {
  id: 'member-uuid-123',
  role: 'ADMIN',
  user: {
    id: 'user-uuid-456',
    name: 'Diego Fernandes',
    email: 'diego@skillz.com.br',
    avatarUrl: 'https://github.com/diego3g.png',
  },
}

// Passo 1: Separar user do membro
const { user, ...member } = memberFromDb
// user = { id: 'user-uuid-456', name: 'Diego', email: '...', avatarUrl: '...' }
// member = { id: 'member-uuid-123', role: 'ADMIN' }

// Passo 2: Renomear id do user para userId
const { id: userId, ...userData } = user
// userId = 'user-uuid-456'
// userData = { name: 'Diego', email: '...', avatarUrl: '...' }

// Passo 3: Combinar tudo em um objeto plano
const result = { ...userData, ...member, userId }
// result = {
//   name: 'Diego Fernandes',
//   email: 'diego@skillz.com.br',
//   avatarUrl: 'https://github.com/diego3g.png',
//   id: 'member-uuid-123',        ← id do membro preservado
//   role: 'ADMIN',
//   userId: 'user-uuid-456',      ← id do user renomeado
// }
```

## Registrando a rota no servidor

```typescript
// server.ts
import { getMembers } from './routes/members/get-members'

// Registrar junto com as outras rotas
app.register(getMembers)
```

## Correcao do bug de metodo HTTP

```typescript
// ERRADO (copiado de delete e nao alterado):
app.delete('/organizations/:slug/projects/:projectId', ...)

// CORRETO para rota de update:
app.put('/organizations/:slug/projects/:projectId', ...)
```

## Variacao: aplicando o mesmo pattern para outras entidades

```typescript
// Listagem de invites com dados do autor (mesmo pattern)
const invites = await prisma.invite.findMany({
  select: {
    id: true,
    role: true,
    email: true,
    createdAt: true,
    author: {
      select: { id: true, name: true, avatarUrl: true },
    },
  },
  where: { organizationId: organization.id },
})

const invitesWithAuthor = invites.map(({ author, ...invite }) => {
  const { id: authorId, ...authorData } = author ?? {}
  return { ...invite, ...authorData, authorId }
})
```