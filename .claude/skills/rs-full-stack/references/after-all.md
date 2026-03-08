---
name: rs-full-stack-after-all
description: "Applies afterAll cleanup patterns when writing test suites in JavaScript/TypeScript. Use when user asks to 'write tests', 'create test suite', 'add test cleanup', 'setup test lifecycle', or 'configure test hooks'. Ensures proper resource cleanup after test execution using afterAll for memory management, file cleanup, and state reset. Make sure to use this skill whenever generating test files with shared resources or setup/teardown needs. Not for individual test assertions, mocking strategies, or CI/CD configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [testing, afterAll, jest, cleanup, lifecycle]
---

# afterAll — Limpeza Após Testes

> Sempre que testes compartilham recursos (arquivos, conexões, estado), use `afterAll` para garantir limpeza após a execução completa da suite.

## Rules

1. **Use `afterAll` para limpar recursos compartilhados** — conexões de banco, arquivos carregados, variáveis globais, porque recursos não-limpos vazam entre suites e causam testes flaky
2. **Pareie `beforeAll` com `afterAll`** — todo setup em `beforeAll` deve ter seu teardown correspondente em `afterAll`, porque setup sem cleanup é débito técnico em testes
3. **Resete estado ao valor original** — não apenas "limpe", restaure ao estado pré-teste, porque testes devem ser idempotentes
4. **Não use `afterAll` para cleanup por teste** — use `afterEach` quando cada teste precisa de cleanup individual, porque `afterAll` executa apenas uma vez após todos os testes

## How to write

### Padrão básico: setup e teardown pareados

```typescript
let database: DatabaseSimulator

beforeAll(() => {
  database = loadDatabaseFromFile('./test-data.json')
})

afterAll(() => {
  database = null // libera memória
})
```

### Padrão com recursos externos

```typescript
let server: TestServer
let connection: DatabaseConnection

beforeAll(async () => {
  server = await startTestServer()
  connection = await connectToTestDatabase()
})

afterAll(async () => {
  await connection.close()
  await server.shutdown()
})
```

## Example

**Before (sem cleanup):**
```typescript
let items = []

beforeAll(() => {
  items = loadLargeDataset('./fixtures/products.json')
})

test('filters active items', () => {
  const active = items.filter(i => i.active)
  expect(active.length).toBeGreaterThan(0)
})
// items permanece na memória após a suite terminar
```

**After (com afterAll):**
```typescript
let items = []

beforeAll(() => {
  items = loadLargeDataset('./fixtures/products.json')
})

afterAll(() => {
  items = []
})

test('filters active items', () => {
  const active = items.filter(i => i.active)
  expect(active.length).toBeGreaterThan(0)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Carregou arquivo grande em `beforeAll` | Libere com `afterAll` |
| Abriu conexão de banco para testes | Feche em `afterAll` |
| Modificou variável de módulo | Restaure valor original em `afterAll` |
| Cada teste precisa de estado limpo | Use `afterEach`, não `afterAll` |
| Nenhum recurso compartilhado | Não precisa de `afterAll` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `beforeAll` sem `afterAll` correspondente | Sempre pareie setup com teardown |
| Cleanup de recurso por-teste em `afterAll` | Use `afterEach` para cleanup individual |
| Ignorar cleanup de arquivos temporários | `afterAll(() => fs.unlinkSync(tempFile))` |
| Deixar conexões abertas após suite | `afterAll(async () => await conn.close())` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Testes flaky que falham aleatoriamente | Recursos não limpos entre suites | Adicione `afterAll` para fechar conexões e limpar estado |
| `afterAll` não executa | Teste anterior lançou exceção não-capturada | Envolva o `afterAll` em try/catch ou use `--forceExit` |
| Conexão de banco fica aberta após testes | Faltou `afterAll(async () => await conn.close())` | Pareie cada `beforeAll` com seu `afterAll` correspondente |
| Cleanup roda antes dos testes terminarem | Usou `afterAll` sem `async/await` em operação assíncrona | Adicione `async` no callback e `await` nas operações |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre lifecycle hooks e quando usar cada um
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações async, banco de dados e arquivos