---
name: rs-testes-e-testando-o-use-case
description: "Enforces use case testing patterns with fakes and spies in Clean Architecture frontend projects. Use when user asks to 'test a use case', 'write unit tests for business logic', 'create test doubles', 'test with fakes instead of mocks', or 'test clean architecture layers'. Applies rules: prefer fakes over mocks, use spies only for call verification, test boundary behaviors (empty/undefined/whitespace inputs), validate layer isolation. Make sure to use this skill whenever testing application layer use cases in frontend projects. Not for E2E tests, component tests, or API integration tests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, playwright, e2e, mock, use-case, clean-architecture]
---

# Testando Use Cases com Fakes e Spies

> Ao testar use cases, prefira fakes sobre mocks para ter controle total sobre o comportamento, e use spies apenas quando precisar verificar QUAIS metodos foram chamados.

## Rules

1. **Prefira fakes sobre mocks** — crie objetos que implementam a interface do repository com logica real simples, porque fakes dao controle total sem acoplamento ao framework de mock
2. **Use spies apenas para verificar chamadas** — `jest.fn()` com `mockResolvedValue` quando precisar validar qual metodo foi chamado e com quais argumentos, porque isso testa o fluxo de decisao do use case
3. **Teste comportamentos de fronteira** — string vazia, string com espacos, undefined/null, porque sao os cenarios onde bugs de trim e validacao aparecem
4. **Valide falsos positivos** — apos o teste passar, quebre-o intencionalmente para confirmar que nao e falso positivo, porque um teste que sempre passa nao testa nada
5. **Espelhe a estrutura de pastas do codigo fonte** — testes ficam em `src/core/application/prompts/search-prompt-use-case.spec.ts`, porque facilita localizar o teste correspondente a cada arquivo
6. **Nao duplique testes entre camadas sem justificativa** — se um comportamento ja esta validado na action, avalie custo/beneficio antes de repetir no use case, porque mais testes significam pipeline mais lento

## How to write

### Fake repository (objeto simples)

```typescript
const input: Prompt[] = [
  { id: '1', title: 'title01', content: 'content01', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'title02', content: 'content02', createdAt: new Date(), updatedAt: new Date() },
]

const repository: PromptRepository = {
  findMany: async () => input,
  searchMany: async (term: string) =>
    input.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(term.toLowerCase()) ||
        prompt.content.toLowerCase().includes(term.toLowerCase())
    ),
}
```

### Repository com spies (para verificar chamadas)

```typescript
const findMany = jest.fn().mockResolvedValue(input)
const searchMany = jest.fn().mockResolvedValue([])

const repositoryWithSpies: PromptRepository = {
  ...repository,
  findMany,
  searchMany,
}
```

### Teste de input undefined com cast de tipo

```typescript
const query = undefined
const results = await useCase.execute(query as unknown as string)
```

## Example

**Before (testes acoplados a mocks):**
```typescript
it('should return all prompts', async () => {
  const mockRepo = {
    findMany: jest.fn().mockResolvedValue(mockData),
    searchMany: jest.fn(),
  }
  const useCase = new SearchPromptUseCase(mockRepo)
  const results = await useCase.execute('')
  expect(results).toHaveLength(2)
  // Sem validacao de falso positivo, sem teste de fronteira
})
```

**After (com fakes, spies e validacao completa):**
```typescript
// Fake com logica real (fora do describe)
const repository: PromptRepository = {
  findMany: async () => input,
  searchMany: async (term) =>
    input.filter((p) => p.title.toLowerCase().includes(term.toLowerCase())),
}

it('deve retornar todos os prompts quando o termo for vazio', async () => {
  const useCase = new SearchPromptUseCase(repository)
  const results = await useCase.execute('')
  expect(results).toHaveLength(2)
})

it('deve aplicar trim em termo com espacos e retornar toda a lista', async () => {
  const findMany = jest.fn().mockResolvedValue(input)
  const searchMany = jest.fn().mockResolvedValue([])
  const repoWithSpies: PromptRepository = { findMany, searchMany }
  const useCase = new SearchPromptUseCase(repoWithSpies)

  const results = await useCase.execute('   ')
  expect(results).toHaveLength(2)
  expect(findMany).toHaveBeenCalledTimes(1)
  expect(searchMany).not.toHaveBeenCalled()
})

it('deve lidar com termo undefined', async () => {
  const findMany = jest.fn().mockResolvedValue(input)
  const searchMany = jest.fn().mockResolvedValue([])
  const repoWithSpies: PromptRepository = { findMany, searchMany }
  const useCase = new SearchPromptUseCase(repoWithSpies)

  const query = undefined
  const results = await useCase.execute(query as unknown as string)
  expect(results).toMatchObject(input)
  expect(findMany).toHaveBeenCalledTimes(1)
  expect(searchMany).not.toHaveBeenCalled()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa testar logica de negocio do use case | Use fake com logica real |
| Precisa verificar qual metodo do repo foi chamado | Use spy com `jest.fn()` |
| Comportamento ja testado em outra camada | Avalie custo/beneficio antes de duplicar |
| Teste passou de primeira | Quebre intencionalmente para validar |
| Input pode ser vazio, undefined ou com espacos | Crie caso de teste para cada cenario |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Mock de tudo sem logica real | Fake com implementacao simples |
| Testar apenas o caminho feliz | Testar fronteiras: vazio, undefined, espacos |
| Confiar que teste passou sem validar falso positivo | Quebrar o teste intencionalmente |
| Criar repository fake dentro de cada `it` | Criar fake compartilhado fora do `describe`, spies dentro do `it` |
| Ignorar verificacao de chamadas em testes de fluxo | Usar `toHaveBeenCalledTimes` e `not.toHaveBeenCalled` |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
