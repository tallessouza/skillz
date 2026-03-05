---
name: rs-testes-arq-frontend-testando-server-action
description: "Enforces patterns for testing Next.js Server Actions with Jest mocks and FormData. Use when user asks to 'test a server action', 'mock use case in tests', 'test form submission', 'write tests for actions', or 'mock Prisma in tests'. Applies rules: mock external dependencies (Prisma, use cases) with jest.mock, use mockResolvedValue/mockRejectedValue for async behavior, reset mocks in beforeEach, test success/error/edge cases with FormData. Make sure to use this skill whenever writing tests for Next.js server actions or any action that uses use cases and external dependencies. Not for unit testing React components, E2E tests, or testing API routes."
---

# Testando Server Actions

> Testes de server actions isolam o comportamento mocando dependencias externas (Prisma, use cases) e validam cenarios de sucesso, erro e edge cases com FormData.

## Rules

1. **Espelhe a estrutura de pastas nos testes** — `src/app/actions/prompt-actions.ts` → `tests/app/actions/prompt-actions.spec.ts`, porque facilita navegacao e garante cobertura visivel
2. **Mock dependencias externas no nivel do modulo** — use `jest.mock()` para Prisma e use cases, porque testes nao devem depender de banco ou infraestrutura
3. **Resete mocks no beforeEach** — `mockFn.mockReset()` antes de cada teste, porque um teste nunca deve impactar outro
4. **Use mockResolvedValue para sucesso e mockRejectedValue para erro** — simula comportamento async sem executar codigo real
5. **Teste com FormData real** — instancie `new FormData()` e use `.append()`, porque server actions recebem FormData do browser
6. **Organize com describe aninhado** — describe externo para o grupo (Server Actions), interno para a feature (Search), porque melhora legibilidade

## How to write

### Setup de mocks para server action

```typescript
const mockedSearchExecute = jest.fn()

// Mock do Prisma — substitui importacao por objeto vazio
jest.mock('@/lib/prisma', () => ({
  prisma: {}
}))

// Mock do use case — substitui factory pelo mock controlavel
jest.mock('@/core/use-cases/search-prompt-use-case', () => ({
  SearchPromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute
  }))
}))
```

### Estrutura do describe

```typescript
describe('Server Actions', () => {
  describe('Search', () => {
    beforeEach(() => {
      mockedSearchExecute.mockReset()
    })

    it('deve retornar sucesso com termo nao vazio', async () => { /* ... */ })
    it('deve retornar sucesso listando todos quando termo vazio', async () => { /* ... */ })
    it('deve retornar erro generico quando falhar', async () => { /* ... */ })
    it('deve aparar espacos do termo antes de executar', async () => { /* ... */ })
    it('deve tratar ausencia da query como termo vazio', async () => { /* ... */ })
  })
})
```

### Teste de sucesso

```typescript
it('deve retornar sucesso com termo nao vazio', async () => {
  const input = [{ id: '1', title: 'AI title', content: 'content' }]
  mockedSearchExecute.mockResolvedValue(input)

  const formData = new FormData()
  formData.append('q', 'AI')

  const result = await searchPromptAction({ success: true }, formData)

  expect(result.success).toBeDefined()
  expect(result.prompts).toEqual(input)
})
```

### Teste de erro

```typescript
it('deve retornar erro generico quando falhar', async () => {
  mockedSearchExecute.mockRejectedValue(new Error('any'))

  const formData = new FormData()
  formData.append('q', 'test')

  const result = await searchPromptAction({ success: true }, formData)

  expect(result.success).toBe(false)
  expect(result.prompts).toBeUndefined()
  expect(result.message).toBe('Error on search prompts')
})
```

### Teste de trim nos espacos

```typescript
it('deve aparar espacos do termo antes de executar', async () => {
  const input = [{ id: '1', title: 'title01', content: 'content01' }]
  mockedSearchExecute.mockResolvedValue(input)

  const formData = new FormData()
  formData.append('q', '  title01  ')

  const result = await searchPromptAction({ success: true }, formData)

  expect(result.success).toBe(true)
  expect(result.prompts).toEqual(input)
  expect(mockedSearchExecute).toHaveBeenCalledWith('title01')
})
```

## Example

**Before (teste acoplado ao banco):**
```typescript
it('busca prompts', async () => {
  // Executa contra banco real — lento, fragil, nao isolado
  const result = await searchPromptAction({ success: true }, formData)
  expect(result.prompts.length).toBeGreaterThan(0)
})
```

**After (teste isolado com mocks):**
```typescript
const mockedSearchExecute = jest.fn()
jest.mock('@/lib/prisma', () => ({ prisma: {} }))
jest.mock('@/core/use-cases/search-prompt-use-case', () => ({
  SearchPromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute
  }))
}))

describe('Server Actions', () => {
  describe('Search', () => {
    beforeEach(() => {
      mockedSearchExecute.mockReset()
    })

    it('deve retornar sucesso com termo nao vazio', async () => {
      const input = [{ id: '1', title: 'AI', content: 'content' }]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', 'AI')

      const result = await searchPromptAction({ success: true }, formData)
      expect(result.success).toBeDefined()
      expect(result.prompts).toEqual(input)
    })
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Server action importa Prisma | Mock com `jest.mock` retornando objeto vazio |
| Server action usa use case | Mock o modulo do use case, controle o `execute` |
| Precisa testar erro async | Use `mockRejectedValue(new Error(...))` |
| Varios testes no mesmo describe | `beforeEach` com `mockReset()` em cada mock |
| Query pode vir com espacos | Teste com espacos e valide que `execute` recebeu string trimada |
| Query pode ser undefined | Teste sem `formData.append` e valide fallback para string vazia |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Testar server action contra banco real | Mock Prisma e use cases |
| Compartilhar estado entre testes sem reset | `beforeEach(() => mock.mockReset())` |
| Usar `mockReturnValue` para async | `mockResolvedValue` / `mockRejectedValue` |
| Testar so o caminho feliz | Testar sucesso, erro, vazio, trim, ausencia |
| Mockar inline em cada teste | Mockar no nivel do modulo, controlar valor por teste |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-a-server-action/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-a-server-action/references/code-examples.md)
