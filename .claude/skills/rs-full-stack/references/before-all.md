---
name: rs-full-stack-before-all
description: "Applies beforeAll test setup patterns when writing automated tests with Vitest or Jest. Use when user asks to 'write tests', 'setup test environment', 'share state between tests', 'initialize before tests', or 'prepare test data'. Ensures correct variable scoping in describe blocks and proper use of beforeAll for shared setup like database connections, file loading, or computed values. Make sure to use this skill whenever generating test files or adding test suites. Not for beforeEach, afterAll, afterEach, or test mocking patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testes
  tags: [vitest, jest, beforeAll, testing, setup]
---

# beforeAll — Setup Antes dos Testes

> Utilize `beforeAll` para executar logica de preparacao uma unica vez antes de todos os testes do bloco `describe`, garantindo que variaveis compartilhadas estejam corretamente inicializadas.

## Rules

1. **Declare variaveis no escopo do `describe`** — `let result: number` no topo do describe, porque todas as funcoes internas (it/test) precisam de acesso
2. **Atribua valores dentro do `beforeAll`** — nunca inicialize valores complexos na declaracao, porque o beforeAll garante que a preparacao aconteceu antes de qualquer teste
3. **Use `beforeAll` para operacoes que servem todos os testes** — conexao com banco, carga de arquivo, calculo compartilhado, porque executar uma vez e mais eficiente que repetir por teste
4. **Tipagem explicita nas variaveis compartilhadas** — `let value: number` nao `let value`, porque sem tipo o TypeScript infere `undefined` e reclama nos testes

## How to write

### Setup basico com beforeAll

```typescript
describe("sum", () => {
  let sumResult: number

  beforeAll(() => {
    sumResult = 10
  })

  it("should return the correct sum", () => {
    expect(sum(5, 5)).toBe(sumResult)
  })
})
```

### Setup com operacao assincrona

```typescript
describe("users", () => {
  let connection: DatabaseConnection

  beforeAll(async () => {
    connection = await connectToDatabase()
  })

  it("should fetch users", async () => {
    const users = await connection.query("SELECT * FROM users")
    expect(users).toBeDefined()
  })
})
```

## Example

**Before (variavel sem beforeAll — teste falha):**
```typescript
describe("sum", () => {
  let sumResult: number
  // sumResult nunca recebe valor → undefined
  
  it("should match result", () => {
    expect(sum(5, 5)).toBe(sumResult) // FAIL: expected 10, received undefined
  })
})
```

**After (com beforeAll — teste passa):**
```typescript
describe("sum", () => {
  let sumResult: number

  beforeAll(() => {
    sumResult = 10
  })

  it("should match result", () => {
    expect(sum(5, 5)).toBe(sumResult) // PASS
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor usado por todos os testes do describe | `beforeAll` com atribuicao |
| Valor diferente por teste | `beforeEach` ou inline no test |
| Conexao com banco/API | `beforeAll` async + `afterAll` para cleanup |
| Variavel compartilhada entre describes aninhados | Declare no describe pai |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `let result = computeExpensive()` no escopo do describe | `let result: Type` + `beforeAll(() => { result = computeExpensive() })` |
| Variavel sem tipo: `let result` | Variavel tipada: `let result: number` |
| Logica de setup repetida em cada `it()` | `beforeAll` para setup compartilhado |
| `beforeAll` para estado que muda entre testes | `beforeEach` para estado mutavel |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Variavel compartilhada e `undefined` nos testes | Faltou atribuir valor no `beforeAll` | Adicione atribuicao dentro do `beforeAll` callback |
| TypeScript reclama que variavel pode ser undefined | Faltou tipagem explicita na declaracao | Use `let result: number` em vez de `let result` |
| `beforeAll` async nao espera completar | Faltou `await` ou retorno de Promise | Use `async/await` dentro do beforeAll |
| Estado compartilhado contamina entre testes | `beforeAll` roda uma vez, estado mutavel persiste | Use `beforeEach` para estado que muda entre testes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escopo de variaveis e ciclo de vida dos hooks de teste
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes