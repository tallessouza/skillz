---
name: rs-api-com-bun-erros-elysia
description: "Enforces module-scoped error handling in ElysiaJS. Use when user asks to 'handle errors in Elysia', 'create error classes', 'add error handling', 'return status codes', or 'treat errors per module'. Applies custom error classes, .error() registration, .onError() per module, global fallback. Make sure to use this skill whenever building Elysia APIs with error handling. Not for Express/Fastify (use rs-node-js) or frontend error boundaries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: elysia
  tags: [elysia, error-handling, custom-errors, bun, http-status]
---

# Tratamento de Erros no Elysia

> Erros de dentro para fora: primeiro no modulo, depois globalmente.

## Rules

1. **Classes de erro por modulo** — `class UnauthorizedError extends Error`
2. **Registre com .error()** — `app.error('UNAUTHORIZED', UnauthorizedError)`
3. **Trate no modulo com .onError()** — switch/case no `code`
4. **set.status** — `set.status = 401`
5. **Fallback global** — VALIDATION (400) e default (500)

## How to write

```typescript
export class UnauthorizedError extends Error { constructor() { super('Unauthorized') } }

export const auth = new Elysia()
  .error('UNAUTHORIZED', UnauthorizedError)
  .onError({ as: 'local' }, ({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED': set.status = 401; return { code, message: error.message }
    }
  })
```

## Example

**Before:** `throw new Error('Invalid token')` -> 500
**After:** `throw new UnauthorizedError()` -> 401

## Troubleshooting

### Erro customizado retorna 500
**Fix:** Registre com `.error()` antes do `.onError()`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
