# Code Examples: Teste E2E da Autenticação

## Exemplo completo da aula

O arquivo de teste criado na aula:

```typescript
// src/http/controllers/authenticate.spec.ts
import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
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

## Comparacao com o teste de register (da aula anterior)

```typescript
// src/http/controllers/register.spec.ts
describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
```

Note a diferenca: o register nao precisa de pre-requisito, ja o authenticate precisa criar o usuario primeiro.

## Padrao para testes e2e que dependem de autenticacao

Quando outras rotas precisam de um usuario autenticado, o padrao se expande:

```typescript
it('should be able to access protected route', async () => {
  // 1. Criar usuario
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  // 2. Autenticar
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  // 3. Usar o token na rota protegida
  const response = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(200)
  expect(response.body.user).toEqual(
    expect.objectContaining({
      email: 'johndoe@example.com',
    }),
  )
})
```

## Helper reutilizavel (evolucao natural do padrao)

Quando varios testes precisam de usuario autenticado, extraia um helper:

```typescript
// test/utils/create-and-authenticate-user.ts
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

Uso:

```typescript
it('should access protected route', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const response = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(200)
})
```