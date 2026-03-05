# Deep Explanation: Testando Eventos de Domínio

## O fluxo mental dos Domain Events

O instrutor enfatiza uma separação crucial que muitos devs confundem: **criar um agregado não é o mesmo que disparar um evento**. O fluxo tem duas fases distintas:

1. **Fase de registro (em memória):** Quando `CustomAggregate.create()` é chamado, o método `addDomainEvent()` apenas adiciona o evento numa lista interna do AggregateRoot. Nada acontece ainda. É como anotar num post-it "isso aconteceu".

2. **Fase de disparo (após persistência):** Somente quando o repositório (que lida com o banco de dados) chama `DomainEvents.dispatchEventsForAggregate(id)` é que os subscribers são notificados. É o banco de dados dizendo "agora sim, está confirmado".

### Por que essa separação existe?

Porque se o evento disparasse imediatamente na criação, e depois a persistência falhasse, os subscribers teriam reagido a algo que na verdade não aconteceu. Imagine enviar uma notificação de "nova resposta" para algo que não foi salvo no banco.

## HandlersMap = Subscribers

O instrutor faz um paralelo direto: o `HandlersMap` dentro da classe `DomainEvents` é exatamente o padrão Pub/Sub (publishers/subscribers). Cada entrada no map associa:
- **Chave:** nome do evento (string via `Class.name`)
- **Valor:** lista de callbacks (handlers) que devem executar quando aquele evento for disparado

## Comunicação entre subdomínios sem acoplamento

O ponto mais poderoso que o instrutor destaca: os dois subdomínios (fórum e notificação) se comunicam **sem importar nada um do outro**. O DomainEvents atua como mediador:

- **Subdomínio do Fórum:** registra `addDomainEvent(new AnswerCreated(answer))` no `create()` da Answer
- **Subdomínio de Notificação:** registra um subscriber via `DomainEvents.register(handler, 'AnswerCreated')`
- **Nenhum dos dois importa código do outro** — eles só conhecem o sistema de eventos

## A classe de evento como "envelope"

Cada evento de domínio (`CustomAggregateCreated`) é como um envelope que carrega todas as informações necessárias para quem vai reagir ao evento. O instrutor destaca que dentro do construtor você pode anotar qualquer coisa que o handler precise:

```typescript
constructor(aggregate: CustomAggregate) {
  this.aggregate = aggregate  // pode ter mais campos
  this.occurredAt = new Date()
}
```

O `getAggregateId()` existe para que o sistema de dispatch saiba qual agregado "dono" desse evento, permitindo disparar todos os eventos de um agregado específico de uma vez.

## O papel do spy nos testes

O `vi.fn()` do Vitest cria uma função "espiã" — ela não faz nada, mas registra se foi chamada, quantas vezes, e com quais argumentos. É a forma ideal de testar se o fluxo de eventos funciona sem precisar implementar um handler real.

## Analogia com o mundo real

Pense assim:
- **`addDomainEvent()`** = Você escreve uma carta e coloca na caixa de saída
- **`dispatchEventsForAggregate()`** = O carteiro passa e leva todas as cartas da sua caixa
- **Subscriber/Handler** = O destinatário recebe e age sobre a carta
- **Após o dispatch, lista vazia** = A caixa de saída foi esvaziada