---
name: rs-testes-e-testando-o-use-case-de-update
description: "Enforces unit testing patterns for Update use cases in TypeScript projects. Use when user asks to 'test an update function', 'write use case tests', 'test CRUD operations', 'add unit tests for update', or 'test happy and error paths'. Applies patterns: mock repository with overrides, arrange-act-assert structure, toHaveBeenCalledWith for repository verification, rejects.toThrow for error paths. Make sure to use this skill whenever writing tests for mutation use cases. Not for E2E tests, UI component tests, or integration tests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, playwright, e2e, mock, use-case, clean-architecture]
---

# Testando Use Cases de Update

> Ao testar use cases de mutacao, cubra sempre o caminho feliz (entidade existe) e o caminho de erro (entidade nao encontrada), verificando tanto o retorno quanto as chamadas ao repositorio.

## Rules

1. **Teste sempre os dois caminhos** — sucesso (entidade existe) e erro (entidade nao encontrada), porque use cases de update tem obrigatoriamente um `findById` antes do `update`
2. **Use factory functions para repositorios** — `makeRepository(overrides)` com valores default e overrides por teste, porque evita duplicacao e torna cada teste declarativo
3. **Verifique chamadas ao repositorio com `toHaveBeenCalledWith`** — nao basta checar o retorno, confirme que o repositorio recebeu os parametros corretos, porque garante que a logica de negocio delega corretamente
4. **Mock `findById` com `mockResolvedValue`** — retorne o objeto completo no caminho feliz e `null` no caminho de erro, porque simula exatamente o comportamento do repositorio real
5. **Siga Arrange-Act-Assert** — organize cada teste em tres blocos claros, porque facilita leitura e manutencao
6. **Use `rejects.toThrow` para erros async** — `await expect(fn()).rejects.toThrow("message")`, porque captura corretamente rejeicoes de promises

## How to write

### Factory de repositorio com overrides

```typescript
function makeRepository(overrides: Partial<PromptRepository> = {}): PromptRepository {
  return {
    update: jest.fn(async (id, data) => ({
      id,
      title: data.title ?? '',
      content: data.content ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findById: jest.fn(async () => null),
    ...overrides,
  }
}
```

### Teste do caminho feliz

```typescript
it('should update when prompt exists', async () => {
  // Arrange
  const now = new Date()
  const repository = makeRepository({
    findById: jest.fn().mockResolvedValue({
      id: '1', title: 'oldTitle', content: 'oldContent', createdAt: now,
    }),
    update: jest.fn().mockResolvedValue({
      id: '1', title: 'newTitle', content: 'newContent', createdAt: now,
    }),
  })
  const useCase = new UpdatePromptUseCase(repository)
  const input = { id: '1', title: 'newTitle', content: 'newContent' }

  // Act
  const result = await useCase.execute(input)

  // Assert
  expect(result.title).toBe(input.title)
  expect(repository.update).toHaveBeenCalledWith(input.id, {
    title: input.title,
    content: input.content,
  })
})
```

### Teste do caminho de erro

```typescript
it('should fail with prompt not found when prompt does not exist', async () => {
  const repository = makeRepository({
    findById: jest.fn().mockResolvedValue(null),
  })
  const useCase = new UpdatePromptUseCase(repository)
  const input = { id: '1', title: 'title', content: 'content' }

  await expect(useCase.execute(input)).rejects.toThrow('prompt not found')
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case tem `findById` + mutacao | Teste caminho feliz E caminho de erro (not found) |
| Precisa verificar parametros passados | Use `toHaveBeenCalledWith` no mock do repositorio |
| Varios testes compartilham setup | Extraia `makeRepository` com overrides |
| Teste de erro async | Use `await expect(...).rejects.toThrow()` |
| Quer validar falso positivo | Altere a mensagem de erro e confirme que o teste falha |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Apenas testar o retorno sem verificar chamadas ao repo | `expect(repo.update).toHaveBeenCalledWith(...)` |
| Mock inline duplicado em cada teste | `makeRepository({ findById: jest.fn()... })` |
| `try/catch` manual para testar erros async | `await expect(fn()).rejects.toThrow()` |
| Testar apenas o caminho feliz | Sempre testar caminho feliz + erro |
| Hardcodar datas em cada teste | `const now = new Date()` reutilizado |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
