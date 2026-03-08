---
name: rs-saas-nextjs-rbac-delete-project
description: "Applies delete resource route pattern with ownership verification in Fastify RBAC APIs. Use when user asks to 'delete a resource', 'remove endpoint', 'create delete route', or 'implement resource deletion with permissions'. Enforces ownership check before deletion, 204 empty response, organization scoping, and CASL permission verification. Make sure to use this skill whenever implementing delete endpoints in multi-tenant SaaS APIs. Not for GET/POST/PUT routes, frontend deletion, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, casl, rbac, zod, project]
---

# Rota de Deletar Recurso com Verificacao de Permissao

> Ao criar rotas de exclusao, sempre verifique ownership e escopo organizacional antes de executar o delete.

## Rules

1. **Use metodo HTTP DELETE** — `app.delete()` nao `app.post()`, porque a semantica REST exige DELETE para remocao de recursos
2. **Retorne 204 sem body** — `return reply.status(204).send()`, porque exclusao bem-sucedida nao tem conteudo para retornar
3. **Valide escopo organizacional** — filtre por `organizationId` alem do `resourceId`, porque um usuario nao pode deletar recurso de outra organizacao
4. **Parse o modelo antes de verificar permissao** — `projectSchema.parse(project)` antes do `getUserPermissions`, porque CASL precisa do subject tipado para avaliar ownership
5. **Verifique existencia antes de deletar** — `findUnique` + throw se null, porque delete silencioso em recurso inexistente mascara bugs
6. **Use a ability correta** — `cannot('delete', authProject)` verifica ownership automaticamente via CASL, porque o model define que so o owner pode deletar

## How to write

### Rota DELETE com verificacao de permissao

```typescript
export async function deleteProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete(
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
      const { membership, organization } = await request.getUserMembership(slug)

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
          organizationId: organization.id,
        },
      })

      if (!project) {
        throw new BadRequestError('Project not found.')
      }

      const authProject = projectSchema.parse(project)
      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', authProject)) {
        throw new UnauthorizedError('You are not allowed to delete this project.')
      }

      await prisma.project.delete({
        where: { id: projectId },
      })

      return reply.status(204).send()
    },
  )
}
```

## Example

**Before (sem verificacao de ownership):**
```typescript
app.delete('/projects/:id', async (request, reply) => {
  const { id } = request.params
  await prisma.project.delete({ where: { id } })
  return reply.status(200).json({ message: 'Deleted' })
})
```

**After (com ownership e escopo organizacional):**
```typescript
app.delete('/organizations/:slug/projects/:projectId', async (request, reply) => {
  const { slug, projectId } = request.params
  const userId = await request.getCurrentUserId()
  const { membership, organization } = await request.getUserMembership(slug)

  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId: organization.id },
  })

  if (!project) {
    throw new BadRequestError('Project not found.')
  }

  const authProject = projectSchema.parse(project)
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('delete', authProject)) {
    throw new UnauthorizedError('You are not allowed to delete this project.')
  }

  await prisma.project.delete({ where: { id: projectId } })
  return reply.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso pertence a uma organizacao | Filtre por `organizationId` no `findUnique` |
| Permissao depende de ownership | Parse o model com schema CASL antes de verificar |
| DELETE bem-sucedido | Retorne 204 com body nulo |
| Recurso nao encontrado | Throw `BadRequestError` antes de verificar permissao |
| Rota ja testada em projeto anterior | Teste no frontend, corrija se necessario |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `return reply.json({ deleted: true })` | `return reply.status(204).send()` |
| `prisma.project.delete({ where: { id } })` sem verificar org | `prisma.project.findUnique({ where: { id, organizationId } })` primeiro |
| `if (role === 'ADMIN')` hardcoded | `if (cannot('delete', authProject))` via CASL |
| `prisma.project.delete()` sem verificar existencia | `findUnique` + throw se null, depois `delete` |
| Verificar permissao com objeto raw do Prisma | `projectSchema.parse(project)` para tipar o subject CASL |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
