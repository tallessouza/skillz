---
name: rs-api-com-bun-setup-autenticacao-jwt
description: "Applies JWT authentication setup with ElysiaJS. Use when user asks to 'setup JWT', 'configure auth in Elysia', 'add JWT with cookie', 'create token auth', or 'configure @elysiajs/jwt'. Covers HS256, TypeBox schema, cookie-based tokens. Make sure to use this skill whenever configuring JWT in Elysia/Bun. Not for frontend auth, OAuth (use rs-seguranca-para), or sessions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [jwt, elysia, authentication, cookie, typebox, bun]
---

# Setup da Autenticacao JWT no Elysia

> JWT com cookie, HS256, schema TypeBox, cookie httpOnly.

## Rules

1. **`@elysiajs/jwt` + `@elysiajs/cookie`** juntos
2. **HS256 para monolitos** — RS256 so com microservicos
3. **Secret em env var** — `openssl rand -hex 32`
4. **Schema TypeBox** — `sub: t.String(), restaurantId: t.Optional(t.String())`
5. **Nunca dados sensiveis no payload**

## How to write

```typescript
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'

const app = new Elysia()
  .use(jwt({ secret: env.JWT_SECRET_KEY, schema: t.Object({ sub: t.String(), restaurantId: t.Optional(t.String()) }) }))
  .use(cookie())
```

## Troubleshooting

### Cookie nao enviado ao frontend
**Fix:** Configure `httpOnly: true`, `path: '/'`, `sameSite: 'lax'`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
