---
name: rs-node-js-2023-autorizacao-rbac
description: "Applies Role-Based Access Control (RBAC) patterns when building Node.js APIs with Fastify and Prisma. Use when user asks to 'add authorization', 'restrict routes by role', 'create admin-only routes', 'implement RBAC', 'add permissions', or 'protect endpoints by user role'. Enforces enum-based roles in Prisma, JWT payload with role, and reusable verify-role middleware. Make sure to use this skill whenever implementing route-level authorization in Node.js APIs. Not for authentication (login/register), session management, or OAuth/third-party auth flows."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: authorization
  tags: [rbac, authorization, fastify, prisma, jwt, middleware, roles, permissions]
---

# Autorização por Cargos (RBAC)

> Controle de acesso baseado em cargos: defina roles como enum no schema, persista no JWT, e proteja rotas com middleware reutilizavel.

## Rules

1. **Defina roles como enum no Prisma** — `enum Role { ADMIN MEMBER }`, porque enums garantem consistencia no banco e validacao automatica, enquanto strings livres permitem typos silenciosos
2. **Sempre defina um valor default** — `role Role @default(MEMBER)`, porque usuarios novos devem ter o menor privilegio possivel (principle of least privilege)
3. **Persista a role no payload do JWT** — inclua `role` ao gerar token E ao fazer refresh, porque o middleware precisa dessa informacao sem consultar o banco a cada request
4. **Crie middleware generico, nao especifico** — `verifyUserRole('ADMIN')` nao `onlyAdmin()`, porque um unico middleware reutilizavel cobre todos os cargos sem duplicacao
5. **Use `onRequest` hook nas rotas** — nao middleware global, porque RBAC e por rota, nao por aplicacao inteira
6. **Retorne 401 Unauthorized quando role nao bate** — `reply.status(401).send({ message: 'Unauthorized.' })`, porque 403 Forbidden implica que o servidor reconhece o usuario mas nega acesso (ambos sao validos, mas mantenha consistencia)

## How to write

### Schema Prisma com enum Role

```prisma
enum Role {
  ADMIN
  MEMBER
}

model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  role          Role     @default(MEMBER)
  created_at    DateTime @default(now())
}
```

### JWT com role no payload

```typescript
// No controller de autenticação
const token = await reply.jwtSign(
  { role: user.role },
  { sign: { sub: user.id } },
)

const refreshToken = await reply.jwtSign(
  { role: user.role },
  { sign: { sub: user.id, expiresIn: '7d' } },
)
```

### Tipagem do FastifyJWT

```typescript
// src/@types/fastify-jwt.d.ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
```

### Middleware verifyUserRole

```typescript
// src/http/middlewares/verify-user-role.ts
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
```

### Protegendo rotas com onRequest

```typescript
// Nas rotas que precisam de RBAC
app.post('/gyms', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, createGymController)
app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, validateCheckInController)
```

## Example

**Before (sem RBAC — qualquer usuario autenticado acessa tudo):**
```typescript
app.post('/gyms', { onRequest: [verifyJWT] }, createGymController)
```

**After (com RBAC — apenas admins criam academias):**
```typescript
app.post('/gyms', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, createGymController)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota de criacao/delecao de recursos | Proteja com `verifyUserRole('ADMIN')` |
| Rota de leitura/listagem publica | Apenas `verifyJWT`, sem role check |
| Rota de validacao/aprovacao | Proteja com `verifyUserRole('ADMIN')` |
| Novo cargo necessario | Adicione ao enum Prisma, rode migration, atualize tipo do FastifyJWT |
| Refresh token | Inclua role no payload para manter acesso sem query extra |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (user.role === 'admin')` hardcoded no controller | `verifyUserRole('ADMIN')` como middleware no onRequest |
| `onlyAdmin()` middleware especifico | `verifyUserRole('ADMIN')` middleware generico parametrizado |
| Role como `String` livre no schema | Role como `enum` no Prisma |
| Buscar user no banco a cada request para checar role | Persistir role no JWT payload |
| Middleware global de RBAC | Hook `onRequest` por rota individual |

## Troubleshooting

### Middleware de role retorna 401 mesmo com role correta
**Symptom:** Admin autenticado recebe 401 em rota protegida
**Cause:** A role nao esta no payload do JWT ou o refresh token nao inclui role
**Fix:** Verifique que `reply.jwtSign({ role: user.role }, ...)` inclui a role no token

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-autorizacao-por-cargos-rbac/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-autorizacao-por-cargos-rbac/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
