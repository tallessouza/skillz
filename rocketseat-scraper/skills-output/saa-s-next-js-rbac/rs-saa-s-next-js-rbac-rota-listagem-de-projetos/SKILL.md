---
name: rs-saas-nextjs-rbac-listagem-projetos
description: "Applies Fastify route patterns for listing resources with RBAC in SaaS apps. Use when user asks to 'list projects', 'create a GET route', 'add pagination endpoint', 'list resources by organization', or 'build CRUD listing'. Enforces permission checks, ordering by createdAt desc, Zod response typing with z.array, and select optimization. Make sure to use this skill whenever building list/index endpoints in Fastify+Prisma projects. Not for single-resource detail routes, authentication, or frontend components."
---

# Rota de Listagem de Recursos (Fastify + Prisma + RBAC)

> Ao criar rotas de listagem, sempre verifique permissoes, ordene por data de criacao decrescente, e tipe a resposta como array no schema Zod.

## Rules

1. **Use GET, nunca POST para listagem** — rotas de listagem sao idempotentes, porque GET comunica a intencao correta ao cliente e ao Swagger
2. **Verifique permissao antes da query** — chame `getUserPermissions` e valide com `cannot` antes de acessar o banco, porque listagem sem permissao vaza dados
3. **Ordene por `createdAt: 'desc'`** — itens mais recentes primeiro, porque e o padrao esperado pelo usuario em listagens de projetos/recursos
4. **Tipe a resposta como `z.array(z.object({...}))`** — nunca retorne arrays sem tipagem Zod, porque o Swagger nao documenta corretamente sem schema
5. **Use `findMany` com `select` explicito** — nunca retorne todas as colunas, porque `select` otimiza a query e evita vazamento de dados sensiveis
6. **Nomeie a rota no plural** — `getProjects` nao `getProject`, porque listagem retorna multiplos itens e a nomenclatura deve refletir isso

## How to write

### Rota de listagem completa

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getProjects(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get(
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
      const { membership, organization } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(membership.userId, membership.role)

      if (cannot('get', 'Project')) {
        throw new UnauthorizedError('You are not allowed to see organization projects.')
      }

      const projects = await prisma.project.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: 'desc' },
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

## Example

**Before (erros comuns):**
```typescript
// POST ao inves de GET
app.post('/organizations/:slug/projects', ...)

// Sem orderBy — ordem indefinida
const projects = await prisma.project.findMany({
  where: { organizationId: organization.id },
})

// Resposta sem tipagem array
response: { 200: z.object({ projects: z.any() }) }
```

**After (com esta skill aplicada):**
```typescript
// GET correto para listagem
app.get('/organizations/:slug/projects', ...)

// Ordenado por criacao decrescente
const projects = await prisma.project.findMany({
  where: { organizationId: organization.id },
  orderBy: { createdAt: 'desc' },
  select: { id: true, name: true, slug: true, createdAt: true, ... },
})

// Resposta tipada como array
response: { 200: z.object({ projects: z.array(z.object({ ... })) }) }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota retorna multiplos itens | Use `findMany` + `z.array` + nome no plural |
| Rota de detalhe vs listagem | Mesma permissao CASL (`get`), mas `findFirst` vs `findMany` |
| Campo so necessario na listagem | Adicione ao `select` da listagem (ex: `createdAt`) |
| Precisa registrar a rota | Importe e chame no arquivo de server/app |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `app.post(...)` para listagem | `app.get(...)` |
| `findMany({})` sem `orderBy` | `findMany({ orderBy: { createdAt: 'desc' } })` |
| `z.any()` na resposta | `z.array(z.object({...}))` |
| `findMany` sem `select` | `findMany({ select: { ... } })` |
| Listagem sem check de permissao | `if (cannot('get', 'Project')) throw ...` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
