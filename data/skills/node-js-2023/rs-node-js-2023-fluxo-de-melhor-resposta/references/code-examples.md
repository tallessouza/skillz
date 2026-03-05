# Code Examples: Fluxo de Domain Events — Best Answer Chosen

## 1. Classe de Evento Completa

```typescript
// src/domain/forum/enterprise/events/question-best-answer-chosen-event.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
```

## 2. Setter no Aggregate com Guards

```typescript
// Dentro de Question entity
set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
  if (bestAnswerId === undefined) {
    return
  }

  if (
    this.props.bestAnswerId !== undefined &&
    !this.props.bestAnswerId.equals(bestAnswerId)
  ) {
    this.addDomainEvent(
      new QuestionBestAnswerChosenEvent(this, bestAnswerId),
    )
  }

  this.props.bestAnswerId = bestAnswerId
}
```

## 3. Subscriber Completo

```typescript
// src/domain/notification/application/subscribers/on-question-best-answer-chosen.ts
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification(
    event: QuestionBestAnswerChosenEvent,
  ) {
    const answer = await this.answersRepository.findById(
      event.bestAnswerId.toString(),
    )

    if (!answer) {
      return
    }

    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: 'Sua resposta foi escolhida!',
      content: `A resposta que voce enviou em "${event.question.title.substring(0, 20)}" foi escolhida pelo autor.`,
    })
  }
}
```

## 4. InMemoryQuestionsRepository — Dispatch de Eventos

```typescript
// test/repositories/in-memory-questions-repository.ts
async create(question: Question) {
  this.items.push(question)
  DomainEvents.dispatchEventsForAggregate(question.id)
}

async save(question: Question) {
  const itemIndex = this.items.findIndex((item) => item.id.equals(question.id))
  this.items[itemIndex] = question
  DomainEvents.dispatchEventsForAggregate(question.id)
}
```

## 5. Teste Unitario

```typescript
// src/domain/notification/application/subscribers/on-question-best-answer-chosen.spec.ts
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(inMemoryNotificationsRepository)

    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification)
  })

  it('should send a notification when topic has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    // Atribui best answer — isso registra o domain event
    question.bestAnswerId = answer.id

    // Save dispara DomainEvents.dispatchEventsForAggregate
    await inMemoryQuestionsRepository.save(question)

    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
```

## 6. Evolucao do Bug — Comparacao por Referencia vs Valor

```typescript
// VERSAO COM BUG — compara referencia em memoria
set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
  if (bestAnswerId) {
    if (bestAnswerId !== this.props.bestAnswerId) {
      // === e !== comparam REFERENCIA, nao VALOR
      // Duas instancias com mesmo UUID retornam true para !==
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }
  }
  this.props.bestAnswerId = bestAnswerId
}

// VERSAO CORRIGIDA — usa equals() para comparar valor primitivo
set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
  if (bestAnswerId === undefined) return

  if (
    this.props.bestAnswerId !== undefined &&
    !this.props.bestAnswerId.equals(bestAnswerId)
  ) {
    this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
  }

  this.props.bestAnswerId = bestAnswerId
}
```