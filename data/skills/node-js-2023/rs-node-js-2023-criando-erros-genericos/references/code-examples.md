# Code Examples: Criando Erros Genéricos

## 1. Interface UseCaseError

```typescript
// src/core/errors/use-case-error.ts
export interface UseCaseError {
  message: string
}
```

## 2. ResourceNotFoundError

```typescript
// src/domain/use-cases/errors/resource-not-found-error.ts
import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
```

## 3. NotAllowedError

```typescript
// src/domain/use-cases/errors/not-allowed-error.ts
import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
```

## 4. Use case com Either tipado

```typescript
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
```

## 5. Teste com instanceof

```typescript
it('should not be able to delete another user answer comment', async () => {
  const answerComment = makeAnswerComment({
    authorId: new UniqueEntityID('author-1'),
  })

  await inMemoryAnswerCommentsRepository.create(answerComment)

  const result = await sut.execute({
    answerCommentId: answerComment.id.toString(),
    authorId: 'author-2',
  })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(NotAllowedError)
})
```

## 6. Variacao: erro especifico de dominio

```typescript
// Exemplo do instrutor: erro especifico de salao de beleza
export class TimeSlotAlreadyBookedError extends Error implements UseCaseError {
  constructor(date: Date) {
    super(`Time slot at ${date.toISOString()} is already booked`)
  }
}

// No use case:
type BookAppointmentResponse = Either<
  ResourceNotFoundError | TimeSlotAlreadyBookedError,
  { appointment: Appointment }
>
```