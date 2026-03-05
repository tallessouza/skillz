# Code Examples: Implementando JWT no Fastify

## 1. Instalacao

```bash
npm install @fastify/jwt
```

## 2. Configuracao da variavel ambiente

```env
# .env
JWT_SECRET=ignite-node-03

# .env.example
JWT_SECRET=
```

```typescript
// src/env/index.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
```

## 3. Registro do modulo no app

```typescript
// src/app.ts
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)
```

## 4. Controller de autenticacao (gera o token)

```typescript
// src/http/controllers/authenticate.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
```

## 5. Controller de profile (rota protegida)

```typescript
// src/http/controllers/profile.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined, // nunca retornar hash da senha
    },
  })
}
```

## 6. Registro das rotas

```typescript
// src/http/routes.ts
import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rota protegida
  app.get('/me', profile)
}
```

## 7. Declaracao de tipos

```typescript
// src/@types/fastify-jwt.d.ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
    }
  }
}
```

## 8. Testando no Insomnia/HTTP client

```http
### Login
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "123456"
}

# Response: { "token": "eyJhbGciOiJI..." }

### Profile (rota protegida)
GET http://localhost:3333/me
Authorization: Bearer eyJhbGciOiJI...

# Response: { "user": { "id": "...", "name": "...", "email": "..." } }

### Profile sem token (erro)
GET http://localhost:3333/me

# Response: 401 Unauthorized
```

## 9. Verificando token no jwt.io

Para validar que o token foi gerado corretamente:
1. Copie o token retornado pelo login
2. Acesse jwt.io
3. Cole o token — voce vera o `sub` com o id do usuario e o `iat` (data de criacao)
4. Na secao "Verify Signature", digite sua `JWT_SECRET`
5. Deve aparecer "Signature Verified"

Se alguem tentar alterar qualquer campo do token sem a chave secreta, a assinatura nao vai bater — o back-end rejeitara o token.