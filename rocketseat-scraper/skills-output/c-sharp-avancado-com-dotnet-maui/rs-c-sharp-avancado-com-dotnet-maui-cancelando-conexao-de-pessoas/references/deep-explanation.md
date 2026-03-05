# Deep Explanation: Cancelando Conexao de Pessoas

## Por que dois cenarios?

O instrutor (Wilson) destaca que o usuario que gerou o codigo pode cancelar em dois momentos distintos:

1. **Tela de exibicao do codigo** — O codigo esta sendo mostrado, mas ninguem tentou se conectar ainda. Talvez o usuario clicou sem querer. Neste caso, basta remover do dicionario e desconectar. Nenhuma notificacao e necessaria.

2. **Tela de aprovacao** — Alguem ja digitou o codigo e esta aguardando aprovacao. O usuario que gerou o codigo viu o nome e decidiu cancelar (nao conhece a pessoa, mudou de ideia, etc). Neste caso, alem de remover do dicionario, e preciso notificar a pessoa que estava esperando.

## O padrao TryRemove com out var

O `ConcurrentDictionary` oferece `TryRemove` com a mesma sintaxe do `TryGetValue` — usando `out var`. A diferenca e que `TryRemove` atomicamente remove E devolve o valor. Isso e crucial porque:

- Voce precisa do valor removido para tomar decisoes (quem notificar)
- A operacao e thread-safe (Singleton compartilhado entre conexoes)
- Se o codigo nao existir, simplesmente retorna false e a variavel fica null

## Por que ConnectingUserId e nao ConnectingUserConnectionId?

O instrutor menciona que ambos sao preenchidos no mesmo momento (durante o `JoinWithCode`), entao verificar qualquer um dos dois seria equivalente. Ele escolheu `ConnectingUserId` por ser um `Guid?` que tem a propriedade `.HasValue` disponibilizada pelo .NET para tipos nullable.

## Decisao: sem argumentos no OnCancelled

O instrutor argumenta explicitamente: "Pra que a gente vai passar algum argumento? Que tipo de argumento?" A funcao `OnCancelled` no cliente so sera chamada quando o cancelamento acontecer. O cliente ja esta naquele contexto de espera — receber a notificacao ja e informacao suficiente para saber o que aconteceu.

## Null-forgiving operator (!)

Apos verificar `connection.ConnectingUserId.HasValue` no if, o compilador C# ainda reclama que `ConnectingUserConnectionId` pode ser null. O `!` diz ao compilador: "eu ja verifiquei, confia em mim". Isso e seguro porque ambas as propriedades sao preenchidas juntas.

## Fluxo completo demonstrado

1. Ellison conecta ao Hub (handshake)
2. Ellison gera codigo (ex: 771463)
3. **Cenario 1:** Ellison cancela → dicionario limpo, sem notificacao
4. Ellison gera novo codigo (ex: 681921)
5. Edeline conecta ao Hub (handshake)
6. Edeline envia o codigo 681921 (JoinWithCode)
7. Ellison recebe notificacao de que Edeline quer se conectar
8. **Cenario 2:** Ellison cancela → dicionario limpo, Edeline recebe OnCancelled