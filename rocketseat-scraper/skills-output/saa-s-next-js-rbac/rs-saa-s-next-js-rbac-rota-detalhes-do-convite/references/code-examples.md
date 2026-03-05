# Code Examples: Rota de Detalhes de Convite

## Exemplo completo da aula

### Arquivo: `get-invite.ts`

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        // Sem body — rota GET
        // Sem security — recurso publico
        response: {
          200: z.object({
            invite: z.object({
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
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
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

      if (!invite) {
        throw new BadRequestError('Invite not found.')
      }

      return { invite }
    },
  )
}
```

## Prisma select com relacoes aninhadas

O select do Prisma permite trazer dados de relacoes sem joins manuais:

```typescript
// Padrao: select com relacoes
const invite = await prisma.invite.findUnique({
  where: { id: inviteId },
  select: {
    // Campos diretos
    id: true,
    email: true,
    role: true,
    createdAt: true,
    // Relacao author (pode ser null)
    author: {
      select: { id: true, name: true, avatarUrl: true },
    },
    // Relacao organization (sempre existe via FK)
    organization: {
      select: { name: true },
    },
  },
})
```

## Zod schema com nullable em relacoes

```typescript
// author pode ser null (usuario deletado)
author: z
  .object({
    id: z.string().uuid(),
    name: z.string().nullable(),        // nome pode ser null
    avatarUrl: z.string().url().nullable(), // avatar pode ser null, mas se existir e URL
  })
  .nullable(), // o objeto inteiro pode ser null

// organization sempre existe (FK obrigatoria)
organization: z.object({
  name: z.string(),
}),
```

## Contraste: rota COM auth vs SEM auth

```typescript
// COM auth (recurso dentro da org)
app.withTypeProvider<ZodTypeProvider>().get(
  '/organizations/:slug/projects/:projectId',
  {
    schema: {
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        projectId: z.string().uuid(),
      }),
    },
  },
  async (request) => {
    const { slug } = request.params
    const { membership, organization } = await request.getUserMembership(slug)
    const { cannot } = getUserPermissions(membership.userId, membership.role)
    if (cannot('get', 'Project')) throw new UnauthorizedError(...)
    // ...
  },
)

// SEM auth (recurso cross-boundary)
app.withTypeProvider<ZodTypeProvider>().get(
  '/invites/:inviteId',
  {
    schema: {
      // Sem security
      params: z.object({ inviteId: z.string().uuid() }),
    },
  },
  async (request) => {
    const { inviteId } = request.params
    // Direto ao ponto, sem auth
    const invite = await prisma.invite.findUnique({ where: { id: inviteId } })
    // ...
  },
)
```