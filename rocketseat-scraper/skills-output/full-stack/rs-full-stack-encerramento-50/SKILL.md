---
name: rs-full-stack-encerramento-50
description: "Enforces repeatable controller testing patterns when building delivery API projects with Node.js. Use when user asks to 'test a controller', 'add tests to API', 'implement controller tests', 'test user sessions', or 'test delivery endpoints'. Applies the principle that controller tests follow a consistent structure across all endpoints — once you test UserController and SessionsController, the same pattern applies to DeliveryController, PackageController, etc. Make sure to use this skill whenever expanding test coverage across multiple controllers in an Express/Fastify API. Not for frontend component testing, E2E browser tests, or non-controller unit tests."
---

# Padrão Repetível de Testes em Controllers

> Uma vez que o padrão de teste de controller está definido (ex: UserController, SessionsController), aplique a mesma estrutura para todos os outros controllers da API.

## Conceito-chave

Testes de controllers em APIs REST seguem uma estrutura repetível. Ao testar UserController e SessionsController, o padrão estabelecido (setup, request, assertion) se replica para qualquer outro controller (DeliveryController, PackageController, etc.) com mínimas variações.

## Decision framework

| Situação | Ação |
|----------|------|
| Primeiro controller a testar | Defina o padrão completo: factory, setup, request, assertion |
| Controllers subsequentes | Replique o padrão, ajustando apenas rotas, payloads e validações |
| Controller com autenticação | Use o mesmo padrão de SessionsController para gerar token antes |
| Controller CRUD completo | Teste cada operação (create, read, update, delete) seguindo a mesma estrutura |

## Como aplicar

### Estrutura padrão de teste de controller

```typescript
// 1. Setup: criar dados necessários (user, session, etc.)
// 2. Request: chamar o endpoint
// 3. Assert: verificar status code, body, side effects

describe('DeliveryController', () => {
  it('should create a delivery', async () => {
    // Setup — mesmo padrão do UserController
    const user = await createUser()
    const token = await authenticateUser(user)

    // Request — muda apenas rota e payload
    const response = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientName: 'João', address: 'Rua A' })

    // Assert — mesmo padrão de verificação
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Testes ficando repetitivos | Extraia factories e helpers reutilizáveis |
| Muitos controllers sem teste | Priorize os com lógica de negócio mais complexa |
| Controller com autenticação | Crie helper `authenticateUser()` reutilizável |
| Mesmo padrão em 3+ controllers | Considere um template de teste parametrizável |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Pular testes por serem "repetitivos" | Implemente — repetição garante cobertura |
| Copiar e colar testes sem adaptar assertions | Ajuste validações para cada domínio |
| Testar apenas o happy path | Teste erros de validação, autenticação e not found |
| Criar setup complexo em cada teste | Extraia factories compartilhadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que testes de controllers são repetíveis e como escalar cobertura
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de testes para múltiplos controllers seguindo o mesmo padrão