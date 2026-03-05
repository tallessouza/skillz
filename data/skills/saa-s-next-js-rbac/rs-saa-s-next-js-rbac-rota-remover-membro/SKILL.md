---
name: rs-saas-nextjs-rbac-rota-remover-membro
description: "Enforces REST API member removal patterns when building organization membership endpoints in Node.js/Fastify. Use when user asks to 'remove a member', 'delete member from org', 'create membership deletion route', or 'build organization member management API'. Applies semantic naming (remove vs delete), proper HTTP method selection, and authorization checks. Make sure to use this skill whenever implementing member removal or organization membership management endpoints. Not for user account deletion, authentication routes, or frontend components."
---

# Rota: Remover Membro de Organização

> Ao implementar remocao de membros, use `remove` semanticamente para desassociacao e `delete` apenas como metodo HTTP — nunca confunda desassociacao com exclusao de usuario.

## Rules

1. **Use `remove` no nome da funcao, `delete` no metodo HTTP** — `removeMember` nao `deleteMember`, porque o usuario nao esta sendo deletado, apenas desassociado da organizacao
2. **Retorne 204 No Content em delecoes bem-sucedidas** — sem body de resposta, porque nao ha dado util para retornar apos remocao
3. **Valide autorizacao antes de executar** — mensagem clara: "You are not allowed to remove this member from the organization"
4. **Mantenha consistencia com rotas irmãs** — se `updateMember` existe, `removeMember` segue o mesmo padrao de parametros e autorizacao

## How to write

### Rota de remocao de membro

```typescript
// removeMember - DELETE /organizations/:orgSlug/members/:memberId
export async function removeMember(app: FastifyInstance) {
  app.delete(
    '/organizations/:orgSlug/members/:memberId',
    {
      schema: {
        tags: ['Members'],
        summary: 'Remove a member from the organization',
        params: z.object({
          orgSlug: z.string(),
          memberId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { orgSlug, memberId } = request.params

      // Autorizacao
      const { membership, organization } = await request.getUserMembership(orgSlug)

      // Verificar permissao (RBAC)
      // ...

      await prisma.member.delete({
        where: {
          id: memberId,
          organizationId: organization.id,
        },
      })

      return reply.status(204).send()
    },
  )
}
```

## Example

**Before (naming semanticamente incorreto):**
```typescript
// Confunde desassociacao com exclusao de usuario
export async function deleteUser(app: FastifyInstance) {
  app.delete('/organizations/:orgSlug/members/:memberId', ...)
}
```

**After (com esta skill aplicada):**
```typescript
// Claro: remove membro da org, nao deleta o usuario
export async function removeMember(app: FastifyInstance) {
  app.delete('/organizations/:orgSlug/members/:memberId', ...)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Desassociar usuario de organizacao | `removeMember` com HTTP DELETE |
| Excluir conta de usuario permanentemente | `deleteUser` ou `deleteAccount` |
| Rota sem body de resposta | Retorne 204 No Content |
| Rota CRUD de membros | Agrupe sob tag `Members` no Swagger |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `deleteMember` (para desassociacao) | `removeMember` |
| `deleteUser` (quando so remove da org) | `removeMember` |
| Retornar 200 com body vazio em DELETE | Retornar 204 No Content |
| Mensagem "cannot delete member" | "not allowed to remove this member from the organization" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
