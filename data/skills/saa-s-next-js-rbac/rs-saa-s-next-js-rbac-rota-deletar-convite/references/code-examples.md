# Code Examples: Rota Deletar (Revogar) Convite

## Exemplo completo da rota

Este e o codigo final da rota conforme desenvolvido na aula:

```typescript
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

app.register(async (app) => {
  app.delete(
    '/organizations/:slug/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Revoke an invite',
        params: z.object({
          slug: z.string(),
          inviteId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, inviteId } = request.params
      const { membership, organization } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(membership.userId, membership.role)

      if (cannot('delete', 'Invite')) {
        throw new UnauthorizedError('You are not allowed to delete an invite.')
      }

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
          organizationId: organization.id,
        },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found.')
      }

      await prisma.invite.delete({
        where: { id: inviteId },
      })

      return reply.status(204).send()
    },
  )
})
```

## Evolucao do codigo durante a aula

### Versao inicial (sem escopo organizacional)

O instrutor comecou assim, sem o `organizationId`:

```typescript
const invite = await prisma.invite.findUnique({
  where: { id: inviteId },
})

if (!invite) {
  throw new BadRequestError('Invite not found.')
}

await prisma.invite.delete({
  where: { id: inviteId },
})
```

### Versao corrigida (com escopo organizacional)

Ao perceber a vulnerabilidade, adicionou o escopo:

```typescript
const invite = await prisma.invite.findUnique({
  where: {
    id: inviteId,
    organizationId: organization.id, // Previne IDOR
  },
})
```

## Padrao reutilizavel: Delete com escopo multi-tenant

Este padrao se aplica a qualquer delete em sistema multi-tenant:

```typescript
// 1. Verificar permissao
if (cannot('delete', 'ResourceName')) {
  throw new UnauthorizedError('You are not allowed to delete this resource.')
}

// 2. Buscar com escopo organizacional
const resource = await prisma.resource.findUnique({
  where: {
    id: resourceId,
    organizationId: organization.id, // SEMPRE incluir
  },
})

// 3. Validar existencia
if (!resource) {
  throw new BadRequestError('Resource not found.')
}

// 4. Deletar
await prisma.resource.delete({
  where: { id: resourceId },
})

// 5. Retornar 204
return reply.status(204).send()
```

## Comparacao: Revoke vs Reject

```typescript
// REVOKE (admin da org) — usa getUserMembership + CASL
app.delete('/organizations/:slug/invites/:inviteId', async (request, reply) => {
  const { membership, organization } = await request.getUserMembership(slug)
  const { cannot } = getUserPermissions(membership.userId, membership.role)
  if (cannot('delete', 'Invite')) throw new UnauthorizedError(...)
  // delete com organizationId scope
})

// REJECT (usuario convidado) — usa apenas userId do token
app.patch('/invites/:inviteId/reject', async (request, reply) => {
  const userId = await request.getCurrentUserId()
  // verifica se o invite pertence ao email do usuario
  // nao precisa de organizationId scope — o convidado nao e membro ainda
})
```