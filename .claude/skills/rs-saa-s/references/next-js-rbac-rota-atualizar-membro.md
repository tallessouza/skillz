---
name: rs-saas-nextjs-rbac-rota-atualizar-membro
description: "Applies the update member route pattern when building role-based member management in Fastify APIs. Use when user asks to 'update member role', 'change user role', 'edit member permissions', 'put route for members', or 'update organization member'. Enforces organization-scoped updates with 204 response, roleSchema validation, and ownership verification. Make sure to use this skill whenever implementing member update endpoints in multi-tenant SaaS apps. Not for authentication routes, member listing, or member deletion."
---

# Rota: Atualizar Membro

> Ao criar rota de atualizacao de membro, garantir que a atualizacao seja restrita a membros da mesma organizacao, com validacao de role via schema e resposta 204.

## Rules

1. **Use PUT para atualizacao de role** — `app.put('/organizations/:slug/members/:memberId')`, porque PUT indica atualizacao completa do recurso e segue REST semantics
2. **Receba memberId nos params e role no body** — params para identificacao, body para dados mutaveis, porque separa identificacao de payload
3. **Valide role com roleSchema** — nunca aceite strings arbitrarias, porque roles invalidas quebram o sistema de permissoes
4. **Verifique que o membro pertence a organizacao** — filtre por `organizationId` no update, porque sem isso um admin pode alterar membros de outra organizacao
5. **Retorne 204 sem body** — atualizacao de role nao precisa retornar dados, porque o cliente ja sabe o que enviou
6. **Nomeie a rota de forma extensivel** — `UpdateMember` nao `UpdateMemberRole`, porque futuramente outros campos podem ser atualizaveis na mesma rota

## How to write

### Rota de atualizacao de membro

```typescript
import { roleSchema } from '@saas/auth'

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { organization, membership } = await request.getUserMembership(slug)
        // verificar permissao de update member
        const { memberId } = request.params
        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: { role },
        })

        return reply.status(204).send()
      },
    )
}
```

## Example

**Before (inseguro — sem escopo de organizacao):**
```typescript
await prisma.member.update({
  where: { id: memberId },
  data: { role },
})
```

**After (com verificacao de organizacao):**
```typescript
await prisma.member.update({
  where: {
    id: memberId,
    organizationId: organization.id,
  },
  data: { role },
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Atualizando apenas role do membro | PUT com body `{ role }` e response 204 |
| Futuros campos alem de role | Adicionar ao body schema, manter mesma rota |
| Membro de outra organizacao | Filtrar por organizationId no where do Prisma |
| Validacao de role | Usar roleSchema do pacote `@saas/auth` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `where: { id: memberId }` sem org | `where: { id: memberId, organizationId: organization.id }` |
| `role: z.string()` | `role: roleSchema` |
| Retornar 200 com body na atualizacao | Retornar 204 sem body |
| `UpdateMemberRole` como nome | `UpdateMember` (extensivel) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-membro/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-membro/references/code-examples.md)
