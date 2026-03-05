# Code Examples: Controller de Criacao de Academia

## Exemplo completo do controller

```typescript
// src/http/controllers/gyms/create.ts
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
```

## Arquivo de rotas de academias

```typescript
// src/http/controllers/gyms/routes.ts
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  // Todas as rotas abaixo exigem autenticacao
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', create)
}
```

## Arquivo de rotas de usuarios (mix publico/privado)

```typescript
// src/http/controllers/users/routes.ts
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'

export async function usersRoutes(app: FastifyInstance) {
  // Rotas publicas
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rota privada (inline hook)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
```

## Registro no app principal

```typescript
// src/app.ts
import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { globalErrorHandler } from './utils/global-error-handler'

export const app = fastify()

app.register(usersRoutes)
app.register(gymsRoutes)

app.setErrorHandler(globalErrorHandler)
```

## Variacao: refine com mensagem customizada

```typescript
const createGymBodySchema = z.object({
  latitude: z.number().refine(
    (value) => Math.abs(value) <= 90,
    { message: 'Latitude must be between -90 and 90' }
  ),
  longitude: z.number().refine(
    (value) => Math.abs(value) <= 180,
    { message: 'Longitude must be between -180 and 180' }
  ),
})
```

## Variacao: controller COM try/catch (quando ha erros customizados)

```typescript
// Exemplo de quando o try/catch FAZ sentido (registro de usuario)
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err // re-throw para o global error handler
  }

  return reply.status(201).send()
}
```