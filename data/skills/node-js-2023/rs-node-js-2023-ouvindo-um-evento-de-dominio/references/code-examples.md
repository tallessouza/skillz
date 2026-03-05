# Code Examples: Ouvindo Eventos de Domínio

## Exemplo completo do Subscriber

```typescript
// src/domain/notification/application/subscribers/on-answer-created.ts
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer, ocurredAt }: AnswerCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: `Nova resposta em "${answer.content.substring(0, 40)}"`,
    })
  }
}
```

## Repositório com dispatch de eventos

```typescript
// src/test/repositories/in-memory-answers-repository.ts
import { DomainEvents } from '@/core/events/domain-events'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)
    // Dispara eventos pendentes do aggregate
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id.equals(answer.id))
    this.items[itemIndex] = answer
    // Também dispara eventos no save
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
```

## Teste completo do Subscriber

```typescript
// src/domain/notification/application/subscribers/on-answer-created.spec.ts
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { OnAnswerCreated } from './on-answer-created'

describe('OnAnswerCreated', () => {
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should send a notification when a new answer is created', async () => {
    // Instanciar = ativa setupSubscriptions = começa a ouvir
    const _onAnswerCreated = new OnAnswerCreated(/* use case mock */)

    // Criar a entidade (evento fica pendente internamente)
    const answer = makeAnswer()

    // Salvar no repo = dispatchEventsForAggregate = handler é chamado
    await inMemoryAnswersRepository.create(answer)

    // Verificar que o handler executou
    // (na aula, inicialmente é apenas console.log para validar o fluxo)
  })
})
```

## O fluxo de chamadas detalhado

```typescript
// 1. Subscriber é instanciado
const onAnswerCreated = new OnAnswerCreated(sendNotificationUseCase)
// → constructor chama setupSubscriptions()
// → DomainEvents.register(fn, 'AnswerCreatedEvent') — handler registrado

// 2. Answer é criada via factory
const answer = makeAnswer()
// → Answer.create() interno adiciona AnswerCreatedEvent à lista de eventos do aggregate

// 3. Repositório persiste e dispara
await answersRepository.create(answer)
// → DomainEvents.dispatchEventsForAggregate(answer.id)
//   → Encontra AnswerCreatedEvent na lista do aggregate
//   → Encontra handlers registrados para 'AnswerCreatedEvent'
//   → Chama handler (que é sendNewAnswerNotification com bind)
//     → this = OnAnswerCreated (graças ao bind)
//     → Acessa this.sendNotification (use case injetado)
//     → Executa lógica de notificação
```

## Variação: múltiplos handlers no mesmo subscriber

```typescript
export class OnAnswerCreated implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private updateQuestionStats: UpdateQuestionStatsUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    // Mesmo evento, múltiplas reações
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
    DomainEvents.register(
      this.updateStats.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    await this.sendNotification.execute({ /* ... */ })
  }

  private async updateStats({ answer }: AnswerCreatedEvent) {
    await this.updateQuestionStats.execute({ questionId: answer.questionId.toString() })
  }
}
```

## Estrutura de pastas resultante

```
src/domain/
├── forum/                          # Subdomínio Forum
│   ├── application/
│   │   └── use-cases/
│   └── enterprise/
│       ├── entities/
│       │   └── answer.ts           # Cria AnswerCreatedEvent
│       └── events/
│           └── answer-created-event.ts
│
├── notification/                   # Subdomínio Notification
│   ├── application/
│   │   ├── subscribers/            # ← Subscribers aqui
│   │   │   ├── on-answer-created.ts
│   │   │   └── on-answer-created.spec.ts
│   │   └── use-cases/
│   │       └── send-notification.ts
│   └── enterprise/
│       └── entities/
│           └── notification.ts
│
└── core/
    └── events/
        ├── domain-events.ts
        └── event-handler.ts        # Interface implementada
```