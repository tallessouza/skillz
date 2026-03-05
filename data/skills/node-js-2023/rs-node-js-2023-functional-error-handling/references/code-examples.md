# Code Examples: Functional Error Handling

## Estrutura completa do Either (core/either.ts)

```typescript
// Left representa erro — o fluxo "volta pra esquerda"
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

// Right representa sucesso — o fluxo "continua pra direita"
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

// Either = um ou outro
export type Either<L, R> = Left<L, R> | Right<L, R>

// Funcoes helper para criar instancias com inferencia automatica
export const left = <L, R = never>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <R, L = never>(value: R): Either<L, R> => {
  return new Right(value)
}
```

## Use case completo: DeleteAnswerComment

### Antes (com throw):
```typescript
interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<void> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer comment not found.')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
```

### Depois (com Either):
```typescript
interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<string, object>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left('Answer comment not found.')
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left('Not allowed.')
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
```

## Consumindo Either em testes

```typescript
it('should not be able to delete a comment from another author', async () => {
  const result = await sut.execute({
    answerCommentId: 'comment-1',
    authorId: 'different-author',
  })

  // Verifica que retornou erro (Left)
  expect(result.isLeft()).toBe(true)

  // Acessa o motivo do erro
  if (result.isLeft()) {
    expect(result.value).toEqual('Not allowed.')
  }
})

it('should delete an answer comment', async () => {
  const result = await sut.execute({
    answerCommentId: 'comment-1',
    authorId: 'author-1',
  })

  // Verifica que retornou sucesso (Right)
  expect(result.isRight()).toBe(true)
})
```

## Use case que retorna dados no sucesso

```typescript
type GetQuestionBySlugResponse = Either<string, { question: Question }>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Request): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left('Question not found.')
    }

    return right({ question })
  }
}
```

## Variacoes de tipo de erro

```typescript
// Erro como string simples
type Response = Either<string, { user: User }>

// Erro como classe de erro customizada (evolucao natural)
type Response = Either<ResourceNotFoundError, { user: User }>

// Multiplos tipos de erro via union
type Response = Either<ResourceNotFoundError | NotAllowedError, { user: User }>
```