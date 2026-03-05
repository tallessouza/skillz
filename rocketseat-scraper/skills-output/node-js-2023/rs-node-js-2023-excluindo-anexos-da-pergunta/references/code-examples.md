# Code Examples: Cascade Delete via Repository Dependency Injection

## Exemplo completo do teste

```typescript
// delete-question.spec.ts
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
  )
  sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
})

it('should delete a question and its attachments', async () => {
  const newQuestion = makeQuestion()
  await inMemoryQuestionsRepository.create(newQuestion)

  // Cria anexos associados a pergunta
  inMemoryQuestionAttachmentsRepository.items.push(
    makeQuestionAttachment({ questionId: newQuestion.id }),
    makeQuestionAttachment({ questionId: newQuestion.id }),
  )

  await sut.execute({
    questionId: newQuestion.id.toString(),
    authorId: newQuestion.authorId.toString(),
  })

  // Verifica que pergunta foi deletada
  expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  // Verifica que anexos tambem foram deletados
  expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
})
```

## InMemoryQuestionAttachmentsRepository completo

```typescript
export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
    this.items = questionAttachments
  }
}
```

## InMemoryQuestionsRepository com dependencia injetada

```typescript
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)
    return question ?? null
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)
    // Cascade delete dos anexos
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
```

## Interface do repositorio (contrato)

```typescript
export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
```

## Atualizando outros arquivos de teste

Todos os testes que usam `InMemoryQuestionsRepository` precisam ser atualizados:

```typescript
// edit-question.spec.ts (e qualquer outro)
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

beforeEach(() => {
  inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
  )
  // ... resto do setup
})
```

## Pattern generico (aplicavel a qualquer agregado)

```typescript
// Para qualquer aggregate root com entidades filhas:
export class InMemoryParentRepository implements ParentRepository {
  constructor(
    private childRepository: ChildRepository,
  ) {}

  async delete(parent: Parent) {
    // Remove o pai
    const index = this.items.findIndex((item) => item.id === parent.id)
    this.items.splice(index, 1)
    // Cascade: remove filhos
    this.childRepository.deleteManyByParentId(parent.id.toString())
  }
}
```