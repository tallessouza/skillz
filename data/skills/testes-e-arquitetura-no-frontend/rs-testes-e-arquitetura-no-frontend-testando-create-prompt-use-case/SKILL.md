---
name: rs-testes-arquitetura-fe-testando-create-prompt
description: "Enforces patterns for testing use case classes with dependency inversion and mocked repositories in TypeScript/Jest. Use when user asks to 'test a use case', 'write unit test for use case', 'mock repository in test', 'test create operation', or 'test error scenarios'. Applies rules: factory functions for repository mocks, override pattern for partial mocks, test both success and error paths, verify function calls not just return values. Make sure to use this skill whenever writing tests for use case classes that depend on repositories or services. Not for testing UI components, API routes, or E2E tests."
---

# Testando Use Cases com Inversão de Dependências

> Ao testar use cases, use factories com overrides para mockar repositórios sem depender de libs externas, porque a inversão de dependências já desacoplou tudo.

## Rules

1. **Crie uma factory `makeRepository` com overrides** — nunca monte mocks inline repetidos, porque a factory centraliza e permite customização por cenário
2. **Use `Partial<Repository>` no overrides** — só implemente os métodos que o teste precisa, porque `as PromptRepository` garante o tipo sem forçar implementação completa
3. **Teste sempre os dois caminhos: sucesso e erro** — o cenário feliz E o cenário de falha, porque cobertura de um caminho só é falso positivo
4. **Verifique chamadas, não só retorno** — use `toHaveBeenCalledWith` para garantir que o repository recebeu os dados corretos, porque um `undefined` de retorno pode mascarar bugs
5. **Valide que o teste realmente falha** — remova temporariamente a lógica e confirme que o teste quebra, porque testes que nunca falham são falsos positivos
6. **Não confie cegamente em coverage** — código executado indiretamente aparece como 100% coberto sem ter teste próprio, porque o Jest conta execução, não intenção

## How to write

### Factory de Repository com Overrides

```typescript
function makeRepository(overrides?: Partial<PromptRepository>) {
  const base: PromptRepository = {
    create: jest.fn().mockResolvedValue(undefined),
    findByTitle: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    // ... demais métodos com defaults seguros
    ...overrides,
  } as PromptRepository

  return base
}
```

### Teste de sucesso (caminho feliz)

```typescript
it('deve criar um prompt quando não existir duplicidade', async () => {
  const repository = makeRepository({
    findByTitle: jest.fn().mockResolvedValue(null),
  })
  const useCase = new CreatePromptUseCase(repository)
  const input = { title: 'Novo', content: 'Conteúdo' }

  await expect(useCase.execute(input)).resolves.toBeUndefined()
  expect(repository.create).toHaveBeenCalledWith(input)
})
```

### Teste de erro (duplicidade)

```typescript
it('deve falhar quando o título já existir', async () => {
  const repository = makeRepository({
    findByTitle: jest.fn().mockResolvedValue({
      id: 'id',
      title: 'Novo',
      content: 'Conteúdo',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  })
  const useCase = new CreatePromptUseCase(repository)
  const input = { title: 'Novo', content: 'Conteúdo' }

  await expect(useCase.execute(input)).rejects.toThrow(
    'Prompt already exists'
  )
})
```

## Example

**Before (mocks inline, sem factory):**
```typescript
it('cria prompt', async () => {
  const repo = {
    create: jest.fn().mockResolvedValue(undefined),
    findByTitle: jest.fn().mockResolvedValue(null),
    findMany: jest.fn(),
    searchMany: jest.fn(),
  } as PromptRepository
  const uc = new CreatePromptUseCase(repo)
  await uc.execute({ title: 'X', content: 'Y' })
  // sem verificação de chamada, sem teste de erro
})
```

**After (com factory e ambos cenários):**
```typescript
function makeRepository(overrides?: Partial<PromptRepository>) {
  return { create: jest.fn().mockResolvedValue(undefined),
    findByTitle: jest.fn().mockResolvedValue(null),
    ...overrides } as PromptRepository
}

it('deve criar quando não há duplicidade', async () => {
  const repository = makeRepository()
  const useCase = new CreatePromptUseCase(repository)
  const input = { title: 'X', content: 'Y' }
  await expect(useCase.execute(input)).resolves.toBeUndefined()
  expect(repository.create).toHaveBeenCalledWith(input)
})

it('deve falhar quando título duplicado', async () => {
  const repository = makeRepository({
    findByTitle: jest.fn().mockResolvedValue({ id: '1', title: 'X', content: 'Y', createdAt: new Date(), updatedAt: new Date() }),
  })
  const useCase = new CreatePromptUseCase(repository)
  await expect(useCase.execute({ title: 'X', content: 'Y' })).rejects.toThrow()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Use case sem return (void) | `resolves.toBeUndefined()` |
| Use case lança erro condicional | Teste com `rejects.toThrow('mensagem exata')` |
| Múltiplos testes com mesmo repository shape | Factory com defaults + overrides |
| Precisa validar dados passados ao repository | `toHaveBeenCalledWith(input)` |
| Coverage mostra 100% sem teste direto | Desconfie — crie teste explícito para o componente |
| Dúvida se teste é falso positivo | Remova a lógica e confirme que o teste quebra |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Mock inline repetido em cada `it` | Factory `makeRepository` com overrides |
| Só teste de sucesso | Sucesso + erro (ambos cenários) |
| `expect(result).toBe(undefined)` sem verificar chamadas | Adicione `toHaveBeenCalledWith` |
| Confiar em 100% coverage como prova de qualidade | Validar que cada teste falha quando a lógica é removida |
| `as any` para tipar mocks | `Partial<Repository>` + cast tipado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
