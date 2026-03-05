---
name: rs-node-js-2023-refatorando-casos-de-uso
description: "Applies Either pattern to refactor use case return types for functional error handling in TypeScript/Node.js. Use when user asks to 'refactor use cases', 'add error handling to use cases', 'apply Either pattern', 'implement functional errors', or 'use Left/Right returns'. Enforces consistent Either wrapping across all use cases with proper error type mapping. Make sure to use this skill whenever refactoring error handling in use case layers or applying DDD functional error patterns. Not for HTTP controllers, middleware error handling, or try/catch exception patterns."
---

# Refatorando Casos de Uso com Either

> Ao refatorar use cases, envolva todos os retornos com Either, mapeando cada erro possivel para Left e cada sucesso para Right.

## Rules

1. **Todo use case retorna Either** — `type Response = Either<ErrorType, SuccessType>`, porque padroniza o contrato de retorno e elimina throw/try-catch no dominio
2. **Sucesso sempre via `right()`** — retorne `right(value)` para o caminho feliz, porque o consumidor sabe que Right = sucesso sem inspecionar o tipo
3. **Erro sempre via `left(new ErrorClass())`** — retorne `left(new ResourceNotFoundError())` nos pontos de falha, porque erros viram valores tipados, nao excecoes
4. **Sem erro possivel = `null` no tipo** — `Either<null, SuccessType>` quando o use case nao tem falha previsivel, porque o tipo documenta que nao ha erro
5. **Sem retorno de sucesso = objeto vazio** — `Either<ErrorType, {}>` quando o sucesso nao tem payload, porque o Either precisa de um tipo no lado direito
6. **Um erro por ponto de falha** — cada `return left()` usa a classe de erro semanticamente correta (`ResourceNotFoundError` vs `NotAllowedError`), porque o consumidor diferencia erros pelo tipo

## How to write

### Use case sem erros

```typescript
type ChooseQuestionBestAnswerUseCaseResponse = Either<null, {
  answer: Answer
}>

// No execute():
return right({ answer })
```

### Use case com erros

```typescript
type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

// Nos pontos de falha:
if (!answer) {
  return left(new ResourceNotFoundError())
}

if (answer.authorId.toString() !== authorId) {
  return left(new NotAllowedError())
}

// No sucesso:
return right({})
```

### Use case com erro e retorno

```typescript
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>
```

## Example

**Before (throw-based):**
```typescript
type AnswerQuestionUseCaseResponse = {
  answer: Answer
}

async execute(params): Promise<AnswerQuestionUseCaseResponse> {
  const answer = Answer.create({ ...params })
  await this.answersRepository.create(answer)
  return { answer }
}
```

**After (Either-based):**
```typescript
type AnswerQuestionUseCaseResponse = Either<null, {
  answer: Answer
}>

async execute(params): Promise<AnswerQuestionUseCaseResponse> {
  const answer = Answer.create({ ...params })
  await this.answersRepository.create(answer)
  return right({ answer })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case so cria/salva, sem validacao | `Either<null, { entity }>` com `right()` |
| Use case busca recurso que pode nao existir | `Either<ResourceNotFoundError, { entity }>` com `left()` no not found |
| Use case valida ownership apos busca | `Either<ResourceNotFoundError \| NotAllowedError, ...>` com left especifico |
| Use case deleta sem retorno | `Either<ErrorType, {}>` — objeto vazio no sucesso |
| Muitos use cases com mesmos erros | Copie o type e ajuste — refatoracao manual e segura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error('Not found')` | `return left(new ResourceNotFoundError())` |
| `return null` para erro | `return left(new SpecificError())` |
| `Either<any, any>` | Tipos exatos dos erros e sucesso |
| `right(null)` para sucesso sem payload | `right({})` |
| Mesmo erro generico para falhas diferentes | Erro semantico por ponto de falha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-refatorando-casos-de-uso/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-refatorando-casos-de-uso/references/code-examples.md)
