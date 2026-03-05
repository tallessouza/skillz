---
name: rs-saas-nextjs-rbac-auth-middleware
description: "Applies Fastify authentication middleware patterns when writing API routes with JWT auth. Use when user asks to 'create middleware', 'add authentication', 'protect routes', 'validate JWT token', or 'extend FastifyRequest'. Enforces getCurrentUserId pattern, FastifyPlugin for scope propagation, and TypeScript interface merging for request decoration. Make sure to use this skill whenever building Fastify auth layers or adding custom methods to request objects. Not for frontend auth, session-based auth, or Next.js middleware."
---

# Middleware de Autenticação no Fastify

> Crie middlewares de autenticação como plugins Fastify que decoram o request com métodos reutilizáveis, nunca bloqueando diretamente no hook.

## Rules

1. **Adicione métodos ao request, nao bloqueie no hook** — `request.getCurrentUserId()` em vez de `request.jwtVerify()` direto no pre-handler, porque algumas rotas precisam do usuario logado sem invalidar acesso de usuarios anonimos
2. **Use FastifyPlugin para escapar o escopo** — sem ele, hooks adicionados num plugin so valem dentro daquele arquivo, porque o Fastify isola contexto por padrao
3. **Estenda FastifyRequest via interface merging** — crie `@types/fastify.d.ts` com a mesma interface `FastifyRequest`, porque TypeScript combina interfaces de mesmo nome automaticamente (diferente de `type`)
4. **Inclua o diretorio @types no tsconfig** — adicione ao `include` do `tsconfig.json`, porque arquivos `.d.ts` fora de `src/` nao sao encontrados por padrao
5. **Registre o middleware antes das rotas** — `app.register(auth)` antes de `app.get(...)`, porque o Fastify aplica plugins na ordem de registro

## How to write

### Middleware com getCurrentUserId

```typescript
import { FastifyInstance } from 'fastify'
import { FastifyPlugin } from 'fastify-plugin'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token.')
      }
    }
  })
})
```

### Extensao de tipos do FastifyRequest

```typescript
// @types/fastify.d.ts
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
  }
}
```

### Uso na rota

```typescript
import { auth } from '../middlewares/auth'

export async function getProfile(app: FastifyInstance) {
  app.register(auth).get('/profile', async (request) => {
    const userId = await request.getCurrentUserId()
    // usar userId...
  })
}
```

## Example

**Before (bloqueio direto no hook — inflexivel):**
```typescript
app.addHook('preHandler', async (request) => {
  await request.jwtVerify() // bloqueia TODA rota
})
```

**After (metodo no request — flexivel):**
```typescript
export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token.')
      }
    }
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota que EXIGE autenticacao | Chame `await request.getCurrentUserId()` — lanca erro automaticamente |
| Rota que aceita usuario anonimo | Envolva `getCurrentUserId()` em try/catch e trate o caso sem usuario |
| Plugin precisa afetar rotas externas | Envolva com `fastifyPlugin()` |
| Plugin so precisa valer internamente | Exporte como funcao async simples, sem `fastifyPlugin` |
| Novo metodo no request | Crie interface merging em `@types/fastify.d.ts` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `request.jwtVerify()` direto no hook | `request.getCurrentUserId = async () => { ... }` |
| `export async function auth(app)` sem fastifyPlugin | `export const auth = fastifyPlugin(async (app) => { ... })` |
| `type FastifyRequest = { ... }` para estender | `interface FastifyRequest { ... }` (interface merge) |
| Tipos em `src/` com import de `fastify` | `@types/fastify.d.ts` com `declare module 'fastify'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
