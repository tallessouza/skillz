---
name: rs-node-js-2023-categorizando-testes
description: "Enforces test organization with describe blocks and 'it should be able to' naming convention when writing Vitest or Jest tests. Use when user asks to 'write tests', 'create test file', 'add test cases', 'organize tests', or any test generation task. Applies rules: group related tests in describe blocks, use 'it' over 'test', name tests as 'should be able to {action}', one file per domain. Make sure to use this skill whenever generating test code. Not for production code, documentation, or non-test files."
---

# Categorizando Testes

> Organize testes em categorias com `describe` e nomeie cada teste como um requisito funcional: "it should be able to {acao}".

## Rules

1. **Agrupe testes por dominio em `describe`** — todos os testes de transacoes ficam em `describe('Transactions routes', ...)`, porque quando um teste falha, a categoria aparece no erro e facilita a localizacao
2. **Um arquivo por dominio** — `transactions.spec.ts` testa apenas rotas de transacoes, porque misturar dominios dificulta a navegacao e o isolamento de falhas
3. **Use `it` em vez de `test`** — semanticamente `it` forma uma frase em ingles: `it('should be able to create a new transaction')`, porque testes lidos como requisitos funcionais sao auto-documentados
4. **Nomeie com "should be able to {acao}"** — descreva o que o sistema DEVE fazer, nao o que o teste faz, porque espelha requisitos funcionais (RF)
5. **`beforeAll`/`afterAll` dentro do `describe`** — setup e teardown pertencem ao contexto da categoria, porque evita vazamento de estado entre categorias
6. **Subcategorias quando necessario** — se uma rota tem muitos cenarios, crie um `describe` aninhado para ela, porque mantem a hierarquia legivel sem limite de niveis

## How to write

### Estrutura basica de arquivo de teste

```typescript
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    // setup que vale apenas para esta categoria
  })

  afterAll(async () => {
    // teardown apenas para esta categoria
  })

  it('should be able to create a new transaction', async () => {
    // teste aqui
  })

  it('should be able to list all transactions', async () => {
    // teste aqui
  })
})
```

### Subcategorias para rotas complexas

```typescript
describe('Transactions routes', () => {
  describe('GET /transactions/:id', () => {
    it('should be able to get a specific transaction', async () => {
      // ...
    })

    it('should be able to return 404 for non-existent transaction', async () => {
      // ...
    })
  })
})
```

## Example

**Before (sem organizacao):**
```typescript
import { test, expect } from 'vitest'

test('create transaction', async () => {
  const response = await request(app).post('/transactions').send({ title: 'Test', amount: 100 })
  expect(response.statusCode).toBe(201)
})

test('list transactions', async () => {
  const response = await request(app).get('/transactions')
  expect(response.statusCode).toBe(200)
})
```

**After (com esta skill aplicada):**
```typescript
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app).post('/transactions').send({ title: 'Test', amount: 100 })
    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all transactions', async () => {
    const response = await request(app).get('/transactions')
    expect(response.statusCode).toBe(200)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo arquivo de teste | Criar `describe` com nome do dominio + "routes" ou "use cases" |
| Mais de 3 testes para mesma rota | Criar `describe` aninhado para aquela rota |
| Setup compartilhado entre testes | `beforeAll`/`afterAll` dentro do `describe` mais proximo |
| Nomeando o teste | Comece com "should be able to" seguido da acao em ingles |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `test('create transaction', ...)` | `it('should be able to create a new transaction', ...)` |
| Testes soltos sem `describe` | `describe('Domain routes', () => { ... })` |
| `beforeAll` no escopo global | `beforeAll` dentro do `describe` relevante |
| Nome em portugues no teste | Nome em ingles: "should be able to {action}" |
| Um arquivo com testes de varios dominios | Um arquivo por dominio: `transactions.spec.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-categorizando-os-testes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-categorizando-os-testes/references/code-examples.md)
