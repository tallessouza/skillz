---
name: rs-node-js-2023-criando-erros-genericos
description: "Enforces functional error handling patterns with typed error classes in Node.js use cases. Use when user asks to 'handle errors', 'create error classes', 'return errors from use cases', 'implement Either pattern', or 'add error handling to domain layer'. Applies rules: error classes extend Error and implement UseCaseError interface, use Left/Right instead of throwing, type errors in Either union, test with instanceof. Make sure to use this skill whenever creating use case error handling in DDD/Clean Architecture projects. Not for HTTP error responses, middleware error handling, or infrastructure-level errors."
---

# Erros Genéricos em Use Cases

> Erros de use case sao classes tipadas que estendem Error, implementam UseCaseError, e retornam via Either (Left/Right) — nunca strings, nunca throws.

## Rules

1. **Crie classes de erro, nunca retorne strings** — `new ResourceNotFoundError()` nao `"Resource not found"`, porque classes permitem diferenciar erros com `instanceof` e carregar metadados
2. **Estenda Error nativo do JavaScript** — toda classe de erro herda de `Error` e chama `super(message)` no constructor, porque isso preserva stack trace e compatibilidade
3. **Implemente a interface UseCaseError** — erros de use case implementam `UseCaseError { message: string }`, porque permite identificar a camada de origem do erro
4. **Separe erros genericos de especificos** — `ResourceNotFoundError` e `NotAllowedError` sao genericos (todo sistema tem); erros de regra de negocio especifica ficam separados
5. **Type o Either com todos os erros possiveis** — `Either<ResourceNotFoundError | NotAllowedError, {}>`, porque o compilador forca tratamento exaustivo
6. **Teste erros com instanceof** — `expect(result.value).toBeInstanceOf(NotAllowedError)`, nunca compare strings de mensagem

## How to write

### Interface base em core/errors

```typescript
// src/core/errors/use-case-error.ts
export interface UseCaseError {
  message: string
}
```

### Classe de erro generico

```typescript
// src/domain/use-cases/errors/resource-not-found-error.ts
import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
```

### Either tipado no use case

```typescript
type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>

async execute({ answerId, authorId }): Promise<DeleteAnswerCommentResponse> {
  const comment = await this.repository.findById(answerId)

  if (!comment) {
    return left(new ResourceNotFoundError())
  }

  if (comment.authorId.toString() !== authorId) {
    return left(new NotAllowedError())
  }

  await this.repository.delete(comment)
  return right({})
}
```

## Example

**Before (string errors — impossivel diferenciar):**
```typescript
if (!comment) {
  return left('Answer comment not found')
}
if (comment.authorId.toString() !== authorId) {
  return left('Not allowed')
}

// No teste:
expect(result.isLeft()).toBe(true)
// Sem como saber QUAL erro aconteceu sem comparar string
```

**After (classes tipadas):**
```typescript
if (!comment) {
  return left(new ResourceNotFoundError())
}
if (comment.authorId.toString() !== authorId) {
  return left(new NotAllowedError())
}

// No teste:
expect(result.isLeft()).toBe(true)
expect(result.value).toBeInstanceOf(NotAllowedError)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso nao encontrado no banco | `ResourceNotFoundError` (generico) |
| Acao nao permitida para o usuario | `NotAllowedError` (generico) |
| Regra de negocio especifica (ex: horario ocupado) | Classe de erro especifica no dominio |
| Precisa saber a camada de origem do erro | Verifique se implementa `UseCaseError` |
| Teste de caso de erro | `result.isLeft()` + `toBeInstanceOf(ErrorClass)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `return left('not found')` | `return left(new ResourceNotFoundError())` |
| `throw new Error('Not allowed')` | `return left(new NotAllowedError())` |
| `expect(result).rejects.toThrow()` | `expect(result.value).toBeInstanceOf(ErrorClass)` |
| Erro sem `extends Error` | `class MyError extends Error implements UseCaseError` |
| Comparar `result.value === 'string'` | `result.value instanceof NotAllowedError` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-erros-genericos/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-erros-genericos/references/code-examples.md)
