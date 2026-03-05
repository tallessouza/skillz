---
name: rs-saas-nextjs-rbac-rota-billing
description: "Generates billing/faturamento API routes that count organization resources and calculate pricing tiers. Use when user asks to 'create billing route', 'add pricing endpoint', 'calculate subscription costs', 'count members and projects for billing', or 'build a usage-based billing API'. Applies patterns: permission check before billing data, Promise.all for parallel counts, exclude non-billable roles from counts, structured pricing response with seats/projects/total. Make sure to use this skill whenever building billing or subscription calculation endpoints in a SaaS app. Not for payment gateway integration, Stripe webhooks, or checkout flows."
---

# Rota de Dados de Faturamento

> Rotas de billing calculam custos a partir de contagens reais do banco, nunca de cache ou valores hardcoded por usuario.

## Rules

1. **Verifique permissao antes de qualquer query** — `cannot('get', 'Billing')` antes de contar recursos, porque dados financeiros sao sensiveis
2. **Use Promise.all para queries independentes** — contagem de membros e projetos nao dependem uma da outra, porque execucao paralela reduz latencia pela metade
3. **Exclua roles nao-faturáveis da contagem** — membros com role `BILLING` nao contam como seats, porque eles existem apenas para gerenciar pagamentos
4. **Estruture resposta em seats + projects + total** — cada secao com `amount`, `unit` (preco unitario), e `price` (total), porque o frontend precisa mostrar o breakdown
5. **Calcule total como soma dos sub-totais** — `(members * unitPrice) + (projects * unitPrice)`, porque multiplicacao tem precedencia sobre soma naturalmente

## How to write

### Estrutura da rota de billing

```typescript
export async function getOrganizationBilling(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get(
    '/organizations/:slug/billing',
    {
      schema: {
        tags: ['Billing'],
        summary: 'Get billing information from organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            billing: z.object({
              seats: z.object({
                amount: z.number(),
                unit: z.number(),
                price: z.number(),
              }),
              projects: z.object({
                amount: z.number(),
                unit: z.number(),
                price: z.number(),
              }),
              total: z.number(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()
      const { organization, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('get', 'Billing')) {
        throw new UnauthorizedError(
          'You are not allowed to get billing details from this organization.'
        )
      }

      const [amountOfMembers, amountOfProjects] = await Promise.all([
        prisma.member.count({
          where: {
            organizationId: organization.id,
            role: { not: 'BILLING' },
          },
        }),
        prisma.project.count({
          where: { organizationId: organization.id },
        }),
      ])

      return {
        billing: {
          seats: {
            amount: amountOfMembers,
            unit: 10,
            price: amountOfMembers * 10,
          },
          projects: {
            amount: amountOfProjects,
            unit: 20,
            price: amountOfProjects * 20,
          },
          total: amountOfMembers * 10 + amountOfProjects * 20,
        },
      }
    }
  )
}
```

### Registro no servidor

```typescript
// Em app.ts ou server.ts
app.register(getOrganizationBilling)
```

## Example

**Before (query sequencial, sem exclusao de role):**
```typescript
const members = await prisma.member.count({
  where: { organizationId: org.id },
})
const projects = await prisma.project.count({
  where: { organizationId: org.id },
})
return { total: members * 10 + projects * 20 }
```

**After (com Promise.all, exclusao de BILLING, resposta estruturada):**
```typescript
const [amountOfMembers, amountOfProjects] = await Promise.all([
  prisma.member.count({
    where: {
      organizationId: organization.id,
      role: { not: 'BILLING' },
    },
  }),
  prisma.project.count({
    where: { organizationId: organization.id },
  }),
])

return {
  billing: {
    seats: { amount: amountOfMembers, unit: 10, price: amountOfMembers * 10 },
    projects: { amount: amountOfProjects, unit: 20, price: amountOfProjects * 20 },
    total: amountOfMembers * 10 + amountOfProjects * 20,
  },
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Multiplas contagens independentes | `Promise.all([count1, count2])` |
| Role que nao deve ser cobrada | Filtrar com `role: { not: 'ROLE_NAME' }` |
| Resposta com breakdown de precos | Estruturar com `amount`, `unit`, `price` por categoria |
| Endpoint precisa de permissao RBAC | Checar `cannot('action', 'Subject')` antes de qualquer query |
| Tipagem da resposta Fastify+Zod | Extrair tipo do objeto e usar `z.object()` no schema |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Queries sequenciais para contagens independentes | `Promise.all([query1, query2])` |
| `return { total: 300 }` sem breakdown | `return { seats: {...}, projects: {...}, total }` |
| Contar todos os membros incluindo BILLING | `role: { not: 'BILLING' }` no filtro |
| Calcular billing sem checar permissao | `cannot('get', 'Billing')` antes |
| `(a * 10 + b) * 20` com parenteses errados | `a * 10 + b * 20` — multiplicacao ja tem precedencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
