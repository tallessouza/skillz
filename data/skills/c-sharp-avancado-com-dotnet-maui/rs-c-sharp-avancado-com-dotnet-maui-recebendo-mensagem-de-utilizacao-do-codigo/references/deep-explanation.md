# Deep Explanation: Recebendo Mensagens do Hub via SignalR

## Por que configurar On() antes do StartAsync?

O instrutor Ellison explica que nao da erro configurar depois, mas existe um risco real: se voce faz uma chamada a um metodo no Hub, e o Hub responde com uma mensagem diferente (em outra chamada), e voce ainda nao configurou o `On()` para aquela mensagem, voce perde a mensagem silenciosamente. Nao ha erro, nao ha exception — simplesmente nao acontece nada.

Por isso a convencao e: **sempre configure todas as mensagens que o connection pode receber antes de fazer o Start**. Pode ser no construtor (preferencia do instrutor) ou no Initialize, desde que seja antes do `StartAsync()`.

## Onde colocar: Construtor vs Initialize

O instrutor prefere o construtor porque o Initialize tende a ficar grande e poluido. O construtor e o lugar natural para configuracao inicial. A unica restricao e que o `On()` deve vir depois do `CreateClient()` (que cria a instancia do `_connection`).

## Separacao de responsabilidades: Response vs Entidade

Este e o ponto mais enfatizado da aula. O instrutor faz uma analogia direta com APIs backend:

> "E a mesma coisa de eu receber na minha API um objeto de JSON Response pra cadastrar uma pessoa — as propriedades sao as mesmas do banco de dados, nao e por isso que a gente vai utilizar o request/response como entidade."

O `ResponseConnectingUserJson` tem responsabilidade de **transportar dados da API para o app**. Nao e responsabilidade dele ser uma propriedade observavel. O `JoinerUser` e a **entidade da camada de apresentacao**, que pode evoluir independentemente.

Mesmo que hoje as propriedades sejam identicas, duplicar o codigo e a forma correta. Cada classe tem sua responsabilidade e seu ciclo de vida.

## Delegate vs invocacao de funcao

O instrutor destaca explicitamente: ao passar `onUserJoins` como parametro do `On()`, voce passa **sem parenteses**. Com parenteses (`onUserJoins()`), voce estaria executando a funcao naquele momento e passando o retorno (void) como parametro — o que causaria erro.

## O que importa na assinatura do handler

O instrutor enfatiza: **o nome da funcao nao importa**. Voce pode chamar de qualquer coisa. O que importa e:

1. O **tipo do parametro** deve ser exatamente o tipo que o Hub envia via `SendAsync`
2. A **string do primeiro parametro do On()** deve ser identica a string usada no `SendAsync` do Hub

Se qualquer um desses estiver errado, a mensagem sera silenciosamente ignorada.

## Fluxo completo da mensagem

```
1. Usuario A gera codigo de conexao (Hub cria grupo)
2. Usuario B envia codigo via Hub (JoinWithCode)
3. Hub processa, chama SendAsync("OnUserJoineds", responseJson) para Usuario A
4. Connection de Usuario A captura via On<ResponseConnectingUserJson>("OnUserJoineds", handler)
5. Handler atualiza JoinerUser e StatusPage
6. UI reage as propriedades observaveis e mostra informacoes do Usuario B
```