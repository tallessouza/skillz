# Deep Explanation: Tratando Mensagens do Hub no ViewModel

## Por que quatro handlers separados?

O instrutor identifica quatro cenarios distintos que o Hub pode comunicar ao cliente que usou o codigo (Joiner):

1. **onCancelled** — A pessoa que gerou o codigo cancelou a operacao manualmente
2. **onConnectionConfirmed** — A pessoa que gerou o codigo aprovou a conexao
3. **onUserDisconnected** — A pessoa que gerou o codigo perdeu conexao (Wi-Fi caiu, app fechou)
4. **onConnectionErrorOccurrence** — Erro desconhecido no servidor durante o fluxo

Cada um precisa de feedback diferente porque o contexto emocional do usuario e diferente: aprovacao e positiva, cancelamento e neutro/negativo, desconexao e frustrante, erro e preocupante.

## A importancia da string exata

O instrutor enfatiza varias vezes: a string passada para `connection.On("nomeExato", handler)` precisa ser **identica** a string usada no `Clients.Client(connectionId).SendAsync("nomeExato")` no Hub do servidor. Ele usa Ctrl+C/Ctrl+V para evitar erros de digitacao. Uma letra diferente e o handler nunca sera chamado — falha silenciosa.

## Tipo generico vs sem tipo generico

Quando o Hub envia uma mensagem sem payload (apenas notificacao), o `On` nao precisa de tipo generico:
```csharp
_connection.On("onCancelled", OnCancelled); // sem <>
```

Quando o Hub envia dados junto, voce precisa do tipo:
```csharp
_connection.On<UserInfo>("onUserJoined", OnUserJoined); // com <>
```

Nos quatro handlers desta aula, nenhum recebe parametros — sao apenas sinais de que algo aconteceu.

## Por que o GeneratedBy ja esta disponivel?

O instrutor antecipa a duvida: "Mas eu tenho certeza que vou ter o nome da pessoa aqui?" Sim, porque se o Hub disparou qualquer uma dessas mensagens, e porque o fluxo ja passou pelo ponto onde o Joiner recebeu as informacoes da pessoa que gerou o codigo (GeneratedBy foi preenchido). A sequencia do fluxo garante isso.

## Feedback de falha vs tipo customizado

O instrutor opta por reutilizar `FeedbackType.Failure` para cancelamento, desconexao e erro, mas explica que voce poderia criar um terceiro tipo (nem sucesso nem falha) para o cancelamento, ja que tecnicamente nao e um erro. Fica a criterio do desenvolvedor. O importante e que o usuario receba algum feedback.

## O Exception Hub Filter e o onConnectionErrorOccurrence

No servidor, existe um `UserConnectionsExceptionHubFilter` que funciona como um middleware. Ele tenta executar a funcao do Hub e, se uma excecao for lancada, captura e retorna falha para quem chamou. Mas quando a excecao acontece no fluxo da pessoa que GEROU o codigo, quem USOU o codigo precisa ser notificado separadamente — por isso existe a mensagem `onConnectionErrorOccurrence`.

## Resource files e internacionalizacao

O instrutor usa arquivos de resource (.resx) para mensagens, permitindo internacionalizacao. Ele adiciona a chave (name) e o valor no idioma neutro (ingles), depois preenche traducoes (portugues). O Visual Studio pode mostrar erros falso-positivos temporarios porque o arquivo C# gerado automaticamente ainda nao foi atualizado — isso resolve sozinho.