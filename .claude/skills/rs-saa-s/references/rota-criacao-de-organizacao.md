---
name: rs-saas-nextjs-rbac-rota-criacao-org
description: "Applies Fastify route creation patterns with Zod validation, auth middleware, and Prisma nested writes when building CRUD API routes. Use when user asks to 'create a route', 'add an endpoint', 'build CRUD', 'create organization endpoint', or 'fastify route with validation'. Enforces: Zod schema for body, auth middleware registration, duplicate checks before create, nested member creation, typed responses. Make sure to use this skill whenever creating Fastify API routes with Prisma. Not for frontend components, database migrations, or authentication middleware setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, organization]
---

# Criacao de Rotas CRUD com Fastify + Zod + Prisma

> Toda rota CRUD segue o padrao: validar schema → autenticar → verificar duplicidade → criar com relacionamentos → retornar apenas o ID.

## Rules

1. **Registre auth antes da rota** — `app.withTypeProvider<ZodTypeProvider>().register(auth).post(...)` porque o middleware de autenticacao precisa estar no escopo da rota
2. **Valide o body com Zod inline** — defina o schema no objeto de opcoes da rota, nao em arquivo separado, porque mantém schema e handler co-localizados
3. **Use `optional()` ao inves de `nullish()` para campos que nao aceitam null no banco** — `nullish` permite `null | undefined`, mas se o Prisma nao aceita `null`, use `optional()` que permite apenas `undefined`
4. **Verifique duplicidade antes de criar** — use `findUnique` no campo unique e lance `BadRequest` se encontrar, porque o banco lanca erro generico sem mensagem util
5. **Crie relacionamentos aninhados no mesmo `create`** — use `members: { create: { ... } }` ao inves de criar separado, porque garante atomicidade
6. **Retorne apenas o ID na resposta de criacao** — `{ organizationId: org.id }` com status 201, porque o frontend so precisa do ID para navegacao

## How to write

### Estrutura completa de uma rota de criacao

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

## Example

**Before (erros comuns):**
```typescript
// Sem validacao, sem auth, sem check de duplicidade
app.post('/organizations', async (request, reply) => {
  const data = request.body as any
  const org = await prisma.organization.create({ data })
  // Cria membro em operacao separada (nao atomico)
  await prisma.member.create({ data: { orgId: org.id, userId: data.userId } })
  return reply.send(org) // Retorna objeto inteiro
})
```

**After (com este skill aplicado):**
```typescript
// Auth registrado, Zod validando, duplicidade checada, criacao atomica
app.withTypeProvider<ZodTypeProvider>()
  .register(auth)
  .post('/organizations', {
    schema: {
      body: z.object({ name: z.string(), domain: z.string().optional() }),
      response: { 201: z.object({ organizationId: z.string().uuid() }) },
    },
  }, async (request, reply) => {
    const userId = await request.getCurrentUserId()
    const { name, domain } = request.body

    if (domain) {
      const existing = await prisma.organization.findUnique({ where: { domain } })
      if (existing) throw new BadRequestError('Domain already in use.')
    }

    const org = await prisma.organization.create({
      data: {
        name, slug: createSlug(name), domain, ownerId: userId,
        members: { create: { userId, role: 'ADMIN' } },
      },
    })

    return reply.status(201).send({ organizationId: org.id })
  })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo pode ser null E undefined | Use `nullish()` |
| Campo pode ser undefined mas NAO null (Prisma) | Use `optional()` |
| Recurso tem campo unique (domain, email, slug) | Verifique duplicidade antes do create |
| Criador do recurso precisa ser membro | Use nested `members: { create }` no mesmo create |
| Rota precisa de autenticacao | `.register(auth)` antes do metodo HTTP |
| Swagger precisa do cadeado | Adicione `security: [{ bearerAuth: [] }]` no schema |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `request.body as any` | Schema Zod no objeto de opcoes da rota |
| `reply.send(organization)` em POST | `reply.status(201).send({ organizationId: org.id })` |
| Create + Create separados para recurso + membro | Nested create atomico no Prisma |
| `z.string().nullish()` quando Prisma nao aceita null | `z.string().optional()` |
| `tags: ['auth']` para rotas de CRUD | `tags: ['organizations']` (o dominio real) |

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
