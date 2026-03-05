# Code Examples: Pattern WatchedList

## Implementacao completa da WatchedList

```typescript
export abstract class WatchedList<T> {
  public currentItems: T[]
  private initial: T[]
  private new: T[]
  private removed: T[]

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || []
    this.initial = initialItems || []
    this.new = []
    this.removed = []
  }

  abstract compareItems(a: T, b: T): boolean

  public getItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.new
  }

  public getRemovedItems(): T[] {
    return this.removed
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  private isRemovedItem(item: T): boolean {
    return this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter((v) => !this.compareItems(item, v))
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  private wasAddedInitially(item: T): boolean {
    return this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }
    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item)
    }
    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item)
    if (this.isNewItem(item)) {
      this.removeFromNew(item)
      return
    }
    if (!this.isRemovedItem(item)) {
      this.removed.push(item)
    }
  }

  public update(items: T[]): void {
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })
    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })
    this.currentItems = items
    this.new = newItems
    this.removed = removedItems
  }
}
```

## Testes unitarios da aula

```typescript
class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])
    expect(list.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.update([1, 3, 5])

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
```

## Exemplo real: QuestionAttachmentList

```typescript
// domain/forum/enterprise/entities/question-attachment-list.ts
import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from './question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

## Exemplo real: Uso no use case de edicao

```typescript
// domain/forum/application/use-cases/edit-question.ts
async execute({ questionId, attachmentIds, title, content }: EditQuestionRequest) {
  const question = await this.questionsRepository.findById(questionId)

  if (!question) {
    throw new Error('Question not found.')
  }

  // Buscar anexos atuais do banco
  const currentAttachments = await this.attachmentsRepository.findManyByQuestionId(questionId)

  // Criar WatchedList com os anexos atuais
  const questionAttachmentList = new QuestionAttachmentList(currentAttachments)

  // Criar os novos anexos a partir dos IDs do frontend
  const questionAttachments = attachmentIds.map((attachmentId) =>
    QuestionAttachment.create({
      attachmentId: new UniqueEntityID(attachmentId),
      questionId: question.id,
    }),
  )

  // O update() calcula automaticamente new e removed
  questionAttachmentList.update(questionAttachments)

  question.title = title
  question.content = content
  question.attachments = questionAttachmentList

  await this.questionsRepository.save(question)
}
```

## Exemplo real: Persistencia no repositorio

```typescript
// infra/database/prisma/repositories/prisma-questions-repository.ts
async save(question: Question): Promise<void> {
  const data = PrismaQuestionMapper.toPrisma(question)

  await Promise.all([
    this.prisma.question.update({
      where: { id: question.id.toString() },
      data,
    }),
    // Apenas cria os novos
    this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    ),
    // Apenas deleta os removidos
    this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    ),
  ])
}
```