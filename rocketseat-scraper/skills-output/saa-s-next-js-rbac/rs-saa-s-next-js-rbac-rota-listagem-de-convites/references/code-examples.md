# Code Examples: Rota de Listagem de Convites

## Exemplo completo da aula

A rota `getInvites` no formato final conforme implementado pelo instrutor:

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { roleSchema } from '@saas/auth'

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all organization invites',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  email: z.string().email(),
                  role: roleSchema,
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('get', 'Invite')) {
          throw new UnauthorizedError(
            'You are not allowed to get organization invites.',
          )
        }

        const invites = await prisma.invite.findMany({
          where: {
            organizationId: organization.id,
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
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { invites }
      },
    )
}
```

## Padrao de adaptacao: POST -> GET

O instrutor copiou `createInvite` e adaptou. As diferencas:

```typescript
// createInvite (original)
.post('/organizations/:slug/invites', {
  schema: {
    body: z.object({ email: z.string(), role: roleSchema }),
    response: { 201: z.object({ inviteId: z.string().uuid() }) }
  }
}, async (request) => {
  if (cannot('create', 'Invite')) { ... }
  const invite = await prisma.invite.create({ ... })
  return reply.status(201).send({ inviteId: invite.id })
})

// getInvites (adaptado)
.get('/organizations/:slug/invites', {
  schema: {
    // sem body
    response: { 200: z.object({ invites: z.array(...) }) }
  }
}, async (request) => {
  if (cannot('get', 'Invite')) { ... }  // mudou action
  const invites = await prisma.invite.findMany({ ... })  // mudou operacao
  return { invites }  // retorno direto, sem status explicito (200 default)
})
```

## Variacao: listagem com paginacao

Se a listagem precisar de paginacao (nao abordado na aula, mas extensao natural):

```typescript
params: z.object({ slug: z.string() }),
querystring: z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(20),
}),

// Na query:
const invites = await prisma.invite.findMany({
  where: { organizationId: organization.id },
  select: { /* mesmos campos */ },
  orderBy: { createdAt: 'desc' },
  take: perPage,
  skip: (page - 1) * perPage,
})
```