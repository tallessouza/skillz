# Code Examples: Setup do Swagger

## Instalacao dos pacotes

```bash
pnpm add @fastify/swagger @fastify/swagger-ui
```

## Configuracao completa no server.ts

```typescript
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// Swagger — gera a spec OpenAPI
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS app with multi-tenant and RBAC',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

// Swagger UI — renderiza a interface em /docs
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})
```

## Rota com documentacao completa

```typescript
import { z } from 'zod'

app.post(
  '/users',
  {
    schema: {
      tags: ['auth'],
      summary: 'Create a new account',
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  },
  async (request, reply) => {
    const { name, email, password } = request.body
    // ... criar usuario
    return reply.status(201).send()
  },
)
```

## Exemplo com multiplas tags

```typescript
// Rotas de auth — todas com tag 'auth'
app.post('/users', {
  schema: {
    tags: ['auth'],
    summary: 'Create a new account',
    body: createAccountSchema,
  },
}, createAccountHandler)

app.post('/sessions', {
  schema: {
    tags: ['auth'],
    summary: 'Authenticate with email and password',
    body: authenticateSchema,
  },
}, authenticateHandler)

// Rotas de organizations — tag diferente
app.post('/organizations', {
  schema: {
    tags: ['organizations'],
    summary: 'Create a new organization',
    body: createOrgSchema,
  },
}, createOrgHandler)
```

## Acessando a documentacao

```
# Interface navegavel
http://localhost:3333/docs

# JSON da spec OpenAPI (consumivel por ferramentas externas)
http://localhost:3333/docs/json
```