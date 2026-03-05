---
name: rs-api-com-bun-rota-autenticacao-link
description: "Applies magic link authentication pattern when building auth routes with ElysiaJS and Bun. Use when user asks to 'create auth route', 'implement magic link', 'authenticate via email link', 'JWT cookie authentication', or 'ElysiaJS authentication'. Covers link validation, JWT generation, cookie setup with httpOnly, and redirect flow. Make sure to use this skill whenever implementing passwordless authentication in ElysiaJS. Not for OAuth, session-based auth, or password authentication flows."
---

# Autenticacao por Magic Link (ElysiaJS)

> Implemente rotas de autenticacao por link validando codigo, gerando JWT, salvando em cookie httpOnly e redirecionando o usuario.

## Rules

1. **Rota GET para autenticacao por link** — o usuario clica num link no email, e cliques no navegador sao sempre requisicoes GET
2. **Valide query parameters com schema** — use `t.Object` do ElysiaJS para validar `code` e `redirect` como `t.String`, porque parametros invalidos devem ser rejeitados antes do handler
3. **Verifique expiracao do link** — compare a data de criacao com a data atual usando dayjs diff em dias, porque links de autenticacao devem expirar (7 dias padrao)
4. **Use modulo auth compartilhado** — extraia JWT e cookie config para um arquivo `auth.ts` separado com `new Elysia()`, porque cada rota ElysiaJS e uma instancia isolada e modulos nao sao compartilhados automaticamente
5. **Cookie httpOnly obrigatorio** — sempre `httpOnly: true` no cookie de autenticacao, porque impede acesso por JavaScript client-side e extensoes maliciosas
6. **Delete o auth link apos uso** — apague o registro do banco apos autenticacao bem-sucedida, porque cada link deve ser single-use
7. **Inclua restaurantId opcional no JWT** — use optional chaining (`managedRestaurant?.id`) para incluir dados contextuais no token sem quebrar quando ausentes

## How to write

### Modulo auth compartilhado

```typescript
// src/http/auth.ts
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../env'

export const auth = new Elysia().use(
  jwt({
    secret: env.JWT_SECRET_KEY,
    schema: t.Object({
      sub: t.String(),
      restaurantId: t.Optional(t.String()),
    }),
  }),
)
```

### Rota de autenticacao por link

```typescript
import { Elysia, t } from 'elysia'
import { auth } from './auth'
import { db } from '../../db/connection'
import { eq } from 'drizzle-orm'
import { authLinks } from '../../db/schema'
import dayjs from 'dayjs'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, jwt, cookie: { auth }, set }) => {
    const { code, redirect } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error('Auth link not found.')
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('Auth link expired, please generate a new one.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    auth.value = token
    auth.httpOnly = true
    auth.maxAge = 60 * 60 * 24 * 7 // 7 days
    auth.path = '/'

    await db.delete(authLinks).where(eq(authLinks.code, code))

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
```

## Example

**Before (modulos JWT registrados globalmente — NAO FUNCIONA):**
```typescript
// server.ts — JWT registrado no server
const app = new Elysia()
  .use(jwt({ secret: env.JWT_SECRET_KEY }))
  .use(authenticateFromLink) // JWT nao visivel dentro da rota!
```

**After (modulo auth compartilhado via .use):**
```typescript
// auth.ts — modulo independente
export const auth = new Elysia().use(jwt({ secret: env.JWT_SECRET_KEY, schema: t.Object({ sub: t.String() }) }))

// rota usa .use(auth) para ter acesso ao jwt
export const authenticateFromLink = new Elysia().use(auth).get('/auth-links/authenticate', ...)

// server.ts — apenas registra a rota
const app = new Elysia().use(authenticateFromLink)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa de JWT ou cookies | `.use(auth)` antes do `.get/.post` |
| Link de autenticacao por email | Rota GET (clique no navegador = GET) |
| Token gerado com sucesso | Delete o auth link do banco imediatamente |
| Cookie de autenticacao | `httpOnly: true`, `path: '/'`, `maxAge` em segundos |
| Dados opcionais no JWT payload | Use optional chaining (`entity?.id`) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Registrar JWT globalmente no server ElysiaJS | Criar modulo `auth.ts` e usar `.use(auth)` por rota |
| Cookie sem httpOnly para tokens | `httpOnly: true` sempre para tokens de autenticacao |
| Deixar auth link ativo apos uso | `db.delete(authLinks).where(eq(...))` apos autenticar |
| Rota POST para link de email | Rota GET (usuario clica no link = GET) |
| `maxAge` sem comentario explicativo | `60 * 60 * 24 * 7 // 7 days` |
| Delete sem where clause | Sempre passe `.where()` no delete (ESLint ajuda) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-autenticacao-pelo-link/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-autenticacao-pelo-link/references/code-examples.md)
