---
name: rs-api-com-bun-rota-logout-e-derivacao
description: "Applies ElysiaJS derive pattern to extract authentication logic into reusable module functions when building APIs with Bun and ElysiaJS. Use when user asks to 'create logout route', 'organize auth module', 'use derive in Elysia', 'extract cookie logic', or 'modularize authentication'. Ensures auth operations (signUser, signOut) live in the auth module via derive, keeping routes clean. Make sure to use this skill whenever structuring ElysiaJS authentication modules. Not for frontend auth, session management outside ElysiaJS, or database auth logic."
---

# Rota de Logout e Derivação no ElysiaJS

> Extraia operacoes de autenticacao (sign-in, sign-out) para dentro do modulo auth usando `derive`, mantendo as rotas limpas e o auth centralizado.

## Rules

1. **Centralize auth no modulo via derive** — use `.derive({ as: 'scoped' }, ...)` no modulo auth para expor `signUser` e `signOut`, porque isso evita duplicacao de logica de cookies em cada rota
2. **Logout = remover cookie** — quando o token vive nos cookies (nao no frontend), a rota de logout e necessaria e consiste apenas em `auth.remove()`, porque o servidor controla o ciclo de vida do token
3. **Derive retorna funcoes, nao so dados** — retorne funcoes assincronas dentro do derive para encapsular operacoes complexas (criar JWT + setar cookie), porque as rotas consumidoras recebem uma API limpa
4. **Use `Static<typeof schema>` para tipar payloads do TypeBox** — o TypeBox retorna `TObject`/`TString`, nao tipos nativos TS; envolva com `Static` do ElysiaJS para obter o tipo TypeScript correto
5. **Evite conflito de nomes entre rota e funcao derivada** — se a rota se chama `signOut`, renomeie a funcao interna para evitar shadowing (ex: prefixo ou nome distinto no derive)

## How to write

### Modulo auth com derive (API atualizada)

```typescript
import Elysia from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { Static } from 'elysia'

export const auth = new Elysia()
  .use(jwt({ secret: env.JWT_SECRET_KEY, schema: jwtPayload }))
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload)
        auth.value = token
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7 // 7 days
        auth.path = '/'
      },
      signOut: () => {
        auth.remove()
      },
    }
  })
```

### Rota de logout consumindo o derive

```typescript
export const signout = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ signOut }) => {
    signOut()
    return { message: 'Logged out' }
  })
```

### Rota consumindo signUser

```typescript
.post('/authenticate', async ({ signUser }) => {
  // ... validacao do link ...
  await signUser({
    sub: authLink.userId,
    restaurantId: managedRestaurant?.id,
  })
})
```

## Example

**Before (logica espalhada nas rotas):**
```typescript
// authenticate-from-link.ts
.post('/auth', async ({ jwt, setCookie }) => {
  const token = await jwt.sign({ sub: userId, restaurantId })
  setCookie('auth', token, { httpOnly: true, maxAge: 604800, path: '/' })
})

// sign-out.ts
.post('/sign-out', async ({ removeCookie }) => {
  removeCookie('auth')
})
```

**After (centralizado no modulo auth via derive):**
```typescript
// auth.ts — derive expoe signUser e signOut
// authenticate-from-link.ts
.post('/auth', async ({ signUser }) => {
  await signUser({ sub: userId, restaurantId })
})

// sign-out.ts
.post('/sign-out', async ({ signOut }) => {
  signOut()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Token armazenado em cookie pelo servidor | Crie rota de logout para remover o cookie |
| Token enviado ao frontend (localStorage) | Logout e responsabilidade do frontend, rota opcional |
| Logica de cookie repetida em varias rotas | Extraia para derive no modulo auth |
| Funcao no derive precisa de dados externos | Receba via parametro da funcao, nao do contexto |
| Tipo do payload vem do TypeBox schema | Use `Static<typeof schema>` para converter |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `setCookie('auth', token, ...)` em cada rota | `await signUser(payload)` via derive |
| `removeCookie('auth')` em cada rota | `signOut()` via derive |
| `typeof jwtPayload` para tipar payload | `Static<typeof jwtPayload>` |
| Funcao derivada com mesmo nome da rota | Nomes distintos para evitar shadowing |
| Logica de JWT + cookie duplicada | Centralizar no modulo auth |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
