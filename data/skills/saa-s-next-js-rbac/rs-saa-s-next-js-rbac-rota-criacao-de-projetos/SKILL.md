---
name: rs-saas-nextjs-rbac-rota-criacao-projetos
description: "Enforces the pattern for creating resource routes with RBAC permission checks in Fastify + Prisma APIs. Use when user asks to 'create a route', 'add an endpoint', 'implement CRUD', or 'create a project endpoint' in a multi-tenant SaaS app. Applies rules: org-scoped routes via URL prefix, permission check before mutation, Prisma create with ownership. Make sure to use this skill whenever building authenticated resource creation endpoints. Not for frontend components, auth flows, or database schema design."
---

# Rota de Criacao de Recursos com RBAC

> Toda rota de criacao de recurso em SaaS multi-tenant segue: extrair org da URL, verificar permissao, criar recurso com ownership.

## Rules

1. **Prefixe a URL com a organizacao** — `POST /organizations/:slug/projects`, porque todo recurso pertence a uma organizacao e o slug identifica o contexto
2. **Verifique permissao ANTES da mutacao** — chame `getUserPermissions` e teste com `cannot` antes de tocar no banco, porque RBAC deve bloquear antes de qualquer side-effect
3. **Crie com ownership explicito** — sempre passe `organizationId` e `ownerId` no create, porque rastreabilidade de quem criou e onde e fundamental
4. **Use slug gerado automaticamente** — passe o nome por `createSlug()` para gerar o slug do recurso, porque slugs manuais causam colisoes e inconsistencias
5. **Retorne apenas o ID** — a resposta de criacao retorna `{ projectId }`, porque o cliente decide se precisa buscar mais dados

## How to write

### Rota de criacao com RBAC

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app.withTypeProvider().register(auth).post(
    '/organizations/:slug/projects',
    {
      schema: {
        tags: ['project'],
        summary: 'Create a new project',
        params: z.object({ slug: z.string() }),
        body: z.object({
          name: z.string(),
          description: z.string(),
        }),
        response: { 201: z.object({ projectId: z.string().uuid() }) },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()
      const { organization, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Project')) {
        throw new UnauthorizedError('You are not allowed to create new projects.')
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

## Example

**Before (sem RBAC, sem org scope):**
```typescript
app.post('/projects', async (request, reply) => {
  const { name, description } = request.body
  const project = await prisma.project.create({
    data: { name, description },
  })
  return reply.send({ project })
})
```

**After (com RBAC e org scope):**
```typescript
app.post('/organizations/:slug/projects', async (request, reply) => {
  const { slug } = request.params
  const userId = await request.getCurrentUserId()
  const { organization, membership } = await request.getUserMembership(slug)

  const { cannot } = getUserPermissions(userId, membership.role)
  if (cannot('create', 'Project')) {
    throw new UnauthorizedError('You are not allowed to create new projects.')
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
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Recurso pertence a org | Prefixe rota com `/organizations/:slug/` |
| Acao de escrita (POST/PUT/DELETE) | Verifique permissao com `cannot` antes |
| Recurso tem dono | Passe `ownerId` no create |
| Recurso precisa de slug | Use `createSlug(name)` automaticamente |
| Resposta de criacao | Retorne apenas `{ resourceId }` com status 201 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `POST /projects` (sem org) | `POST /organizations/:slug/projects` |
| Criar recurso e depois checar permissao | Checar permissao antes do `prisma.create` |
| `return { project }` (objeto inteiro) | `return { projectId: project.id }` |
| Slug manual no body | `slug: createSlug(name)` gerado do nome |
| Hardcode do organizationId | Extrair via `getUserMembership(slug)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
