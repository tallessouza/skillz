---
name: rs-api-com-bun-rota-logout-derivacao
description: "Applies ElysiaJS derive pattern to extract auth operations into reusable module. Use when user asks to 'create logout', 'organize auth with derive', 'extract cookie logic', 'modularize auth in Elysia', or 'use derive'. Ensures signUser/signOut in auth module via derive. Make sure to use this skill whenever structuring ElysiaJS auth modules. Not for frontend auth, sessions outside ElysiaJS, or DB schema."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [elysia, derive, logout, auth-module, cookie, bun]
---

# Rota de Logout e Derivacao

> Extraia signUser/signOut para auth module via derive, rotas ficam limpas.

## Rules

1. **Centralize via derive** — `.derive({ as: 'scoped' }, ...)` expoe funcoes
2. **Logout = `auth.remove()`**
3. **Derive retorna funcoes** — nao so dados
4. **`Static<typeof schema>`** para tipar TypeBox payloads
5. **Evite conflito de nomes** entre rota e funcao derivada

## How to write

```typescript
export const auth = new Elysia()
  .use(jwt({ secret: env.JWT_SECRET_KEY, schema: jwtPayload }))
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => ({
    signUser: async (payload: Static<typeof jwtPayload>) => {
      auth.value = await jwt.sign(payload)
      auth.httpOnly = true; auth.maxAge = 60 * 60 * 24 * 7; auth.path = '/'
    },
    signOut: () => { auth.remove() },
  }))

// Rota
export const signout = new Elysia().use(auth)
  .post('/sign-out', ({ signOut }) => { signOut() })
```

## Troubleshooting

### signUser nao disponivel
**Fix:** Adicione `.use(auth)` antes do handler.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
