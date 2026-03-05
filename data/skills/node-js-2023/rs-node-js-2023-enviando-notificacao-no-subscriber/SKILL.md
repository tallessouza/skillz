---
name: rs-node-js-2023-enviando-notificacao-subscriber
description: "Enforces domain event subscriber implementation patterns when writing DDD Node.js applications. Use when user asks to 'create a subscriber', 'send notification on event', 'test domain events', 'implement pub/sub', or 'connect subdomains'. Applies rules: subscribers can use cross-subdomain repositories, use spy to verify event-triggered side effects, use waitFor for async event assertions. Make sure to use this skill whenever implementing event-driven communication between bounded contexts. Not for CRUD operations, REST endpoints, or synchronous service calls."
---

# Enviando Notificacao no Subscriber

> Subscribers conectam subdomínios via eventos de domínio — acoplamento aqui é intencional e isolado na pasta subscriber.

## Rules

1. **Subscriber pode usar repositórios de outro subdomínio** — porque o subscriber só existe por causa do outro subdomínio; se o fórum não existisse, o `onAnswerCreated` também não existiria
2. **Mantenha acoplamento cross-domain exclusivamente dentro da pasta subscriber** — nunca espalhe dependências de outro subdomínio para fora do subscriber
3. **Busque dados complementares antes de notificar** — a resposta tem `authorId`, mas quem recebe a notificação é o autor da pergunta; busque a question no repositório
4. **Use spy para verificar se efeitos colaterais foram disparados** — `vi.spyOn(instance, 'method')` observa se o método foi chamado sem alterar comportamento
5. **Use waitFor para assertions de eventos assíncronos** — domain events não disparam sincronamente; polling a cada 10ms até 1s evita falsos negativos
6. **Type o spy completamente** — use `MockInstance` (antigo `SpyInstance`) com generics de request e response para IntelliSense completo

## How to write

### Subscriber com dependências cross-domain

```typescript
export class OnAnswerCreated implements EventHandler {
  private questionsRepository: QuestionsRepository
  private sendNotification: SendNotificationUseCase

  constructor(
    questionsRepository: QuestionsRepository,
    sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
    this.questionsRepository = questionsRepository
    this.sendNotification = sendNotification
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.except,
      })
    }
  }
}
```

### Teste com spy e waitFor

```typescript
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

beforeEach(() => {
  sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

  // eslint-disable-next-line no-new
  new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
})

it('should send a notification when an answer is created', async () => {
  const question = makeQuestion()
  const answer = makeAnswer({ questionId: question.id })

  inMemoryQuestionsRepository.create(question)
  inMemoryAnswersRepository.create(answer)

  await waitFor(() => {
    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})
```

## Example

**Before (teste síncrono que falha):**
```typescript
inMemoryAnswersRepository.create(answer)
// Falha! O evento é assíncrono, ainda não disparou
expect(sendNotificationExecuteSpy).toHaveBeenCalled()
```

**After (teste com waitFor):**
```typescript
inMemoryAnswersRepository.create(answer)

await waitFor(() => {
  expect(sendNotificationExecuteSpy).toHaveBeenCalled()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Subscriber precisa de dados de outro subdomínio | Injete o repositório como dependência do subscriber |
| Notificação deve ir para quem não disparou o evento | Busque a entidade relacionada (ex: question) para obter o recipientId correto |
| Teste de subscriber falha intermitentemente | Use `waitFor` — eventos de domínio são assíncronos |
| Quer verificar se efeito colateral ocorreu | Use `vi.spyOn` no método do caso de uso |
| Quer verificar parâmetros do efeito colateral | Use `toHaveBeenCalledWith` com spy tipado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `expect(spy).toHaveBeenCalled()` direto após create | `await waitFor(() => { expect(spy).toHaveBeenCalled() })` |
| Importar repositório de outro subdomínio no use case | Importar repositório cross-domain apenas no subscriber |
| Enviar notificação para `answer.authorId` | Buscar `question` e enviar para `question.authorId` |
| `let spy: any` | `let spy: MockInstance<[Request], Promise<Response>>` |
| Testar subscriber sem criar a entidade relacionada | Criar question E answer no teste |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
