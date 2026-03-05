---
name: rs-node-js-2023-testando-criacao-transacao
description: "Applies E2E testing patterns with Supertest and Vitest for Fastify/Express APIs. Use when user asks to 'write e2e tests', 'test an API route', 'setup supertest', 'test HTTP endpoints', or 'create integration tests' in Node.js. Enforces app/server separation, beforeAll/afterAll lifecycle, and proper Supertest usage. Make sure to use this skill whenever creating or reviewing API test files. Not for unit tests, frontend tests, or non-HTTP testing scenarios."
---

# Testes E2E com Supertest

> Separar a criacao da aplicacao (app) do servidor (server) para testar rotas HTTP sem subir um servidor real.

## Rules

1. **Separe app.ts de server.ts** — app.ts cria e configura a aplicacao, server.ts faz o listen, porque testes importam apenas o app sem conflito de portas
2. **Use SuperTest em vez de servidor real** — SuperTest faz requisicoes sem listen, porque evita conflito de portas e elimina latencia de boot/shutdown
3. **Aguarde app.ready() no beforeAll** — plugins Fastify sao assincronos, porque sem ready() as rotas ainda nao existem e retornam 404
4. **Feche a aplicacao no afterAll** — `app.close()` remove a aplicacao da memoria, porque evita memory leaks entre suites de teste
5. **Passe app.server ao SuperTest** — todo framework tem um HTTP server interno do Node, porque SuperTest opera no nivel do http.createServer
6. **Instale @types separado para libs JS** — pacotes sem TypeScript nativo (icone DT no npm) precisam de `@types/pacote` como devDependency

## How to write

### Estrutura app/server

```typescript
// src/app.ts — cria a aplicacao, NAO faz listen
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()
app.register(transactionsRoutes)

// src/server.ts — apenas o listen
import { app } from './app'
app.listen({ port: 3333 })
```

### Teste E2E com SuperTest

```typescript
import { it, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })
})
```

## Example

**Before (teste importa server — conflito de porta):**
```typescript
import { app } from '../src/server' // executa listen na porta 3333
import request from 'supertest'

it('creates transaction', async () => {
  // ERRO: porta 3333 ja em uso se app estiver rodando
  await request(app.server).post('/transactions').expect(201)
  // ERRO: 404 — plugins ainda nao carregados
})
```

**After (separacao correta):**
```typescript
import { app } from '../src/app' // sem listen
import request from 'supertest'

beforeAll(async () => { await app.ready() })
afterAll(async () => { await app.close() })

it('user can create a new transaction', async () => {
  await request(app.server)
    .post('/transactions')
    .send({ title: 'New transaction', amount: 5000, type: 'credit' })
    .expect(201)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste retorna 404 inesperado | Verifique se `await app.ready()` esta no beforeAll |
| Conflito de porta nos testes | Verifique se esta importando `app.ts` e nao `server.ts` |
| TypeScript reclama de import | Cheque icone no npm: DT = instale `@types/pacote` |
| Precisa rodar algo antes de CADA teste | Use `beforeEach` em vez de `beforeAll` |
| Precisa limpar banco entre testes | Use `beforeEach` para reset do banco |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `import { app } from '../src/server'` em testes | `import { app } from '../src/app'` |
| Teste sem `beforeAll(() => app.ready())` | Sempre aguarde ready antes dos testes |
| Teste sem `afterAll(() => app.close())` | Sempre feche a app depois dos testes |
| `request('http://localhost:3333')` | `request(app.server)` |
| Validacao manual `expect(res.statusCode).toBe(201)` | `.expect(201)` encadeado no SuperTest |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
