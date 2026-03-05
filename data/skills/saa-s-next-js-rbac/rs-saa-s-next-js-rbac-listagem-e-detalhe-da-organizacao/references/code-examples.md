# Code Examples: Rotas de Listagem e Detalhe de Organizacao

## Exemplo completo: getOrganization (detalhe)

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get details from organization',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            organization: z.object({
              id: z.string().uuid(),
              name: z.string(),
              slug: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean(),
              avatarUrl: z.string().url().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              ownerId: z.string().uuid(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      // getCurrentUserMembership ja valida que o usuario e membro
      const { organization } = await request.getCurrentUserMembership(slug)

      return { organization }
    },
  )
}
```

## Exemplo completo: getOrganizations (listagem)

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'

export async function getOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get organizations where user is a member',
        response: {
          200: z.object({
            organizations: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                role: roleSchema,
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const userId = await request.getCurrentUserId()

      const organizations = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          // Traz somente a role do usuario logado, nao de todos os membros
          members: {
            select: { role: true },
            where: { userId },
          },
        },
        where: {
          // Filtra organizacoes onde o usuario e membro
          members: {
            some: { userId },
          },
        },
      })

      // Reshape: achata members[0].role para o nivel raiz
      const organizationsWithUserRole = organizations.map(
        ({ members, ...org }) => ({
          ...org,
          role: members[0].role,
        }),
      )

      return { organizations: organizationsWithUserRole }
    },
  )
}
```

## Registro das rotas no server

```typescript
// server.ts
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'

app.register(getOrganization)
app.register(getOrganizations)
```

## Padrao de destructuring para reshape

```typescript
// Padrao generico para achatar relacoes do Prisma
const items = rawItems.map(({ relation, ...rest }) => ({
  ...rest,
  fieldName: relation[0].desiredField,
}))
```

## Variacao: listagem com multiplas relacoes

```typescript
// Se precisar trazer role E outro dado de relacao
const organizations = await prisma.organization.findMany({
  select: {
    id: true,
    name: true,
    members: {
      select: { role: true },
      where: { userId },
    },
    _count: {
      select: { members: true },
    },
  },
  where: { members: { some: { userId } } },
})

const result = organizations.map(({ members, _count, ...org }) => ({
  ...org,
  role: members[0].role,
  membersCount: _count.members,
}))
```