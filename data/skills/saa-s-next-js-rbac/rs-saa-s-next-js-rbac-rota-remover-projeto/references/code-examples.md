# Code Examples: Rota de Deletar Projeto

## Exemplo completo da aula

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { projectSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Delete a project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        // Buscar projeto com escopo organizacional
        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found.')
        }

        // Parse para subject CASL (necessario para ownership check)
        const authProject = projectSchema.parse(project)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to delete this project.',
          )
        }

        await prisma.project.delete({
          where: { id: projectId },
        })

        return reply.status(204).send()
      },
    )
}
```

## Registro da rota no app

```typescript
// Em routes/index.ts ou similar
import { deleteProject } from './projects/delete-project'

app.register(deleteProject)
```

## Padrao comparativo: Shutdown Organization (mesmo padrao)

A rota de shutdown organization segue exatamente o mesmo padrao de parse + verificacao CASL:

```typescript
// O mesmo padrao aplicado a organizacao
const authOrganization = organizationSchema.parse(organization)
const { cannot } = getUserPermissions(userId, membership.role)

if (cannot('delete', authOrganization)) {
  throw new UnauthorizedError('You are not allowed to shutdown this organization.')
}
```

## Variacao: Aplicando o mesmo padrao para outros recursos

### Delete Member
```typescript
const authMember = memberSchema.parse(member)
if (cannot('delete', authMember)) {
  throw new UnauthorizedError('You are not allowed to remove this member.')
}
await prisma.member.delete({ where: { id: memberId } })
return reply.status(204).send()
```

### Delete Invite
```typescript
const authInvite = inviteSchema.parse(invite)
if (cannot('delete', authInvite)) {
  throw new UnauthorizedError('You are not allowed to revoke this invite.')
}
await prisma.invite.delete({ where: { id: inviteId } })
return reply.status(204).send()
```

## Schema Zod para response 204

```typescript
// A response 204 sempre segue este padrao
response: {
  204: z.null(),
}
```

Nao use `z.void()` ou `z.undefined()` — `z.null()` e o correto para representar ausencia de body no Fastify com Zod type provider.