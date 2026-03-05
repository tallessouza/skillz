---
name: rs-node-js-2023-evento-resposta-criada
description: "Applies Domain Event creation pattern when implementing event-driven architectures in Node.js/TypeScript. Use when user asks to 'create a domain event', 'dispatch event on entity creation', 'implement DDD events', 'add event to aggregate', or 'notify when entity is created'. Enforces: event class per domain action, aggregate dispatching, conditional firing only for new entities. Make sure to use this skill whenever creating domain events or making entities emit events. Not for event subscribers, message queues, or infrastructure-level pub/sub."
---

# Domain Events — Evento de Criacao de Entidade

> Cada acao de dominio que precisa ser observada gera uma classe de evento propria, disparada condicionalmente apenas quando a entidade e realmente nova.

## Rules

1. **Um evento por acao de dominio** — crie `AnswerCreatedEvent`, `QuestionCreatedEvent`, etc., porque cada evento tem payload e contexto diferentes
2. **Evento implementa interface DomainEvent** — com `occurredAt` (Date) e `getAggregateId()` (UniqueEntityId), porque o sistema precisa saber QUANDO e DE QUEM veio o evento
3. **Entidade que dispara eventos deve ser Aggregate** — transforme a entidade em agregado (`extends AggregateRoot`), porque apenas agregados tem autoridade para emitir domain events
4. **Dispare eventos apenas para entidades NOVAS** — no metodo `create`, verifique se o `id` nao foi fornecido (entidade nova vs referencia a existente), porque o `create` tambem serve para hidratar entidades ja persistidas
5. **Use variavel semantica para a condicional** — `const isNewAnswer = !id` e mais legivel que `if (!id)` direto, porque comunica a intencao do check

## How to write

### Classe de Domain Event

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

### Disparo condicional no metodo create do Aggregate

```typescript
// Dentro da entidade Answer (que extends AggregateRoot)
static create(props: AnswerProps, id?: UniqueEntityID) {
  const answer = new Answer(props, id)

  const isNewAnswer = !id

  if (isNewAnswer) {
    answer.addDomainEvent(new AnswerCreatedEvent(answer))
  }

  return answer
}
```

## Example

**Before (disparo incondicional — BUG):**
```typescript
static create(props: AnswerProps, id?: UniqueEntityID) {
  const answer = new Answer(props, id)
  // Dispara mesmo quando esta hidratando entidade existente
  answer.addDomainEvent(new AnswerCreatedEvent(answer))
  return answer
}
```

**After (disparo condicional — correto):**
```typescript
static create(props: AnswerProps, id?: UniqueEntityID) {
  const answer = new Answer(props, id)

  const isNewAnswer = !id

  if (isNewAnswer) {
    answer.addDomainEvent(new AnswerCreatedEvent(answer))
  }

  return answer
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo `create` recebe `id` opcional | Verifique `!id` para saber se e entidade nova |
| Entidade emite eventos | Transforme em Aggregate (`extends AggregateRoot`) |
| Novo evento de dominio | Crie classe dedicada implementando `DomainEvent` |
| Entidade tem colecoes filhas (ex: attachments) | Forte indicativo que deve ser Aggregate |
| Precisa reagir a criacao de entidade | Crie `{Entity}CreatedEvent` + subscriber do outro lado |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Disparar evento sem checar se e entidade nova | `const isNewAnswer = !id; if (isNewAnswer) { ... }` |
| Colocar evento em entidade simples (Entity) | Transforme em AggregateRoot primeiro |
| Evento generico `EntityCreatedEvent` para tudo | Um evento especifico por acao: `AnswerCreatedEvent` |
| `if (!id)` sem variavel semantica | `const isNewAnswer = !id` para clareza |
| Evento sem `occurredAt` | Sempre inicialize `this.occurredAt = new Date()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-evento-resposta-criada/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-evento-resposta-criada/references/code-examples.md)
