---
name: rs-full-stack-validando-teste-e-2-e
description: "Enforces E2E test assertion best practices when writing expect validations for HTTP responses in Node.js tests. Use when user asks to 'validate a response', 'write test assertions', 'check status code', 'verify API response', or 'add expects to test'. Applies patterns: status code validation with toBe, array length with toHaveLength, content existence with toBeGreaterThan, and stacking multiple expects per test. Make sure to use this skill whenever writing E2E test validations for API endpoints. Not for unit tests of pure functions, frontend component tests, or test setup/configuration."
---

# Validando Teste E2E

> Cada teste E2E valida o contrato da resposta HTTP com expects empilhados: status code, estrutura e conteudo.

## Rules

1. **Valide sempre o status code primeiro** — `expect(response.status).toBe(200)`, porque o status code confirma que a requisicao foi processada antes de verificar o body
2. **Use toHaveLength para tamanho exato** — `expect(response.body).toHaveLength(3)`, porque especifica exatamente quantos itens sao esperados e a mensagem de erro mostra o array completo
3. **Use toBeGreaterThan(0) para existencia** — `expect(response.body.length).toBeGreaterThan(0)`, porque verifica que ha conteudo retornado sem depender de quantidade exata
4. **Empilhe multiplos expects no mesmo teste** — acumule validacoes de status, tamanho e conteudo em um unico test block, porque cada expect valida uma dimensao diferente do contrato
5. **Especifique expectativas precisas** — quando o numero de itens e conhecido, use o valor exato em vez de verificacoes genericas, porque falhas mostram exatamente o que divergiu

## How to write

### Validacao de status code

```javascript
const response = await request(app).get('/products')
expect(response.status).toBe(200)
```

### Validacao de tamanho exato do array

```javascript
expect(response.body).toHaveLength(3)
```

### Validacao de existencia de conteudo

```javascript
expect(response.body.length).toBeGreaterThan(0)
```

### Expects empilhados (padrao completo)

```javascript
it('should list all products', async () => {
  const response = await request(app).get('/products')

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(3)
  expect(response.body.length).toBeGreaterThan(0)
})
```

## Example

**Before (sem validacao adequada):**

```javascript
it('should list products', async () => {
  const response = await request(app).get('/products')
  console.log(response.body)
})
```

**After (com expects empilhados):**

```javascript
it('should list products', async () => {
  const response = await request(app).get('/products')

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(3)
  expect(response.body.length).toBeGreaterThan(0)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint retorna lista com quantidade conhecida | Use `toHaveLength(n)` com valor exato |
| Endpoint retorna lista com quantidade variavel | Use `toBeGreaterThan(0)` para garantir conteudo |
| Qualquer requisicao HTTP | Sempre valide `response.status` primeiro |
| Teste com multiplas verificacoes | Empilhe expects — nao crie testes separados para cada aspecto |
| Teste falhou no length | Leia a mensagem de erro — ela mostra o array recebido vs esperado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `console.log(response.body)` sem expect | `expect(response.status).toBe(200)` |
| Teste sem validacao de status code | Sempre inclua `expect(response.status).toBe(200)` |
| `expect(response.body.length).toBe(3)` | `expect(response.body).toHaveLength(3)` (mensagem de erro melhor) |
| Teste com apenas um expect generico | Empilhe expects: status + estrutura + conteudo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrategias de asserção em testes E2E
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações