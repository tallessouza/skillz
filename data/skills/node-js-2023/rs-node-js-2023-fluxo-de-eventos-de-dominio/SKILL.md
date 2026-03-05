---
name: rs-node-js-2023-fluxo-eventos-dominio
description: "Enforces Domain Events with PubSub pattern for cross-subdomain communication in DDD architectures. Use when user asks to 'notify another domain', 'dispatch domain event', 'communicate between bounded contexts', 'decouple use cases', or 'trigger side effects after persistence'. Applies two-phase dispatch: register event on entity creation, dispatch only after repository persistence. Make sure to use this skill whenever implementing cross-domain communication or entity-triggered side effects in DDD projects. Not for simple function calls, HTTP webhooks, or message broker configuration."
---

# Fluxo de Eventos de Domínio

> Eventos de domínio conectam subdomínios sem acoplamento direto, usando PubSub com despacho em duas fases: registrar no create, disparar no persist.

## Rules

1. **Nunca chame um caso de uso de outro subdomínio diretamente** — porque se o subdomínio de notificação sair da codebase, o subdomínio de fórum quebra
2. **Registre o evento na entidade, não no caso de uso** — porque a entidade sabe quando foi criada independente de qual caso de uso a criou; se amanhã existirem 3 casos de uso que criam Answer, todos disparam o evento
3. **Use PubSub para comunicação entre subdomínios** — publisher e subscriber não se conhecem, podem existir independentemente sem causar erros
4. **Despache eventos somente após persistência no banco** — porque se ocorrer erro entre a criação da entidade e o save no repositório, a notificação já teria sido enviada incorretamente
5. **Duas fases: register + dispatch** — fase 1: entidade registra evento (flag pending), fase 2: repositório marca como ready e dispara os subscribers

## How to write

### Fase 1: Entidade registra o evento no create

```typescript
// No método estático create da entidade
export class Answer extends AggregateRoot<AnswerProps> {
  static create(props: AnswerProps, id?: UniqueEntityID) {
    const answer = new Answer(props, id)

    // Registra o evento — NÃO dispara ainda
    answer.addDomainEvent(new AnswerCreatedEvent(answer))

    return answer
  }
}
```

### Fase 2: Repositório dispara após persistir

```typescript
// No repositório, após salvar no banco
export class PrismaAnswersRepository implements AnswersRepository {
  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({ data: PrismaAnswerMapper.toPrisma(answer) })

    // Agora sim — entidade persistida, seguro disparar
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
```

### Subscriber ouve e reage

```typescript
// Subscriber no subdomínio de notificação
export class OnAnswerCreated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.execute.bind(this), AnswerCreatedEvent.name)
  }

  async execute({ answer }: AnswerCreatedEvent): Promise<void> {
    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: 'Nova resposta na sua pergunta',
      content: answer.excerpt,
    })
  }
}
```

## Example

**Before (acoplamento direto — errado):**
```typescript
// Caso de uso chamando outro caso de uso de outro subdomínio
export class AnswerQuestionUseCase {
  constructor(
    private answersRepo: AnswersRepository,
    private sendNotification: SendNotificationUseCase, // ACOPLAMENTO
  ) {}

  async execute(props): Promise<void> {
    const answer = Answer.create(props)
    await this.answersRepo.create(answer)
    await this.sendNotification.execute({ ... }) // PROBLEMA: e se houver outro caso de uso que cria Answer?
  }
}
```

**After (PubSub com duas fases):**
```typescript
// Caso de uso limpo — não conhece notificação
export class AnswerQuestionUseCase {
  constructor(private answersRepo: AnswersRepository) {}

  async execute(props): Promise<void> {
    const answer = Answer.create(props) // Fase 1: evento registrado internamente
    await this.answersRepo.create(answer) // Fase 2: repo persiste e dispara eventos
  }
}

// Subscriber separado, outro subdomínio, zero acoplamento
// OnAnswerCreated ouve o evento e chama SendNotification
```

## Heuristics

| Situação | Ação |
|----------|------|
| Ação em subdomínio A precisa disparar efeito em subdomínio B | Domain Event com PubSub |
| Múltiplos casos de uso podem criar a mesma entidade | Registrar evento no `create` da entidade, não no caso de uso |
| Efeito colateral não pode acontecer se persistência falhar | Dispatch somente após `repository.save()` |
| Subscriber pode existir sem o publisher | Correto — PubSub garante independência |
| Precisa garantir que evento só dispara uma vez | Flag pending → ready no momento do dispatch |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| `useCase.execute()` chamando outro useCase de outro subdomínio | Domain Event via PubSub |
| Disparar evento dentro do `create` da entidade imediatamente | Registrar evento no create, disparar no repositório após persist |
| Registrar evento no caso de uso | Registrar no método `create` da entidade (entidade sabe quando foi criada) |
| Enviar notificação antes de confirmar persistência | Duas fases: register + dispatch após save |
| Subscriber com dependência direta do publisher | Subscriber conhece apenas o evento, não quem publicou |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
