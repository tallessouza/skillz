---
name: rs-saas-nextjs-rbac-rota-convites-pendentes
description: "Generates a 'get pending invites' API route that lists all pending invites for the authenticated user by matching their email. Use when user asks to 'list pending invites', 'show user notifications', 'get invites for logged user', or 'create invite listing endpoint'. Applies pattern: fetch user first, then query invites by user email with select projection. Make sure to use this skill whenever building notification-style endpoints that aggregate pending items for the current user. Not for accepting/rejecting invites, sending invites, or organization-scoped invite listing."
---

# Rota: Convites Pendentes

> Ao criar endpoints de listagem de convites pendentes, busque o usuario autenticado primeiro, depois filtre convites pelo email dele, retornando apenas campos necessarios via select.

## Rules

1. **Busque o usuario antes dos convites** — primeiro `findUnique` pelo userId do token, depois `findMany` nos invites pelo email, porque o convite e vinculado ao email e nao ao userId
2. **Filtre por email, nao por userId** — convites sao enviados para um email que pode nao ter conta ainda, entao a busca e sempre por `email`, porque e o campo que conecta convite ao destinatario
3. **Use select para projecao** — retorne apenas `id`, `email`, `role`, `createdAt` e dados da `organization` com `select`, porque endpoints de listagem nao devem expor todos os campos
4. **Valide existencia do usuario** — se `findUnique` retorna null, lance `BadRequestError('User not found')`, porque isso indica token invalido ou usuario removido
5. **Rota sem parametros** — esta rota nao recebe `orgSlug` nem `inviteId`, porque lista todos os convites pendentes do usuario independente de organizacao

## How to write

### Route handler completo

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all user pending invites',
          response: {
            200: z.object({
              invites: z.array(
                z.object({
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
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        const invites = await prisma.invite.findMany({
          where: {
            email: user.email,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        })

        return { invites }
      },
    )
}
```

## Example

**Before (erro comum — buscar por userId):**
```typescript
const invites = await prisma.invite.findMany({
  where: { userId: userId },
})
return { invites }
```

**After (correto — buscar por email do usuario):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
})

if (!user) {
  throw new BadRequestError('User not found.')
}

const invites = await prisma.invite.findMany({
  where: { email: user.email },
  select: {
    id: true,
    email: true,
    role: true,
    createdAt: true,
    organization: { select: { name: true } },
    author: { select: { id: true, name: true, avatarUrl: true } },
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint de notificacoes/convites pendentes | Busque usuario, filtre por email, sem parametros de rota |
| Precisa mostrar quem convidou | Inclua `author` no select com `id`, `name`, `avatarUrl` |
| Precisa mostrar de qual org e o convite | Inclua `organization` no select com `name` |
| Reutilizar schema de invite | Copie o schema do `getInvite` e envolva em array |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `where: { userId }` no invite | `where: { email: user.email }` — convite e por email |
| Retornar todos os campos do invite | `select` apenas campos necessarios para a UI |
| Pular validacao do usuario | Sempre `findUnique` + check null antes de buscar invites |
| Receber orgSlug como parametro | Rota sem parametros — lista de todas as orgs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
