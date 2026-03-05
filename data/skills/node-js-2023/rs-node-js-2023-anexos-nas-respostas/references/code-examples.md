# Code Examples: Anexos nas Respostas

## AnswerAttachmentList (entidade de lista observada)

```typescript
// src/domain/forum/enterprise/entities/answer-attachment-list.ts
import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

## Entidade Answer atualizada

```typescript
// Dentro da entidade Answer
import { AnswerAttachmentList } from './answer-attachment-list'

// Props
interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

// Getter e Setter
get attachments() {
  return this.props.attachments
}

set attachments(attachments: AnswerAttachmentList) {
  this.props.attachments = attachments
  this.touch()
}

// Create com attachments opcional
static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityID) {
  const answer = new Answer(
    {
      ...props,
      attachments: props.attachments ?? new AnswerAttachmentList([]),
      createdAt: props.createdAt ?? new Date(),
    },
    id,
  )
  return answer
}
```

## Repositório de AnswerAttachments

```typescript
// src/domain/forum/application/repositories/answer-attachments-repository.ts
export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
```

## InMemory implementation

```typescript
// test/repositories/in-memory-answer-attachments-repository.ts
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter((item) => item.answerId.toString() !== answerId)
  }
}
```

## InMemoryAnswersRepository atualizado

```typescript
// O construtor agora recebe o repositório de attachments
export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(index, 1)
    // Deleta attachments associados
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
  // ... outros métodos
}
```

## Factory de testes

```typescript
// test/factories/make-answer-attachment.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return answerAttachment
}
```

## Use case AnswerQuestion atualizado

```typescript
// No execute do AnswerQuestion
const answer = Answer.create({
  authorId: new UniqueEntityID(authorId),
  questionId: new UniqueEntityID(questionId),
  content,
})

const answerAttachments = attachmentsIds.map((attachmentId) => {
  return AnswerAttachment.create({
    attachmentId: new UniqueEntityID(attachmentId),
    answerId: answer.id,
  })
})

answer.attachments = new AnswerAttachmentList(answerAttachments)

await this.answersRepository.create(answer)
```

## Use case EditAnswer atualizado

```typescript
// No execute do EditAnswer
const currentAnswerAttachments =
  await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

const answerAttachments = attachmentsIds.map((attachmentId) => {
  return AnswerAttachment.create({
    attachmentId: new UniqueEntityID(attachmentId),
    answerId: answer.id,
  })
})

answerAttachmentList.update(answerAttachments)

answer.attachments = answerAttachmentList
answer.content = content

await this.answersRepository.save(answer)
```

## Teste do AnswerQuestion com attachments

```typescript
it('should be able to create an answer with attachments', async () => {
  const result = await sut.execute({
    questionId: '1',
    authorId: '1',
    content: 'Nova resposta',
    attachmentsIds: ['1', '2'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
  expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
    expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
    expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
  ])
})
```

## Teste do EditAnswer com attachments

```typescript
it('should be able to edit an answer with new attachments', async () => {
  const newAnswer = makeAnswer()
  await inMemoryAnswersRepository.create(newAnswer)

  inMemoryAnswerAttachmentsRepository.items.push(
    makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID('1') }),
    makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID('2') }),
  )

  await sut.execute({
    answerId: newAnswer.id.toString(),
    authorId: newAnswer.authorId.toString(),
    content: 'Conteúdo editado',
    attachmentsIds: ['1', '3'],
  })

  expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryAnswerAttachmentsRepository.items).toEqual([
    expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
    expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
  ])
})
```

## Teste do DeleteAnswer com attachments

```typescript
it('should delete answer attachments when deleting answer', async () => {
  const newAnswer = makeAnswer()
  await inMemoryAnswersRepository.create(newAnswer)

  inMemoryAnswerAttachmentsRepository.items.push(
    makeAnswerAttachment({ answerId: newAnswer.id }),
    makeAnswerAttachment({ answerId: newAnswer.id }),
  )

  await sut.execute({
    answerId: newAnswer.id.toString(),
    authorId: newAnswer.authorId.toString(),
  })

  expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
})
```