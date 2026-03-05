---
name: rs-node-js-2023-cookies-no-fastify
description: "Applies Fastify cookie patterns for session tracking and user identification in Node.js APIs. Use when user asks to 'add cookies', 'track sessions', 'identify users without auth', 'use @fastify/cookie', or 'persist context between requests'. Covers session ID strategy, cookie configuration (path, maxAge), and pre-authentication user tracking. Make sure to use this skill whenever implementing cookies or session management in Fastify. Not for JWT authentication, OAuth flows, or frontend cookie handling."
---

# Utilizando Cookies no Fastify

> Cookies mantêm contexto entre requisições — use-os para identificar usuários antes mesmo de terem autenticação.

## Rules

1. **Registre o plugin antes das rotas** — `app.register(cookie)` deve vir antes de `app.register(transactionsRoutes)`, porque plugins registrados depois não estarão disponíveis nas rotas anteriores
2. **Use `let` para sessionId condicional** — verifique primeiro se já existe nos cookies antes de criar um novo, porque criar sessão nova a cada request quebra o tracking
3. **maxAge em segundos no Fastify** — apesar da tipagem sugerir milissegundos, a documentação do `@fastify/cookie` define maxAge em segundos
4. **path: '/' por padrão** — use path raiz para que todas as rotas acessem o cookie, porque restringir a `/transactions` impede futuras rotas de ler a sessão
5. **Cookies são enviados automaticamente** — não coloque sessionId no body, headers ou query params manualmente, porque cookies são metadados invisíveis gerenciados pelo protocolo HTTP
6. **Expresse duração com multiplicação legível** — `60 * 60 * 24 * 7 // 7 days` é melhor que `604800`, porque ninguém consegue editar um número mágico

## How to write

### Setup do plugin

```typescript
import cookie from '@fastify/cookie'

// ANTES das rotas
app.register(cookie)
```

### Criar ou reutilizar sessionId

```typescript
app.post('/', async (request, reply) => {
  let sessionId = request.cookies.sessionId

  if (!sessionId) {
    sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days (em segundos)
    })
  }

  await knex('transactions').insert({
    id: randomUUID(),
    title,
    amount,
    session_id: sessionId,
  })
})
```

### Ler sessionId nas rotas de listagem

```typescript
app.get('/', async (request) => {
  const sessionId = request.cookies.sessionId

  const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()

  return { transactions }
})
```

## Example

**Before (sem cookies, transações misturadas):**
```typescript
app.post('/', async (request, reply) => {
  await knex('transactions').insert({
    id: randomUUID(),
    title,
    amount,
    // sem session_id — impossível saber quem criou
  })
})
```

**After (com cookies, transações isoladas por usuário):**
```typescript
app.post('/', async (request, reply) => {
  let sessionId = request.cookies.sessionId

  if (!sessionId) {
    sessionId = randomUUID()
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  await knex('transactions').insert({
    id: randomUUID(),
    title,
    amount,
    session_id: sessionId,
  })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| API sem autenticação mas precisa isolar dados | Use sessionId via cookie |
| Precisa que cookie funcione em todas as rotas | `path: '/'` |
| Quer expiração legível | Multiplique: `60 * 60 * 24 * N` com comentário |
| Usuário já tem cookie | Reutilize o sessionId existente, não crie novo |
| Futuramente terá login | Associe o sessionId ao userId quando autenticar |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `maxAge: 1000 * 60 * 60 * 24 * 7` | `maxAge: 60 * 60 * 24 * 7` (Fastify usa segundos) |
| `maxAge: 604800` | `maxAge: 60 * 60 * 24 * 7 // 7 days` |
| `sessionId = randomUUID()` sem checar cookies | `let sessionId = request.cookies.sessionId` primeiro |
| `app.register(routes)` antes de `app.register(cookie)` | Plugin de cookie registrado primeiro |
| Enviar sessionId no body da request | Confiar no envio automático via cookies |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
