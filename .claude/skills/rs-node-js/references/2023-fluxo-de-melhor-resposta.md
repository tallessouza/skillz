---
name: rs-node-js-2023-fluxo-melhor-resposta
description: "Enforces correct Domain Event flow implementation in DDD/Clean Architecture when user asks to 'create a domain event', 'implement event subscriber', 'notify on state change', 'dispatch domain event', or 'handle aggregate events'. Applies patterns: event class creation, conditional event dispatching, subscriber wiring, value object comparison with equals() instead of ===. Make sure to use this skill whenever implementing domain events, event-driven notifications, or aggregate state change side-effects in Node.js/TypeScript. Not for REST API design, database queries, or UI components."
---

# Fluxo de Domain Events — Best Answer Chosen

> Ao implementar domain events, crie o evento, dispare condicionalmente no aggregate, implemente o subscriber, e sempre compare value objects com equals(), nunca com ===.

## Rules

1. **Crie uma classe de evento por acao de dominio** — `QuestionBestAnswerChosenEvent`, nao reutilize eventos genericos, porque cada evento carrega dados especificos do contexto
2. **Dispare eventos dentro do aggregate, nao no use case** — o aggregate sabe quando seu estado mudou, o use case nao deve decidir isso
3. **Adicione guards antes de disparar** — so dispare se o valor realmente mudou, porque eventos duplicados geram notificacoes duplicadas
4. **Compare value objects com equals(), nunca com ===** — `===` compara referencia em memoria, nao o valor primitivo interno, gerando bugs em testes e2e e producao
5. **Use early returns para simplificar condicionais** — inverta a logica: retorne cedo nos casos que NAO disparam evento, porque reduz nesting e melhora legibilidade
6. **Subscriber busca dados complementares** — o subscriber recebe o evento e busca entidades relacionadas (ex: answer details) antes de executar a acao

## How to write

### Classe de Domain Event

```typescript
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

### Disparo condicional no Aggregate (com equals)

```typescript
set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
  // Guard: se undefined, nao faz nada
  if (bestAnswerId === undefined) {
    return
  }

  // Guard: se ja tinha melhor resposta E o id e diferente, dispara evento
  if (
    this.props.bestAnswerId !== undefined &&
    !this.props.bestAnswerId.equals(bestAnswerId)
  ) {
    this.addDomainEvent(
      new QuestionBestAnswerChosenEvent(this, bestAnswerId)
    )
  }

  this.props.bestAnswerId = bestAnswerId
}
```

### Subscriber

```typescript
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

    if (!answer) return

    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: `Sua resposta foi escolhida!`,
      content: `A resposta que voce enviou em "${event.question.title.substring(0, 20)}" foi escolhida pelo autor.`,
    })
  }
}
```

## Example

**Before (bug: comparacao por referencia):**
```typescript
set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
  if (bestAnswerId) {
    if (bestAnswerId !== this.props.bestAnswerId) {
      // BUG: compara referencia em memoria, nao valor
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }
  }
  this.props.bestAnswerId = bestAnswerId
}
```

**After (correto: equals + early return):**
```typescript
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Setter muda propriedade que gera side-effect | Adicione guard + dispare domain event condicionalmente |
| Comparar dois Value Objects / Entity IDs | Use `.equals()`, nunca `===` ou `!==` |
| Subscriber precisa de dados alem do evento | Injete o repository e busque antes de agir |
| InMemoryRepository em testes | Adicione `DomainEvents.dispatchEventsForAggregate()` no save/create |
| Evento pode ser disparado com mesmo valor | Guard: so dispare se valor realmente mudou |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (idA !== idB)` (classes) | `if (!idA.equals(idB))` |
| Evento disparado no use case | Evento disparado dentro do aggregate setter |
| Ifs aninhados para guards | Early returns sequenciais |
| Subscriber sem null check | `if (!entity) return` antes de usar |
| Evento sem dados de contexto | Evento carrega aggregate + ids relevantes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-fluxo-de-melhor-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-fluxo-de-melhor-resposta/references/code-examples.md)
