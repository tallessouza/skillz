---
name: rs-saas-nextjs-rbac-rota-perfil
description: "Applies authenticated user profile route patterns in Fastify with JWT verification, Prisma select, and Swagger response typing. Use when user asks to 'create a profile route', 'get logged in user', 'return authenticated user data', 'add JWT protected endpoint', or 'document API responses in Swagger'. Make sure to use this skill whenever building authenticated API routes that return user data with Fastify. Not for frontend auth, middleware chains, or role-based access control."
---

# Rota de Perfil do Usuario Logado

> Toda rota autenticada verifica o JWT, seleciona apenas os campos necessarios para o frontend, e tipa completamente a resposta no Swagger.

## Rules

1. **Documente respostas no Swagger** — use `response` com schemas Zod para cada status code (201, 400), porque o frontend precisa saber exatamente o que esperar
2. **Use `select` no Prisma** — nunca retorne todos os campos do usuario, selecione apenas o necessario (id, name, email, avatarUrl), porque dados sensiveis como passwordHash nunca devem vazar
3. **Tipe o payload do JWT** — passe um generic para `request.jwtVerify<{ sub: string }>()`, porque garante type-safety na desestruturacao
4. **Marque campos nulaveis como `nullable()`** — campos como `avatarUrl` e `name` podem ser nulos, o Zod deve refletir isso, porque o frontend precisa tratar esses casos
5. **Lance erro quando usuario nao existe** — apos buscar pelo `sub`, valide que o usuario existe antes de retornar, porque o token pode referenciar um usuario deletado
6. **Rota GET sem body** — rotas de perfil usam GET e nao recebem body, a identificacao vem do JWT no header Authorization

## How to write

### Rota de perfil autenticado

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              email: z.string().email(),
              avatarUrl: z.string().url().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        where: { id: sub },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      })

      if (!user) {
        throw new Error('User not found.')
      }

      return reply.send({ user })
    },
  )
}
```

### Documentacao de resposta de erro

```typescript
response: {
  201: z.object({
    token: z.string(),
  }),
  400: z.object({
    message: z.string(),
  }),
}
```

## Example

**Before (sem select, sem tipagem de resposta):**
```typescript
app.get('/profile', async (request, reply) => {
  const { sub } = await request.jwtVerify()
  const user = await prisma.user.findUnique({ where: { id: sub } })
  return reply.send(user)
})
```

**After (com select, tipagem completa, nullable):**
```typescript
app.withTypeProvider<ZodTypeProvider>().get('/profile', {
  schema: {
    tags: ['auth'],
    summary: 'Get authenticated user profile',
    response: {
      200: z.object({
        user: z.object({
          id: z.string().uuid(),
          name: z.string().nullable(),
          email: z.string().email(),
          avatarUrl: z.string().url().nullable(),
        }),
      }),
    },
  },
}, async (request, reply) => {
  const { sub } = await request.jwtVerify<{ sub: string }>()
  const user = await prisma.user.findUnique({
    where: { id: sub },
    select: { id: true, name: true, email: true, avatarUrl: true },
  })
  if (!user) throw new Error('User not found.')
  return reply.send({ user })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados retornados para o frontend | Sempre use `select` no Prisma |
| Campo pode ser nulo no banco | Use `.nullable()` no schema Zod |
| Rota precisa de autenticacao | Use `request.jwtVerify()` com generic tipado |
| Swagger nao mostra resposta | Adicione `response` no schema com todos os status codes |
| Tipo do payload do JWT | Use generic `<{ sub: string }>` na verificacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `prisma.user.findUnique({ where: { id: sub } })` (sem select) | `prisma.user.findUnique({ where: { id: sub }, select: { id: true, name: true, email: true, avatarUrl: true } })` |
| `request.jwtVerify()` (sem generic) | `request.jwtVerify<{ sub: string }>()` |
| `return reply.send(user)` (sem wrapper) | `return reply.send({ user })` |
| Schema sem `response` | Schema com `response: { 200: z.object(...), 400: z.object(...) }` |
| `avatarUrl: z.string()` (campo nulavel) | `avatarUrl: z.string().url().nullable()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-perfil-do-usuario-logado-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-perfil-do-usuario-logado-1/references/code-examples.md)
