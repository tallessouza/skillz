# Code Examples: Rota de Atualizacao de Organizacao

## Rota completa — update-organization.ts

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { organizationSchema } from '@saas/auth'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        // 1. Verificar permissao
        const { cannot } = getUserPermissions(userId, membership.role)
        const authOrganization = organizationSchema.parse(organization)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to update this organization.'
          )
        }

        // 2. Validar dominio unico (excluindo a propria org)
        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationByDomain =
            await prisma.organization.findFirst({
              where: {
                domain,
                id: { not: organization.id },
              },
            })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with same domain already exists.'
            )
          }
        }

        // 3. Atualizar (sem slug)
        await prisma.organization.update({
          where: { id: organization.id },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        })

        return reply.status(204).send()
      }
    )
}
```

## getUserPermissions — utils/get-user-permissions.ts

```typescript
import { defineAbilityFor, userSchema, type Role } from '@saas/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({ id: userId, role })
  const ability = defineAbilityFor(authUser)
  return ability
}
```

## Registrando a rota no server

```typescript
import { updateOrganization } from './routes/orgs/update-organization'

// No arquivo de setup do server
app.register(updateOrganization)
```

## Evolucao do codigo — antes e depois da abstracao

### Antes (inline em cada rota):

```typescript
import { defineAbilityFor, userSchema, organizationSchema } from '@saas/auth'

// Dentro do handler
const authUser = userSchema.parse({ id: userId, role: membership.role })
const permissions = defineAbilityFor(authUser)
const authOrganization = organizationSchema.parse(organization)

if (permissions.cannot('update', authOrganization)) {
  throw new UnauthorizedError('...')
}
```

### Depois (com getUserPermissions):

```typescript
import { organizationSchema } from '@saas/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

// Dentro do handler
const { cannot } = getUserPermissions(userId, membership.role)
const authOrganization = organizationSchema.parse(organization)

if (cannot('update', authOrganization)) {
  throw new UnauthorizedError('...')
}
```

## Detalhe: Zod parse com objeto completo

Quando os nomes dos campos coincidem, pode-se passar o objeto inteiro:

```typescript
// Campos do banco: { id, name, slug, domain, ownerId, createdAt, ... }
// Schema espera: { id, ownerId }

// Funciona — Zod extrai apenas id e ownerId, ignora o resto
const authOrganization = organizationSchema.parse(organization)

// Equivalente verbose (desnecessario)
const authOrganization = organizationSchema.parse({
  id: organization.id,
  ownerId: organization.ownerId,
})
```

## findFirst vs findUnique

```typescript
// ERRO — findUnique nao aceita condicoes compostas arbitrarias
await prisma.organization.findUnique({
  where: {
    domain,
    id: { not: organization.id }, // Prisma rejeita isso em findUnique
  },
})

// CORRETO — findFirst aceita qualquer WHERE
await prisma.organization.findFirst({
  where: {
    domain,
    id: { not: organization.id },
  },
})
```