# Code Examples: Criacao de Rotas CRUD com Fastify + Zod + Prisma

## Exemplo completo da rota (como mostrado na aula)

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create a new organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().optional(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationByDomain = await prisma.organization.findUnique({
            where: { domain },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with same domain already exists.'
            )
          }
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      }
    )
  }
```

## Funcao createSlug (utils)

```typescript
// src/utils/create-slug.ts
export function createSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
}
```

## Registro da rota no servidor

```typescript
// No arquivo do servidor (server.ts ou app.ts)
import { createOrganization } from './routes/orgs/create-organization'

app.register(createOrganization)
```

## Teste via Swagger

Request body enviado na demonstracao:
```json
{
  "name": "Skillz",
  "domain": "skillz.team",
  "shouldAttachUsersByDomain": true
}
```

Response (201):
```json
{
  "organizationId": "uuid-gerado-aqui"
}
```

## Variacao: rota sem campo optional

```typescript
// Quando todos os campos sao obrigatorios, schema mais simples
body: z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
}),
```

## Variacao: verificacao de duplicidade em multiplos campos

```typescript
// Se precisar checar slug E domain
if (domain) {
  const existingByDomain = await prisma.organization.findUnique({
    where: { domain },
  })
  if (existingByDomain) {
    throw new BadRequestError('Domain already in use.')
  }
}

const existingBySlug = await prisma.organization.findUnique({
  where: { slug: createSlug(name) },
})
if (existingBySlug) {
  throw new BadRequestError('Organization with similar name already exists.')
}
```

## Variacao: nested create com multiplos relacionamentos

```typescript
const organization = await prisma.organization.create({
  data: {
    name,
    slug: createSlug(name),
    ownerId: userId,
    members: {
      create: { userId, role: 'ADMIN' },
    },
    // Se precisar criar outros relacionamentos
    settings: {
      create: { theme: 'default', language: 'pt-BR' },
    },
  },
})
```