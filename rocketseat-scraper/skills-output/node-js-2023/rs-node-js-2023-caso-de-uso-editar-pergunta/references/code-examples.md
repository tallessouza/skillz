# Code Examples: Caso de Uso Editar Pergunta

## Exemplo completo do caso de uso

```typescript
// src/domain/forum/application/use-cases/edit-question.ts

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
  }: EditQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
  }
}
```

## Interface do repositorio atualizada

```typescript
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>
}
```

## Repositorio in-memory com save

```typescript
// src/test/repositories/in-memory-questions-repository.ts

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)
    return question ?? null
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
  }
}
```

## Teste completo

```typescript
// src/domain/forum/application/use-cases/edit-question.spec.ts

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta test',
      content: 'Conteudo test',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Pergunta test',
      content: 'Conteudo test',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        questionId: newQuestion.id.toValue(),
        authorId: 'author-2',
        title: 'Pergunta test',
        content: 'Conteudo test',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
```

## Padrao de evolucao: Delete → Edit

Comparacao lado a lado mostrando como o Edit evolui do Delete:

```typescript
// DELETE — remove a entidade
async execute({ authorId, questionId }) {
  const question = await this.questionsRepository.findById(questionId)
  if (!question) throw new Error('Question not found.')
  if (question.authorId.toString() !== authorId) throw new Error('Not allowed.')
  await this.questionsRepository.delete(question)  // remove
}

// EDIT — modifica e salva a entidade
async execute({ authorId, questionId, title, content }) {
  const question = await this.questionsRepository.findById(questionId)
  if (!question) throw new Error('Question not found.')
  if (question.authorId.toString() !== authorId) throw new Error('Not allowed.')
  question.title = title      // modifica
  question.content = content   // modifica
  await this.questionsRepository.save(question)  // salva (nao cria)
}
```

A estrutura e identica ate a validacao. A diferenca esta na acao final: delete remove, edit modifica campos e salva.