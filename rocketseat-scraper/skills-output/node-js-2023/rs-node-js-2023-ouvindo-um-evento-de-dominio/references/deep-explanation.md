# Deep Explanation: Ouvindo Eventos de Domínio

## Por que o Subscriber fica em Application e não em Enterprise?

O instrutor explica com clareza a separação de camadas: entidades em Enterprise são "código puro" — dependem apenas da linguagem, sem dependências externas. Já o subscriber, assim como um caso de uso, precisa acessar repositórios e outras dependências via inversão de dependência. Por isso mora em `application/subscribers/`.

A analogia é direta: **subscriber ≈ use case** em termos de posição arquitetural, mas com papel diferente — é uma ponte entre subdomínios, não um executor de regra de negócio.

## O problema do `this` em JavaScript e o papel do `.bind()`

Este é um ponto crítico que o instrutor antecipa antes de acontecer o erro. O fluxo é:

1. `OnAnswerCreated` registra `this.sendNewAnswerNotification` no `DomainEvents.register`
2. Mais tarde, `DomainEvents` chama essa função durante o `dispatch`
3. Quando `DomainEvents` chama a função, o `this` dentro dela passa a ser o contexto de `DomainEvents`, não de `OnAnswerCreated`
4. Sem `.bind(this)`, acessar `this.sendNotification` (o use case injetado) resultaria em `undefined`

O instrutor chama isso de "hackzinho que a gente usa no JavaScript desde muito tempo" — `.bind(this)` congela o contexto `this` no momento do registro, garantindo que não importa quem chame a função, `this` sempre referencia a instância de `OnAnswerCreated`.

## O fluxo completo do evento

O instrutor traça o caminho completo:

```
1. Answer é criada (new Answer()) → evento adicionado à lista interna
2. Repository.create(answer) → chama DomainEvents.dispatchEventsForAggregate(answer.id)
3. DomainEvents encontra handlers registrados para AnswerCreatedEvent
4. Chama cada handler → que é a função passada no register()
5. A função (com bind) executa no contexto do subscriber
6. Subscriber delega para use case
```

Ponto importante: o dispatch acontece no **repositório**, não na entidade. Isso porque o evento só deve ser disparado quando a persistência é confirmada — criar a entidade em memória não é suficiente.

## Por que métodos nomeados e não apenas `execute`?

O instrutor explica que um subscriber pode ouvir múltiplos eventos ou reagir de múltiplas formas ao mesmo evento. Se fosse apenas `execute`, não haveria como registrar múltiplos handlers no mesmo `setupSubscriptions`. Por isso nomes como `sendNewAnswerNotification` são preferíveis.

## O padrão de teste para subscribers

O teste segue uma sequência precisa que o instrutor demonstra com erros reais:

1. **Instanciar o subscriber** — isso ativa `setupSubscriptions` e registra os listeners
2. **Criar a entidade** — `makeAnswer()` cria com ID undefined, disparando a criação do evento interno
3. **Salvar no repositório** — `repository.create(answer)` chama `dispatchEventsForAggregate`
4. **Verificar o efeito** — o handler foi chamado

O instrutor errou primeiro ao esquecer de chamar `repository.create()` — o `makeAnswer()` sozinho cria o evento na entidade, mas não o despacha. O dispatch só acontece via repositório.

## O detalhe do TypeScript sobre `new` para side effects

Quando instanciamos `new OnAnswerCreated()` sem salvar numa variável, o linter reclama porque o `new` está sendo usado apenas por efeito colateral (o construtor chama `setupSubscriptions`). A solução prática: `const _onAnswerCreated = new OnAnswerCreated(...)` — o underline indica variável intencionalmente não utilizada.

## Subscriber como ponte entre subdomínios

O insight mais importante da aula: o subscriber existe no subdomínio de **notificação**, mas ouve eventos do subdomínio de **fórum**. Ele é literalmente a ponte entre os dois bounded contexts. Por isso deve ter o mínimo de lógica — sua responsabilidade é conectar, não processar.