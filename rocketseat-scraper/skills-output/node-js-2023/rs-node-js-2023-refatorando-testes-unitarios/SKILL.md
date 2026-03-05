---
name: rs-node-js-2023-refatorando-testes-unitarios
description: "Enforces Either pattern test assertions when writing unit tests for use cases that return Result/Either types. Use when user asks to 'write a test', 'test a use case', 'refactor tests', 'add test for error case', or 'validate either result'. Applies isLeft/isRight assertions, optional chaining on value access, and proper error type checking. Make sure to use this skill whenever testing use cases that return Either/Result types. Not for testing pure functions, UI components, or integration tests without Either returns."
---

# Testando Use Cases com Either/Result

> Ao testar use cases que retornam Either, valide o lado (Left/Right) antes de acessar o value.

## Rules

1. **Sempre armazene o retorno em `result`** — `const result = await sut.execute(...)`, porque o retorno e um Either, nao o valor direto
2. **Valide o lado antes do valor** — `expect(result.isRight()).toBe(true)` antes de acessar `result.value`, porque o Either pode ser sucesso ou falha
3. **Use optional chaining no value** — `result.value?.answer` nao `result.value.answer`, porque TypeScript nao sabe qual lado do Either voce tem sem um narrowing explicito
4. **Teste erros com isLeft + instanceof** — `expect(result.isLeft()).toBe(true)` seguido de `expect(result.value).toBeInstanceOf(NotAllowedError)`, porque valida tanto o lado quanto o tipo do erro
5. **Nunca acesse propriedades direto do execute** — proibido `const { answer } = await sut.execute(...)`, porque o retorno agora e um Either, nao o valor puro

## How to write

### Teste de sucesso

```typescript
it('should do something', async () => {
  const result = await sut.execute({
    authorId: 'author-1',
    content: 'Example content',
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryRepo.items[0]).toEqual(result.value?.entity)
})
```

### Teste de erro

```typescript
it('should not allow unauthorized action', async () => {
  const result = await sut.execute({
    authorId: 'wrong-author',
    entityId: 'entity-1',
  })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(NotAllowedError)
})
```

## Example

**Before (acesso direto, quebra com Either):**
```typescript
it('should create answer', async () => {
  const { answer } = await sut.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(answer.id).toBeTruthy()
})

it('should not allow', async () => {
  await expect(() =>
    sut.execute({ authorId: 'wrong' })
  ).rejects.toBeInstanceOf(NotAllowedError)
})
```

**After (com Either pattern):**
```typescript
it('should create answer', async () => {
  const result = await sut.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryAnswersRepo.items[0]).toEqual(result.value?.answer)
})

it('should not allow', async () => {
  const result = await sut.execute({ authorId: 'wrong' })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(NotAllowedError)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case retorna Either | `const result = await sut.execute(...)` + validar lado |
| Teste de sucesso | `result.isRight()` + verificar entidade no repositorio |
| Teste de erro | `result.isLeft()` + `toBeInstanceOf(ErrorClass)` |
| Acessar valor do result | Sempre com `result.value?.prop` (optional chaining) |
| Fetch/Get use cases | Trocar acesso direto por `result.value?.entities` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const { answer } = await sut.execute(...)` | `const result = await sut.execute(...)` |
| `expect(answer.id).toBeTruthy()` | `expect(result.isRight()).toBe(true)` |
| `rejects.toBeInstanceOf(Error)` | `expect(result.isLeft()).toBe(true)` + `toBeInstanceOf` |
| `result.value.answer` (sem `?`) | `result.value?.answer` |
| Testar so o valor sem validar o lado | Sempre validar `isRight`/`isLeft` primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
