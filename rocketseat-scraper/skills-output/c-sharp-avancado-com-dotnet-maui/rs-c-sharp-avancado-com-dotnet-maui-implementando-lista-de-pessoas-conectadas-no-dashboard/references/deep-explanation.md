# Deep Explanation: Lista de Pessoas Conectadas no Dashboard

## Por que separar models mesmo com propriedades iguais?

O instrutor (Ellison) enfatiza um ponto importante: existia uma classe `JoinerUser` com `Name` e `PhotoUrl` que poderia ser reutilizada para `ConnectedUser`. Ele escolhe deliberadamente criar uma nova classe porque:

- **JoinerUser** representa uma pessoa *pendente* de aprovacao — nao faz sentido transitar o ID dela antes de saber se sera aprovada
- **ConnectedUser** representa uma pessoa *ja conectada* — tem ID, ja passou pelo fluxo de aprovacao
- Mesmo com duas propriedades "duplicadas", a separacao evita acoplamento entre fluxos distintos
- Se no futuro ConnectedUser precisar de propriedades extras (ex: `LastActiveAt`), nao contamina o JoinerUser

Essa e uma aplicacao do principio de **Single Responsibility** aplicado a models/DTOs.

## Como funciona o DataTemplate tipado

Dentro de um `CollectionView.ItemTemplate > DataTemplate`, o binding context e o *item individual* da lista, nao a ViewModel da pagina. Isso causa dois problemas:

1. **IntelliSense nao funciona** — sem saber o tipo, o Visual Studio nao sugere propriedades
2. **Commands da ViewModel ficam inacessiveis** — o contexto e o item, nao a page

### Solucao para IntelliSense: x:DataType

```xml
<DataTemplate x:DataType="models:ConnectedUser">
```

Isso requer declarar o namespace no ContentPage:
```xml
<ContentPage xmlns:models="clr-namespace:PlanShare.Models">
```

### Solucao para Commands: x:Reference

A "sintaxe maluca" que o instrutor menciona:
```xml
Command="{Binding Path=BindingContext.ConnectionByCodeCommand,
          Source={x:Reference PageDashboard}}"
```

- `Source={x:Reference PageDashboard}` — aponta para o elemento com `x:Name="PageDashboard"`
- `Path=BindingContext.CommandName` — navega pelo BindingContext desse elemento (a ViewModel)

Isso e necessario porque dentro do DataTemplate o contexto e o `ConnectedUser`, nao a ViewModel.

## CornerRadius para circulos

O instrutor explica a formula: para garantir que um elemento seja circular, o `CornerRadius` deve ser **metade** do `HeightRequest` e `WidthRequest` (que devem ser iguais). Ex: 50x50 → CornerRadius 25.

## Scroll bar visibility

Opcoes disponiveis:
- `Default` — comportamento padrao da plataforma
- `Always` — sempre visivel
- `Never` — sempre escondida

Funciona tanto para `HorizontalScrollBarVisibility` quanto `VerticalScrollBarVisibility`. O instrutor prefere esconder para listas horizontais de avatares porque a barra polui visualmente.

## HeaderTemplate vs Footer vs item fixo

O botao "Adicionar" poderia ser colocado de varias formas:
- **Fora da CollectionView** — problema: nao acompanha o scroll
- **Como primeiro item da lista** — problema: mistura dados com acao
- **Como HeaderTemplate** — solucao ideal: fica posicionado antes dos itens, participa do layout horizontal, mas nao e um item de dados

O HeaderTemplate tambem precisa da mesma tecnica de `x:Reference` para commands, ja que tambem esta dentro de um DataTemplate.

## Transicao da ViewModel

O instrutor refatora a ViewModel do dashboard:
- **Antes:** propriedade `Username` (string simples) + `IUserStorage` injetado
- **Depois:** propriedade `Dashboard` (model completo) com `Username` e `ConnectedUsers`

Isso prepara para a integracao com API nas proximas aulas — a ViewModel vai receber o objeto Dashboard inteiro da API em vez de montar propriedades individuais.