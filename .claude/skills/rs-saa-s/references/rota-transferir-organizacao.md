---
name: rs-saas-nextjs-rbac-transferir-org
description: "Applies ownership transfer route pattern when building PATCH endpoints for transferring entity ownership in Node.js/Fastify APIs with Prisma. Use when user asks to 'transfer ownership', 'change owner', 'build a PATCH route', 'update entity owner', or 'implement ownership transfer'. Enforces membership validation before transfer, role promotion to admin, and Prisma $transaction for atomic updates. Make sure to use this skill whenever implementing ownership or responsibility transfer between users. Not for generic CRUD updates, user profile changes, or role management outside transfer context."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, organization]
---

# Rota de Transferencia de Propriedade

> Ao transferir propriedade de uma entidade, valide que o destinatario e membro, promova sua role, e execute ambas operacoes em transacao atomica.

## Rules

1. **Use PATCH, nao PUT, para atualizacoes parciais** — `PATCH /organizations/:slug/owner` deixa explicito qual campo esta sendo atualizado, porque PUT implica substituicao completa da entidade
2. **Inclua o recurso sendo atualizado na URL** — `/owner` no path indica exatamente o que muda, porque uma URL generica nao comunica a intencao
3. **Valide membership antes de transferir** — busque o usuario destino na organizacao antes de qualquer update, porque transferir para alguem de fora e erro de negocio
4. **Force role admin no destinatario** — independente da role atual (billing, member), o novo owner deve ser admin, porque owner sem permissao admin nao faz sentido
5. **Use `prisma.$transaction([])` com array** — executa updates em paralelo e garante atomicidade, porque falha parcial deixaria dados inconsistentes
6. **Retorne 204 No Content** — transferencia nao precisa retornar body, porque o cliente ja tem o contexto necessario

## How to write

### Estrutura da rota PATCH

```typescript
import { prisma } from '@/lib/prisma'

app.withTypeProvider<ZodTypeProvider>().register(auth).patch(
  '/organizations/:slug/owner',
  {
    schema: {
      tags: ['Organizations'],
      summary: 'Transfer organization ownership',
      params: z.object({ slug: z.string() }),
      body: z.object({ transferToUserId: z.string().uuid() }),
      response: { 204: z.null() },
    },
  },
  async (request, reply) => {
    const { slug } = request.params
    const userId = await request.getCurrentUserId()
    const { membership, organization } = await request.getUserMembership(slug)

    const { cannot } = getUserPermissions(userId, membership.role)

    if (cannot('transfer_ownership', 'Organization')) {
      throw new UnauthorizedError('You are not allowed to transfer this organization ownership.')
    }

    const { transferToUserId } = request.body

    const transferToMembership = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: transferToUserId,
        },
      },
    })

    if (!transferToMembership) {
      throw new BadRequestError('Target user is not a member of this organization.')
    }

    await prisma.$transaction([
      prisma.member.update({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: transferToUserId,
          },
        },
        data: { role: 'ADMIN' },
      }),
      prisma.organization.update({
        where: { id: organization.id },
        data: { ownerId: transferToUserId },
      }),
    ])

    return reply.status(204).send()
  }
)
```

## Example

**Before (sem validacao, sem transacao):**
```typescript
app.put('/organizations/:slug', async (request, reply) => {
  const { transferToUserId } = request.body
  await prisma.organization.update({
    where: { slug: request.params.slug },
    data: { ownerId: transferToUserId },
  })
  return reply.send({ ok: true })
})
```

**After (com validacao, transacao e PATCH semantico):**
```typescript
app.patch('/organizations/:slug/owner', async (request, reply) => {
  // ... auth + permission check ...

  const transferToMembership = await prisma.member.findUnique({
    where: { organizationId_userId: { organizationId: organization.id, userId: transferToUserId } },
  })

  if (!transferToMembership) {
    throw new BadRequestError('Target user is not a member of this organization.')
  }

  await prisma.$transaction([
    prisma.member.update({
      where: { organizationId_userId: { organizationId: organization.id, userId: transferToUserId } },
      data: { role: 'ADMIN' },
    }),
    prisma.organization.update({
      where: { id: organization.id },
      data: { ownerId: transferToUserId },
    }),
  ])

  return reply.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizando campo especifico de entidade | Use PATCH com recurso na URL (`/owner`, `/status`) |
| Destinatario pode nao pertencer ao contexto | Valide membership/pertencimento antes |
| Duas+ operacoes devem ser atomicas | Use `prisma.$transaction([])` com array |
| Novo owner tem role insuficiente | Force role adequada na mesma transacao |
| Operacao nao retorna dados uteis | Use 204 No Content |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `PUT /organizations/:slug` para mudar owner | `PATCH /organizations/:slug/owner` |
| Atualizar owner sem checar membership | `findUnique` no membro antes de transferir |
| Dois `await` separados sem transacao | `prisma.$transaction([update1, update2])` |
| `prisma.$transaction(async (tx) => {})` para queries independentes | `prisma.$transaction([])` com array (paralelo) |
| Transferir sem promover role | Sempre force `role: 'ADMIN'` no destinatario |
| Retornar 200 com body vazio | Retornar 204 No Content |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
