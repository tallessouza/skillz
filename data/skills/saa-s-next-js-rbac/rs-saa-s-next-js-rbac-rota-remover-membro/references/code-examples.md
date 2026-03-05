# Code Examples: Rota Remover Membro

## Exemplo completo da rota removeMember

Baseado no padrao da aula, a rota segue a mesma estrutura das demais rotas de membros:

```typescript
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Remove a member from the organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        // Verificacao RBAC
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to remove this member from the organization.',
          )
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
```

## Registro da rota no server

```typescript
// No arquivo de rotas ou server principal
import { removeMember } from './routes/members/remove-member'

// Registrar junto com as demais rotas de membros
app.register(removeMember)
```

## Comparacao: updateMember vs removeMember

```typescript
// updateMember - PATCH com body
app.patch('/organizations/:slug/members/:memberId', {
  schema: {
    body: z.object({ role: roleSchema }),
    response: { 204: z.null() },
  },
}, async (request, reply) => {
  // ... autorizacao ...
  await prisma.member.update({
    where: { id: memberId, organizationId: organization.id },
    data: { role },
  })
  return reply.status(204).send()
})

// removeMember - DELETE sem body
app.delete('/organizations/:slug/members/:memberId', {
  schema: {
    response: { 204: z.null() },
  },
}, async (request, reply) => {
  // ... autorizacao ...
  await prisma.member.delete({
    where: { id: memberId, organizationId: organization.id },
  })
  return reply.status(204).send()
})
```

## Resultado no Swagger

Apos registrar todas as rotas de membros, o Swagger exibe:

```
Members
  GET    /organizations/{slug}/members        - Get all members
  PATCH  /organizations/{slug}/members/{id}   - Update a member
  DELETE /organizations/{slug}/members/{id}   - Remove a member
```