---
name: rs-testes-arquitetura-fe-test-update-action
description: "Enforces patterns for testing Server Actions (update/edit operations) in Next.js with Vitest. Use when user asks to 'test an action', 'test update function', 'write integration test for server action', 'test form submission', or 'mock use case execute'. Applies patterns: mock rejected/resolved values for use cases, test validation errors via Zod, test not-found scenarios, test generic error fallbacks, reset mocks in beforeEach. Make sure to use this skill whenever writing tests for Next.js Server Actions. Not for E2E tests, component tests, or repository-level tests."
---

# Testando Actions de Update (Server Actions)

> Ao testar Server Actions, cubra todos os caminhos: sucesso, validacao, entidade nao encontrada e erro generico, sempre com mocks resetados entre testes.

## Rules

1. **Resete todos os mocks no beforeEach** — inclua TODO mock de use case (create, update, search, delete) no reset, porque testes devem ser independentes e estado compartilhado causa falsos positivos
2. **Teste cenarios de sucesso primeiro** — organize com `describe` por action e coloque o caminho feliz no topo, porque facilita leitura e geralmente e o cenario mais simples
3. **Cubra todos os branches de erro** — validacao Zod, entidade nao encontrada (erro especifico), e erro generico (catch generico), porque cada `if` na action e um branch que precisa de cobertura
4. **Use mockRejectedValue para simular erros** — `mockExecute.mockRejectedValue(new Error('mensagem'))` para forcar o caminho de erro especifico ou generico, porque e assim que use cases lancam erros
5. **Use mockResolvedValue para sucesso** — mesmo que vazio, torne explicito o retorno do mock, porque garante que o teste nao depende de comportamento implicito
6. **Verifique objetos com toMatchObject** — quando o retorno e um objeto com multiplas propriedades, use `toMatchObject` ao inves de checar propriedade por propriedade, porque escala melhor com objetos grandes

## How to write

### Setup de mocks para use cases

```typescript
// Crie mocks para CADA use case usado nas actions
const mockCreateExecute = vi.fn()
const mockUpdateExecute = vi.fn()
const mockSearchExecute = vi.fn()

// Mock dos modulos
vi.mock('@/use-cases/create-prompt', () => ({
  CreatePrompt: vi.fn().mockImplementation(() => ({
    execute: mockCreateExecute,
  })),
}))

vi.mock('@/use-cases/update-prompt', () => ({
  UpdatePrompt: vi.fn().mockImplementation(() => ({
    execute: mockUpdateExecute,
  })),
}))
```

### beforeEach com reset completo

```typescript
beforeEach(() => {
  mockCreateExecute.mockReset()
  mockUpdateExecute.mockReset()
  mockSearchExecute.mockReset()
  // Reset de outras dependencias (toast, router, etc)
})
```

### Teste de erro de validacao (Zod)

```typescript
it('deve retornar erro de validacao quando campos faltarem', async () => {
  const data = { id: '1', title: '', content: '' }

  const result = await updatePromptAction(data)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Erro de validação')
  expect(result.errors).toBeDefined()
})
```

### Teste de entidade nao encontrada

```typescript
it('deve retornar erro quando prompt nao existir', async () => {
  const promptId = 'non-existent-id'
  const data = { id: promptId, title: 'Title', content: 'Content' }

  mockUpdateExecute.mockRejectedValue(new Error('Prompt not found'))

  const result = await updatePromptAction(data)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Prompt não encontrado')
})
```

### Teste de sucesso com toMatchObject

```typescript
it('deve atualizar com sucesso', async () => {
  const data = { id: '1', title: 'New title', content: 'New content' }

  mockUpdateExecute.mockResolvedValue(undefined)

  const result = await updatePromptAction(data)

  expect(result).toMatchObject({
    success: true,
    message: 'Prompt atualizado com sucesso',
  })
})
```

### Teste de erro generico

```typescript
it('deve retornar erro generico quando falhar ao atualizar', async () => {
  const data = { id: '1', title: 'Title', content: 'Content' }

  mockUpdateExecute.mockRejectedValue(new Error('unexpected'))

  const result = await updatePromptAction(data)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Falha ao atualizar o prompt')
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Action tem try/catch com if no erro | Teste cada branch: erro especifico E erro generico |
| Action usa Zod validation | Teste com campos vazios/invalidos, verifique `errors` definido |
| Mock de use case nao e necessario pro teste | Ainda assim use `mockResolvedValue` explicito |
| Objeto de retorno tem muitas props | Use `toMatchObject` ao inves de checar uma a uma |
| Teste ja existe em nivel de unidade | Repita em integracao se o cenario e critico (not found, validacao) |
| Coverage de branches esta baixo | Foque nos `if/else` dentro do catch — cada um e um branch |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `beforeEach` sem resetar todos os mocks | `beforeEach` com `.mockReset()` para cada mock |
| Testar so sucesso e ignorar erros | Testar sucesso + validacao + not found + erro generico |
| `expect(result.success).toBe(false)` + `expect(result.message).toBe(...)` em objetos grandes | `expect(result).toMatchObject({ success: false, message: '...' })` |
| Confiar que mock sem setup retorna undefined | `mockResolvedValue(undefined)` explicito |
| Copiar mocks sem renomear (create → update) | Revisar cada referencia ao copiar mocks entre describes |
| Olhar so `statements` no coverage | Verificar `branches` e `functions` tambem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-a-action-de-update/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-a-action-de-update/references/code-examples.md)
