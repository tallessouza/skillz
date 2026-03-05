# Code Examples: Rota Atualizar Projeto

## Exemplo completo da rota (baseado na aula)

O instrutor partiu da rota de delete project e adaptou para update:

```typescript
// routes/update-project.ts
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserAbility } from '@/utils/get-user-ability'
import { UnauthorizedError } from '@/errors/unauthorized-error'

export async function updateProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/projects/:projectId',
    {
      schema: {
        params: z.object({
          projectId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { projectId } = request.params

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      })

      const ability = getUserAbility(request.user)

      if (!ability.can('update', project)) {
        throw new UnauthorizedError(
          'You are not allowed to update this project.'
        )
      }

      const { name, description } = request.body

      await prisma.project.update({
        where: { id: projectId },
        data: { name, description },
      })

      return reply.status(204).send()
    }
  )
}
```

## Processo de copia e adaptacao

O instrutor seguiu estes passos ao adaptar da rota de delete:

```typescript
// 1. ORIGINAL (delete project) - ponto de partida
app.delete('/projects/:projectId', async (request, reply) => {
  const { projectId } = request.params
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })
  const ability = getUserAbility(request.user)
  if (!ability.can('delete', project)) {
    throw new UnauthorizedError('You are not allowed to delete this project.')
  }
  await prisma.project.delete({ where: { id: projectId } })
  return reply.status(204).send()
})

// 2. ADAPTADO (update project) - mudancas feitas:
// - DELETE → PUT
// - 'delete' → 'update' na ability check
// - mensagem de erro atualizada
// - prisma.project.delete → prisma.project.update
// - adicionado body schema (name, description)
// - adicionado data: { name, description }
```

## Variacao: campos opcionais no update

Se quiser permitir update parcial (PATCH semantics):

```typescript
body: z.object({
  name: z.string().optional(),
  description: z.string().optional(),
}),

// No update, filtrar undefined
const data: Record<string, string> = {}
if (name !== undefined) data.name = name
if (description !== undefined) data.description = description

await prisma.project.update({
  where: { id: projectId },
  data,
})
```