---
name: rs-saas-nextjs-rbac-rota-detalhes-convite
description: "Applies the pattern for building detail routes that bypass organization scope and auth in Fastify APIs. Use when user asks to 'create a detail route', 'get invite details', 'build a public API endpoint', or 'fetch single resource by ID'. Enforces: no auth for cross-boundary resources, foreign key data inclusion, proper Zod response typing with nullable relations. Make sure to use this skill whenever building routes for resources accessible outside org scope. Not for CRUD routes requiring permission checks or organization-scoped endpoints."
---

# Rota de Detalhes sem Escopo de Organizacao

> Quando um recurso transcende a barreira da organizacao, a rota nao exige autenticacao nem verificacao de permissoes — apenas o ID do recurso.

## Rules

1. **Identifique recursos cross-boundary** — convites, links publicos, tokens de reset sao acessiveis fora do escopo da organizacao, porque usuarios deslogados precisam acessa-los
2. **Remova auth e permission checks** — sem `registerOf`, sem `security`, sem middleware de autenticacao, porque o recurso e visivel ate para quem nao esta logado
3. **Use apenas o ID do recurso como parametro** — nao exija orgId ou userId, porque os dados da organizacao estao contidos na chave estrangeira do proprio recurso
4. **Inclua dados de relacoes via select** — traga author e organization inline no select, porque evita queries adicionais no frontend
5. **Tipe nullable em relacoes opcionais** — author pode ser nulo, use `z.object().nullable()`, porque o autor pode ter sido removido
6. **Retorne erro semantico se nao encontrar** — `BadRequestError('Invite not found')` antes de tipar o response, porque facilita a tipagem do retorno

## How to write

### Rota GET sem autenticacao

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              role: roleSchema,
              createdAt: z.date(),
              organization: z.object({
                name: z.string(),
              }),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          organization: {
            select: { name: true },
          },
        },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found.')
      }

      return { invite }
    },
  )
}
```

## Example

**Before (erro comum — exigir org scope para recurso publico):**
```typescript
export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:orgSlug/invites/:inviteId',
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: z.object({
          orgSlug: z.string(),
          inviteId: z.string(),
        }),
      },
    },
    async (request) => {
      const { membership } = await request.getUserMembership(request.params.orgSlug)
      // Desnecessario — convite e acessivel sem login
    },
  )
}
```

**After (recurso cross-boundary sem auth):**
```typescript
export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        params: z.object({ inviteId: z.string().uuid() }),
        // Sem security, sem orgSlug
      },
    },
    async (request) => {
      const { inviteId } = request.params
      const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
        select: { /* campos + relacoes */ },
      })
      if (!invite) throw new BadRequestError('Invite not found.')
      return { invite }
    },
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso visivel fora da org (convite, link publico) | Rota sem auth, parametro apenas ID |
| Recurso visivel apenas dentro da org (projeto) | Rota com auth + orgSlug + permission check |
| Relacao pode nao existir (author deletado) | `z.object().nullable()` no schema |
| Dados da org necessarios no response | Inclua via select na FK, nao exija orgId |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `security: [{ bearerAuth: [] }]` em rota publica | Omita o campo security inteiro |
| `/organizations/:orgSlug/invites/:id` para convite | `/invites/:inviteId` direto |
| `request.getUserMembership()` para recurso publico | Acesse direto pelo ID sem auth |
| Response sem tipar nullable em author | `z.object({...}).nullable()` |
| `findUnique` sem tratar null | `if (!invite) throw new BadRequestError(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
