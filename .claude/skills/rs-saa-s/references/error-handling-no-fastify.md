---
name: rs-saas-nextjs-rbac-error-handling-fastify
description: "Enforces standardized error handling patterns in Fastify APIs with custom error classes and centralized ErrorHandler. Use when user asks to 'create an API', 'handle errors in Fastify', 'add error handling', 'standardize API responses', or 'create error classes'. Applies rules: custom error classes extending Error, centralized ErrorHandler with instanceof checks, consistent JSON response shape, ZodError integration. Make sure to use this skill whenever building Fastify APIs or adding error handling to Node.js backends. Not for frontend error handling, React error boundaries, or database error recovery."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: error-handling
  tags: [saas, fastify, api, routes, nextjs, zod]
---

# Error Handling no Fastify

> Padronize todas as respostas de erro da API com classes de erro customizadas e um ErrorHandler centralizado, garantindo que o front-end sempre receba a mesma estrutura de resposta.

## Rules

1. **Nunca retorne erros inline nas rotas** — use `throw new BadRequestError('message')` em vez de `reply.status(400).send({ message })`, porque respostas inline criam inconsistencia no formato (um dev usa `message`, outro usa `error`)
2. **Crie classes de erro por status HTTP** — `BadRequestError` (400), `UnauthorizedError` (401), cada uma estendendo `Error`, porque permite usar `instanceof` no handler centralizado
3. **Centralize todo tratamento no ErrorHandler** — uma unica funcao registrada via `app.setErrorHandler()`, porque garante que TODO erro passa pelo mesmo pipeline
4. **Trate ZodError separadamente** — valide com `instanceof ZodError` e retorne `errors: error.flatten().fieldErrors`, porque erros de validacao tem estrutura diferente de erros de negocio
5. **Erros inesperados vao pro console + observabilidade** — status 500 com mensagem generica para o cliente, log completo no servidor, porque nunca exponha stack traces ou detalhes internos
6. **Organize erros em pasta `_errors/`** — prefixo underscore mantem no topo do diretorio, porque facilita navegacao

## How to write

### Classes de erro customizadas

```typescript
// src/http/_errors/bad-request-error.ts
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}

// src/http/_errors/unauthorized-error.ts
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unauthorized')
  }
}
```

### ErrorHandler centralizado

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
    return reply.status(400).send({ message: error.message })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message })
  }

  console.error(error)
  // TODO: send error to observability platform (Sentry, Datadog, etc.)

  return reply.status(500).send({ message: 'Internal server error' })
}
```

### Registro no servidor

```typescript
// src/http/server.ts
import { errorHandler } from './error-handler'

app.setErrorHandler(errorHandler)
```

## Example

**Before (erro inline inconsistente):**
```typescript
app.post('/sessions', async (request, reply) => {
  // ...
  if (!isPasswordValid) {
    return reply.status(400).send({ message: 'Invalid credentials' })
  }
})

app.post('/users', async (request, reply) => {
  // ...
  if (userExists) {
    return reply.status(400).send({ error: 'User already exists' }) // campo diferente!
  }
})
```

**After (com classes de erro):**
```typescript
app.post('/sessions', async (request, reply) => {
  // ...
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials')
  }
})

app.post('/users', async (request, reply) => {
  // ...
  if (userExists) {
    throw new BadRequestError('User with same e-mail already exists')
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Erro de validacao de input (Zod) | Retorne 400 com `error.flatten().fieldErrors` |
| Erro de regra de negocio (credencial invalida, duplicado) | `throw new BadRequestError(msg)` |
| Usuario nao autenticado | `throw new UnauthorizedError()` |
| Erro inesperado (crash, bug) | 500 + log + enviar para observabilidade |
| Novo status HTTP necessario (403, 404, 409) | Crie nova classe em `_errors/` seguindo o padrao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `reply.status(400).send({ message })` inline | `throw new BadRequestError(message)` |
| `reply.status(400).send({ error })` | `throw new BadRequestError(message)` |
| `catch (e) { reply.send(e) }` | Deixe o ErrorHandler centralizado tratar |
| `reply.status(500).send({ stack: error.stack })` | `reply.status(500).send({ message: 'Internal server error' })` |
| Mensagem padrao hardcoded em cada rota | `UnauthorizedError` com default no constructor |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
