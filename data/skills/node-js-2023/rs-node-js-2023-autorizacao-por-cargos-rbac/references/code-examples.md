# Code Examples: Autorização por Cargos (RBAC)

## 1. Schema Prisma completo com enum Role

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

Migration: `npx prisma migrate dev` com nome `add role to users`. Todos os usuários existentes recebem `MEMBER` automaticamente pelo default.

## 2. Controller de autenticação com role no token

```typescript
// src/http/controllers/authenticate.controller.ts
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  // ... validação de credenciais e chamada do use case ...

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
```

## 3. Controller de refresh com role mantida

```typescript
// src/http/controllers/refresh.controller.ts
export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub } },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
```

## 4. Tipagem do FastifyJWT

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

## 5. Middleware verifyUserRole completo

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

## 6. Aplicação nas rotas

```typescript
// src/http/controllers/gyms/routes.ts
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGymController)
  app.get('/gyms/search', searchGymsController)
  app.get('/gyms/nearby', nearbyGymsController)
}
```

```typescript
// src/http/controllers/check-ins/routes.ts
export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', createCheckInController)
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validateCheckInController)
  app.get('/check-ins/history', historyController)
  app.get('/check-ins/metrics', metricsController)
}
```

## 7. Verificação via jwt.io

Ao decodificar o token no jwt.io, o payload mostra:

```json
{
  "role": "MEMBER",
  "sub": "user-uuid-here",
  "iat": 1234567890
}
```

Para admin:
```json
{
  "role": "ADMIN",
  "sub": "admin-uuid-here",
  "iat": 1234567890
}
```

## 8. Evolução do middleware (primeira versão → versão final)

```typescript
// PRIMEIRA VERSÃO (específica — não use)
export async function onlyAdmin(request: FastifyRequest, reply: FastifyReply) {
  const { role } = request.user

  if (role !== 'ADMIN') {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}

// VERSÃO FINAL (genérica — use esta)
export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
```