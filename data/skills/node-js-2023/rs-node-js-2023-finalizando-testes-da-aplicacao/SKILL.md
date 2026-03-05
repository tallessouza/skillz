---
name: rs-nodejs-finalizando-testes-app
description: "Applies end-to-end testing patterns for Node.js REST APIs when writing tests for specific routes, summaries, or CRUD endpoints. Use when user asks to 'write tests', 'test this route', 'add e2e tests', 'test the API', or 'create integration tests'. Enforces test-adapts-to-code principle, cookie-based auth chaining, and proper response shape assertions. Make sure to use this skill whenever generating or reviewing API route tests. Not for unit tests, frontend tests, or mocking strategies."
---

# Finalizando Testes E2E de API REST

> Testes se adaptam ao codigo — nunca force o codigo a se adaptar aos testes.

## Rules

1. **Teste se adapta ao codigo** — se a rota nao retorna o ID na criacao, obtenha-o pela listagem, porque o teste deve refletir o comportamento real da API, nao o ideal
2. **Encadeie cookies entre requisicoes** — toda requisicao autenticada deve enviar os cookies obtidos na primeira, porque sessoes sao stateful e sem cookie o teste retorna 401
3. **Valide a forma exata da resposta** — use `expect.objectContaining` para objetos e verifique se e array ou objeto direto, porque testar a shape errada causa falsos positivos
4. **Crie cenarios realistas no resumo** — use multiplas transacoes (credito + debito) para validar calculos, porque testar com um unico valor nao prova que a logica funciona
5. **Corrija a rota antes de debugar logica** — se recebeu 404, verifique o path primeiro (`/transactions/summary` nao `/summary`), porque erros de rota sao a causa mais comum de falha em testes E2E
6. **Verifique a estrutura no cliente HTTP antes de assertar** — confira no Insomnia/Postman o shape real (`summary.amount` vs `transactions.amount`), porque assumir a estrutura causa `undefined`

## How to write

### Teste de recurso especifico (by ID)

```typescript
it('should be able to get a specific transaction', async () => {
  const createResponse = await app.request('/transactions', {
    method: 'POST',
    body: JSON.stringify({ title: 'New transaction', amount: 5000, type: 'credit' }),
  })

  const cookies = createResponse.headers.get('set-cookie')

  // Obter ID pela listagem — a rota de criacao nao retorna ID
  const listResponse = await app.request('/transactions', {
    headers: { cookie: cookies },
  })

  const transactionId = listResponse.body.transactions[0].id

  const getResponse = await app.request(`/transactions/${transactionId}`, {
    headers: { cookie: cookies },
  })

  expect(getResponse.body.transaction).toEqual(
    expect.objectContaining({ title: 'New transaction', amount: 5000 }),
  )
})
```

### Teste de resumo com multiplas transacoes

```typescript
it('should be able to get the summary', async () => {
  const createResponse = await app.request('/transactions', {
    method: 'POST',
    body: JSON.stringify({ title: 'Credit', amount: 5000, type: 'credit' }),
  })

  const cookies = createResponse.headers.get('set-cookie')

  await app.request('/transactions', {
    method: 'POST',
    headers: { cookie: cookies },
    body: JSON.stringify({ title: 'Debit', amount: 2000, type: 'debit' }),
  })

  const summaryResponse = await app.request('/transactions/summary', {
    headers: { cookie: cookies },
  })

  expect(summaryResponse.body.summary).toEqual({ amount: 3000 })
})
```

## Example

**Before (erro comum — path errado e shape assumida):**
```typescript
it('should get summary', async () => {
  // Criou apenas uma transacao
  await app.request('/transactions', {
    method: 'POST',
    body: JSON.stringify({ title: 'Test', amount: 5000, type: 'credit' }),
  })

  const res = await app.request('/summary') // 404 — path errado

  expect(res.body.amount).toBe(5000) // undefined — shape errada
})
```

**After (com esta skill aplicada):**
```typescript
it('should get the summary', async () => {
  const createRes = await app.request('/transactions', {
    method: 'POST',
    body: JSON.stringify({ title: 'Credit', amount: 5000, type: 'credit' }),
  })
  const cookies = createRes.headers.get('set-cookie')

  await app.request('/transactions', {
    method: 'POST',
    headers: { cookie: cookies },
    body: JSON.stringify({ title: 'Debit', amount: 2000, type: 'debit' }),
  })

  const summaryRes = await app.request('/transactions/summary', {
    headers: { cookie: cookies },
  })

  expect(summaryRes.body.summary).toEqual({ amount: 3000 })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota nao retorna ID do recurso criado | Obtenha pela listagem, nao mude a rota |
| Teste retorna 404 | Verifique o path completo primeiro |
| Teste retorna `undefined` | Confira a shape real no Insomnia/Postman |
| Precisa validar calculo agregado | Crie multiplas entradas com valores conhecidos |
| Multiplas requisicoes no mesmo teste | Encadeie cookies da primeira resposta |
| Resposta e objeto direto (nao array) | Use `expect.objectContaining` sem indexar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `expect(res.body.transactions[0])` para rota de detalhe | `expect(res.body.transaction)` — detalhe retorna objeto |
| `/summary` (path parcial) | `/transactions/summary` (path completo) |
| Teste de resumo com 1 transacao | Teste com credito + debito para validar calculo |
| Requisicao sem cookie apos autenticacao | Sempre passe `headers: { cookie: cookies }` |
| Alterar a API para facilitar o teste | Adaptar o teste ao comportamento real da API |
| `expect(res.body).toBe(3000)` | `expect(res.body.summary).toEqual({ amount: 3000 })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
