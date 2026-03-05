# Code Examples: Rota de Detalhes do Projeto

## Exemplo completo da rota

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                description: z.string(),
                avatarUrl: z.string().nullable(),
                organizationId: z.string().uuid(),
                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        // Verificar permissao usando CASL
        const { cannot } = getUserPermissions(membership.userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError('You are not allowed to see this project.')
        }

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found.')
        }

        return reply.send({ project })
      },
    )
}
```

## Registro no server

```typescript
// server.ts
import { getProject } from './routes/projects/get-project'

app.register(getProject)
```

## Prisma select — comparacao

### Sem select (retorna tudo — perigoso):
```typescript
const project = await prisma.project.findUnique({
  where: { slug: projectSlug },
})
// Retorna TODOS os campos, incluindo possiveis dados sensiveis
```

### Com select (retorna apenas o necessario):
```typescript
const project = await prisma.project.findUnique({
  where: { slug: projectSlug, organizationId: organization.id },
  select: {
    id: true,
    name: true,
    slug: true,
    description: true,
    avatarUrl: true,
    organizationId: true,
    owner: {
      select: { id: true, name: true, avatarUrl: true },
    },
  },
})
// Retorna objeto tipado com apenas os campos listados
```

## Padrao para nullable no Zod

```typescript
// Campo que pode ser null no banco
avatarUrl: z.string().nullable()

// Campo que sempre existe
name: z.string()

// Campo UUID
id: z.string().uuid()
```

## Tipagem do response — como o TypeScript valida

```typescript
// Se o schema diz z.string() mas o Prisma retorna number,
// o TypeScript acusa erro em reply.send({ project })
// Isso funciona como validacao em tempo de compilacao

response: {
  200: z.object({
    project: z.object({
      id: z.string().uuid(), // Prisma retorna string UUID — OK
      name: z.string(),       // Prisma retorna string — OK
      // count: z.number(),   // Se adicionasse isso, TypeScript erraria
    }),
  }),
},
```