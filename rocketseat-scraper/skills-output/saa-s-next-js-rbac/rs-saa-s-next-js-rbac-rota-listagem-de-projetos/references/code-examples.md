# Code Examples: Rota de Listagem de Projetos

## Exemplo completo da rota de listagem

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all organization projects',
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  ownerId: z.string().uuid(),
                  avatarUrl: z.string().url().nullable(),
                  organizationId: z.string().uuid(),
                  createdAt: z.date(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role
        )

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            'You are not allowed to see organization projects.'
          )
        }

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
          },
        })

        return reply.send({ projects })
      }
    )
}
```

## Comparacao: Rota de detalhe vs listagem

### Detalhe (findFirst + slug do projeto)
```typescript
const project = await prisma.project.findFirst({
  where: {
    slug: projectSlug,
    organizationId: organization.id,
  },
  select: {
    id: true,
    name: true,
    slug: true,
    ownerId: true,
    avatarUrl: true,
    organizationId: true,
    // Sem createdAt no detalhe
  },
})
```

### Listagem (findMany + orderBy)
```typescript
const projects = await prisma.project.findMany({
  where: {
    organizationId: organization.id,
    // Sem filtro por slug individual
  },
  orderBy: {
    createdAt: 'desc',
  },
  select: {
    id: true,
    name: true,
    slug: true,
    ownerId: true,
    avatarUrl: true,
    organizationId: true,
    createdAt: true, // Adicionado na listagem
  },
})
```

## Registro da rota no server

```typescript
// server.ts ou app.ts
import { getProjects } from './routes/projects/get-projects'

// Registrar junto com as demais rotas
app.register(getProjects)
```

## Schema de resposta: objeto unico vs array

### Objeto unico (detalhe)
```typescript
response: {
  200: z.object({
    project: z.object({
      id: z.string().uuid(),
      name: z.string(),
      // ...
    }),
  }),
}
```

### Array (listagem)
```typescript
response: {
  200: z.object({
    projects: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        createdAt: z.date(),
        // ...
      })
    ),
  }),
}
```

## Correcao de metodo HTTP

```typescript
// ERRADO: copiado da rota de criacao
app.post('/organizations/:slug/projects', ...)

// CORRETO: listagem usa GET
app.get('/organizations/:slug/projects', ...)
```