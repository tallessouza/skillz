# Code Examples: Aggregates & Watched Lists

## 1. Classe base WatchedList

A Watched List e generica — funciona com qualquer tipo de entidade.

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

  getItems(): T[] {
    return this.currentItems
  }

  getNewItems(): T[] {
    return this.new
  }

  getRemovedItems(): T[] {
    return this.removed
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.some((v) => this.compareItems(item, v))
  }

  private isNewItem(item: T): boolean {
    return this.new.some((v) => this.compareItems(item, v))
  }

  private isRemovedItem(item: T): boolean {
    return this.removed.some((v) => this.compareItems(item, v))
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  private wasAddedInitially(item: T): boolean {
    return this.initial.some((v) => this.compareItems(item, v))
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

  public update(updated: WatchedList<T>): void {
    const newItems = updated.getItems()
    const removedItems = this.currentItems.filter(
      (current) => !newItems.some((n) => this.compareItems(current, n)),
    )
    const addedItems = newItems.filter(
      (n) => !this.currentItems.some((current) => this.compareItems(current, n)),
    )

    this.currentItems = newItems
    this.new = addedItems
    this.removed = removedItems
  }
}
```

## 2. Implementacao concreta: QuestionAttachmentList

```typescript
export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

## 3. Aggregate Root base

```typescript
export abstract class AggregateRoot<Props> extends Entity<Props> {
  // Agregados podem disparar domain events
  // Entidades simples NAO podem
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }
}
```

## 4. Question como Aggregate Root

```typescript
interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityID
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() { return this.props.title }
  get content() { return this.props.content }
  get attachments() { return this.props.attachments }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Partial<QuestionProps>, id?: UniqueEntityID) {
    return new Question(
      {
        ...props,
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
```

## 5. Repository usando Watched List na persistencia

```typescript
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaClient,
    private attachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async save(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: { id: question.id.toString() },
      data: PrismaQuestionMapper.toPrisma(question),
    })

    // Watched List em acao: operacoes cirurgicas
    await this.attachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )
    await this.attachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )
  }

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    // Na criacao, todos os attachments sao "novos"
    await this.attachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }
}
```

## 6. Fluxo completo: editando uma pergunta

```typescript
// Use case de edicao
async execute({ questionId, title, content, attachmentIds }: EditQuestionRequest) {
  const question = await this.questionsRepository.findById(questionId)

  question.title = title
  question.content = content

  // Cria nova lista com os attachments que vieram na edicao
  const currentAttachments = await this.attachmentsRepository
    .findManyByQuestionId(questionId)

  const questionAttachmentList = new QuestionAttachmentList(currentAttachments)

  // Atualiza a watched list — ela calcula o diff automaticamente
  questionAttachmentList.update(
    new QuestionAttachmentList(
      attachmentIds.map((id) =>
        QuestionAttachment.create({ attachmentId: new UniqueEntityID(id), questionId: question.id })
      ),
    ),
  )

  question.attachments = questionAttachmentList

  // O repository sabe exatamente o que criar e o que deletar
  await this.questionsRepository.save(question)
}
```

## 7. Comparacao: com e sem Watched List

### Sem Watched List (ingenuo)

```typescript
// Edicao: 2 operacoes sempre, mesmo se nada mudou
await db.attachment.deleteMany({ where: { questionId } })  // DELETE ALL
await db.attachment.createMany({ data: newAttachments })    // INSERT ALL

// Problema: se tinha 100 anexos e usuario so removeu 1,
// voce fez 101 operacoes em vez de 1
```

### Com Watched List (eficiente)

```typescript
// Edicao: apenas as operacoes necessarias
const newItems = question.attachments.getNewItems()       // ex: 0 itens
const removedItems = question.attachments.getRemovedItems() // ex: 1 item

await db.attachment.createMany({ data: newItems })     // 0 operacoes
await db.attachment.deleteMany({ data: removedItems }) // 1 operacao

// Total: 1 operacao em vez de 101
```