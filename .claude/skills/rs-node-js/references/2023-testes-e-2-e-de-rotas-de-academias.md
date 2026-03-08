---
name: rs-node-js-2023-testes-e2e-rotas-academias
description: "Applies E2E testing patterns for authenticated API routes using Vitest and Supertest in Node.js. Use when user asks to 'write e2e tests', 'test API routes', 'create test utilities', 'test authenticated endpoints', or 'refactor test helpers'. Enforces reusable auth helpers, query parameter coercion with Zod, and proper test isolation. Make sure to use this skill whenever writing integration or e2e tests for Fastify/Express routes. Not for unit tests, use case tests, or frontend testing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: testes-e2e-rotas
  tags: [e2e, testing, supertest, vitest, fastify, zod, authentication, query-params]
---

# Testes E2E de Rotas com Autenticacao

> Extraia funcoes utilitarias de autenticacao para reutilizar em todos os testes E2E de rotas protegidas, e trate query parameters como strings antes de validar.

## Rules

1. **Crie helpers de autenticacao reutilizaveis** — extraia a logica de criar usuario + login + token para `utils/test/create-and-authenticate-user.ts`, porque toda rota autenticada precisa desse setup e duplicar e fragil
2. **Retorne objetos expansiveis do helper** — retorne `{ token }` em vez de `token` direto, porque no futuro voce pode precisar retornar tambem dados do usuario criado
3. **Converta query parameters com coerce do Zod** — todo query parameter chega como string, use `z.coerce.number()` para latitude/longitude, porque a validacao vai falhar com erro 400 se esperar number
4. **Valide status code E conteudo do body** — nao basta verificar 200/201, verifique que o array retornado contem os objetos esperados com `expect.objectContaining`
5. **Crie dados de teste que exercitem a logica** — para busca, crie itens que matcham e itens que nao matcham; para nearby, crie academias proximas e distantes
6. **Use Vitest watch mode** — no modo watch, apenas testes alterados re-executam; pressione `a` para rodar todos

## How to write

### Helper de autenticacao

```typescript
// src/utils/test/create-and-authenticate-user.ts
import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
```

### Teste de criacao (POST)

```typescript
it('should be able to create a gym', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const response = await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'JavaScript Gym',
      description: 'Some description',
      phone: '11999999999',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

  expect(response.statusCode).toEqual(201)
})
```

### Teste de busca (GET com query)

```typescript
it('should be able to search gyms by title', async () => {
  const { token } = await createAndAuthenticateUser(app)

  // Cria dados que matcham e nao matcham
  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'JavaScript Gym', latitude: -27.2092052, longitude: -49.6401091 })

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'TypeScript Gym', latitude: -27.2092052, longitude: -49.6401091 })

  const response = await request(app.server)
    .get('/gyms/search')
    .query({ q: 'JavaScript' })
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(200)
  expect(response.body.gyms).toHaveLength(1)
  expect(response.body.gyms).toEqual([
    expect.objectContaining({ title: 'JavaScript Gym' }),
  ])
})
```

### Coercao de query parameters com Zod

```typescript
// No schema de validacao da rota nearby
const nearbyGymsQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
})
```

## Example

**Before (helper duplicado em cada teste):**
```typescript
// profile.spec.ts
it('should get profile', async () => {
  await request(app.server).post('/users').send({ name: 'John', email: 'john@example.com', password: '123456' })
  const auth = await request(app.server).post('/sessions').send({ email: 'john@example.com', password: '123456' })
  const { token } = auth.body
  // ... teste
})

// create-gym.spec.ts
it('should create gym', async () => {
  await request(app.server).post('/users').send({ name: 'John', email: 'john@example.com', password: '123456' })
  const auth = await request(app.server).post('/sessions').send({ email: 'john@example.com', password: '123456' })
  const { token } = auth.body
  // ... teste
})
```

**After (helper reutilizavel):**
```typescript
// create-gym.spec.ts
it('should create gym', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const response = await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'JavaScript Gym', latitude: -27.2092052, longitude: -49.6401091 })

  expect(response.statusCode).toEqual(201)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota exige autenticacao | Use `createAndAuthenticateUser(app)` |
| Rota recebe query params numericos | Use `z.coerce.number()` no schema |
| Teste de busca/filtro | Crie items que matcham E que nao matcham |
| Teste de nearby/distancia | Use coordenadas reais proximas e distantes |
| Rota sem retorno no body | Valide apenas o status code (201) |
| Rota com retorno | Valide status + body com `objectContaining` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duplicar setup de auth em cada teste | `createAndAuthenticateUser(app)` |
| Retornar `token` direto do helper | Retornar `{ token }` (objeto expansivel) |
| `z.number()` para query params | `z.coerce.number()` |
| Testar busca com apenas 1 item | Criar items que matcham e nao matcham |
| Ignorar registro de rotas no app | Verificar que todas as rotas estao registradas |

## Troubleshooting

### Query parameter numerico retorna erro 400 de validacao
**Symptom:** Rota com latitude/longitude retorna `ZodError` com mensagem "Expected number, received string"
**Cause:** Query parameters sempre chegam como string via HTTP, mas o schema Zod espera `z.number()`
**Fix:** Use `z.coerce.number()` em vez de `z.number()` no schema de validacao dos query parameters

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
