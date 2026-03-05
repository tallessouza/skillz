---
name: rs-node-js-2023-testando-eventos-de-dominio
description: "Applies Domain Events testing patterns when writing DDD event-driven code in Node.js/TypeScript. Use when user asks to 'test domain events', 'create event handler test', 'test aggregate events', 'implement domain event test', or 'test subdomain communication'. Ensures correct flow: register subscriber, create aggregate, assert event queued, dispatch via repository, assert handler called. Make sure to use this skill whenever testing or implementing domain events in DDD architectures. Not for unit testing regular functions, API endpoint testing, or database integration tests."
---

# Testando Eventos de Domínio

> Teste de domain events valida o fluxo completo: registro do subscriber, criação do agregado, enfileiramento do evento, disparo pelo repositório e execução do handler.

## Rules

1. **Registre o subscriber antes de criar o agregado** — `DomainEvents.register(callback, EventName)` vem primeiro, porque o handler precisa estar ouvindo antes do evento ser disparado
2. **Use `Class.name` como identificador do evento** — `CustomAggregateCreated.name` retorna o nome da classe como string, servindo como chave única no HandlersMap
3. **Criar o agregado NÃO dispara o evento** — `addDomainEvent()` apenas enfileira na lista interna do AggregateRoot, porque o evento só deve disparar após persistência no banco
4. **O repositório dispara os eventos** — chame `DomainEvents.dispatchEventsForAggregate(aggregate.id)` após salvar no banco, porque garante que só eventos de entidades persistidas são disparados
5. **Use spy para verificar o disparo** — `vi.fn()` como callback no register permite assertar que o handler foi chamado sem efeitos colaterais reais
6. **Após o disparo, a lista de eventos zera** — asserte `domainEvents` vazio após dispatch, porque eventos não devem ser disparados duas vezes

## How to write

### Estrutura do evento de domínio

```typescript
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

### Teste completo do fluxo

```typescript
it('should dispatch and listen to events', () => {
  // 1. Subscriber cadastrado (ouvindo o evento)
  const callbackSpy = vi.fn()
  DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

  // 2. Criando agregado (sem salvar no banco)
  const aggregate = CustomAggregate.create()

  // 3. Evento criado, porém NÃO disparado
  expect(aggregate.domainEvents).toHaveLength(1)

  // 4. Salvando no banco → dispara o evento
  DomainEvents.dispatchEventsForAggregate(aggregate.id)

  // 5. Subscriber ouviu e executou
  expect(callbackSpy).toHaveBeenCalled()
  expect(aggregate.domainEvents).toHaveLength(0)
})
```

## Example

**Before (erro comum — testar sem entender o fluxo):**
```typescript
it('should fire event', () => {
  const aggregate = CustomAggregate.create()
  // Erro: espera que o handler já tenha sido chamado
  expect(someHandler).toHaveBeenCalled() // FALHA
})
```

**After (com fluxo correto):**
```typescript
it('should fire event', () => {
  const callbackSpy = vi.fn()
  DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

  const aggregate = CustomAggregate.create()
  expect(aggregate.domainEvents).toHaveLength(1)

  DomainEvents.dispatchEventsForAggregate(aggregate.id)
  expect(callbackSpy).toHaveBeenCalled()
  expect(aggregate.domainEvents).toHaveLength(0)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Testando se evento foi enfileirado | Assert `domainEvents.toHaveLength(1)` ANTES do dispatch |
| Testando se handler executou | Use `vi.fn()` como spy no `DomainEvents.register` |
| Testando comunicação entre subdomínios | Cada subdomínio registra seu subscriber independente, sem imports cruzados |
| Agregado dentro do `create()` estático | Use `aggregate.addDomainEvent(new Event(aggregate))`, não `this` (método estático) |
| Múltiplos eventos no mesmo agregado | Assert `domainEvents.toHaveLength(N)` antes e `0` depois do dispatch |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| Disparar evento diretamente no `create()` | `addDomainEvent()` para enfileirar, dispatch separado |
| Importar código do subdomínio de notificação no fórum | Usar DomainEvents como mediador entre subdomínios |
| Testar handler sem registrar subscriber antes | `DomainEvents.register(spy, Event.name)` antes de criar o agregado |
| Usar `this` em método `static create()` | Usar a variável local do agregado criado |
| Assumir que criar agregado = evento disparado | Separar criação (enfileira) de persistência (dispara) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
