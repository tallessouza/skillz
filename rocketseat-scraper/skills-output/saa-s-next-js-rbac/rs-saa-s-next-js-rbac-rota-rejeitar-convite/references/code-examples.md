# Code Examples: Rota Rejeitar Convite

## Exemplo completo da rota

A rota segue exatamente o mesmo padrao da rota de accept invite, com a diferenca na acao final.

### Estrutura do arquivo

```typescript
// apps/api/src/http/routes/invites/reject-invite.ts
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/reject',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Reject an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { inviteId } = request.params

        // 1. Verificar se o invite existe
        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found or expired.')
        }

        // 2. Verificar se o usuario existe
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        // 3. Verificar se o invite pertence ao usuario
        if (invite.email !== user.email) {
          throw new BadRequestError('This invite belongs to another user.')
        }

        // 4. Apenas deletar o invite (diferente do accept que tambem cria membership)
        await prisma.invite.delete({
          where: { id: inviteId },
        })

        return reply.status(204).send()
      },
    )
}
```

## Comparacao: Accept vs Reject

### Accept invite (acao final)
```typescript
// Accept tem DUAS acoes:
await prisma.$transaction([
  prisma.member.create({
    data: {
      userId,
      organizationId: invite.organizationId,
      role: invite.role,
    },
  }),
  prisma.invite.delete({
    where: { id: inviteId },
  }),
])
```

### Reject invite (acao final)
```typescript
// Reject tem UMA acao:
await prisma.invite.delete({
  where: { id: inviteId },
})
```

## Registro da rota no servidor

```typescript
// apps/api/src/http/server.ts
import { rejectInvite } from './routes/invites/reject-invite'

// ... outras rotas
app.register(rejectInvite)
```

## Possivel refatoracao: extrair validacoes compartilhadas

```typescript
// Se accept e reject compartilham validacoes, pode-se extrair:
async function validateInviteOwnership(inviteId: string, userId: string) {
  const invite = await prisma.invite.findUnique({
    where: { id: inviteId },
  })

  if (!invite) {
    throw new BadRequestError('Invite not found or expired.')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new BadRequestError('User not found.')
  }

  if (invite.email !== user.email) {
    throw new BadRequestError('This invite belongs to another user.')
  }

  return { invite, user }
}
```