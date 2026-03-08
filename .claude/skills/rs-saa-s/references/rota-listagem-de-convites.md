---
name: rs-saas-nextjs-rbac-listagem-convites
description: "Generates invite listing routes in Fastify/Prisma APIs when user asks to 'list invites', 'get all invites', 'fetch organization invites', or 'create a GET route for invites'. Applies patterns: permission check, field selection, author relation select, descending date ordering, typed array response. Make sure to use this skill whenever building invite or membership listing endpoints in multi-tenant SaaS apps. Not for creating invites, accepting invites, or revoking invites."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, invites, members]
---

# Rota de Listagem de Convites

> Ao criar rotas de listagem em APIs multi-tenant, sempre filtre por organizacao, selecione apenas campos necessarios, ordene por data e type a resposta como array.

## Rules

1. **Filtre sempre pelo tenant** — `where: { organizationId }`, porque sem filtro voce vaza dados entre organizacoes
2. **Selecione campos explicitamente** — use `select` ao inves de retornar o model inteiro, porque evita expor campos sensíveis e reduz payload
3. **Ordene por data decrescente** — `orderBy: { createdAt: 'desc' }`, porque o usuario quer ver os mais recentes primeiro
4. **Inclua relacoes com select** — `author: { select: { id, name } }`, porque retornar o author inteiro expoe dados desnecessarios
5. **Verifique permissao antes da query** — check ability antes de acessar dados, porque RBAC deve bloquear antes do acesso ao banco
6. **Type a resposta como array de objetos** — defina o schema de retorno com os campos exatos selecionados, porque o client precisa de contrato tipado

## How to write

### Rota GET de listagem com Fastify + Prisma

```typescript
app.withTypeProvider<ZodTypeProvider>().register(auth).get(
  '/organizations/:slug/invites',
  {
    schema: {
      tags: ['Invites'],
      summary: 'Get all organization invites',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          invites: z.array(
            z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              role: roleSchema,
              createdAt: z.date(),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                })
                .nullable(),
            }),
          ),
        }),
      },
    },
  },
  async (request) => {
    const { slug } = request.params
    const { organization, membership } = await request.getUserMembership(slug)

    const { cannot } = getUserPermissions(membership.userId, membership.role)

    if (cannot('get', 'Invite')) {
      throw new UnauthorizedError('You are not allowed to get organization invites.')
    }

    const invites = await prisma.invite.findMany({
      where: { organizationId: organization.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { invites }
  },
)
```

## Example

**Before (anti-pattern — retorna tudo sem filtro):**
```typescript
app.get('/invites', async () => {
  const data = await prisma.invite.findMany()
  return { data }
})
```

**After (com esta skill aplicada):**
```typescript
app.get('/organizations/:slug/invites', async (request) => {
  const { organization, membership } = await request.getUserMembership(slug)
  // 1. Permissao RBAC
  if (cannot('get', 'Invite')) throw new UnauthorizedError(...)
  // 2. Query filtrada, selecionada, ordenada
  const invites = await prisma.invite.findMany({
    where: { organizationId: organization.id },
    select: { id: true, email: true, role: true, createdAt: true,
      author: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return { invites }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem pertence a uma org | Sempre filtrar por `organizationId` |
| Relacao com author/user | Use `select` na relacao, nunca inclua tudo |
| Resposta tipada no Fastify | Defina `response.200` com z.object + z.array |
| Rota copiada de outra similar | Remova body schema, troque method pra GET |
| Campo nao existe no select | Remova do schema de resposta tambem |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findMany()` sem `where` em app multi-tenant | `findMany({ where: { organizationId } })` |
| `include: { author: true }` | `select: { author: { select: { id, name } } }` |
| Retornar sem ordenacao | `orderBy: { createdAt: 'desc' }` |
| Schema de resposta sem tipar | `z.array(z.object({ ...campos exatos }))` |
| Query antes do check de permissao | Verificar `cannot()` antes de `findMany` |

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
