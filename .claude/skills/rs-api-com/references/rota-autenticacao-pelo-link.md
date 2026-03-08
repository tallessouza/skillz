---
name: rs-api-com-bun-rota-autenticacao-link
description: "Applies magic link callback route pattern when validating tokens, generating JWT, setting cookies. Use when user asks to 'authenticate via email link', 'validate magic link', 'create auth callback', 'JWT cookie auth', or 'link expiration'. Covers validation, JWT generation, cookie httpOnly, link deletion, redirect. Make sure to use this skill whenever implementing callback step of passwordless auth. Not for send-link step (see rota-envio-do-link-de-autenticacao), OAuth, or password auth."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [magic-link, jwt, cookie, elysia, callback, bun]
---

# Autenticacao por Magic Link — Callback

> Validar codigo, verificar expiracao, gerar JWT, cookie httpOnly, deletar link, redirecionar.

## Rules

1. **Rota GET** — clique no email = GET
2. **Validar query params** — `t.Object({ code: t.String(), redirect: t.String() })`
3. **Verificar expiracao** — dayjs diff > 7 dias
4. **Modulo auth compartilhado** — `.use(auth)` por rota
5. **Cookie httpOnly** — sempre true
6. **Delete apos uso** — single-use
7. **restaurantId opcional** — optional chaining

## How to write

```typescript
export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, jwt, cookie: { auth }, set }) => {
    const authLink = await db.query.authLinks.findFirst({
      where(fields, { eq }) { return eq(fields.code, query.code) },
    })
    if (!authLink) throw new Error('Auth link not found.')
    if (dayjs().diff(authLink.createdAt, 'days') > 7) throw new Error('Expired.')

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) { return eq(fields.managerId, authLink.userId) },
    })

    auth.value = await jwt.sign({ sub: authLink.userId, restaurantId: restaurant?.id })
    auth.httpOnly = true; auth.maxAge = 60 * 60 * 24 * 7; auth.path = '/'

    await db.delete(authLinks).where(eq(authLinks.code, query.code))
    set.redirect = query.redirect
  },
  { query: t.Object({ code: t.String(), redirect: t.String() }) },
)
```

## Troubleshooting

### jwt nao disponivel
**Fix:** Crie modulo auth.ts com `new Elysia().use(jwt(...))` e use `.use(auth)`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
