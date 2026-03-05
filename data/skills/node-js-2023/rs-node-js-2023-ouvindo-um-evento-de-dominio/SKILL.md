---
name: rs-node-js-2023-ouvindo-evento-dominio
description: "Applies Domain Event subscriber pattern when implementing cross-subdomain communication in DDD Node.js applications. Use when user asks to 'create a subscriber', 'listen to domain events', 'notify on entity creation', 'connect subdomains', or 'implement event handler'. Enforces subscriber placement in Application layer, proper bind usage for handler context, and bridge-role pattern between bounded contexts. Make sure to use this skill whenever implementing event-driven communication between DDD subdomains. Not for CQRS event sourcing, message queues, or infrastructure-level pub/sub systems."
---

# Ouvindo Eventos de Dominio (Domain Event Subscribers)

> Subscribers ficam na camada Application e funcionam como pontes entre subdomínios, delegando lógica para use cases em vez de acumular código.

## Rules

1. **Subscriber fica em Application, não em Enterprise** — `src/domain/{subdomain}/application/subscribers/`, porque subscribers acessam repositórios e use cases via inversão de dependência, assim como casos de uso
2. **Subscriber é ponte, não lógica** — mantenha pouco código no subscriber, porque ele conecta subdomínios e delega para use cases a execução real
3. **Implemente EventHandler** — toda classe subscriber implementa a interface `EventHandler` do core, que exige o método `setupSubscriptions`
4. **Chame setupSubscriptions no construtor** — o registro dos listeners acontece na instanciação, porque o subscriber precisa estar ouvindo antes dos eventos serem disparados
5. **Use .bind(this) ao passar handlers** — `this.sendNewAnswerNotification.bind(this)`, porque quando DomainEvents chama o handler, o contexto `this` muda para a classe chamadora
6. **Nomeie handlers pela ação específica** — `sendNewAnswerNotification` não `execute`, porque um subscriber pode registrar múltiplos handlers para diferentes eventos
7. **Use NomeDoEvento.name no register** — `AnswerCreatedEvent.name` não a string literal, porque se a classe mudar de nome, o TypeScript detecta o erro

## How to write

### Estrutura do Subscriber

```typescript
// src/domain/notification/application/subscribers/on-answer-created.ts
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'

export class OnAnswerCreated implements EventHandler {
  constructor(
    // Inversão de dependência — mesma pattern dos use cases
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
    // Delegar para use case — subscriber é ponte, não lógica
    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: `Nova resposta em "${answer.content.substring(0, 40)}"`,
    })
  }
}
```

### Disparando eventos no repositório

```typescript
// in-memory-answers-repository.ts (ou repositório real)
async create(answer: Answer) {
  this.items.push(answer)
  DomainEvents.dispatchEventsForAggregate(answer.id)
}

async save(answer: Answer) {
  const index = this.items.findIndex((item) => item.id.equals(answer.id))
  this.items[index] = answer
  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```

### Teste do Subscriber

```typescript
describe('OnAnswerCreated', () => {
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should send a notification when a new answer is created', async () => {
    // Instanciar subscriber = ativa setupSubscriptions
    const _onAnswerCreated = new OnAnswerCreated(/* dependencies */)

    const answer = makeAnswer()

    // Salvar no repo dispara DomainEvents.dispatchEventsForAggregate
    await inMemoryAnswersRepository.create(answer)

    // Verificar que notificação foi enviada
    expect(/* assertion */).toBeTruthy()
  })
})
```

## Example

**Before (lógica no subscriber):**
```typescript
export class OnAnswerCreated implements EventHandler {
  setupSubscriptions() {
    DomainEvents.register(this.execute.bind(this), 'AnswerCreatedEvent')
  }
  // Lógica de negócio diretamente no subscriber — errado
  private async execute(event: AnswerCreatedEvent) {
    const notification = Notification.create({ title: '...' })
    await this.notificationsRepository.create(notification)
  }
}
```

**After (subscriber como ponte):**
```typescript
export class OnAnswerCreated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }
  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }
  // Delega para use case — subscriber é ponte
  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    await this.sendNotification.execute({ recipientId: answer.authorId.toString() })
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Subscriber precisa acessar repositório | Injete via construtor (inversão de dependência) |
| Subscriber precisa executar lógica complexa | Delegue para um use case existente |
| Múltiplas ações para o mesmo evento | Múltiplos `DomainEvents.register` no `setupSubscriptions` |
| Handler perde contexto `this` | Adicione `.bind(this)` ao passar a referência |
| Teste não dispara o evento | Verifique se `dispatchEventsForAggregate` é chamado no repo |
| Teste não detecta o subscriber | Instancie a classe antes de criar/salvar a entidade |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `DomainEvents.register(this.execute, ...)` (sem bind) | `DomainEvents.register(this.execute.bind(this), ...)` |
| `DomainEvents.register(..., 'AnswerCreatedEvent')` (string literal) | `DomainEvents.register(..., AnswerCreatedEvent.name)` |
| Subscriber em `enterprise/` | Subscriber em `application/subscribers/` |
| Lógica de negócio dentro do subscriber | `await this.useCase.execute(...)` — delegue |
| Um único método `execute` para tudo | Métodos nomeados: `sendNewAnswerNotification` |
| Subscriber sem `setupSubscriptions` no construtor | Sempre chame no construtor para auto-registro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
