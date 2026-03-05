---
name: rs-full-stack-encerramento-47
description: "Applies automated testing strategy using Jest and SuperTest for Node.js APIs. Use when user asks to 'add tests', 'write unit tests', 'test my API', 'setup Jest', or 'create e2e tests'. Guides test separation between unit and end-to-end, enforces correct tool selection per test type. Make sure to use this skill whenever setting up a testing strategy for Node.js backend projects. Not for frontend component testing, browser testing, or non-JavaScript projects."
---

# Estrategia de Testes Automatizados com Jest e SuperTest

> Separe testes unitarios (funcionalidades isoladas) de testes end-to-end (requisicoes reais a API), usando Jest como runner e SuperTest para simular requisicoes HTTP.

## Rules

1. **Use Jest como test runner padrao** — `jest` para unitarios e e2e, porque unifica configuracao e reporters em um unico ecossistema
2. **Use SuperTest para testes e2e de API** — simula requisicoes HTTP reais sem subir servidor, porque testa o fluxo completo como um usuario faria
3. **Separe testes unitarios de e2e em pastas distintas** — `tests/unit/` e `tests/e2e/`, porque cada tipo tem setup, velocidade e proposito diferentes
4. **Testes unitarios focam em funcionalidades isoladas** — uma funcao, um service, um util, porque feedback rapido e especifico sobre onde quebrou
5. **Testes e2e simulam o usuario real** — fazem requisicao HTTP completa pela rota, porque validam integracao entre camadas (rota → controller → service → banco)

## Decision framework

| Situacao | Tipo de teste | Ferramenta |
|----------|--------------|------------|
| Testar uma funcao pura ou service | Unitario | Jest |
| Testar uma rota/endpoint completo | End-to-end | Jest + SuperTest |
| Testar integracao com banco | E2E ou integracao | Jest + SuperTest |
| Validar regra de negocio isolada | Unitario | Jest |

## How to write

### Setup basico Jest + SuperTest

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.ts',
    '<rootDir>/tests/e2e/**/*.spec.ts',
  ],
}
```

### Teste unitario (funcionalidade isolada)

```typescript
// tests/unit/calculate-price.spec.ts
import { calculatePrice } from '../../src/utils/calculate-price'

describe('calculatePrice', () => {
  it('applies discount correctly', () => {
    const priceInCents = calculatePrice({ baseInCents: 10000, discountPercent: 10 })
    expect(priceInCents).toBe(9000)
  })
})
```

### Teste e2e com SuperTest (requisicao real)

```typescript
// tests/e2e/create-user.spec.ts
import request from 'supertest'
import { app } from '../../src/app'

describe('POST /users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(response.body.user).toHaveProperty('id')
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo sem testes | Configure Jest + SuperTest, crie pastas `tests/unit/` e `tests/e2e/` |
| Funcao pura sem side effects | Teste unitario direto, sem mock de infra |
| Endpoint de API | Teste e2e com SuperTest simulando request completo |
| Precisa de feedback rapido | Rode unitarios primeiro (`jest --testPathPattern=unit`) |
| CI pipeline | Rode ambos, unitarios antes de e2e |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Misturar unitarios e e2e na mesma pasta | Separar em `tests/unit/` e `tests/e2e/` |
| Testar rota inteira como "unitario" | Se faz HTTP request, e e2e |
| Subir servidor manualmente para testar | Use SuperTest que gerencia o servidor |
| Pular testes unitarios e so fazer e2e | Unitarios dao feedback rapido e especifico |
| Testar implementacao interna | Teste comportamento e resultado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de testes e estrategia de testing
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de Jest e SuperTest com variacoes