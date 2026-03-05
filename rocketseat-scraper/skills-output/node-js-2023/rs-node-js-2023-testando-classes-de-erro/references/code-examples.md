# Code Examples: Testando Classes de Erro

## Exemplo 1: Teste basico de Right e Left

```typescript
// src/core/either.spec.ts

import { left, right } from './either'

it('success result', () => {
  const success = right('success')

  expect(success.value).toEqual('success')
})

it('error result', () => {
  const error = left('error')

  expect(error.value).toEqual('error')
})
```

## Exemplo 2: Funcao que retorna Either

```typescript
import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

it('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
  expect(result.value).toEqual(10)
})

it('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
  expect(result.value).toEqual('error')
})
```

## Exemplo 3: Classes Left e Right com type narrowing

```typescript
// src/core/either.ts

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

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export function left<L, R>(value: L): Either<L, R> {
  return new Left(value)
}

export function right<L, R>(value: R): Either<L, R> {
  return new Right(value)
}
```

## Exemplo 4: Narrowing em acao

```typescript
// Demonstracao do narrowing automatico

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }
  return left('error')
}

const result = doSomething(true)

// SEM narrowing — value e string | number
console.log(result.value) // tipo: string | number

// COM narrowing via isRight()
if (result.isRight()) {
  console.log(result.value)        // tipo: number
  console.log(result.value.toFixed(2)) // metodos de number disponiveis
}

// COM narrowing via isLeft()
if (result.isLeft()) {
  console.log(result.value)            // tipo: string
  console.log(result.value.toUpperCase()) // metodos de string disponiveis
}
```

## Exemplo 5: Uso em use case real

```typescript
// Aplicacao pratica em um use case

class DeleteAnswerCommentUseCase {
  async execute(input: DeleteAnswerCommentInput): Promise<Either<NotAllowedError, null>> {
    const comment = await this.repository.findById(input.commentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    if (comment.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError())
    }

    await this.repository.delete(comment)

    return right(null)
  }
}

// No teste:
it('should delete an answer comment', async () => {
  const result = await sut.execute({
    commentId: 'comment-1',
    authorId: 'author-1',
  })

  expect(result.isRight()).toBe(true)
})

it('should not allow deleting another user comment', async () => {
  const result = await sut.execute({
    commentId: 'comment-1',
    authorId: 'wrong-author',
  })

  expect(result.isLeft()).toBe(true)
})
```