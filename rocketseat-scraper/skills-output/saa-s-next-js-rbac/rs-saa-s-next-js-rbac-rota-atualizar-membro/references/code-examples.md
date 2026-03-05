# Code Examples: Rota Atualizar Membro

## Exemplo completo da rota

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { organization, membership } =
          await request.getUserMembership(slug)

        // Aqui entraria a verificacao de permissao CASL/RBAC
        // const authUser = userSchema.parse({ id: userId, role: membership.role })
        // if (cannot('update', 'User')) throw new UnauthorizedError(...)

        const { memberId } = request.params
        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id, // CRITICO: escopo de organizacao
          },
          data: {
            role,
          },
        })

        return reply.status(204).send()
      },
    )
}
```

## Registro da rota no app

```typescript
import { updateMember } from './routes/members/update-member'

// No arquivo principal de rotas ou app.ts
app.register(updateMember)
```

## Comparacao: GetMembers (base) vs UpdateMember (resultado)

### GetMembers (rota base copiada)
```typescript
// GET /organizations/:slug/members
// Params: slug
// Response: 200 com lista de membros
```

### UpdateMember (rota resultante)
```typescript
// PUT /organizations/:slug/members/:memberId
// Params: slug, memberId
// Body: { role }
// Response: 204 sem body
```

## Prisma update com escopo de organizacao

```typescript
// SEM escopo (VULNERAVEL)
await prisma.member.update({
  where: { id: memberId },
  data: { role },
})

// COM escopo (SEGURO)
await prisma.member.update({
  where: {
    id: memberId,
    organizationId: organization.id,
  },
  data: { role },
})
```

O segundo formato garante que o Prisma so atualiza se o membro realmente pertence a organizacao do usuario autenticado. Se o membro nao existir OU pertencer a outra organizacao, o Prisma lanca `RecordNotFound`.