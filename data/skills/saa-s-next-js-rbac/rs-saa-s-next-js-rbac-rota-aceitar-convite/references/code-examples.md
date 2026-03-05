# Code Examples: Rota Aceitar Convite

## Exemplo completo da rota

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
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

        // 1. Buscar convite
        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found or expired.')
        }

        // 2. Buscar usuario logado para comparar email
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        // 3. Verificar propriedade do convite
        if (invite.email !== user.email) {
          throw new BadRequestError('This invite belongs to another user.')
        }

        // 4. Transacao: criar member + deletar invite
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

        return reply.status(204).send()
      },
    )
}
```

## Registro no servidor

```typescript
// server.ts
import { acceptInvite } from './routes/invites/accept-invite'

app.register(acceptInvite)
```

## Prisma Transaction — duas formas

### Array de operacoes (usado nesta aula)
```typescript
// Quando as operacoes sao independentes entre si
await prisma.$transaction([
  prisma.member.create({ data: { ... } }),
  prisma.invite.delete({ where: { id: inviteId } }),
])
```

### Callback interativo (para quando uma operacao depende do resultado da outra)
```typescript
await prisma.$transaction(async (tx) => {
  const member = await tx.member.create({ data: { ... } })
  await tx.invite.delete({ where: { id: inviteId } })
  // pode usar member.id aqui se necessario
})
```

## Variacao: aceitar convite com verificacoes adicionais

```typescript
// Verificar se usuario ja e membro da organizacao
const existingMember = await prisma.member.findUnique({
  where: {
    organizationId_userId: {
      organizationId: invite.organizationId,
      userId,
    },
  },
})

if (existingMember) {
  throw new BadRequestError('User is already a member of this organization.')
}
```