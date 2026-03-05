# Deep Explanation: Tratamento de Conexoes Perdidas em SignalR

## Por que conexoes caem?

O instrutor (Wellerson) apresenta tres cenarios reais e cotidianos:

1. **Perda de internet** — o usuario esta usando o app normalmente e a conexao de rede cai. Sem internet, o WebSocket morre.
2. **Fechamento acidental do app** — o usuario fecha o app sem querer. O app precisa estar aberto para manter a conexao ativa com o Hub.
3. **Bateria acabou** — o telefone desliga, a conexao cai junto.

Esses tres cenarios sao "forca maior" — o servidor nao tem controle sobre eles.

## O problema do OnDisconnectedAsync

O ponto central da aula e que `OnDisconnectedAsync` e um override de um metodo do proprio Hub do SignalR. Voce nao pode adicionar parametros a ele. Voce nao recebe o "codigo" que o usuario tinha gerado, nem o contexto do usuario. O unico dado disponivel e `Context.ConnectionId`.

O instrutor enfatiza: **"a gente precisa se virar com o que a gente tem disponivel nessa funcao"**. E o que se tem e apenas o ID da conexao.

## A solucao: dicionario reverso

Para resolver isso, o instrutor renomeia o dicionario existente para `connectionsByCode` (chave = codigo, valor = DTO) e cria um segundo dicionario `codesByConnectionId` (chave = connection ID, valor = codigo).

Com isso, no `OnDisconnectedAsync`, voce:
1. Recebe o connection ID
2. Busca o codigo associado no dicionario reverso
3. Com o codigo, busca as informacoes completas no dicionario principal
4. Age conforme o cenario

## Os tres cenarios de desconexao e o que fazer em cada um

### Cenario 1: Conectou e desconectou sem fazer nada
- **Acao:** Nada. A pessoa nao gerou codigo, nao chamou nenhum metodo. O dicionario reverso nao tem entrada para esse connection ID.

### Cenario 2: Conectou, gerou codigo, desconectou (sem par)
- **Acao:** Apenas remover as informacoes do dicionario. Ninguem leu aquele codigo, ninguem esta esperando. Limpar e seguir.

### Cenario 3: Conectou, gerou codigo, outra pessoa leu o codigo e esta esperando
- **Sub-cenario A:** Quem caiu foi a pessoa que leu o codigo (esta esperando aprovacao). **Acao:** Nada de especial. O fluxo depende da pessoa que gerou o codigo, nao de quem esta esperando.
- **Sub-cenario B:** Quem caiu foi a pessoa que gerou o codigo. **Acao:** Notificar a pessoa que esta esperando que o gerador caiu.

## Por que nao enviar mensagem textual do servidor

O instrutor explica que o servidor esta executando no contexto da conexao da pessoa que **gerou** o codigo (e caiu). Se voce enviar uma mensagem como "Fulano perdeu a conexao", ela estaria na cultura/idioma errado — seria o idioma do gerador, nao do destinatario.

A responsabilidade de formatar a mensagem no idioma correto e do **aplicativo** do destinatario. O servidor so envia o tipo de evento: `OnUserDisconnected`.

## Short-circuit evaluation em C#

O instrutor destaca que C# e "preguicoso" com operadores `&&`. Na expressao:

```csharp
if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())
```

Se `connection` for null, o C# nem avalia a segunda parte. Isso evita `NullReferenceException`. A **ordem importa** — sempre coloque a verificacao de null primeiro.

## OnDisconnectedAsync tambem executa em desconexoes propositais

Ponto importante: essa funcao nao e chamada apenas em desconexoes acidentais. Quando o fluxo normal termina (aprovacao/cancelamento feitos), o app se desconecta propositalmente e `OnDisconnectedAsync` tambem executa. Por isso todas as verificacoes de null sao necessarias — o `RemoveConnection` pode ja ter sido chamado antes.

## Divida tecnica reconhecida

O instrutor reconhece explicitamente que o codigo tem uma divida: o dicionario reverso (`codesByConnectionId`) nunca tem seus itens removidos nesta aula. Ele explica que isso sera tratado na proxima aula quando um novo cenario de excecao for coberto.