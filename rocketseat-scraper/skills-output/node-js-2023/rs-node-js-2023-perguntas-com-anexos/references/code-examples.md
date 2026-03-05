# Code Examples: Persistencia de Agregados com Colecoes Filhas

## 1. Adicionando metodos ao repositorio abstrato

```typescript
// question-attachments-repository.ts
export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  
  // Novos metodos para suportar persistencia de agregados
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
}
```

## 2. Implementacao no repositorio em memoria

```typescript
// in-memory-question-attachments-repository.ts
async createMany(attachments: QuestionAttachment[]) {
  this.items.push(...attachments)
}

async deleteMany(attachments: QuestionAttachment[]) {
  this.items = this.items.filter((item) => {
    return !attachments.some((attachment) => attachment.equals(item))
  })
}
```

## 3. Repositorio de Questions atualizado

```typescript
// in-memory-questions-repository.ts
async create(question: Question) {
  this.items.push(question)

  await this.questionAttachmentsRepository.createMany(
    question.attachments.getItems(),
  )
}

async save(question: Question) {
  const index = this.items.findIndex((item) => item.id.equals(question.id))
  this.items[index] = question

  await this.questionAttachmentsRepository.createMany(
    question.attachments.getNewItems(),
  )
  await this.questionAttachmentsRepository.deleteMany(
    question.attachments.getRemovedItems(),
  )
}
```

## 4. Teste: persistir anexos ao criar pergunta

```typescript
it('should persist attachments when creating a new question', async () => {
  const result = await sut.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteudo da pergunta',
    attachmentsIds: ['1', '2'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2'),
      }),
    ]),
  )
})
```

## 5. Teste: sincronizar anexos ao editar pergunta

```typescript
it('should sync new and removed attachments when editing a question', async () => {
  // Cria pergunta com attachments 1 e 2
  const question = makeQuestion()
  inMemoryQuestionsRepository.create(question)
  
  inMemoryQuestionAttachmentsRepository.items.push(
    makeQuestionAttachment({ questionId: question.id, attachmentId: new UniqueEntityID('1') }),
    makeQuestionAttachment({ questionId: question.id, attachmentId: new UniqueEntityID('2') }),
  )

  // Edita pergunta com attachments 1 e 3 (removeu 2, adicionou 3)
  const result = await sut.execute({
    questionId: question.id.toValue(),
    authorId: question.authorId.toValue(),
    title: 'Pergunta editada',
    content: 'Conteudo editado',
    attachmentsIds: ['1', '3'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ]),
  )
})
```