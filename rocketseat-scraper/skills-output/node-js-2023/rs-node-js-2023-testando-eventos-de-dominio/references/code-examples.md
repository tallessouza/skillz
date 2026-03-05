# Code Examples: Testando Eventos de Domínio

## Exemplo completo do teste (como no transcript)

### Classe CustomAggregate (simula uma entidade)

```typescript
// Dentro do arquivo de teste — simula um agregado genérico
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null, null)

    // Registra que o evento aconteceu (NÃO dispara)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}
```

**Pontos importantes:**
- Estende `AggregateRoot` (não `Entity` diretamente), porque só aggregates raiz disparam eventos
- O `static create()` usa `aggregate.addDomainEvent()` e não `this.addDomainEvent()` porque métodos estáticos não têm acesso a `this`
- As propriedades são `null` porque é um teste genérico — na prática, seria `Answer`, `Question`, etc.

### Classe CustomAggregateCreated (o evento)

```typescript
// eslint-disable-next-line no-use-before-define
class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}
```

**Pontos importantes:**
- Implementa a interface `DomainEvent` (requer `occurredAt` e `getAggregateId()`)
- O `eslint-disable-next-line no-use-before-define` é necessário porque a classe é usada dentro de `CustomAggregate.create()` que está definida acima no mesmo arquivo
- `getAggregateId()` retorna o ID do agregado "dono" do evento — essencial para o dispatch seletivo

### O teste completo

```typescript
import { vi, describe, it, expect } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    // 1. Subscriber cadastrado (ouvindo o evento "resposta criada")
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // 2. Estou criando uma resposta, porém sem salvar no banco
    const aggregate = CustomAggregate.create()

    // 3. Estou assegurando que o evento foi criado, porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // 4. Estou salvando a resposta no banco de dados
    //    e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // 5. O subscriber ouve o evento e faz o que precisa ser feito
    expect(callbackSpy).toHaveBeenCalled()

    // 6. Após disparo, lista de eventos fica vazia
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
```

## Variação: Testando com múltiplos eventos

```typescript
it('should dispatch multiple events for same aggregate', () => {
  const createSpy = vi.fn()
  const updateSpy = vi.fn()

  DomainEvents.register(createSpy, 'AggregateCreated')
  DomainEvents.register(updateSpy, 'AggregateUpdated')

  const aggregate = MyAggregate.create() // enfileira AggregateCreated
  aggregate.update({ title: 'novo' })    // enfileira AggregateUpdated

  expect(aggregate.domainEvents).toHaveLength(2)

  DomainEvents.dispatchEventsForAggregate(aggregate.id)

  expect(createSpy).toHaveBeenCalled()
  expect(updateSpy).toHaveBeenCalled()
  expect(aggregate.domainEvents).toHaveLength(0)
})
```

## Variação: Como será na prática (Answer + Notificação)

```typescript
// No subdomínio do Fórum (domain/forum/enterprise/entities/answer.ts)
class Answer extends AggregateRoot<AnswerProps> {
  static create(props: AnswerProps, id?: UniqueEntityId) {
    const answer = new Answer(props, id)

    // Só registra evento se é uma criação nova (sem id existente)
    if (!id) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}

// No subdomínio de Notificação (domain/notification/subscribers/)
// Registra o subscriber — SEM importar nada do fórum
DomainEvents.register(
  async (event: AnswerCreatedEvent) => {
    // Busca a pergunta, notifica o autor
    await sendNotification(event.getAggregateId())
  },
  'AnswerCreatedEvent'
)

// No repositório (infra/repositories/prisma-answers-repository.ts)
async create(answer: Answer) {
  await this.prisma.answer.create({ data: PrismaAnswerMapper.toPrisma(answer) })

  // Após persistir, dispara os eventos
  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```

## API Reference rápida

```typescript
// Registrar subscriber
DomainEvents.register(callback: Function, eventClassName: string): void

// Enfileirar evento no agregado
aggregateRoot.addDomainEvent(event: DomainEvent): void

// Disparar todos os eventos de um agregado
DomainEvents.dispatchEventsForAggregate(id: UniqueEntityId): void

// Acessar eventos pendentes
aggregateRoot.domainEvents: DomainEvent[]
```