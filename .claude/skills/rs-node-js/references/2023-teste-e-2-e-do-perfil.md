---
name: rs-node-js-2023-teste-e2e-perfil
description: "Applies E2E testing patterns for authenticated routes in Node.js APIs using Supertest. Use when user asks to 'write e2e test', 'test authenticated route', 'test profile endpoint', 'test protected route', or 'add integration test with auth'. Enforces the cascade pattern: create user, authenticate, then test with token. Make sure to use this skill whenever writing E2E tests for routes that require authentication. Not for unit tests, in-memory repository tests, or frontend testing."
---

# Teste E2E de Rotas Autenticadas

> Testes E2E de rotas protegidas seguem o padrao cascata: criar usuario, autenticar, executar acao com token.

## Rules

1. **Siga o padrao cascata para rotas autenticadas** — crie usuario → autentique → use token → teste a rota, porque rotas protegidas exigem autenticacao previa e cada passo depende do anterior
2. **Envie o token via header Authorization** — use `.set('Authorization', `Bearer ${token}`)` no Supertest, porque e o padrao HTTP para JWT
3. **Valide campos especificos, nao o objeto inteiro** — use `expect.objectContaining({ email })` ao inves de comparar todo o body, porque campos como `id` e `created_at` sao dinamicos
4. **Separe o response de cada etapa em variaveis nomeadas** — `authResponse`, `profileResponse`, porque facilita debug e torna o teste legivel
5. **Extraia a cascata em funcao utilitaria quando repetir** — se multiplos testes precisam de usuario autenticado, crie um helper `createAndAuthenticateUser(app)`, porque evita duplicacao em todo arquivo de teste

## How to write

### Teste E2E de rota autenticada (padrao cascata)

```typescript
import request from 'supertest'
import { app } from '@/app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    // Step 1: Criar usuario
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Step 2: Autenticar
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    // Step 3: Acessar rota protegida com token
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Step 4: Validar resposta
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
```

### Helper para reutilizar a cascata (otimizacao)

```typescript
// utils/test/create-and-authenticate-user.ts
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

## Example

**Before (duplicacao em cada teste):**
```typescript
// profile.spec.ts — cascata completa
// check-ins.spec.ts — mesma cascata copiada
// gyms.spec.ts — mesma cascata copiada novamente
```

**After (helper extraido):**
```typescript
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

it('should get profile', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const response = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(200)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeira rota autenticada sendo testada | Escreva cascata inline no teste |
| Segunda rota autenticada sendo testada | Extraia helper `createAndAuthenticateUser` |
| Rota com roles diferentes (admin/user) | Helper aceita parametro de role |
| Teste valida campos dinamicos (id, date) | Use `expect.objectContaining` com campos estaveis |
| Rota publica (sem auth) | Nao precisa da cascata, teste direto |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Token hardcoded no teste | Gere token via fluxo real (register + login) |
| `expect(body).toEqual(objetoCompleto)` | `expect(body.user).toEqual(expect.objectContaining({...}))` |
| Copiar cascata em 3+ arquivos | Extrair `createAndAuthenticateUser` helper |
| Testar auth e profile no mesmo `it` | Um `it` por comportamento testado |
| Esquecer `beforeAll(app.ready)` e `afterAll(app.close)` | Sempre incluir setup/teardown do app |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-do-perfil/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-do-perfil/references/code-examples.md)
