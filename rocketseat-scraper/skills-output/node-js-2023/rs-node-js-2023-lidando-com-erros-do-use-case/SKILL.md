---
name: rs-node-2023-erros-use-case
description: "Enforces custom error class pattern for use case error handling in Node.js/TypeScript APIs. Use when user asks to 'handle errors', 'create error handling', 'throw errors in use case', 'return different status codes', or builds controllers with try/catch. Applies pattern: one class per error type extending native Error, instanceof checks in controller for specific status codes. Make sure to use this skill whenever creating use cases, services, or controllers that need error differentiation. Not for global error middleware, validation libraries, or logging configuration."
---

# Erros Personalizados em Use Cases

> Cada tipo de erro do use case deve ser uma classe propria que estende Error, permitindo tratamento especifico no controller.

## Rules

1. **Crie uma classe por tipo de erro** — `UserAlreadyExistsError`, `ResourceNotFoundError`, porque permite `instanceof` no controller para retornar status codes diferentes
2. **Estenda a classe Error nativa** — `extends Error` com `super(message)` no constructor, porque mantém compatibilidade com stack traces e catch padrão
3. **Sufixo Error no nome da classe** — `UserAlreadyExistsError` nao `UserAlreadyExists`, porque deixa explicito que é um erro ao ler o código
4. **Use instanceof no controller, nao message string** — `if (err instanceof UserAlreadyExistsError)` nao `if (err.message === '...')`, porque strings quebram silenciosamente com refactor
5. **Organize erros em pasta dedicada** — `src/use-cases/errors/`, porque centraliza e facilita reutilizacao entre use cases
6. **Use case faz throw, controller faz catch** — separacao clara de responsabilidades, porque o use case nao conhece HTTP

## How to write

### Classe de erro personalizada

```typescript
// src/use-cases/errors/user-already-exists-error.ts
export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
```

### Throw no use case

```typescript
// Dentro do use case, lance o erro tipado
const userWithSameEmail = await this.usersRepository.findByEmail(email)

if (userWithSameEmail) {
  throw new UserAlreadyExistsError()
}
```

### Catch no controller com instanceof

```typescript
try {
  await registerUseCase.execute({ name, email, password })
} catch (err) {
  if (err instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: err.message })
  }

  // TODO: tratar outros erros conhecidos aqui

  throw err // erros inesperados sobem para error handler global
}
```

## Example

**Before (erro generico):**
```typescript
// use case
if (userWithSameEmail) {
  throw new Error('E-mail already exists.')
}

// controller — trata tudo igual
catch (err) {
  return reply.status(409).send()
}
```

**After (erro tipado):**
```typescript
// use case
if (userWithSameEmail) {
  throw new UserAlreadyExistsError()
}

// controller — tratamento por tipo
catch (err) {
  if (err instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: err.message })
  }
  throw err
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case tem uma unica validacao | Ainda crie classe de erro dedicada — novos erros virao |
| Multiplos use cases lancam mesmo erro | Reutilize a mesma classe de erro da pasta errors/ |
| Erro nao tem status HTTP obvio | Defina status no controller, nunca na classe de erro |
| Erro inesperado no catch | Re-throw para error handler global (status 500) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error('email exists')` | `throw new UserAlreadyExistsError()` |
| `if (err.message === 'email exists')` | `if (err instanceof UserAlreadyExistsError)` |
| `catch (err) { return reply.status(409) }` para todos | `instanceof` check por tipo de erro |
| Status HTTP dentro da classe de erro | Status HTTP apenas no controller |
| Erro generico com código: `new Error('409:exists')` | Classe tipada + instanceof |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
