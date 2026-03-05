# Code Examples: Setup de API com Fastify

## Instalacao de dependencias

```bash
npm install fastify fastify-type-provider-zod @fastify/cors zod
```

## Estrutura de pastas criada na aula

```
apps/api/src/
├── http/
│   ├── server.ts
│   └── routes/
│       └── auth/
│           └── create-account.ts
```

## server.ts completo

```typescript
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

// Routes
app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

Nota: `jsonSchemaTransform` e importado mas nao usado ainda — sera usado para documentacao da API em aula futura.

## create-account.ts completo

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      return reply.status(201).send({ message: 'User created' })
    },
  )
}
```

## Testando a API

```bash
# Sem dados — retorna erro de validacao
curl -X POST http://localhost:3333/users

# Com dados validos
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Diego", "email": "diego@skillz.com.br", "password": "123456"}'
```

## Configuracao do package.json

O entry point precisa apontar para o server:

```json
{
  "scripts": {
    "dev": "tsx watch src/http/server.ts"
  }
}
```

## Pattern: registrando multiplas rotas

```typescript
// server.ts — cada rota e um app.register()
import { createAccount } from './routes/auth/create-account'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getProfile } from './routes/auth/get-profile'
import { createOrganization } from './routes/orgs/create-organization'

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(createOrganization)
// arquivo vai crescer — e isso e OK
```

## Pattern: rota com querystring validation

```typescript
export async function listUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users',
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          perPage: z.coerce.number().default(20),
        }),
      },
    },
    async (request) => {
      const { page, perPage } = request.query
      // query e tipado automaticamente
    },
  )
}
```

## Pattern: rota com params validation

```typescript
export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/:userId',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { userId } = request.params
      // params e tipado automaticamente
    },
  )
}
```