# Code Examples: Rota de Dados de Faturamento

## Exemplo completo da rota

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Get billing information from organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError(
            'You are not allowed to get billing details from this organization.'
          )
        }

        const [amountOfMembers, amountOfProjects] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: { not: 'BILLING' },
            },
          }),
          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        return {
          billing: {
            seats: {
              amount: amountOfMembers,
              unit: 10,
              price: amountOfMembers * 10,
            },
            projects: {
              amount: amountOfProjects,
              unit: 20,
              price: amountOfProjects * 20,
            },
            total: amountOfMembers * 10 + amountOfProjects * 20,
          },
        }
      }
    )
}
```

## Registro no servidor

```typescript
// server.ts
import { getOrganizationBilling } from './routes/billing/get-organization-billing'

// ... outras rotas ...
app.register(getOrganizationBilling)
```

## Variacao: billing com mais categorias

Se o SaaS cobrar por storage ou API calls alem de membros e projetos:

```typescript
const [amountOfMembers, amountOfProjects, storageInGb] = await Promise.all([
  prisma.member.count({
    where: { organizationId: organization.id, role: { not: 'BILLING' } },
  }),
  prisma.project.count({
    where: { organizationId: organization.id },
  }),
  getStorageUsage(organization.id), // funcao customizada
])

return {
  billing: {
    seats: { amount: amountOfMembers, unit: 10, price: amountOfMembers * 10 },
    projects: { amount: amountOfProjects, unit: 20, price: amountOfProjects * 20 },
    storage: { amount: storageInGb, unit: 5, price: storageInGb * 5 },
    total: amountOfMembers * 10 + amountOfProjects * 20 + storageInGb * 5,
  },
}
```

## Variacao: precos configuraveis

```typescript
const PRICING = {
  seats: 10,
  projects: 20,
} as const

return {
  billing: {
    seats: {
      amount: amountOfMembers,
      unit: PRICING.seats,
      price: amountOfMembers * PRICING.seats,
    },
    projects: {
      amount: amountOfProjects,
      unit: PRICING.projects,
      price: amountOfProjects * PRICING.projects,
    },
    total:
      amountOfMembers * PRICING.seats + amountOfProjects * PRICING.projects,
  },
}
```

## Query com exclusao de role — detalhamento

```typescript
// Contar apenas membros "reais" (que consomem seats)
prisma.member.count({
  where: {
    organizationId: organization.id,
    role: { not: 'BILLING' }, // BILLING members don't count as seats
  },
})

// Se tivesse multiplas roles para excluir:
prisma.member.count({
  where: {
    organizationId: organization.id,
    role: { notIn: ['BILLING', 'GUEST'] },
  },
})
```