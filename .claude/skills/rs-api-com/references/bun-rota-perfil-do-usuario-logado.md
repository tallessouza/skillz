---
name: rs-api-com-bun-rota-perfil-usuario
description: "Applies authenticated profile route pattern when building API endpoints with Elysia and Bun. Use when user asks to 'create a profile route', 'return logged user data', 'get current user', 'authenticated route', or 'protect route with auth'. Enforces pattern: auth plugin composition, getCurrentUser extraction from JWT cookie, database lookup, and error handling. Make sure to use this skill whenever creating authenticated API routes with Elysia. Not for frontend auth, session management UI, or OAuth provider setup."
---

# Rota de Perfil do Usuario Autenticado

> Rotas autenticadas em Elysia seguem o padrao: plugin de auth → extrair usuario do JWT cookie → consultar banco → retornar dados.

## Rules

1. **Use `/me` para rotas do usuario logado** — `GET /me` retorna dados do usuario autenticado, porque e um padrao REST amplamente reconhecido (como "quem sou eu")
2. **Compose auth como plugin Elysia** — toda rota autenticada usa `.use(auth)` para ter acesso a `getCurrentUser`, porque centraliza logica de autenticacao
3. **Extraia getCurrentUser do plugin de auth** — nao duplique logica de JWT verify em cada rota, porque o plugin ja encapsula cookie extraction + jwt.verify + payload parsing
4. **Valide payload do JWT antes de usar** — se `jwt.verify` retornar falso, lance erro imediatamente, porque significa token invalido ou expirado
5. **Consulte o banco apos extrair userId** — o JWT contem apenas `sub` (userId) e dados minimos; busque dados completos no banco, porque o token pode estar desatualizado
6. **Lance erro explicito se usuario nao existir** — `throw new Error('User not found')` apos query, porque o usuario pode ter sido deletado desde a emissao do token

## How to write

### Plugin de autenticacao com getCurrentUser

```typescript
// Dentro do plugin de auth (authentication.ts)
const getCurrentUser = async () => {
  const payload = await jwt.verify(cookie.auth)

  if (!payload) {
    throw new Error('Unauthorized')
  }

  return {
    userId: payload.sub,
    restaurantId: payload.restaurantId,
  }
}
```

### Rota GET /me com auth plugin

```typescript
export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  })
```

### Registrar no server

```typescript
const app = new Elysia()
  .use(getProfile)
  // ... outras rotas
```

## Example

**Before (logica de auth duplicada na rota):**
```typescript
export const getProfile = new Elysia()
  .get('/me', async ({ cookie, jwt }) => {
    const payload = await jwt.verify(cookie.auth)
    if (!payload) throw new Error('Unauthorized')
    const user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, payload.sub),
    })
    return user
  })
```

**After (auth encapsulado no plugin):**
```typescript
export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()
    const user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
    })
    if (!user) throw new Error('User not found')
    return user
  })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa saber quem esta logado | `.use(auth)` + `getCurrentUser()` |
| Rota retorna dados do proprio usuario | Use `GET /me` como path |
| JWT verify retorna false | Lance erro imediatamente, nao continue |
| Precisa de dados completos do usuario | Consulte o banco com userId do token |
| Novo campo no plugin de auth | Retorne objeto explicito `{ userId, restaurantId }` em vez de payload cru |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `jwt.verify` direto na rota | `getCurrentUser()` via plugin |
| Retornar payload JWT como resposta | Consultar banco e retornar dados frescos |
| `GET /user/profile` ou `/user/me` | `GET /me` (padrao REST) |
| Ignorar caso de usuario nao encontrado | `if (!user) throw new Error('User not found')` |
| Espalhar logica de cookie em cada rota | Centralizar no plugin de auth |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-perfil-do-usuario-logado/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-perfil-do-usuario-logado/references/code-examples.md)
