# Deep Explanation: Pagina de Codigo de Conexao com Estado

## Por que uma unica pagina para multiplos estados?

O instrutor enfatiza que as telas de "aguardando codigo", "codigo gerado" e "alguem conectou" sao **a mesma pagina**. A estrategia e "brincar de esconder elemento, mostrar elementos" baseado no status. Isso minimiza a quantidade de arquivos e evita duplicacao de layout — elementos compartilhados (imagem, titulo) ficam em um so lugar.

## O padrao `new` para sobrescrever propriedades observaveis

O ViewModelBase ja possui uma propriedade `StatusPage` do tipo `StatusPage` (enum generico com Default, Send, Load). Para o fluxo de conexao, os estados sao completamente diferentes (GeneratingCode, WaitingForJoiner, JoinerConnectedWaitingApproval).

Ao usar `public new ConnectionByCodeStatusPage statusPage`, voce:
1. Declara explicitamente ao compilador que a intencao e sobrescrever
2. Mantem o tipo correto para binding no XAML
3. Nao precisa alterar o ViewModelBase (que serve outras paginas)

O instrutor destaca: "preciso deixar claro para o compilador que e a minha intencao estar sobrescrevendo".

## BoxView como separador

O .NET MAUI oferece o BoxView como componente versatil para shapes simples. O instrutor mostra que com dimensoes de 160x160 voce tem um quadrado, mas com HeightRequest=1 e sem WidthRequest voce tem uma linha que ocupa toda a largura disponivel. "Se voce nao passar a largura, o .NET MAUI vai ocupar o maximo de espaco possivel."

## Enum de 3 estados do fluxo

1. **GeneratingCode** — "vai gastar um tempinho, alguns segundinhos pra essa pagina se conectar com o hub e invocar o metodo de gerar o code" → exibe skeleton load
2. **WaitingForJoiner** — hub devolveu o codigo → esconde skeleton, mostra codigo
3. **JoinerConnectedWaitingApproval** — alguem usou o codigo, hub notificou → esconde codigo, mostra UI de aprovacao

## AppThemeBinding para cores de linha

A cor do BoxView usa `AppThemeBinding` para alternar automaticamente entre temas light e dark, referenciando cores ja definidas nos resources do app (LinesColorLight / LinesColorDark).

## Organizacao de pastas

- Enum: `Models/ConnectionByCodeStatusPage.cs`
- ViewModel: `ViewModels/Pages/User/Connection/UserConnectionGeneratorViewModel.cs`
- Page XAML: `Views/Pages/User/Connection/UserConnectionGeneratorPage.xaml`
- Page code-behind: `Views/Pages/User/Connection/UserConnectionGeneratorPage.xaml.cs`

O padrao e manter ViewModel e Page com o mesmo nome base, diferenciando apenas o sufixo (ViewModel vs Page).