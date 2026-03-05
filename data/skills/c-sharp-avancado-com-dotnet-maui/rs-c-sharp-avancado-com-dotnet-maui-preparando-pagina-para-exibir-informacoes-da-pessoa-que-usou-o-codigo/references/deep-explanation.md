# Deep Explanation: Toggle de Visibilidade com DataTriggers

## Por que DataTriggers e nao code-behind?

O instrutor enfatiza que no .NET MAUI, um ContentPage so aceita um unico layout raiz. Isso cria um problema quando voce precisa alternar entre dois estados visuais completamente diferentes na mesma pagina (ex: tela de gerar codigo vs tela de aprovar conexao).

A solucao arquitetural e criar um VerticalStackLayout pai que contem dois VerticalStackLayout filhos — um para cada estado. A visibilidade de cada um e controlada declarativamente via DataTriggers vinculados a uma propriedade observavel de status na ViewModel.

## O padrao de triggers inversos

O conceito central e que os dois layouts tem triggers **inversos**:
- Layout A (estado inicial): visivel por padrao, trigger seta `IsVisible=False` quando status muda
- Layout B (estado alternativo): `IsVisible="False"` por padrao, trigger seta `IsVisible=True` quando status muda

Isso garante que em qualquer momento, apenas um layout esta visivel. O trigger reage ao mesmo valor de enum (`JoinerConnectedPendingApproval`), mas com efeitos opostos.

## A propriedade JoinerUser

O instrutor criou uma classe modelo `JoinerUser` na pasta `Models/` com duas propriedades:
- `Name` (string): nome da pessoa que usou o codigo
- `ProfilePhotoUrl` (string?): URL da foto, inicialmente nula

Na ViewModel (`UserConnectionGeneratorViewModel`), uma propriedade observavel `JoinerUser` do tipo `JoinerUser` e preenchida quando o Hub SignalR envia a mensagem de que alguem utilizou o codigo.

## Converters: logica de apresentacao fora da ViewModel

O instrutor reutiliza o converter `NameToAvatarName` que ja existia no projeto (usado no Dashboard). O converter transforma o nome completo nas iniciais para exibir no AvatarView. A chave e que essa transformacao e **logica de apresentacao** — pertence ao XAML layer, nao a ViewModel.

Para registrar o converter:
1. Adicionar namespace: `xmlns:converters="clr-namespace:PlanShare.App.Converters"`
2. Declarar em `ContentPage.Resources`: `<converters:NameToAvatarConverter x:Key="NameToAvatarName" />`
3. Usar no binding: `Converter={StaticResource NameToAvatarName}`

## TextTransform vs Resource Files

Detalhe importante: o botao "ACEITAR" aparece em uppercase no design. Em vez de escrever "ACEITAR" no arquivo de resource (o que seria fragil e inconsistente), o instrutor usa `TextTransform="Uppercase"` no XAML. O .NET MAUI aplica a transformacao em runtime, mantendo o resource file limpo com a capitalizacao natural ("Aceitar"/"Accept").

## AvatarView do Community Toolkit

O componente `toolkit:AvatarView` vem do .NET MAUI Community Toolkit. Propriedades chave:
- `BackgroundColor`: usa `AppThemeBinding` para suportar light/dark mode
- `BorderWidth="0"`: sem borda
- `FontFamily`: fonte para as iniciais
- `FontSize`: tamanho das iniciais
- `HeightRequest`/`WidthRequest`: dimensoes do avatar
- `CornerRadius`: metade da dimensao para circulo perfeito
- `TextColor`: cor das iniciais, tambem com theme binding
- `Text`: binding com converter para extrair iniciais

## Fluxo completo do status da pagina

```
Initialize() → StatusPage = GeneratingCode
                ↓
            API retorna codigo
                ↓
            StatusPage = WaitingForJoiner
                ↓
            Hub recebe mensagem (alguem usou o codigo)
                ↓
            StatusPage = JoinerConnectedPendingApproval
                ↓
            Layout A esconde, Layout B aparece
                ↓
            Usuario aceita ou cancela conexao
```