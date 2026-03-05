# Code Examples: Teste E2E do Registro

## Setup completo do teste

### Instalacao das dependencias

```bash
npm install supertest -D
npm install @types/supertest -D
```

O Supertest nao e desenvolvido com TypeScript, entao os types precisam ser instalados separadamente.

### Arquivo de teste: `src/http/controllers/register.spec.ts`

```typescript
import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
  })
})
```

### Imports importantes

```typescript
// Supertest — para fazer requests HTTP
import request from 'supertest'

// App — instancia do Fastify (nao o servidor rodando)
import { app } from '@/app'

// Vitest — funcoes de teste (cuidado para importar do vitest, nao de outro pacote)
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
```

## Scripts no package.json

```json
{
  "scripts": {
    "test:e2e": "vitest run --dir src/http",
    "test:e2e:watch": "vitest --dir src/http"
  }
}
```

Diferenca entre os scripts:
- `test:e2e`: roda uma vez (`run`) — util para CI e para rodar com pre-scripts (lint, typecheck)
- `test:e2e:watch`: roda em modo watch (padrao do vitest) — util durante desenvolvimento

## Passando flags via npm

```bash
# Flag vai para o npm
npm run test:e2e -h

# Flag vai para o vitest (note os dois hifens)
npm run test:e2e -- -h
npm run test:e2e -- --reporter=verbose
```

## Variacao: testando erro de duplicacao

```typescript
it('should not be able to register with duplicate email', async () => {
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  }

  // Primeiro registro — sucesso
  await request(app.server).post('/users').send(userData)

  // Segundo registro com mesmo email — erro
  const response = await request(app.server).post('/users').send(userData)

  expect(response.statusCode).toEqual(409)
})
```

## Variacao: testando com validacao de body

```typescript
it('should not be able to register without required fields', async () => {
  const response = await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      // email e password ausentes
    })

  expect(response.statusCode).toEqual(400)
})
```

## Padrao para testes que precisam de autenticacao

```typescript
describe('Profile (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    // 1. Registrar usuario
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // 2. Fazer login para obter token
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    // 3. Acessar rota protegida com token
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
```