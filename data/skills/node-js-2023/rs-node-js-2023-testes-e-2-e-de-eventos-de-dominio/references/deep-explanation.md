# Deep Explanation: Testes E2E de Eventos de Domínio

## Por que testes E2E se já existem testes unitários?

O instrutor explica que os testes unitários para `OnAnswerCreated` e `OnQuestionBestAnswerChosen` usam repositórios em memória (`InMemoryAnswersRepository`). Esses repositórios já chamam `DomainEvents.dispatchEventsForAggregate()`, então os testes unitários passam. Porém, isso **não garante** que o repositório Prisma (camada de infra real) também dispara os eventos.

É exatamente esse gap que os testes E2E cobrem: validam que a aplicação inteira, incluindo a camada de infraestrutura real (Prisma, banco de dados), dispara eventos corretamente.

## Por que eventos de domínio são assíncronos?

O instrutor mostra o código do `DomainEvents.dispatch()`:

```typescript
// Percorre todos os handlers e chama cada um
// Sem await — dispara tudo e segue em frente
callbacks.forEach((callback) => callback(aggregate))
```

Não há `await` porque eventos são **efeitos colaterais** que não devem bloquear o fluxo principal. Se um usuário responde uma pergunta no fórum, ele não deve esperar a notificação ser enviada para receber o status de sucesso. A notificação é um side effect que acontece assincronamente.

Isso significa que, no teste, se você criar uma answer e imediatamente consultar o banco para ver se a notificação existe, ela provavelmente **ainda não foi criada**.

## O padrão waitFor

O `waitFor` resolve isso executando as assertions repetidamente em intervalos curtos (10ms) até que passem ou atinjam um timeout. É o mesmo padrão usado nos testes unitários de eventos, mas nos testes E2E precisa suportar callbacks assíncronos (porque consultamos o banco de dados real).

A mudança necessária: o tipo do callback muda de `() => void` para `() => void | Promise<void>`.

## Organização dos arquivos de teste

O instrutor segue o padrão de manter testes próximos aos arquivos testados. Para controllers, o teste fica ao lado do controller. Mas eventos não têm um controller dedicado — são disparados automaticamente. Então os testes de eventos ficam em uma pasta separada dentro de `infra/events/`.

## O erro da tabela de notificações

Ao rodar o teste pela primeira vez, falha porque a tabela de notificações não existe no banco de testes. Isso é resolvido garantindo que o schema Prisma inclua o model Notification e que as migrations sejam rodadas no ambiente de teste.

## Teste de infra pode depender de infra

O instrutor destaca que não há problema em usar a rota HTTP (controller) para disparar a criação da answer dentro do teste de evento, porque ambos vivem na camada de infra. Poderia também chamar o repositório diretamente, mas usar a rota é igualmente válido. "As coisas vivem juntas."