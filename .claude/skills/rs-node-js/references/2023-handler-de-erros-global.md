---
name: rs-node-js-2023-handler-de-erros-global
description: "Applies global error handling patterns when building Fastify APIs with Node.js. Use when user asks to 'handle errors', 'create error handler', 'setup error middleware', 'treat validation errors', or 'add global error handling' in Fastify applications. Enforces centralized error treatment with setErrorHandler, Zod validation formatting, environment-aware logging, and proper HTTP status codes. Make sure to use this skill whenever creating or reviewing Fastify error handling, even if user only mentions a specific error type. Not for Express.js middleware, frontend error boundaries, or database error handling."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: error-handling
  tags: [fastify, error-handler, zod, validation, http, nodejs]
---

# Handler de Erros Global (Fastify)

> Centralize todo tratamento de erros em um unico setErrorHandler no Fastify, separando erros conhecidos (validacao, dominio) de erros desconhecidos (500).

## Rules

1. **Use `app.setErrorHandler`** — nunca trate erros apenas dentro de controllers individuais, porque erros inesperados (ex: funcao inexistente, falha de hash) escapam do try-catch local
2. **Re-lance erros desconhecidos nos controllers** — se o erro nao cair em nenhum `if` conhecido, faca `throw error` para que o error handler global capture, porque manter o erro preso no controller sem tratamento gera 500 silencioso
3. **Erros de validacao Zod retornam 400** — use `error instanceof ZodError` e responda com `error.format()` em um campo `issues`, porque o cliente precisa saber qual campo falhou e por que
4. **Erros desconhecidos retornam 500 generico** — responda apenas `{ message: 'Internal server error' }`, porque expor stack traces em producao e vulnerabilidade de seguranca
5. **Log condicional por ambiente** — em dev, use `console.error(error)` para ver stack trace completa; em producao, envie para ferramenta de observabilidade (Datadog, Sentry, New Relic), porque ninguem monitora terminal em producao
6. **Prefixe parametros nao utilizados com `_`** — use `_request` quando o handler nao precisa do request, porque evita warnings de "declared but never read"

## How to write

### Error Handler global no app.ts

```typescript
import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error.',
        issues: error.format(),
      })
    }

    if (env.NODE_ENV !== 'production') {
      console.error(error)
    } else {
      // TODO: log to external observability tool (Datadog/Sentry/New Relic)
    }

    return reply.status(500).send({ message: 'Internal server error.' })
  })
}
```

### Controller que re-lanca erros desconhecidos

```typescript
try {
  await registerUseCase.execute({ name, email, password })
} catch (error) {
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }

  // Erro desconhecido: re-lance para o error handler global
  throw error
}
```

## Example

**Before (erro preso no controller, 500 silencioso):**
```typescript
try {
  await registerUseCase.execute({ name, email, password })
} catch (error) {
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }
  // Erro desconhecido: 500 sem log, sem detalhes
  return reply.status(500).send({ message: 'Internal server error' })
}
```

**After (erro re-lancado, handler global trata):**
```typescript
// Controller
try {
  await registerUseCase.execute({ name, email, password })
} catch (error) {
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }
  throw error // handler global captura
}

// app.ts — error handler global
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error) // stack trace completa no terminal
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro de validacao (Zod) | 400 + `error.format()` em `issues` |
| Erro de dominio conhecido (ex: UserAlreadyExists) | Trate no controller com status especifico (409, 404, etc) |
| Erro desconhecido no controller | `throw error` para o handler global |
| Ambiente de desenvolvimento | `console.error(error)` para ver stack trace |
| Ambiente de producao | Envie para ferramenta de observabilidade |
| Parametro nao usado no callback | Prefixe com `_` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `return reply.status(500).send()` dentro do catch generico no controller | `throw error` e deixe o handler global tratar |
| `console.error` em producao | Envie para Datadog/Sentry/New Relic |
| Retornar stack trace na resposta HTTP | Retorne apenas `{ message: 'Internal server error.' }` |
| Tratar `ZodError` em cada controller individualmente | Trate uma vez no `setErrorHandler` global |
| Ignorar erros desconhecidos (catch vazio) | Sempre logue ou re-lance |

## Troubleshooting

### Erro 500 sem log ou detalhes no terminal
**Symptom:** A API retorna 500 Internal Server Error mas nenhum log aparece no terminal
**Cause:** O erro desconhecido e capturado no catch do controller com return reply.status(500) em vez de ser re-lancado
**Fix:** No catch do controller, apos tratar erros conhecidos, use throw error para que o setErrorHandler global capture e logue

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
