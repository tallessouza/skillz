---
name: rs-full-stack-boas-vindas-2036
description: "Applies automated testing strategy with Jest and SuperTest in Node.js projects. Use when user asks to 'write tests', 'add test coverage', 'create e2e tests', 'setup Jest', or 'test my API'. Guides test type selection (unit vs e2e), Jest assertions, and SuperTest HTTP simulation. Make sure to use this skill whenever setting up or writing tests in Node.js backends. Not for frontend component testing, browser testing, or Cypress/Playwright."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testing
  tags: [testing, jest, supertest, e2e, unit-tests, node-js]
---

# Testes Automatizados em Node.js

> Escolha o tipo de teste correto para cada camada da aplicacao, use Jest para unidade e SuperTest para end-to-end.

## Rules

1. **Defina criterios de aceitacao antes de escrever o teste** — cada teste tem uma expectativa clara que a funcionalidade deve atender, porque testes sem criterio definido sao frageis e quebram sem motivo
2. **Simule falhas intencionalmente** — alem de testar o caminho feliz, force o teste a falhar para validar que ele realmente detecta problemas
3. **Use SuperTest para testes end-to-end de API** — SuperTest simula o usuario enviando requisicoes HTTP reais para a API, testando o fluxo completo
4. **Use Jest para testes unitarios e de integracao** — Jest define expectativas (`expect`) e matchers para validar funcionalidades isoladas
5. **Separe testes por tipo** — unitarios testam funcoes isoladas, e2e testam fluxo completo do usuario ate a resposta da API

## Tipos de teste

| Tipo | Ferramenta | O que testa | Quando usar |
|------|-----------|-------------|-------------|
| Unitario | Jest | Funcao/modulo isolado | Logica de negocio pura |
| Integracao | Jest | Modulos interagindo | Services + repositories |
| End-to-end | SuperTest + Jest | Requisicao HTTP completa | Rotas da API simulando usuario real |

## How to write

### Teste unitario com Jest

```typescript
describe('calculateTotal', () => {
  it('should sum items correctly', () => {
    const total = calculateTotal([{ price: 10 }, { price: 20 }])
    expect(total).toBe(30)
  })

  it('should return 0 for empty array', () => {
    const total = calculateTotal([])
    expect(total).toBe(0)
  })
})
```

### Teste end-to-end com SuperTest

```typescript
import request from 'supertest'
import { app } from '../app'

describe('POST /users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })
})
```

## Example

**Before (sem testes, validacao manual):**
```typescript
// Desenvolve a rota e testa manualmente no Insomnia/Postman
app.post('/users', async (req, res) => {
  const user = await createUser(req.body)
  return res.status(201).json(user)
})
```

**After (com teste e2e automatizado):**
```typescript
// Rota implementada
app.post('/users', async (req, res) => {
  const user = await createUser(req.body)
  return res.status(201).json(user)
})

// Teste automatizado que substitui validacao manual
describe('POST /users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('John')
  })

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/users')
      .send({})

    expect(response.status).toBe(400)
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Logica pura sem dependencia externa | Teste unitario com Jest |
| Rota HTTP da API | Teste e2e com SuperTest |
| Precisa validar que o teste realmente funciona | Force uma falha intencional e veja o teste quebrar |
| Novo projeto Node.js | Configure Jest + SuperTest desde o inicio |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Testar apenas caminho feliz | Testar caminho feliz + falhas esperadas |
| Validar API apenas no Postman | Automatizar com SuperTest |
| Escrever teste sem criterio claro | Definir expectativa antes de implementar |
| Misturar teste unitario com chamada HTTP | Separar por tipo: Jest puro vs SuperTest |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Jest test not running** | Check that the test file ends with `.test.ts` or `.spec.ts` and that Jest is configured in `package.json` or `jest.config.ts`. |
| **SuperTest returns connection refused** | Ensure the app is exported without calling `listen()` — SuperTest manages its own server instance. |
| **Test passes but should fail** | Intentionally break the assertion value to verify the test actually validates the expected behavior. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tipos de teste, quando usar cada um, e a filosofia por tras de testes automatizados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e setup completo