# Code Examples: Refatorando Testes Unitarios

## Exemplo 1: Answer Question (sucesso)

### Antes
```typescript
it('should be able to answer a question', async () => {
  const { answer } = await sut.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(answer.id).toBeTruthy()
})
```

### Depois
```typescript
it('should be able to answer a question', async () => {
  const result = await sut.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
})
```

## Exemplo 2: Delete/Edit com erro de autorizacao

### Antes
```typescript
it('should not allow deleting from another author', async () => {
  await expect(() =>
    sut.execute({
      authorId: 'wrong-author',
      answerId: 'answer-1',
    })
  ).rejects.toBeInstanceOf(NotAllowedError)
})
```

### Depois
```typescript
it('should not allow deleting from another author', async () => {
  const result = await sut.execute({
    authorId: 'wrong-author',
    answerId: 'answer-1',
  })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(NotAllowedError)
})
```

## Exemplo 3: Create Question (sucesso)

```typescript
it('should create a question', async () => {
  const result = await sut.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteudo da pergunta',
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
})
```

## Exemplo 4: Fetch/Get use cases

### Antes
```typescript
it('should fetch answer comments', async () => {
  const { answerComments } = await sut.execute({
    answerId: 'answer-1',
    page: 1,
  })

  expect(answerComments).toHaveLength(3)
})
```

### Depois
```typescript
it('should fetch answer comments', async () => {
  const result = await sut.execute({
    answerId: 'answer-1',
    page: 1,
  })

  expect(result.isRight()).toBe(true)
  expect(result.value?.answerComments).toHaveLength(3)
})
```

## Exemplo 5: Get by slug

```typescript
it('should get question by slug', async () => {
  const result = await sut.execute({
    slug: 'example-question',
  })

  expect(result.isRight()).toBe(true)
  expect(result.value?.question.slug.value).toEqual('example-question')
})
```

## Padrao reutilizavel para erros

```typescript
// Copie este par para qualquer teste de erro com Either
expect(result.isLeft()).toBe(true)
expect(result.value).toBeInstanceOf(SpecificErrorClass)
```