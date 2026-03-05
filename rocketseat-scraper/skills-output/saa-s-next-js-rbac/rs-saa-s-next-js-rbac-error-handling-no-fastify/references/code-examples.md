# Code Examples: Error Handling no Fastify

## Estrutura de arquivos

```
src/
└── http/
    ├── _errors/
    │   ├── bad-request-error.ts
    │   └── unauthorized-error.ts
    ├── error-handler.ts
    ├── server.ts
    └── routes/
        ├── authenticate.ts
        ├── create-account.ts
        └── get-profile.ts
```

## Classe BadRequestError completa

```typescript
// src/http/_errors/bad-request-error.ts
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}
```

## Classe UnauthorizedError completa

```typescript
// src/http/_errors/unauthorized-error.ts
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unauthorized')
  }
}
```

## ErrorHandler completo

```typescript
// src/http/error-handler.ts
import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './_errors/bad-request-error'
import { UnauthorizedError } from './_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)
  // Send error to some observability platform

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
```

## Registro no server.ts

```typescript
// src/http/server.ts
import fastify from 'fastify'
import { errorHandler } from './error-handler'

const app = fastify()

app.setErrorHandler(errorHandler)
```

## Uso nas rotas — antes e depois

### authenticate.ts

**Antes:**
```typescript
if (!isPasswordValid) {
  return reply.status(400).send({ message: 'Invalid credentials' })
}
```

**Depois:**
```typescript
import { BadRequestError } from '../_errors/bad-request-error'

if (!isPasswordValid) {
  throw new BadRequestError('Invalid credentials')
}
```

### create-account.ts

**Antes:**
```typescript
if (userWithSameEmail) {
  return reply.status(400).send({ message: 'User with same e-mail already exists' })
}
```

**Depois:**
```typescript
import { BadRequestError } from '../_errors/bad-request-error'

if (userWithSameEmail) {
  throw new BadRequestError('User with same e-mail already exists')
}
```

### get-profile.ts

**Antes:**
```typescript
if (!user) {
  return reply.status(400).send({ message: 'User not found' })
}
```

**Depois:**
```typescript
import { BadRequestError } from '../_errors/bad-request-error'

if (!user) {
  throw new BadRequestError('User not found')
}
```

## Respostas da API — exemplos reais

### Erro de validacao (ZodError)
```json
// POST /sessions com body vazio
// Status: 400
{
  "message": "Validation error",
  "errors": {
    "email": ["Required"],
    "password": ["Required"]
  }
}
```

### Erro de negocio (BadRequestError)
```json
// POST /sessions com senha errada
// Status: 400
{
  "message": "Invalid credentials"
}
```

### Erro de autenticacao (UnauthorizedError)
```json
// GET /profile sem token
// Status: 401
{
  "message": "Unauthorized"
}
```

### Erro inesperado (500)
```json
// Qualquer rota com bug interno
// Status: 500
{
  "message": "Internal server error"
}
```

## Adicionando novas classes de erro

Quando precisar de um novo status HTTP, siga o padrao:

```typescript
// src/http/_errors/not-found-error.ts
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
  }
}

// Adicione no error-handler.ts:
import { NotFoundError } from './_errors/not-found-error'

// Dentro do errorHandler, antes do fallthrough 500:
if (error instanceof NotFoundError) {
  return reply.status(404).send({
    message: error.message,
  })
}
```