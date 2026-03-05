---
name: rs-saas-nextjs-rbac-listagem-detalhe-org
description: "Enforces patterns for building Fastify API routes that list and detail resources using Prisma and Zod. Use when user asks to 'create a route', 'list resources', 'get details endpoint', 'build API endpoint', or 'return data from database'. Applies rules: explicit Zod response typing per field, reshape nested Prisma relations into flat API responses, use select to limit returned fields on listings. Make sure to use this skill whenever generating Fastify routes with Prisma queries. Not for frontend components, authentication logic, or permission checks."
---

# Rotas de Listagem e Detalhe com Fastify + Prisma + Zod

> Sempre tipar explicitamente cada campo da resposta com Zod e reformatar dados do Prisma antes de retornar na API.

## Rules

1. **Tipar cada campo da resposta individualmente** — nao use schemas gerados do Prisma, porque se trocar o ORM a rota continua validando o contrato
2. **Use `select` em queries de listagem** — nunca retorne `findMany` sem select, porque listagens expõem dados desnecessarios
3. **Reformate relações aninhadas em campos planos** — `members[0].role` vira `role` no mesmo nivel dos outros campos, porque o consumidor da API nao precisa conhecer a estrutura do banco
4. **Use `slug` em vez de `id` nos parametros de rota** — rotas publicas usam slug para URLs legiveis
5. **Filtre relações com `where` dentro de `select`** — ao trazer role do usuario, filtre por `userId` para nao expor dados de outros membros

## How to write

### Rota de detalhe (GET com slug)

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get details from organization',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            organization: z.object({
              id: z.string().uuid(),
              name: z.string(),
              slug: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean(),
              avatarUrl: z.string().url().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              ownerId: z.string().uuid(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const { membership, organization } =
        await request.getCurrentUserMembership(slug)

      return { organization }
    },
  )
}
```

### Rota de listagem com reshaping de relações

```typescript
export async function getOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get organizations where user is a member',
        response: {
          200: z.object({
            organizations: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                role: roleSchema,
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const userId = await request.getCurrentUserId()

      const organizations = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          members: {
            select: { role: true },
            where: { userId },
          },
        },
        where: {
          members: { some: { userId } },
        },
      })

      const organizationsWithUserRole = organizations.map(
        ({ members, ...org }) => ({
          ...org,
          role: members[0].role,
        }),
      )

      return { organizations: organizationsWithUserRole }
    },
  )
}
```

## Example

**Before (tipagem preguicosa e dados brutos):**
```typescript
app.get('/organizations', async (request) => {
  const orgs = await prisma.organization.findMany({
    include: { members: true },
  })
  return { data: orgs }
})
```

**After (tipagem explicita e dados reformatados):**
```typescript
app.withTypeProvider<ZodTypeProvider>().get('/organizations', {
  schema: {
    response: {
      200: z.object({
        organizations: z.array(z.object({
          id: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          role: roleSchema,
        })),
      }),
    },
  },
}, async (request) => {
  const userId = await request.getCurrentUserId()
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true, slug: true, members: { select: { role: true }, where: { userId } } },
    where: { members: { some: { userId } } },
  })
  return {
    organizations: organizations.map(({ members, ...org }) => ({
      ...org, role: members[0].role,
    })),
  }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota de listagem | Use `select` para limitar campos, nunca `include` |
| Relação aninhada na resposta | Reshape com `.map()` para achatar a estrutura |
| Rota de detalhe para formulario | Retorne todos os campos que o formulario precisa |
| Identificador na URL | Use `slug` para rotas publicas, `id` para internas |
| Campo nullable no banco | Marque como `.nullable()` no schema Zod |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `include: { members: true }` em listagem | `select: { members: { select: { role: true }, where: { userId } } }` |
| Response sem tipagem Zod | `response: { 200: z.object({...}) }` |
| Retornar `members[0].role` aninhado | Reshape: `{ ...org, role: members[0].role }` |
| Schema gerado automatico do Prisma como response | Schema Zod manual campo a campo |
| `findMany()` sem `where` para dados do usuario | `findMany({ where: { members: { some: { userId } } } })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-listagem-e-detalhe-da-organizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-listagem-e-detalhe-da-organizacao/references/code-examples.md)
