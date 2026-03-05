---
name: rs-api-com-bun-erros-elysia
description: "Enforces module-scoped error handling patterns in Elysia applications. Use when user asks to 'handle errors in Elysia', 'create error classes', 'add error handling', 'return proper status codes', or 'treat errors per module'. Applies rules: custom error classes extending Error, register errors with .error(), handle per-module with .onError(), global fallback for validation and unknown errors. Make sure to use this skill whenever building Elysia APIs with error handling. Not for generic Express/Fastify error handling or frontend error boundaries."
---

# Tratamento de Erros no Elysia

> Erros devem ser tratados de dentro para fora: primeiro no modulo, depois globalmente — nunca o contrario.

## Rules

1. **Crie classes de erro por modulo** — cada modulo define seus proprios erros em `errors/`, porque erros genericos resultam em status 500 sem informacao util
2. **Toda classe de erro estende Error** — `class UnauthorizedError extends Error`, porque o Elysia so reconhece erros que estendem a classe base Error do TypeScript
3. **Registre erros com .error()** — use `app.error('UNAUTHORIZED', UnauthorizedError)` antes ou depois do `.use()`, porque erros nao registrados sao tratados como erro 500 pelo Elysia
4. **Trate erros no modulo com .onError()** — use switch/case no `code` e so trate erros que pertencem ao modulo, porque tratar tudo globalmente forca generalizacao de status e mensagens
5. **Use set.status para definir o codigo HTTP** — `set.status = 401`, porque sem isso o Elysia retorna 500 por padrao
6. **Fallback global no servidor** — no servidor principal, trate `VALIDATION` (400) e default (500 com console.error), porque erros nao previstos precisam de um ultimo recurso

## How to write

### Classe de erro customizada

```typescript
// src/http/errors/unauthorized-error.ts
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}
```

### Registro e tratamento no modulo

```typescript
import { UnauthorizedError } from '../errors/unauthorized-error'

export const auth = new Elysia()
  .error('UNAUTHORIZED', UnauthorizedError)
  .onError({ as: 'local' }, ({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401
        return { code, message: error.message }
    }
  })
  .use(/* ... */)
```

### Tratamento global no servidor

```typescript
const app = new Elysia()
  .use(auth)
  .use(routes)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return error.toResponse()
      default:
        set.status = 500
        console.error(error)
        return new Response(null, { status: 500 })
    }
  })
```

## Example

**Before (erro generico, retorna 500):**
```typescript
const user = await validateJwt(token)
if (!user) {
  throw new Error('Invalid token')
}
```

**After (erro tipado, retorna 401):**
```typescript
const user = await validateJwt(token)
if (!user) {
  throw new UnauthorizedError()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Erro especifico de um dominio (auth, pagamento) | Crie classe de erro no modulo, registre com .error() |
| Erro de validacao de body/query/params | Trate no onError global com case 'VALIDATION' |
| Erro totalmente inesperado | Retorne 500 no default do onError global com console.error |
| Modulo A usa modulo B | Modulo A herda os erros registrados em B automaticamente |
| Muitos erros no mesmo modulo | Crie uma classe por tipo de erro (NotFound, Forbidden, etc.) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error('Unauthorized')` sem classe | `throw new UnauthorizedError()` com classe registrada |
| Tratar todos os erros no servidor global | Tratar erros no modulo de origem, global so para fallback |
| `onError` sem switch no code | Switch no code para tratar cada tipo de erro separadamente |
| Retornar erro sem set.status | Sempre definir set.status antes de retornar |
| Ignorar erros nao previstos (sem default) | Sempre ter default com 500 e console.error |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-lidando-com-erros-no-elysia/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-lidando-com-erros-no-elysia/references/code-examples.md)
