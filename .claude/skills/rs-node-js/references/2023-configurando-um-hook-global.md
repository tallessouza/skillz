---
name: rs-node-js-2023-hooks-globais-fastify
description: "Applies Fastify global hook and plugin scoping patterns when writing Node.js APIs with Fastify. Use when user asks to 'add middleware', 'create a hook', 'add logging', 'add global validation', 'register preHandler', or any Fastify route interceptor task. Ensures correct hook placement based on desired scope (plugin-local vs app-wide). Make sure to use this skill whenever registering Fastify hooks or middleware. Not for Express.js middleware, authentication logic, or database query patterns."
---

# Hooks Globais no Fastify

> Registre hooks no escopo correto: plugin para contexto local, server para contexto global.

## Rules

1. **Use `app.addHook()` para hooks globais dentro de um plugin** — porque tudo registrado dentro de um plugin vale apenas para as rotas daquele plugin (contexto isolado do Fastify)
2. **Registre hooks no server antes dos plugins para escopo global** — porque o Fastify respeita a arvore de contexto: hooks no nivel raiz afetam todas as rotas, hooks dentro de um plugin afetam apenas aquele plugin
3. **Separe a funcao do hook em arquivo proprio** — `import { logRequest } from './middlewares/log-request'` porque permite reutilizacao e testabilidade, igual ao pattern do `checkSessionIdExists`
4. **Escolha o hook correto para o momento certo** — `preHandler` para logica pre-execucao, `onRequest` para o inicio absoluto, `onResponse` para pos-resposta, porque cada hook dispara em um ponto diferente do lifecycle
5. **Nunca assuma que um hook de plugin afeta outras rotas** — porque cada `app.register()` cria um contexto encapsulado no Fastify

## How to write

### Hook global dentro de um plugin (escopo local)

```typescript
// routes/transactions.ts
// Este hook dispara APENAS para rotas dentro deste plugin
export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/', async () => { /* ... */ })
  app.post('/', async () => { /* ... */ })
}
```

### Hook global no server (escopo da aplicacao inteira)

```typescript
// server.ts
const app = fastify()

// Registrado ANTES dos plugins = afeta TODAS as rotas
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(transactionsRoutes, { prefix: '/transactions' })
```

### Hook extraido para arquivo separado

```typescript
// middlewares/log-request.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function logRequest(request: FastifyRequest, reply: FastifyReply) {
  console.log(`[${request.method}] ${request.url}`)
}

// server.ts ou routes/*.ts
app.addHook('preHandler', logRequest)
```

## Example

**Before (hook no lugar errado — acha que e global mas so vale no plugin):**

```typescript
// routes/transactions.ts
export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', logRequest) // So dispara para /transactions/*
}

// server.ts
app.register(transactionsRoutes, { prefix: '/transactions' })
app.get('/hello', async () => 'Hello World') // logRequest NAO dispara aqui
```

**After (hook no escopo correto para ser realmente global):**

```typescript
// server.ts
app.addHook('preHandler', logRequest) // Dispara para TODAS as rotas

app.register(transactionsRoutes, { prefix: '/transactions' })
app.get('/hello', async () => 'Hello World') // logRequest dispara aqui tambem
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Hook deve afetar apenas rotas de uma entidade | Registre dentro do plugin daquela entidade |
| Hook deve afetar toda a aplicacao | Registre no server.ts antes de todos os `register()` |
| Hook tem logica reutilizavel | Extraia para arquivo separado e importe a referencia |
| Precisa de validacao por rota especifica | Use `preHandler` inline na rota, nao hook global |
| Precisa logar todas as requisicoes | Use `onRequest` no server.ts (dispara antes de tudo) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Registrar hook no plugin achando que vale para toda app | Registre no server.ts para escopo global |
| Copiar o mesmo hook em multiplos plugins | Extraia para arquivo e importe em cada plugin ou registre globalmente |
| Usar `preHandler` inline em todas as rotas uma a uma | Use `app.addHook('preHandler', fn)` no escopo desejado |
| Registrar hook global DEPOIS de `app.register()` | Registre ANTES para garantir que afeta os plugins |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-configurando-um-hook-global/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-configurando-um-hook-global/references/code-examples.md)
