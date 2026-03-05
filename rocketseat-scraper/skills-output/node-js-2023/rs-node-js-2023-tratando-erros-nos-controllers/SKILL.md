---
name: rs-node-js-2023-erros-controllers
description: "Enforces proper error handling in NestJS controllers using typed errors from use cases. Use when user asks to 'handle errors in controller', 'return proper status codes', 'map domain errors to HTTP', or 'treat errors in NestJS'. Applies switch on error.constructor pattern, maps domain errors to specific HTTP exceptions (ConflictException, UnauthorizedException, BadRequestException). Make sure to use this skill whenever creating or modifying NestJS controllers that consume use cases returning Either/Result types. Not for domain layer error creation, middleware error handling, or global exception filters."
---

# Tratando Erros nos Controllers NestJS

> Mapear cada erro de dominio para a excecao HTTP correta usando switch no constructor do erro.

## Rules

1. **Nunca lance erro generico no controller** — use `switch (error.constructor)` para mapear cada erro de dominio a uma excecao HTTP especifica, porque erros genericos impedem o front-end de reagir adequadamente
2. **Use as excecoes do NestJS** — `UnauthorizedException` (401), `ConflictException` (409), `BadRequestException` (400), porque cada uma gera o status code HTTP correto automaticamente
3. **Default para BadRequestException** — no `default` do switch, lance `BadRequestException`, porque e um erro esperado mas nao mapeado especificamente
4. **Erros nao esperados viram 500 automaticamente** — se o erro nao bate no `result.isLeft()`, o NestJS retorna `InternalServerError` sem intervencao manual
5. **Passe a mensagem do erro de dominio** — `new ConflictException(error.message)` preserva a mensagem descritiva da classe de erro do dominio
6. **Controllers sem erros esperados usam BadRequest direto** — se o use case nao retorna erros tipados, use `if (result.isLeft()) throw new BadRequestException()`

## How to write

### Pattern: switch no error.constructor

```typescript
const result = await this.useCase.execute({ ... })

if (result.isLeft()) {
  const error = result.value

  switch (error.constructor) {
    case SpecificDomainError:
      throw new MatchingHttpException(error.message)
    default:
      throw new BadRequestException(error.message)
  }
}
```

### Mapeamento de erros comuns

```typescript
// Credenciais invalidas → 401
case WrongCredentialsError:
  throw new UnauthorizedException(error.message)

// Recurso ja existe → 409
case StudentAlreadyExistsError:
  throw new ConflictException(error.message)

// Recurso nao encontrado → 404 (extrapolacao do pattern)
case ResourceNotFoundError:
  throw new NotFoundException(error.message)
```

### Controller sem erros tipados

```typescript
const result = await this.useCase.execute({ ... })

if (result.isLeft()) {
  throw new BadRequestException()
}
```

## Example

**Before (erro generico):**
```typescript
const result = await this.authenticateStudent.execute({ email, password })

if (result.isLeft()) {
  throw new Error('Something went wrong')
}
```

**After (erro mapeado):**
```typescript
const result = await this.authenticateStudent.execute({ email, password })

if (result.isLeft()) {
  const error = result.value

  switch (error.constructor) {
    case WrongCredentialsError:
      throw new UnauthorizedException(error.message)
    default:
      throw new BadRequestException(error.message)
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case retorna erros tipados | switch no error.constructor com mapeamento |
| Use case nao tem erros esperados | if isLeft → BadRequestException simples |
| Erro de autenticacao/credenciais | UnauthorizedException (401) |
| Conflito de unicidade (email, slug) | ConflictException (409) |
| Recurso nao encontrado | NotFoundException (404) |
| Erro nao mapeado no switch | default → BadRequestException (400) |
| Erro totalmente inesperado | Deixe o NestJS retornar 500 automaticamente |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `throw new Error('...')` no controller | `throw new ConflictException(error.message)` |
| `res.status(409).json(...)` manual | `throw new ConflictException(...)` (NestJS cuida) |
| `if (result.isLeft()) throw new BadRequestException()` quando ha erros tipados | `switch (error.constructor)` com cada caso |
| `try/catch` generico no controller | `result.isLeft()` + switch pattern |
| Status code hardcoded no response | Excecoes do `@nestjs/common` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
