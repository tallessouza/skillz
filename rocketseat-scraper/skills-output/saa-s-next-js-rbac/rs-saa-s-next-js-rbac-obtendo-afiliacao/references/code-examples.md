# Code Examples: Obtendo Afiliação

## 1. Tipagem do getUserMembership no Fastify

```typescript
// No arquivo de types do Fastify
declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(slug: string): Promise<{
      organization: Organization
      membership: Member
    }>
  }
}
```

## 2. Implementação completa do getUserMembership

```typescript
fastify.decorateRequest('getUserMembership', async function (slug: string) {
  const userId = await this.getCurrentUserId()

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organization: {
        slug,
      },
    },
    include: {
      organization: true,
    },
  })

  if (!member) {
    throw new UnauthorizedError(
      'You are not a member of this organization.'
    )
  }

  const { organization, ...membership } = member

  return { organization, membership }
})
```

## 3. Rota getMembership completa

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { roleSchema } from '@saas/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get user membership on organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string(),
                role: roleSchema,
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return {
          membership: {
            id: membership.id,
            role: roleSchema.parse(membership.role),
            organizationId: membership.organizationId,
          },
        }
      },
    )
}
```

## 4. Registro da rota no servidor

```typescript
// server.ts
import { getMembership } from './routes/orgs/get-membership'

app.register(getMembership)
```

## 5. Padrão de uso em rotas que precisam de permissão

```typescript
// Qualquer rota futura que precise de permissões
export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put('/organizations/:slug', { /* schema */ }, async (request) => {
      const { slug } = request.params
      const { membership, organization } = await request.getUserMembership(slug)

      // Agora tem membership.role para checar permissões
      // E organization para contexto
    })
}
```

## 6. Re-export do roleSchema

```typescript
// No módulo de auth (index.ts)
export * from './roles'
// Isso disponibiliza roleSchema para import:
// import { roleSchema } from '@saas/auth'
```