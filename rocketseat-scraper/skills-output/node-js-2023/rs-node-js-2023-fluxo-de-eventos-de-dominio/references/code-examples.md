# Code Examples: Fluxo de Eventos de Domínio

## Exemplo 1: O problema — acoplamento direto entre casos de uso

```typescript
// ❌ ERRADO: AnswerQuestionUseCase conhece SendNotificationUseCase
export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase, // acoplamento com outro subdomínio
  ) {}

  async execute({ questionId, authorId, content }): Promise<void> {
    const answer = Answer.create({ questionId, authorId, content })
    await this.answersRepository.create(answer)

    // Se o sistema de notificação for removido, esse código quebra
    // Se outro caso de uso criar uma Answer, a notificação NÃO será enviada
    await this.sendNotification.execute({
      recipientId: answer.questionAuthorId,
      title: 'Nova resposta',
      content: answer.excerpt,
    })
  }
}
```

### Por que é errado:
1. Se `SendNotificationUseCase` for terceirizado → `AnswerQuestionUseCase` quebra
2. Se `ImportAnswersFromCSVUseCase` criar answers → notificações não são enviadas
3. Acoplamento entre subdomínios de Fórum e Notificação

## Exemplo 2: Entidade registra evento no create

```typescript
// domain/forum/enterprise/entities/answer.ts
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerCreatedEvent } from '../events/answer-created-event'

interface AnswerProps {
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  content: string
  createdAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  // ... getters

  static create(props: AnswerProps, id?: UniqueEntityID) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    // Registra o evento — flag pending internamente
    // NÃO dispara nada ainda, apenas "anota" que o evento aconteceu
    const isNewAnswer = !id // se não tem id, é criação nova
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
```

### Ponto chave:
O `create` é chamado por QUALQUER caso de uso que precise criar uma Answer. O evento é registrado na entidade, não no caso de uso.

## Exemplo 3: Evento de domínio

```typescript
// domain/forum/enterprise/events/answer-created-event.ts
import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
```

## Exemplo 4: Infraestrutura de Domain Events (PubSub)

```typescript
// core/events/domain-events.ts
import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: any) => void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedAggregates: AggregateRoot<any>[] = []

  // Fase 1: Entidade marca que tem eventos pendentes
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const found = this.markedAggregates.find((a) => a.equals(aggregate))
    if (!found) {
      this.markedAggregates.push(aggregate)
    }
  }

  // Fase 2: Repositório chama após persistir — AQUI os subscribers são notificados
  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.markedAggregates.find((a) => a.id.equals(id))

    if (aggregate) {
      aggregate.domainEvents.forEach((event: DomainEvent) => {
        this.dispatch(event)
      })
      aggregate.clearEvents()
      this.removeAggregateFromMarkedList(aggregate)
    }
  }

  // Subscribers se registram aqui
  public static register(callback: DomainEventCallback, eventClassName: string): void {
    const wasRegistered = this.handlersMap[eventClassName]
    if (!wasRegistered) {
      this.handlersMap[eventClassName] = []
    }
    this.handlersMap[eventClassName].push(callback)
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName = event.constructor.name
    const handlers = this.handlersMap[eventClassName]

    if (handlers) {
      handlers.forEach((handler) => handler(event))
    }
  }

  private static removeAggregateFromMarkedList(aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates.splice(index, 1)
  }
}
```

## Exemplo 5: Repositório dispara eventos após persistência

```typescript
// infra/database/prisma/repositories/prisma-answers-repository.ts
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({ data })

    // AGORA é seguro disparar — a answer está persistida no banco
    // Se tivesse ocorrido erro acima, esta linha não executaria
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
```

## Exemplo 6: Subscriber no subdomínio de Notificação

```typescript
// domain/notification/application/subscribers/on-answer-created.ts
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.execute.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  async execute({ answer }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
```

## Exemplo 7: AggregateRoot base com suporte a eventos

```typescript
// core/entities/aggregate-root.ts
import { Entity } from './entity'
import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }
}
```

## Fluxo completo passo a passo

```
1. Controller recebe request HTTP
2. AnswerQuestionUseCase.execute() é chamado
3. Answer.create() → addDomainEvent(AnswerCreatedEvent) → marcado como pending
4. Caso de uso continua processando lógica de negócio
5. answersRepository.create(answer) → persiste no Prisma/banco
6. DomainEvents.dispatchEventsForAggregate(answer.id) → flag muda para ready
7. AnswerCreatedEvent é despachado
8. OnAnswerCreated.execute() recebe o evento
9. SendNotificationUseCase.execute() envia a notificação
10. ✅ Notificação enviada SOMENTE após persistência confirmada
```

## Variações do mesmo padrão

O mesmo fluxo se aplica a qualquer evento de domínio:

| Evento | Entidade | Subscriber | Ação |
|--------|----------|-----------|------|
| AnswerCreatedEvent | Answer | OnAnswerCreated | Enviar notificação ao dono da pergunta |
| BestAnswerChosenEvent | Question | OnBestAnswerChosen | Notificar autor da resposta escolhida |
| CommentOnAnswerEvent | AnswerComment | OnCommentOnAnswer | Notificar autor da resposta |
| CommentOnQuestionEvent | QuestionComment | OnCommentOnQuestion | Notificar autor da pergunta |