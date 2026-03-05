# Code Examples: Handler de Erros Global

## Exemplo 1: Problema — erro desconhecido silencioso

Controller que "engole" erros desconhecidos:

```typescript
// src/http/controllers/register.ts
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // PROBLEMA: erro desconhecido retorna 500 sem log
    // Terminal nao mostra nada
    // Cliente recebe JSON generico
    return reply.status(500).send({ message: 'Internal server error' })
  }

  return reply.status(201).send()
}
```

## Exemplo 2: Solucao — controller re-lanca, handler global captura

Controller corrigido:

```typescript
// src/http/controllers/register.ts
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error // Deixa o error handler global lidar
  }

  return reply.status(201).send()
}
```

## Exemplo 3: Error handler global completo

```typescript
// src/app.ts
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  // 1. Erros de validacao (Zod)
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  // 2. Erros desconhecidos
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
```

## Exemplo 4: Resposta formatada para erro de validacao

Request com senha invalida (3 caracteres):
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "123"}'
```

Resposta com handler global:
```json
{
  "message": "Validation error.",
  "issues": {
    "_errors": [],
    "password": {
      "_errors": ["String must contain at least 6 characters"]
    }
  }
}
```

Status: `400 Bad Request`

## Exemplo 5: Extensao futura — mais erros de dominio

Conforme a aplicacao cresce, o controller pode ter mais `if`s para erros conhecidos, mas erros desconhecidos sempre caem no `throw`:

```typescript
try {
  await someUseCase.execute(params)
} catch (error) {
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message })
  }

  if (error instanceof NotAllowedError) {
    return reply.status(403).send({ message: error.message })
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }

  // Qualquer outro erro: handler global
  throw error
}
```

## Exemplo 6: Integracao com observabilidade (producao)

```typescript
// Exemplo conceitual para producao
import * as Sentry from '@sentry/node'

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    Sentry.captureException(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
```