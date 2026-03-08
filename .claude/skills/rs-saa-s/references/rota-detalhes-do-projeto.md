---
name: rs-saas-next-rbac-rota-detalhes-projeto
description: "Applies the pattern for building detail routes (GET single resource) in Fastify APIs with Prisma and Zod. Use when user asks to 'create a get route', 'fetch project details', 'build a detail endpoint', 'return single resource', or 'create findUnique route'. Enforces slug-based lookups, scoped queries, selective field returns, and Zod response typing. Make sure to use this skill whenever building GET detail endpoints in Fastify+Prisma APIs. Not for list/collection routes, create/update/delete routes, or frontend data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, project]
---

# Rota de Detalhes de Recurso (GET Single)

> Ao criar rotas de detalhes, use slug em vez de id na URL, selecione apenas os campos necessarios, e tipe a resposta com Zod para garantir compatibilidade com o Prisma.

## Rules

1. **Use slug na URL, nao id** — `/orgs/:orgSlug/projects/:projectSlug` nao `/projects/:id`, porque a URL fica legivel e evita duas chamadas no frontend
2. **Escope a busca pela organizacao** — sempre filtre `organization.id` junto com o slug, porque um projeto so pode ser acessado dentro da sua organizacao
3. **Use select explicito** — liste cada campo retornado no `select` do Prisma, porque evita vazamento de dados sensiveis e documenta o contrato da API
4. **Trate not found antes de tipar** — faca `if (!resource) throw new BadRequestError()` antes do return, porque garante que o TypeScript infere o tipo sem null
5. **Tipe a resposta com Zod** — o schema de resposta deve ser compativel com o retorno do Prisma select, porque o TypeScript valida isso em build time
6. **Valide permissao antes da query** — verifique `getUserPermissions` antes de buscar no banco, porque evita queries desnecessarias para usuarios sem acesso

## How to write

### Estrutura da rota de detalhes

```typescript
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProject(app: FastifyInstance) {
  app.register(auth).get(
    '/organizations/:orgSlug/projects/:projectSlug',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Get project details',
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

      // 1. Validar permissao
      const { organization } = await request.getUserMembership(orgSlug)

      // 2. Buscar com select explicito e escopo por org
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

      // 3. Tratar not found
      if (!project) {
        throw new BadRequestError('Project not found.')
      }

      // 4. Retornar tipado
      return reply.send({ project })
    },
  )
}
```

## Example

**Before (anti-pattern):**
```typescript
// Busca por id na URL, sem select, sem escopo
app.get('/projects/:id', async (request) => {
  const { id } = request.params
  const project = await prisma.project.findUnique({ where: { id } })
  return { project }
})
```

**After (com esta skill):**
```typescript
// Slug na URL, select explicito, escopo por org, resposta tipada
app.get('/organizations/:orgSlug/projects/:projectSlug', async (request) => {
  const { orgSlug, projectSlug } = request.params
  const { organization } = await request.getUserMembership(orgSlug)

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug, organizationId: organization.id },
    select: { id: true, name: true, slug: true, description: true, avatarUrl: true, organizationId: true,
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
  })

  if (!project) throw new BadRequestError('Project not found.')
  return reply.send({ project })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Recurso acessado por URL publica | Use slug no path param |
| Recurso so acessado internamente | id e aceitavel |
| Relacao aninhada (owner, author) | Use select aninhado, retorne apenas campos publicos |
| Campo pode ser null no banco | Use `z.string().nullable()` no schema |
| Recurso nao encontrado | `throw new BadRequestError()` antes do return |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findUnique({ where: { id } })` em rota publica | `findUnique({ where: { slug, organizationId } })` |
| `prisma.project.findUnique({ where: { slug } })` sem escopo | Adicione `organizationId: organization.id` no where |
| Retornar `project` sem select (todos os campos) | Use `select` explicito com cada campo listado |
| `return { project }` sem verificar null | `if (!project) throw new BadRequestError()` antes |
| Tipar resposta manualmente com interface | Use `z.object()` no schema de resposta do Fastify |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
