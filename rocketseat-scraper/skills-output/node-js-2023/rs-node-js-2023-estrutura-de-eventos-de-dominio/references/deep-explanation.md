# Deep Explanation: Estrutura de Domain Events

## O modelo mental: Publish/Subscribe no dominio

O instrutor explica que Domain Events seguem o padrao pub/sub: voce **publica** eventos e **ouve** por eventos. A diferenca crucial do pub/sub tradicional (como message brokers) e que aqui tudo acontece **dentro do dominio da aplicacao**, antes de qualquer infraestrutura externa.

## As duas propriedades centrais da classe DomainEvents

### HandlersMap (os subscribers)
- E um `Record<string, DomainEventCallback[]>`
- A chave e o **nome do evento** (string)
- O valor e um **array de callbacks** (subscribers)
- Para cada evento, podem existir multiplos subscribers
- Exemplo: o evento "resposta criada" pode disparar:
  - Uma notificacao para o autor da pergunta
  - Um recalculo de estatisticas
  - Um log de auditoria

### MarkedAggregates (eventos pendentes)
- E um array que guarda **quais agregados tem eventos pendentes**
- Quando um agregado registra um evento via `addDomainEvent()`, ele e adicionado a este array
- O evento **existe** mas **ainda nao esta pronto para ser disparado**
- O instrutor usa a analogia de um "ready: false" — o evento foi anotado mas aguarda confirmacao

## O fluxo completo de um evento

1. **Algo acontece no dominio** — ex: uma resposta e criada
2. **O agregado chama `addDomainEvent(event)`** — o evento e registrado internamente no agregado E o agregado e marcado no array `MarkedAggregates`
3. **O repositorio persiste no banco de dados** — a resposta e salva
4. **Apos persistencia, `dispatchEventsForAggregate(aggregate)` e chamado** — este metodo:
   - Pega o agregado
   - Itera sobre seus `domainEvents`
   - Para cada evento, busca os subscribers no HandlersMap
   - Dispara cada subscriber
5. **`clearEvents()` e chamado** — remove todos os eventos do agregado para evitar re-disparo

## Por que so agregados (nao entidades)?

O instrutor explica que **tecnicamente** poderia usar eventos em entidades, mas a convencao e usar apenas em agregados porque:
- Agregados sao a **fronteira de consistencia** (consistency boundary)
- Eventos de dominio representam algo significativo que aconteceu no dominio
- Entidades dentro de um agregado mudam como parte da operacao do agregado

## O metodo equals() — motivacao real

O instrutor percebeu que nas WatchedLists (AnswerAttachmentList, QuestionAttachmentList), a comparacao estava sendo feita com `===`. Como `AttachmentId` e uma classe (objeto), `===` compara referencia de memoria, nao valor. O metodo `equals()` resolve isso:

- Na Entity: compara por referencia (`=== this`) OU por id (`id.equals()`)
- No UniqueEntityID: compara pelo `toValue()` interno

Isso e essencial para qualquer operacao que precise determinar se duas entidades representam a mesma coisa (deduplicacao, diff em WatchedList, etc).

## Por que `addDomainEvent` e protected (nao private)?

O instrutor explica que o metodo e `protected` porque precisa ser chamado **a partir das classes que herdam AggregateRoot**. Se fosse `private`, as classes concretas como `Answer` ou `Question` nao conseguiriam registrar eventos.

## A classe DomainEvents como singleton estatico

Todos os metodos sao estaticos — nao se instancia a classe. Ela funciona como um **registry global**:
- `markAggregateForDispatch(aggregate)` — registra agregado com eventos pendentes
- `dispatchEventsForAggregate(aggregate)` — dispara eventos de um agregado especifico
- `register(callback, eventClassName)` — registra um subscriber para um tipo de evento

O instrutor menciona que "a classe e so para encapsular um monte de variaveis e funcoes" — e um namespace com estado.