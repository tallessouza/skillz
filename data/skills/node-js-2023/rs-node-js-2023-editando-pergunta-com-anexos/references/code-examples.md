# Code Examples: Editando Pergunta com Anexos via WatchedList

## 1. Criando a QuestionAttachmentList

```typescript
// src/domain/forum/enterprise/entities/question-attachment-list.ts
import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from './question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

## 2. Atualizando a entidade Question

```typescript
// ANTES — array simples
interface QuestionProps {
  attachments: QuestionAttachment[]
}

// DEPOIS — WatchedList
interface QuestionProps {
  attachments: QuestionAttachmentList
}

// Na classe Question:
get attachments() {
  return this.props.attachments
}

set attachments(attachments: QuestionAttachmentList) {
  this.props.attachments = attachments
}

// No static create:
static create(props: Optional<QuestionProps, 'createdAt' | 'attachments'>) {
  return new Question({
    ...props,
    attachments: props.attachments ?? new QuestionAttachmentList([]),
    createdAt: props.createdAt ?? new Date(),
  })
}
```

## 3. Criando o QuestionAttachmentsRepository

```typescript
// src/domain/forum/application/repositories/question-attachments-repository.ts
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
}
```

## 4. Atualizando o CreateQuestion use case

```typescript
// ANTES
const questionAttachments = attachmentIds.map(attachmentId =>
  QuestionAttachment.create({
    questionId: question.id,
    attachmentId: new UniqueEntityID(attachmentId),
  })
)
question.attachments = questionAttachments // array direto

// DEPOIS
const questionAttachments = attachmentIds.map(attachmentId =>
  QuestionAttachment.create({
    questionId: question.id,
    attachmentId: new UniqueEntityID(attachmentId),
  })
)
question.attachments = new QuestionAttachmentList(questionAttachments)
```

## 5. EditQuestion use case completo

```typescript
interface EditQuestionRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentIds: string[]
}

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({ questionId, authorId, title, content, attachmentIds }: EditQuestionRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed')
    }

    // Buscar anexos atuais da pergunta (nao vem no findById)
    const currentQuestionAttachments = await this.questionAttachmentsRepository
      .findManyByQuestionId(questionId)

    // Criar WatchedList com estado atual
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

    // Criar novos anexos a partir dos IDs recebidos
    const questionAttachments = attachmentIds.map(attachmentId =>
      QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(attachmentId),
      })
    )

    // Update detecta added e removed
    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)
  }
}
```

## 6. Corrigindo testes apos adotar WatchedList

```typescript
// ANTES — acessava array direto
expect(question.attachments).toHaveLength(2)

// DEPOIS — precisa de .currentItems
expect(question.attachments.currentItems).toHaveLength(2)
```

## 7. Variacao: outras entidades com WatchedList

O mesmo padrao se aplica para qualquer relacao 1:N editavel:

```typescript
// AnswerAttachmentList
export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}

// OrderItemList
export class OrderItemList extends WatchedList<OrderItem> {
  compareItems(a: OrderItem, b: OrderItem): boolean {
    return a.productId.equals(b.productId)
  }
}
```