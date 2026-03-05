# Code Examples: Estrutura de Domain Events

## Interface DomainEvent

```typescript
import { UniqueEntityID } from '../entities/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
```

Cada evento de dominio concreto implementa esta interface, anotando **quando** ocorreu e **qual agregado** o disparou.

## Interface EventHandler (Subscriber)

```typescript
export interface EventHandler {
  setupSubscriptions(): void
}
```

Cada subscriber implementa esta interface. O metodo `setupSubscriptions()` e onde o subscriber se registra para ouvir eventos especificos.

## Classe DomainEvents (Registry estatico)

```typescript
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: any) => void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedAggregates: AggregateRoot<any>[] = []

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event),
    )
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ): void {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers(): void {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
```

### Walkthrough do fluxo completo:

1. **`register(callback, 'AnswerCreatedEvent')`** — um subscriber se registra para ouvir `AnswerCreatedEvent`
2. **`markAggregateForDispatch(answer)`** — quando `Answer` chama `addDomainEvent()`, o agregado e marcado
3. **`dispatchEventsForAggregate(answer.id)`** — chamado pelo repositorio apos persistir:
   - Encontra o agregado pelo id
   - Itera sobre `domainEvents` do agregado
   - Para cada evento, chama `dispatch(event)`
   - `dispatch` busca handlers pelo nome da classe do evento
   - Executa cada handler
   - Limpa eventos e remove agregado da lista

## AggregateRoot completo

```typescript
import { DomainEvents } from '../events/domain-events'
import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'

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

## Entity com equals()

```typescript
import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity: Entity<any>): boolean {
    if (entity === this) {
      return true
    }

    if (entity.id.equals(this.id)) {
      return true
    }

    return false
  }
}
```

## UniqueEntityID com equals()

```typescript
export class UniqueEntityID {
  private value: string

  toValue(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID): boolean {
    return id.toValue() === this.value
  }
}
```

## WatchedList corrigida (AnswerAttachmentList)

```typescript
// ANTES (comparacao por referencia — buggy)
export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}

// DEPOIS (comparacao por valor — correto)
export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

O mesmo ajuste se aplica a `QuestionAttachmentList`.

## Exemplo de uso futuro (como ficara no proximo passo)

```typescript
// Dentro de Answer (agregado)
export class Answer extends AggregateRoot<AnswerProps> {
  static create(props: AnswerProps, id?: UniqueEntityID): Answer {
    const answer = new Answer(props, id)

    const isNewAnswer = !id
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}

// No repositorio, apos persistir
async create(answer: Answer): Promise<void> {
  await this.prisma.answer.create({ data: PrismaAnswerMapper.toPrisma(answer) })
  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```