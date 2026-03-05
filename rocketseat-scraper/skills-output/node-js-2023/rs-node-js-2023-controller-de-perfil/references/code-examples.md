# Code Examples: Controller de Perfil com JWT Middleware

## Exemplo completo do controller de perfil

```typescript
// src/http/controllers/profile.ts
import { FastifyRequest, FastifyReply } from 'fastify'
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

## Middleware de verificacao JWT

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

## Registro de rota com middleware

```typescript
// src/http/routes.ts
import { FastifyInstance } from 'fastify'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  // Rotas publicas
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rotas autenticadas — onRequest garante JWT valido
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
```

## Evolucao: antes e depois do middleware

### Antes — verificacao inline no controller

```typescript
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Logica de auth misturada com logica de negocio
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(500).send() // status errado!
  }

  // Agora sim o controller
  const getUserProfile = makeGetUserProfileUseCase()
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.send({ user }) // expoe password_hash!
}
```

### Depois — separacao de responsabilidades

```typescript
// Middleware cuida APENAS de auth
export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}

// Controller cuida APENAS de buscar e retornar o perfil
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: { ...user, password_hash: undefined },
  })
}

// Rota conecta middleware + controller
app.get('/me', { onRequest: [verifyJWT] }, profile)
```

## Problema do delete com TypeScript

```typescript
// ERRO: TypeScript nao permite delete em campo obrigatorio
const { user } = await getUserProfile.execute({ userId: request.user.sub })
delete user.password_hash // Property 'password_hash' is not optional

// SOLUCAO: spread com undefined
return reply.send({
  user: {
    ...user,
    password_hash: undefined, // undefined e ignorado pelo JSON.stringify
  },
})
```

## Aplicando o middleware em multiplas rotas

```typescript
export async function appRoutes(app: FastifyInstance) {
  // Publicas
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Todas autenticadas — mesmo middleware reutilizado
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.post('/check-ins', { onRequest: [verifyJWT] }, createCheckIn)
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyJWT] }, validateCheckIn)
  app.get('/gyms/search', { onRequest: [verifyJWT] }, searchGyms)
}
```