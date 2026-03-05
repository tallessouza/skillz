# Code Examples: Rota de Transferencia de Propriedade

## Exemplo completo da rota

```typescript
// src/http/routes/orgs/transfer-organization.ts
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership',
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().uuid(),
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

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', 'Organization')) {
          throw new UnauthorizedError(
            'You are not allowed to transfer this organization ownership.'
          )
        }

        const { transferToUserId } = request.body

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError(
            'Target user is not a member of this organization.'
          )
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),
          prisma.organization.update({
            where: { id: organization.id },
            data: { ownerId: transferToUserId },
          }),
        ])

        return reply.status(204).send()
      }
    )
}
```

## Comparacao: $transaction com array vs callback

### Forma com array (preferida para operacoes independentes)

```typescript
await prisma.$transaction([
  prisma.member.update({
    where: { organizationId_userId: { organizationId: org.id, userId } },
    data: { role: 'ADMIN' },
  }),
  prisma.organization.update({
    where: { id: org.id },
    data: { ownerId: userId },
  }),
])
```

### Forma com callback (quando ha dependencia entre queries)

```typescript
await prisma.$transaction(async (tx) => {
  const member = await tx.member.update({
    where: { organizationId_userId: { organizationId: org.id, userId } },
    data: { role: 'ADMIN' },
  })

  // Usa resultado da primeira query
  await tx.organization.update({
    where: { id: org.id },
    data: {
      ownerId: userId,
      lastTransferredBy: member.id, // depende do resultado acima
    },
  })
})
```

## Registro da rota no app

```typescript
// src/http/server.ts
import { transferOrganization } from './routes/orgs/transfer-organization'

app.register(transferOrganization)
```

## Pattern: indice composto como where clause

```typescript
// Schema Prisma define:
// @@unique([organizationId, userId])

// Isso gera o where helper:
where: {
  organizationId_userId: {
    organizationId: '...',
    userId: '...',
  }
}
// Nome do helper = campos unidos por underscore
```