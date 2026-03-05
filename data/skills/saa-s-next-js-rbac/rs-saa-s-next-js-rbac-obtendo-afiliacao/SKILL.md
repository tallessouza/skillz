---
name: rs-saas-nextjs-rbac-obtendo-afiliacao
description: "Applies the getUserMembership pattern when building permission-aware routes in Fastify SaaS APIs. Use when user asks to 'create a route with permissions', 'check user membership', 'get user role in organization', 'build organization-scoped route', or 'resolve permissions by slug'. Enforces slug-based org lookup, membership validation with organization include, and proper error handling for unauthorized access. Make sure to use this skill whenever creating routes that depend on user permissions within an organization context. Not for authentication setup, token generation, or CASL/ability definition."
---

# Obtendo Afiliação — Membership Resolution Pattern

> Toda rota que depende de permissões do usuário precisa primeiro resolver a membership dele na organização via slug.

## Rules

1. **Use slug, não ID da organização** — `orgs/skillz/projects` não `orgs/clkj2f0x0000.../projects`, porque o slug já é único (índice no banco) e produz URLs legíveis no front-end
2. **Crie getUserMembership no middleware de auth** — método reutilizável no request object, porque toda rota com permissão vai precisar dele
3. **Sempre inclua organization no query** — `include: { organization: true }`, porque rotas de permissão precisam dos dados da organização para mensagens de erro e contexto
4. **Valide membership antes de qualquer ação** — se não encontrou member, lance `UnauthorizedError` imediatamente, porque usuário sem membership não pode fazer nada na organização
5. **Separe organization e membership no retorno** — desestruture `{ organization, ...membership }`, porque consumers precisam de ambos separadamente

## How to write

### getUserMembership no middleware de auth

```typescript
// Dentro do plugin de autenticação do Fastify
fastify.decorateRequest('getUserMembership', async (slug: string) => {
  const userId = await request.getCurrentUserId()

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organization: { slug },
    },
    include: { organization: true },
  })

  if (!member) {
    throw new UnauthorizedError('You are not a member of this organization.')
  }

  const { organization, ...membership } = member
  return { organization, membership }
})
```

### Rota que consome membership

```typescript
export async function getMembership(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/organizations/:slug/membership', {
      schema: {
        tags: ['Organizations'],
        summary: 'Get user membership on organization',
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),
        response: {
          200: z.object({
            membership: z.object({
              id: z.string(),
              role: roleSchema,
              organizationId: z.string(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { slug } = request.params
      const { membership } = await request.getUserMembership(slug)

      return {
        membership: {
          id: membership.id,
          role: roleSchema.parse(membership.role),
          organizationId: membership.organizationId,
        },
      }
    })
}
```

## Example

**Before (sem membership pattern):**
```typescript
app.get('/organizations/:id/update', async (request) => {
  const userId = await request.getCurrentUserId()
  // Só tem o userId — não sabe a role, não sabe as permissões
  // Teria que fazer query manual toda vez
})
```

**After (com membership pattern):**
```typescript
app.get('/organizations/:slug/update', async (request) => {
  const { slug } = request.params
  const { membership, organization } = await request.getUserMembership(slug)
  // Tem role, organizationId, dados da org — pronto para checar permissões
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota precisa saber permissões do usuário | Use `getUserMembership(slug)` |
| Precisa do ID da organização no back-end | Extraia de `organization` retornado pelo membership |
| Front-end monta URL de organização | Use slug: `/orgs/${slug}/projects` |
| Enum role do Prisma não casa com Zod | Use `roleSchema.parse(membership.role)` |
| Rota não precisa de permissões | Use apenas `getCurrentUserId()` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Passar orgId na URL | Passar slug — é único e legível |
| Buscar org pelo ID e depois membership | Buscar membership com `organization: { slug }` em uma query |
| Query membership sem include organization | Sempre `include: { organization: true }` |
| Retornar todos os campos do member | Selecionar apenas `id`, `role`, `organizationId` |
| Checar permissões sem resolver membership | Sempre resolver membership primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
