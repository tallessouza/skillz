---
name: rs-node-js-2023-controller-de-perfil
description: "Applies authenticated profile controller pattern with JWT middleware in Fastify/Node.js. Use when user asks to 'create a profile route', 'protect routes with authentication', 'add JWT middleware', 'verify token in routes', or 'return user data without password'. Ensures JWT verification is extracted as reusable middleware with onRequest hook. Make sure to use this skill whenever building authenticated API routes in Fastify. Not for frontend auth, session-based auth, or OAuth flows."
---

# Controller de Perfil com JWT Middleware

> Extraia a verificacao de JWT em um middleware reutilizavel e aplique via onRequest hook, nunca inline no controller.

## Rules

1. **Nunca retorne password_hash na resposta** — remova campos sensiveis antes de enviar, porque expor hashes e uma vulnerabilidade mesmo que nao seja a senha em texto puro
2. **Extraia verificacao JWT em middleware separado** — arquivo dedicado em `middlewares/` ou `hooks/`, porque cada rota autenticada precisa da mesma logica e duplicar e bug waiting to happen
3. **Use onRequest hook do Fastify** — nao chame `request.jwtVerify()` dentro do controller, porque o middleware intercepta antes e nem deixa o controller executar se o token for invalido
4. **Retorne 401 com mensagem clara no middleware** — capture o erro do jwtVerify em try/catch e retorne `{ message: 'Unauthorized' }` com status 401, porque 500 internal server error confunde o cliente
5. **Acesse o userId via request.user.sub** — apos o JWT ser verificado, o payload decodificado fica em `request.user`, porque o Fastify JWT plugin popula automaticamente

## How to write

### Middleware de verificacao JWT

```typescript
// src/http/middlewares/verify-jwt.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
```

### Controller de perfil

```typescript
// src/http/controllers/profile.ts
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
```

### Registro da rota com onRequest

```typescript
import { verifyJWT } from '../middlewares/verify-jwt'

export async function profileRoutes(app: FastifyInstance) {
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
```

## Example

**Before (verificacao inline, sem middleware):**
```typescript
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(500).send()
  }

  const user = await getUser(request.user.sub)
  return reply.send({ user }) // expoe password_hash
}
```

**After (middleware extraido, campo sensivel removido):**
```typescript
// Middleware separado cuida da auth
// Controller so faz o que precisa
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: { ...user, password_hash: undefined },
  })
}

// Rota registrada com onRequest hook
app.get('/me', { onRequest: [verifyJWT] }, profile)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa de autenticacao | Adicione `{ onRequest: [verifyJWT] }` na definicao da rota |
| Retornando dados de usuario | Sempre remova `password_hash` antes de enviar |
| Multiplas rotas autenticadas | Reutilize o mesmo middleware, nunca duplique o try/catch |
| Cadastro e login | Nao aplique o middleware — sao rotas publicas |
| Erro de JWT invalido/ausente | Retorne 401, nunca 500 |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `request.jwtVerify()` dentro do controller | `{ onRequest: [verifyJWT] }` no registro da rota |
| `return reply.send({ user })` com todos os campos | `{ ...user, password_hash: undefined }` |
| `catch { return reply.status(500).send() }` no JWT | `catch { return reply.status(401).send({ message: 'Unauthorized' }) }` |
| `delete user.password_hash` direto no objeto | Spread com `password_hash: undefined` para evitar erro de tipo |
| Copiar verificacao JWT em cada controller | Um middleware em arquivo separado reutilizado via onRequest |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-de-perfil/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-de-perfil/references/code-examples.md)
