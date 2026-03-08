---
name: rs-saas-nextjs-rbac-aceitar-convite
description: "Applies the accept-invite route pattern when building invitation acceptance endpoints in Fastify with Prisma. Use when user asks to 'accept invite', 'handle invitation', 'create invite acceptance route', or 'process pending invites'. Enforces auth verification, email ownership check, Prisma transaction for member creation + invite deletion, and 204 response. Make sure to use this skill whenever implementing invite acceptance or similar claim-and-consume flows. Not for sending invites, listing invites, or rejecting invites."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, invites, members]
---

# Rota: Aceitar Convite

> Ao implementar aceitacao de convite, valide propriedade por email, crie o membro e delete o convite numa unica transacao.

## Rules

1. **Exija autenticacao** — o usuario precisa estar logado para aceitar um convite, porque convites sao vinculados a um email especifico
2. **Valide propriedade por email** — compare o email do convite com o email do usuario logado, porque convites nao podem ser aceitos por outro usuario
3. **Use transacao do Prisma** — crie o member e delete o invite na mesma `$transaction`, porque dados inconsistentes (member sem delete do invite) causam convites reutilizaveis
4. **Retorne 204 sem body** — aceitar convite nao precisa retornar dados, porque o cliente so precisa saber que funcionou
5. **Delete o convite apos uso** — convites sao single-use, porque permitir reuso quebraria o modelo de seguranca

## How to write

### Estrutura da rota

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
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

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          }),
          prisma.invite.delete({
            where: { id: inviteId },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
```

## Example

**Before (sem transacao, inseguro):**
```typescript
// Cria member e deleta invite separadamente — risco de inconsistencia
await prisma.member.create({
  data: { userId, organizationId: invite.organizationId, role: invite.role },
})
await prisma.invite.delete({ where: { id: inviteId } })
```

**After (com transacao):**
```typescript
await prisma.$transaction([
  prisma.member.create({
    data: { userId, organizationId: invite.organizationId, role: invite.role },
  }),
  prisma.invite.delete({ where: { id: inviteId } }),
])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso single-use (convite, token, codigo) | Delete na mesma transacao que consome |
| Rota que muda estado sem retornar dados | Use 204 sem body |
| Acao vinculada a email especifico | Compare email do recurso com email do usuario logado |
| Precisa criar + deletar atomicamente | Use `prisma.$transaction([...])` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `create` e `delete` separados sem transacao | `prisma.$transaction([create, delete])` |
| Aceitar convite sem verificar email | `if (invite.email !== user.email) throw` |
| Retornar 200 com body vazio | `reply.status(204).send()` |
| Deixar convite no banco apos aceito | Deletar na mesma transacao |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
