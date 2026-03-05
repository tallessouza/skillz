# Code Examples: Refatorando Casos de Uso com Either

## Exemplo 1: Use case sem erro (AnswerQuestion)

```typescript
// ANTES
type AnswerQuestionUseCaseResponse = {
  answer: Answer
}

async execute(params): Promise<AnswerQuestionUseCaseResponse> {
  const answer = Answer.create({
    instructorId: new UniqueEntityID(params.instructorId),
    questionId: new UniqueEntityID(params.questionId),
    content: params.content,
    attachments: params.attachments,
  })

  await this.answersRepository.create(answer)

  return { answer }
}

// DEPOIS
type AnswerQuestionUseCaseResponse = Either<null, {
  answer: Answer
}>

async execute(params): Promise<AnswerQuestionUseCaseResponse> {
  const answer = Answer.create({
    instructorId: new UniqueEntityID(params.instructorId),
    questionId: new UniqueEntityID(params.questionId),
    content: params.content,
    attachments: params.attachments,
  })

  await this.answersRepository.create(answer)

  return right({ answer })
}
```

## Exemplo 2: Use case com ResourceNotFound e NotAllowed (DeleteAnswer)

```typescript
// ANTES
async execute({ answerId, authorId }): Promise<void> {
  const answer = await this.answersRepository.findById(answerId)

  if (!answer) {
    throw new Error('Answer not found.')
  }

  if (answer.authorId.toString() !== authorId) {
    throw new Error('Not allowed.')
  }

  await this.answersRepository.delete(answer)
}

// DEPOIS
type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

async execute({ answerId, authorId }): Promise<DeleteAnswerUseCaseResponse> {
  const answer = await this.answersRepository.findById(answerId)

  if (!answer) {
    return left(new ResourceNotFoundError())
  }

  if (answer.authorId.toString() !== authorId) {
    return left(new NotAllowedError())
  }

  await this.answersRepository.delete(answer)

  return right({})
}
```

## Exemplo 3: Use case com erro e retorno (EditAnswer)

```typescript
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>

async execute({ answerId, authorId, content }): Promise<EditAnswerUseCaseResponse> {
  const answer = await this.answersRepository.findById(answerId)

  if (!answer) {
    return left(new ResourceNotFoundError())
  }

  if (answer.authorId.toString() !== authorId) {
    return left(new NotAllowedError())
  }

  answer.content = content

  await this.answersRepository.save(answer)

  return right({ answer })
}
```

## Exemplo 4: Use case de leitura com possivel not found (GetQuestionBySlug)

```typescript
type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>

async execute({ slug }): Promise<GetQuestionBySlugUseCaseResponse> {
  const question = await this.questionsRepository.findBySlug(slug)

  if (!question) {
    return left(new ResourceNotFoundError())
  }

  return right({ question })
}
```

## Exemplo 5: Use case de listagem sem erro (FetchAnswerComments)

```typescript
type FetchAnswerCommentsUseCaseResponse = Either<null, {
  answerComments: AnswerComment[]
}>

async execute({ answerId, page }): Promise<FetchAnswerCommentsUseCaseResponse> {
  const answerComments = await this.answerCommentsRepository.findManyByAnswerId(
    answerId,
    { page },
  )

  return right({ answerComments })
}
```

## Padrao de refatoracao repetido

Para cada use case, o processo e:

1. Definir o type `Response = Either<ErroOuNull, Sucesso>`
2. Substituir cada `throw new Error(...)` por `return left(new ErrorClass())`
3. Substituir o `return { value }` final por `return right({ value })`
4. Ajustar imports: `Either`, `left`, `right`, classes de erro