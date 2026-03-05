---
name: rs-saas-nextjs-rbac-rejeitar-convite
description: "Applies the reject invite route pattern when building invitation systems in Next.js SaaS apps. Use when user asks to 'reject invite', 'decline invitation', 'create reject route', or 'handle invitation rejection'. Follows pattern: validate invite exists, validate user exists, check ownership via email, then delete. Make sure to use this skill whenever implementing invite rejection or denial endpoints. Not for accept invite flows, invite creation, or email sending logic."
---

# Rota: Rejeitar Convite

> Ao implementar rejeicao de convite, reutilize as mesmas validacoes da rota de aceitar convite, substituindo apenas a acao final por uma delecao.

## Rules

1. **Valide existencia do convite** — busque o invite pelo ID antes de qualquer acao, porque operacoes em registros inexistentes causam erros silenciosos
2. **Valide existencia do usuario** — confirme que o usuario autenticado existe no banco, porque tokens podem referir usuarios deletados
3. **Verifique propriedade por email** — compare o email do convite com o email do usuario autenticado, porque um usuario nao pode rejeitar convite de outro
4. **Apenas delete o convite** — diferente da rota de aceitar (que cria membership + deleta), rejeitar so executa delete, porque nao ha side-effect de criacao
5. **Reutilize validacoes da rota de aceitar** — as verificacoes sao identicas, apenas a acao final muda, porque DRY reduz bugs de validacao

## How to write

### Rota de rejeitar convite

```typescript
// Mesmo padrao de validacao do accept, apenas acao final diferente
app.withTypeProvider().register(auth).post(
  '/invites/:inviteId/reject',
  {
    schema: {
      tags: ['Invites'],
      summary: 'Reject an invite',
      params: z.object({
        inviteId: z.string().uuid(),
      }),
      response: { 204: z.null() },
    },
  },
  async (request, reply) => {
    const userId = await request.getCurrentUserId()
    const { inviteId } = request.params

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    })

    if (!invite) {
      throw new BadRequestError('Invite not found or expired.')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestError('User not found.')
    }

    if (invite.email !== user.email) {
      throw new BadRequestError('This invite belongs to another user.')
    }

    // Unica diferenca do accept: apenas delete, sem criar membership
    await prisma.invite.delete({
      where: { id: inviteId },
    })

    return reply.status(204).send()
  },
)
```

## Example

**Before (validacao incompleta):**
```typescript
app.post('/invites/:inviteId/reject', async (request, reply) => {
  const { inviteId } = request.params
  await prisma.invite.delete({ where: { id: inviteId } })
  return reply.status(204).send()
})
```

**After (com todas as validacoes):**
```typescript
app.post('/invites/:inviteId/reject', async (request, reply) => {
  const userId = await request.getCurrentUserId()
  const { inviteId } = request.params

  const invite = await prisma.invite.findUnique({ where: { id: inviteId } })
  if (!invite) throw new BadRequestError('Invite not found or expired.')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new BadRequestError('User not found.')

  if (invite.email !== user.email)
    throw new BadRequestError('This invite belongs to another user.')

  await prisma.invite.delete({ where: { id: inviteId } })
  return reply.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota de rejeitar convite | Copie validacoes do accept, troque acao final por delete |
| Accept vs Reject | Accept = criar membership + delete invite. Reject = apenas delete invite |
| Verificacao de propriedade | Sempre compare email do invite com email do usuario autenticado |
| Resposta HTTP | 204 No Content para delecoes bem-sucedidas |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Deletar invite sem verificar existencia | `findUnique` + check null antes de `delete` |
| Deletar invite sem checar propriedade | Compare `invite.email !== user.email` |
| Retornar 200 com body em delecao | Retorne 204 No Content |
| Duplicar logica de validacao manualmente | Extraia validacoes compartilhadas com accept em funcao comum |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
