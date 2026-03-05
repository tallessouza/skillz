---
name: rs-node-js-2023-teste-e2e-autenticacao
description: "Enforces E2E testing patterns for authentication routes in Node.js APIs using Supertest and Vitest. Use when user asks to 'write e2e test', 'test authentication endpoint', 'test login route', 'create integration test for auth', or 'test sessions controller'. Applies rules: test happy path only, create prerequisites via API not ORM, validate token shape not value, keep e2e tests minimal. Make sure to use this skill whenever generating e2e tests for auth flows. Not for unit tests, repository tests, or use-case tests."
---

# Teste E2E da Autenticação

> Testes end-to-end validam o fluxo completo de cabo a rabo pelo caminho de sucesso — poucos testes, mas que garantem que a rota funciona de ponta a ponta.

## Rules

1. **Crie pre-requisitos via API, nao via ORM** — para autenticar, primeiro chame `POST /users` via Supertest, porque o teste e2e simula exatamente como o usuario real usaria a aplicacao
2. **Teste apenas o caminho de sucesso** — nao crie teste e2e para "senha errada retorna erro", porque isso ja foi validado nos testes unitarios que sao muito mais rapidos
3. **Valide a forma do retorno, nao o valor exato** — verifique que `token` e `expect.any(String)`, nao um JWT especifico, porque o valor muda a cada execucao
4. **Poucos testes e2e, bem focados** — cada teste e2e e pesado (sobe servidor, banco), entao crie apenas o necessario para garantir que o fluxo funciona
5. **Use status codes semanticos** — `201` para criacao, `200` para login, porque o status code e parte do contrato da API
6. **Isole cada teste com banco limpo** — cada suite e2e roda contra um banco isolado para evitar interferencia entre testes

## How to write

### Teste de autenticacao completo

```typescript
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    // Pre-requisito: criar usuario via API (nao via Prisma direto)
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
```

## Example

**Before (anti-pattern — usando Prisma direto no e2e):**
```typescript
it('should authenticate', async () => {
  // ERRADO: acessando ORM diretamente no teste e2e
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    },
  })

  const response = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  expect(response.statusCode).toEqual(200)
})
```

**After (correto — pre-requisito via API):**
```typescript
it('should be able to authenticate', async () => {
  // CORRETO: cria usuario pela rota, simulando o fluxo real
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const response = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  expect(response.statusCode).toEqual(200)
  expect(response.body).toEqual({
    token: expect.any(String),
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de usuario logado para testar outra rota | Crie usuario + autentique via API, use o token retornado |
| Quer testar senha invalida | Faca no teste unitario do use case, nao no e2e |
| Quer testar email duplicado | Faca no teste unitario, e2e testa so o sucesso |
| Rota retorna JWT | Valide com `expect.any(String)`, nao decodifique o token |
| Precisa de dados no banco para o teste | Crie via rotas da API, nao via ORM/Prisma direto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `await prisma.user.create(...)` no teste e2e | `await request(app.server).post('/users').send(...)` |
| `expect(response.body.token).toBe('eyJhbG...')` | `expect(response.body).toEqual({ token: expect.any(String) })` |
| Teste e2e para cada regra de negocio | Teste e2e apenas para o caminho de sucesso |
| `it('should not authenticate with wrong password')` no e2e | Esse cenario vai no teste unitario do use case |
| Dezenas de testes e2e por controller | 1-3 testes e2e por controller, cobrindo fluxos principais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-da-autenticacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-da-autenticacao/references/code-examples.md)
