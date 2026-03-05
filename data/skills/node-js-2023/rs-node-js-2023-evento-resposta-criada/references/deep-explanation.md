# Deep Explanation: Domain Events — Evento de Resposta Criada

## Por que um evento por acao de dominio?

O instrutor enfatiza que "para cada evento que vai acontecer na nossa aplicacao, que a gente quer ouvir que aquele evento aconteceu, a gente vai criar uma classe." Isso nao e overhead — e o principio de que cada evento carrega contexto proprio. Um `AnswerCreatedEvent` sabe que carrega uma `Answer`, enquanto um `QuestionCreatedEvent` carrega uma `Question`. Tentar generalizar com um unico `EntityCreatedEvent` perderia type safety e clareza.

## A armadilha do metodo `create`

Este e o insight mais importante da aula. O instrutor explica com clareza:

> "O metodo create, por mais que ele tenha esse nome, ele e para criar uma referencia para uma answer ja existente. Eu so sei que a answer foi criada mesmo se o meu id aqui, ele vier vazio, porque dai quer dizer que e uma answer nova."

O padrao de factory method `create(props, id?)` em DDD serve dois propositos:
1. **Sem id:** Criacao real de entidade nova → deve disparar evento
2. **Com id:** Hidratacao/reconstituicao de entidade existente (ex: vindo do banco) → NAO deve disparar evento

Se voce dispara o evento incondicionalmente, toda vez que o repositorio carregar uma Answer do banco, o sistema vai notificar como se fosse uma nova resposta. Isso gera notificacoes duplicadas, side-effects indesejados e bugs dificeis de rastrear.

## Variavel semantica `isNewAnswer`

O instrutor faz questao de extrair a condicao para uma variavel nomeada:

```typescript
const isNewAnswer = !id
if (isNewAnswer) {
  answer.addDomainEvent(new AnswerCreatedEvent(answer))
}
```

Isso e mais legivel que `if (!id)` direto. A variavel comunica a INTENCAO do check, nao apenas a mecanica. Quem le o codigo entende imediatamente o que significa sem precisar inferir.

## Aggregate vs Entity

A Answer precisa ser transformada de `Entity` para `AggregateRoot` para poder disparar eventos. O instrutor observa:

> "Na verdade, a Answer ate tem aqui a lista de attachments, entao faz sentido ela ser um agregado."

Dois motivos para ser Aggregate:
1. **Tecnico:** Apenas agregados tem o metodo `addDomainEvent` (herdado de `AggregateRoot`)
2. **Conceitual:** A Answer ja gerencia uma colecao filha (attachments), o que e o caso classico de agregado em DDD

## Estrutura de pastas

Os eventos ficam em `domain/{bounded-context}/enterprise/events/`. Isso segue a separacao por bounded context — o evento pertence ao dominio do Forum, nao a infraestrutura.

## Sobre testes

O instrutor menciona que poderia criar um teste especifico para verificar que o evento e adicionado quando a resposta e criada, mas considera que nesse caso nao ha tanta necessidade. O mais importante e rodar todos os testes existentes para garantir que nada quebrou com a mudanca de Entity para AggregateRoot.

## Proximo passo: Subscriber

A aula termina com o gancho: "agora que a gente ja esta criando o evento, eu tenho que do outro lado, na parte de notificacao, ouvir o evento." Isso mostra o padrao completo: Publisher (este evento) → Subscriber (proxima aula). O evento e so metade do sistema.