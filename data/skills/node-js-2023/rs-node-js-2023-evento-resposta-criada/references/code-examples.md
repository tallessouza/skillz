# Code Examples: Domain Events — Evento de Resposta Criada

## Estrutura de pastas

```
src/domain/forum/enterprise/
├── entities/
│   ├── answer.ts          # Aggregate que dispara eventos
│   └── ...
└── events/
    └── answer-created-event.ts  # Classe do evento
```

## Interface DomainEvent (base)

```typescript
import { UniqueEntityID } from '../entities/unique-entity-id'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}
```

## AnswerCreatedEvent (implementacao completa)

```typescript
import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
```

## Answer transformada em Aggregate

```typescript
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerCreatedEvent } from '../events/answer-created-event'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachmentList
  createdAt?: Date
  updatedAt?: Date
}

// ANTES: extends Entity<AnswerProps>
// DEPOIS: extends AggregateRoot<AnswerProps>
export class Answer extends AggregateRoot<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  // Factory method com disparo condicional de evento
  static create(props: AnswerProps, id?: UniqueEntityID) {
    const answer = new Answer(props, id)

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
```

## Padrao aplicado a outras entidades

O mesmo padrao se aplica a qualquer entidade que precise emitir eventos:

### QuestionCreatedEvent (analogia)

```typescript
export class QuestionCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public question: Question

  constructor(question: Question) {
    this.question = question
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
```

### Question com disparo condicional

```typescript
export class Question extends AggregateRoot<QuestionProps> {
  static create(props: QuestionProps, id?: UniqueEntityID) {
    const question = new Question(props, id)

    const isNewQuestion = !id

    if (isNewQuestion) {
      question.addDomainEvent(new QuestionCreatedEvent(question))
    }

    return question
  }
}
```

## Teste opcional (mencionado pelo instrutor)

```typescript
import { makeAnswer } from 'test/factories/make-answer'

describe('Answer', () => {
  it('should add AnswerCreatedEvent when creating a new answer', () => {
    const answer = makeAnswer() // sem id = entidade nova

    expect(answer.domainEvents).toHaveLength(1)
    expect(answer.domainEvents[0]).toBeInstanceOf(AnswerCreatedEvent)
  })

  it('should NOT add AnswerCreatedEvent when reconstituting an answer', () => {
    const answer = makeAnswer({}, new UniqueEntityID('existing-id'))

    expect(answer.domainEvents).toHaveLength(0)
  })
})
```