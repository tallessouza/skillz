---
name: rs-api-com-bun-rota-envio-auth-link
description: "Applies Elysia route separation and Drizzle query API for the send-auth-link route. Use when user asks to 'create auth route', 'send magic link', 'implement login route', 'separate elysia routes', or 'use drizzle findFirst'. Covers route modularization, db.query vs db.select, URL constructor, env-based redirect. Make sure to use this skill whenever implementing magic link login step or separating Elysia routes. Not for callback step (see rota-autenticacao-pelo-link), email sending (see envio-de-e-mail-com-nodemailer)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [elysia, auth, magic-link, drizzle-query-api, route-separation, bun]
---

# Rota de Envio do Link de Autenticacao

> Separe rotas em arquivos, use query API para consultas simples, URL constructor para links.

## Rules

1. **Um arquivo por rota** — `new Elysia()` por arquivo, `.use()` no server
2. **`db.query.tabela.findFirst()`** para queries simples
3. **`db.select().from()` para complexas** — joins, subqueries
4. **`new URL()` + `searchParams.set()`** — nao concatenar strings
5. **Env vars para URLs** — nunca hardcode
6. **cuid2 para tokens**

## How to write

```typescript
export const sendAuthLink = new Elysia().post('/authenticate', async ({ body }) => {
  const user = await db.query.users.findFirst({
    where(fields, { eq }) { return eq(fields.email, body.email) },
  })
  if (!user) throw new Error('User not found.')

  const code = createId()
  await db.insert(authLinks).values({ userId: user.id, code })

  const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
  authLink.searchParams.set('code', code)
  authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)
}, { body: t.Object({ email: t.String({ format: 'email' }) }) })
```

## Troubleshooting

### db.query retorna undefined
**Fix:** Passe schema ao drizzle: `drizzle(connection, { schema })`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
