# Code Examples: Rota de Criacao de Projetos

## Exemplo completo da rota

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['project'],
          summary: 'Create a new project',
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'You are not allowed to create new projects.',
          )
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({ projectId: project.id })
      },
    )
}
```

## Registro no server.ts

```typescript
import { createProject } from './routes/projects/create-project'

// Dentro do setup do Fastify:
app.register(createProject)
```

## Padrao reutilizavel para outras rotas de criacao

O mesmo padrao se aplica a qualquer recurso dentro de uma organizacao. Exemplo para criar um "team":

```typescript
export async function createTeam(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/teams',
      {
        schema: {
          tags: ['team'],
          summary: 'Create a new team',
          params: z.object({ slug: z.string() }),
          body: z.object({
            name: z.string(),
            description: z.string().optional(),
          }),
          response: {
            201: z.object({ teamId: z.string().uuid() }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Team')) {
          throw new UnauthorizedError(
            'You are not allowed to create new teams.',
          )
        }

        const { name, description } = request.body

        const team = await prisma.team.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({ teamId: team.id })
      },
    )
}
```

## Estrutura de pastas sugerida

```
src/http/routes/
├── auth/
│   ├── authenticate.ts
│   └── create-account.ts
├── orgs/
│   └── create-organization.ts
└── projects/
    └── create-project.ts
```

## Schema do Prisma (referencia)

```prisma
model Project {
  id             String   @id @default(uuid())
  name           String
  slug           String   @unique
  description    String
  organizationId String
  ownerId        String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  owner        User         @relation(fields: [ownerId], references: [id])

  @@map("projects")
}
```