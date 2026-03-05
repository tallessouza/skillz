---
name: rs-node-js-2023-functional-error-handling
description: "Applies the Either pattern (Left/Right) for functional error handling in TypeScript/Node.js. Use when user asks to 'handle errors', 'create use case', 'return errors from functions', 'implement Either pattern', or 'avoid throw in domain layer'. Enforces returning typed Either tuples instead of throwing exceptions in use cases and domain code. Make sure to use this skill whenever implementing use cases, domain services, or any function that can fail in a DDD/Clean Architecture context. Not for HTTP error responses, middleware error handling, or infrastructure-level try/catch."
---

# Functional Error Handling (Either Pattern)

> Funcoes que podem falhar retornam Either<L, R> em vez de fazer throw — o tipo de retorno SEMPRE comunica erro e sucesso.

## Rules

1. **Nunca use throw em casos de uso ou dominio** — use `return left(motivo)` para erros e `return right(valor)` para sucesso, porque throw quebra o fluxo de tipos e o chamador nao sabe que erros esperar
2. **Retorne Either<L, R> tipado** — o tipo Left representa o erro, Right representa o sucesso, porque o TypeScript consegue inferir e forcar que todos os caminhos estejam cobertos
3. **Left = erro (fluxo volta), Right = sucesso (fluxo continua)** — a convencao vem da ideia de que o fluxo da aplicacao sempre segue pra direita (controller → use case → entity → repository); quando da erro, volta pra esquerda
4. **Value e o unico campo** — tanto Left quanto Right carregam `.value`, nao use `.reason` ou `.result`, porque padronizar simplifica o consumo
5. **Use funcoes helper `left()` e `right()`** — nao instancie `new Left()` diretamente, porque as funcoes helper permitem inferencia generica automatica
6. **Type alias Either e obrigatorio no retorno** — `Promise<Either<ErrorType, SuccessType>>` no retorno de todo use case, porque isso documenta e forca o contrato

## How to write

### Classe Either (core/either.ts)

```typescript
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }
}

export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return false
  }

  isRight(): this is Right<L, R> {
    return true
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R = never>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <R, L = never>(value: R): Either<L, R> => {
  return new Right(value)
}
```

### Use case com Either

```typescript
type DeleteAnswerCommentResponse = Either<string, object>

export class DeleteAnswerCommentUseCase {
  async execute({ commentId, authorId }: Request): Promise<DeleteAnswerCommentResponse> {
    const comment = await this.repository.findById(commentId)

    if (!comment) {
      return left('Answer comment not found')
    }

    if (comment.authorId.toString() !== authorId) {
      return left('Not allowed')
    }

    await this.repository.delete(comment)

    return right({})
  }
}
```

## Example

**Before (throw tradicional):**
```typescript
async execute({ commentId, authorId }: Request): Promise<void> {
  const comment = await this.repository.findById(commentId)

  if (!comment) {
    throw new Error('Comment not found')
  }

  if (comment.authorId.toString() !== authorId) {
    throw new Error('Not allowed')
  }

  await this.repository.delete(comment)
}
```

**After (Either pattern):**
```typescript
type Response = Either<string, object>

async execute({ commentId, authorId }: Request): Promise<Response> {
  const comment = await this.repository.findById(commentId)

  if (!comment) {
    return left('Comment not found')
  }

  if (comment.authorId.toString() !== authorId) {
    return left('Not allowed')
  }

  await this.repository.delete(comment)
  return right({})
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case pode falhar por regra de negocio | Retorne `Either<ErrorType, SuccessType>` |
| Use case nao retorna dados no sucesso | Use `Either<ErrorType, object>` com `right({})` |
| Use case retorna entidade no sucesso | Use `Either<ErrorType, { entity: Entity }>` |
| Erro de dominio (not found, not allowed) | `return left(erro)` — nunca throw |
| Erro de infra (banco caiu, rede falhou) | try/catch na camada de infra e ok — Either e para dominio |
| Consumindo resultado de use case em teste | Use `result.isLeft()` e `result.isRight()` para assertions |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error('Not found')` em use case | `return left('Not found')` |
| `Promise<void>` em use case que pode falhar | `Promise<Either<string, object>>` |
| `try { useCase.execute() } catch` no chamador | `const result = useCase.execute(); if (result.isLeft())` |
| `{ success: boolean, data?: T, error?: string }` | `Either<L, R>` com classes Left e Right |
| `new Left(value)` direto | `left(value)` via funcao helper |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
