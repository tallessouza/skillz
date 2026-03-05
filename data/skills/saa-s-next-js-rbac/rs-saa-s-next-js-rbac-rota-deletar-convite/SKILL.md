---
name: rs-saas-nextjs-rbac-rota-deletar-convite
description: "Applies invite revocation route pattern when building admin-side delete/revoke endpoints in multi-tenant SaaS APIs. Use when user asks to 'revoke invite', 'delete invite route', 'admin cancel invitation', or 'remove pending invite'. Enforces organization scoping on delete operations to prevent cross-tenant data deletion. Make sure to use this skill whenever implementing revoke/delete endpoints for invitations in multi-org systems. Not for user-side invite rejection, accept flows, or invite creation."
---

# Rota: Deletar (Revogar) Convite

> Revogar convite e uma operacao administrativa que exige verificacao de permissao e escopo organizacional no delete.

## Rules

1. **Revogar != Rejeitar** — revogar e feito pelo admin da organizacao, rejeitar e feito pelo convidado, porque sao fluxos de permissao completamente diferentes
2. **Sempre escope o delete pela organization_id** — `WHERE id = inviteId AND organization_id = orgId`, porque sem isso um admin poderia deletar convites de outra organizacao
3. **Verifique permissao antes de qualquer operacao** — checar `ability.can('delete', 'Invite')` antes de buscar ou deletar, porque evita queries desnecessarias se o usuario nao tem permissao
4. **Retorne 204 No Content** — delete bem-sucedido nao precisa retornar body, porque nao ha conteudo util para o cliente apos exclusao
5. **Valide existencia antes de deletar** — busque o invite primeiro e retorne 404 se nao existir, porque delete silencioso esconde bugs

## How to write

### Rota de revoke invite

```typescript
app.register(async (app) => {
  app.delete(
    '/organizations/:slug/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Revoke an invite',
        params: z.object({
          slug: z.string(),
          inviteId: z.string().uuid(),
        }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { slug, inviteId } = request.params
      const { membership, organization } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(membership.userId, membership.role)

      if (cannot('delete', 'Invite')) {
        throw new UnauthorizedError('You are not allowed to delete an invite.')
      }

      const invite = await prisma.invite.findUnique({
        where: { id: inviteId, organizationId: organization.id },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found.')
      }

      await prisma.invite.delete({ where: { id: inviteId } })

      return reply.status(204).send()
    },
  )
})
```

## Example

**Before (inseguro — sem escopo de organizacao):**
```typescript
const invite = await prisma.invite.findUnique({
  where: { id: inviteId },
})
await prisma.invite.delete({ where: { id: inviteId } })
```

**After (com escopo organizacional):**
```typescript
const invite = await prisma.invite.findUnique({
  where: { id: inviteId, organizationId: organization.id },
})
if (!invite) throw new BadRequestError('Invite not found.')
await prisma.invite.delete({ where: { id: inviteId } })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Admin quer cancelar convite enviado | Use rota DELETE com permissao `delete:Invite` |
| Usuario convidado quer recusar | Use rota separada de reject (acao do convidado) |
| Delete de recurso em sistema multi-tenant | Sempre inclua `organizationId` no WHERE |
| Operacao de delete bem-sucedida | Retorne 204, sem body |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `delete({ where: { id } })` sem org scope | `findUnique({ where: { id, organizationId } })` + `delete` |
| Retornar 200 com body vazio no delete | Retornar 204 No Content |
| Misturar revoke (admin) e reject (convidado) na mesma rota | Rotas separadas com permissoes distintas |
| Deletar sem checar permissao primeiro | `cannot('delete', 'Invite')` antes de qualquer query |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
