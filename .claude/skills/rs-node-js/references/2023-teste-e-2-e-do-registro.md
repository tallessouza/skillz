---
name: rs-node-js-2023-teste-e2e-registro
description: "Applies E2E testing patterns with Supertest and Vitest for Fastify API routes. Use when user asks to 'write e2e test', 'test an endpoint', 'test a controller', 'create integration test', or 'test API route'. Enforces app lifecycle management with beforeAll/afterAll, proper HTTP assertions, and Supertest request patterns. Make sure to use this skill whenever creating tests that hit HTTP endpoints in a Fastify/Node.js application. Not for unit tests, use-case tests, or repository tests."
---

# Teste E2E com Supertest e Vitest

> Testes end-to-end exercitam o fluxo completo da requisicao HTTP ate a persistencia, usando Supertest para disparar requests sem subir o servidor manualmente.

## Rules

1. **Use Supertest com o servidor nativo do Fastify** — `request(app.server)` acessa o HTTP server do Node, porque Supertest precisa do servidor raw, nao da instancia Fastify
2. **Sempre aguarde app.ready() no beforeAll** — o Fastify precisa registrar plugins (JWT, rotas) antes de receber requests, porque sem isso os testes falham intermitentemente
3. **Sempre feche o app no afterAll** — `app.close()` encerra conexoes e evita vazamento de recursos entre suites de teste
4. **Agrupe testes por controller com describe** — `describe('Register (E2E)')` facilita identificacao no output do test runner
5. **Asserte pelo statusCode especifico** — `expect(response.statusCode).toEqual(201)` nao `toBeTruthy()`, porque o codigo HTTP e o contrato da API
6. **Separe scripts de teste e2e do unitario** — `test:e2e` e `test:e2e:watch` como scripts distintos no package.json, porque evita rodar linting desnecessario no modo watch

## How to write

### Estrutura basica de teste E2E

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

### Scripts no package.json

```json
{
  "scripts": {
    "test:e2e": "vitest run --dir src/http",
    "test:e2e:watch": "vitest --dir src/http"
  }
}
```

## Example

**Before (teste fragil sem lifecycle):**
```typescript
import { test } from 'vitest'

test('register', async () => {
  // app pode nao estar pronto
  const res = await request(app.server).post('/users').send({ name: 'a' })
  expect(res.ok).toBeTruthy() // nao verifica codigo especifico
  // servidor nunca e fechado — leak de recursos
})
```

**After (com esta skill aplicada):**
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Testando rota POST que cria recurso | Assert `statusCode` 201 |
| Testando rota GET que retorna dados | Assert `statusCode` 200 + body |
| Testando rota que requer auth | Faca login antes, use token no header |
| Modo watch rodando linting | Crie script `test:e2e:watch` separado sem pre-scripts |
| Passando flags para CLI interna via npm | Use `--` (dois hifens) para repassar flags ao vitest |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `expect(res.ok).toBeTruthy()` | `expect(res.statusCode).toEqual(201)` |
| `test('register', ...)` solto | `describe('Register (E2E)', () => { it(...) })` |
| Teste sem `beforeAll(app.ready)` | Sempre aguardar `app.ready()` no `beforeAll` |
| Teste sem `afterAll(app.close)` | Sempre fechar com `app.close()` no `afterAll` |
| `request(app)` direto na instancia Fastify | `request(app.server)` para acessar o HTTP server nativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-do-registro/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-teste-e-2-e-do-registro/references/code-examples.md)
