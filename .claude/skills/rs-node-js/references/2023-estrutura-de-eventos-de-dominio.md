---
name: rs-node-js-2023-domain-events-structure
description: "Enforces Domain Events structure patterns when implementing DDD in Node.js/TypeScript. Use when user asks to 'implement domain events', 'create aggregate root', 'add event dispatching', 'setup pub/sub in domain', or 'structure DDD events'. Applies patterns: static DomainEvents class with HandlersMap and MarkedAggregates, pre-dispatch via addDomainEvent on AggregateRoot, equals method on entities and value objects. Make sure to use this skill whenever building event-driven domain layers or aggregate roots. Not for application-level messaging, HTTP webhooks, or infrastructure event buses like RabbitMQ/Kafka."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: domain-events
  tags: [domain-events, aggregate-root, ddd, equals, entity, dispatch, typescript]
---

# Estrutura de Domain Events

> Domain Events sao pre-registrados no agregado e so disparados apos persistencia no banco de dados, garantindo consistencia entre estado salvo e eventos publicados.

## Rules

1. **Eventos de dominio pertencem a agregados, nao a entidades** — registre eventos apenas em classes que estendem AggregateRoot, porque agregados sao a fronteira de consistencia
2. **Pre-registre antes de disparar** — use `addDomainEvent()` para anotar o evento no agregado; o disparo real acontece somente apos o banco de dados confirmar a persistencia, porque eventos sem persistencia causam inconsistencia
3. **DomainEvents e uma classe estatica** — nao instancie; ela encapsula HandlersMap (subscribers) e MarkedAggregates (agregados com eventos pendentes), porque e um registry global
4. **Um evento pode ter multiplos subscribers** — HandlersMap e um Record onde a chave e o nome do evento e o valor e um array de callbacks, porque um evento como "resposta criada" pode disparar notificacao, outro evento, etc
5. **Limpe eventos apos disparo** — chame `clearEvents()` no agregado apos despachar, porque eventos residuais causam disparos duplicados
6. **Implemente equals() em Entity e UniqueEntityID** — compare por referencia (`=== this`) e por id (`id.equals()`), porque comparacao de objetos por referencia direta falha em classes

## How to write

### Estrutura de arquivos no core

```
src/core/
├── events/
│   ├── domain-event.ts          # Interface do evento
│   ├── domain-events.ts         # Classe estatica (registry + dispatch)
│   └── event-handler.ts         # Interface do subscriber
├── entities/
│   ├── entity.ts                # Classe base com equals()
│   ├── aggregate-root.ts        # Estende Entity, adiciona domain events
│   └── unique-entity-id.ts      # Value object com equals()
```

### AggregateRoot com suporte a eventos

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

### Entity com equals()

```typescript
export abstract class Entity<Props> {
  // ...existing code

  public equals(entity: Entity<any>): boolean {
    if (entity === this) return true
    if (entity.id.equals(this.id)) return true
    return false
  }
}
```

### WatchedList usando equals() ao inves de ===

```typescript
// Em compareItems de listas como AnswerAttachmentList
compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
  return a.attachmentId.equals(b.attachmentId)
}
```

## Example

**Before (comparacao rasa em WatchedList):**
```typescript
compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
  return a.attachmentId === b.attachmentId // Falha: compara referencia de objeto
}
```

**After (com equals):**
```typescript
compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
  return a.attachmentId.equals(b.attachmentId) // Compara pelo valor interno
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando novo agregado | Estender AggregateRoot, nunca Entity diretamente |
| Evento precisa ser disparado | Chamar `addDomainEvent()` dentro do metodo de dominio do agregado |
| Persistiu no banco | Chamar `DomainEvents.dispatchEventsForAggregate(aggregate)` no repositorio |
| Comparando entidades | Usar `entity.equals(other)`, nunca `===` |
| Comparando IDs (UniqueEntityID) | Usar `id.equals(otherId)`, nunca `===` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new DomainEvents()` | `DomainEvents.markAggregateForDispatch(this)` (metodos estaticos) |
| `entity.addDomainEvent()` em Entity comum | Mover para classe que estende AggregateRoot |
| `if (a.id === b.id)` entre entidades | `if (a.equals(b))` ou `if (a.id.equals(b.id))` |
| Disparar evento dentro do metodo de dominio | Pre-registrar com addDomainEvent, disparar apos persistencia |
| Esquecer `clearEvents()` apos dispatch | Sempre limpar no `dispatchEventsForAggregate` |

## Troubleshooting

### WatchedList nao detecta itens iguais como duplicados
**Symptom:** `compareItems` retorna false para itens que deveriam ser iguais, causando duplicatas
**Cause:** Usando `===` para comparar objetos UniqueEntityID ao inves de `.equals()`
**Fix:** Implemente `equals()` em Entity e UniqueEntityID, e use `a.attachmentId.equals(b.attachmentId)` no `compareItems`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
