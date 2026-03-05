---
name: rs-node-js-2023-testando-listagem-transacoes
description: "Enforces E2E test patterns for API listing endpoints using Supertest cookie forwarding and partial matching. Use when user asks to 'write e2e tests', 'test a listing route', 'pass cookies between requests in tests', 'validate response body in vitest', or 'test authenticated endpoints'. Applies rules: test isolation (no shared state), cookie extraction via getSetCookie, objectContaining for partial matching. Make sure to use this skill whenever writing integration or e2e tests for REST APIs with session-based auth. Not for unit tests, frontend component tests, or mock-based testing."
---

# Testando Listagem de Transacoes (E2E)

> Cada teste e2e deve ser autossuficiente — nunca depender de estado criado por outro teste.

## Rules

1. **Nunca compartilhe estado entre testes** — se o teste de listagem precisa de uma transacao, crie-a dentro do proprio teste, porque testes que dependem de outros testes sao frageis e quebram quando executados isoladamente
2. **Extraia cookies com `getSetCookie()`** — use `response.getSetCookie()` para capturar cookies da resposta e reenvie com `.set('Cookie', cookies)`, porque e assim que o Supertest propaga sessoes entre requisicoes
3. **Use `objectContaining` para validacao parcial** — nao tente validar campos gerados como `id` e `created_at` com valores exatos; use `expect.objectContaining({ title, amount })` para validar apenas os campos conhecidos
4. **Nao valide a criacao dentro do teste de listagem** — omita o `.expect(201)` na requisicao de setup, porque voce nao esta testando a criacao nesse teste
5. **Valide a estrutura completa da resposta** — se a API retorna `{ transactions: [...] }`, acesse `body.transactions`, nao `body` diretamente, porque a estrutura real pode diferir do que voce imagina
6. **Use `it.skip`, `it.todo`, `it.only` para controle de execucao** — `skip` pula, `todo` marca como pendente, `only` executa apenas aquele teste durante desenvolvimento

## How to write

### Setup: criar recurso e extrair cookie

```typescript
const createTransactionResponse = await request(app.server)
  .post('/transactions')
  .send({ title: 'New transaction', amount: 5000, type: 'credit' })

const cookies = createTransactionResponse.getSetCookie()
```

### Requisicao autenticada com cookie

```typescript
const listTransactionsResponse = await request(app.server)
  .get('/transactions')
  .set('Cookie', cookies)
  .expect(200)
```

### Validacao parcial com objectContaining

```typescript
expect(listTransactionsResponse.body.transactions).toEqual([
  expect.objectContaining({
    title: 'New transaction',
    amount: 5000,
  }),
])
```

## Example

**Before (teste dependente de outro teste — errado):**
```typescript
let cookies: string[]

it('should create a transaction', async () => {
  const response = await request(app.server)
    .post('/transactions')
    .send({ title: 'Test', amount: 100, type: 'credit' })
    .expect(201)
  cookies = response.getSetCookie() // estado compartilhado!
})

it('should list transactions', async () => {
  const response = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies) // depende do teste anterior!
    .expect(200)
})
```

**After (teste autossuficiente — correto):**
```typescript
it('should be able to list all transactions', async () => {
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({ title: 'New transaction', amount: 5000, type: 'credit' })

  const cookies = createTransactionResponse.getSetCookie()

  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies)
    .expect(200)

  expect(listTransactionsResponse.body.transactions).toEqual([
    expect.objectContaining({
      title: 'New transaction',
      amount: 5000,
    }),
  ])
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste precisa de dado pre-existente | Crie o dado dentro do proprio teste |
| Campo com valor aleatorio (id, uuid) | Use `expect.any(String)` ou `objectContaining` sem o campo |
| Resposta vem envelopada em objeto | Acesse a propriedade correta (`body.transactions`, nao `body`) |
| Trabalhando em um unico teste | Use `it.only` temporariamente |
| Teste ainda nao implementado | Use `it.todo('descricao')` |
| API usa cookies para autenticacao | Extraia com `getSetCookie()`, reenvie com `.set('Cookie', cookies)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `let cookies` compartilhado entre testes | `const cookies` dentro de cada teste |
| `expect(body).toEqual([{ id: '...', ... }])` com id hardcoded | `expect(body).toEqual([expect.objectContaining({ title, amount })])` |
| `expect(body).toEqual([...])` sem verificar envelope | `expect(body.transactions).toEqual([...])` |
| `.expect(201)` no setup de um teste de listagem | Omitir o expect do setup — voce nao esta testando a criacao |
| `response.headers['set-cookie']` | `response.getSetCookie()` — metodo dedicado do Supertest |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-testando-listagem-de-transacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-testando-listagem-de-transacoes/references/code-examples.md)
