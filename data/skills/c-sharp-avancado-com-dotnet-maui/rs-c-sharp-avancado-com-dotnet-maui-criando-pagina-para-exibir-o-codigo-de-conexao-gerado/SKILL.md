---
name: rs-csharp-maui-connection-code-page
description: "Generates .NET MAUI pages that display connection codes with state-driven UI visibility. Use when user asks to 'create a connection page', 'show a generated code', 'toggle UI elements based on status', 'hide and show elements by state', or 'implement enum-based page states in MAUI'. Applies patterns: enum for page states, ViewModel property hiding with new keyword, BoxView for line separators, resource text bindings. Make sure to use this skill whenever building MAUI pages that change visible elements based on connection or pairing status. Not for SignalR hub logic, API integration, or backend code generation."
---

# Pagina de Codigo de Conexao com Estado em .NET MAUI

> Implemente paginas MAUI que alternam elementos visiveis com base em um enum de status, reaproveitando uma unica pagina para multiplos estados visuais.

## Rules

1. **Uma pagina, multiplos estados** — nao crie paginas separadas para cada etapa do fluxo, porque esconder/mostrar elementos via binding reduz arquivos e simplifica navegacao
2. **Enum especifico por fluxo** — crie um enum dedicado ao invés de reutilizar o enum generico StatusPage, porque cada fluxo tem estados proprios
3. **Sobrescreva com `new`** — ao redeclarar uma propriedade observavel do ViewModelBase com tipo diferente, use `public new` para deixar explicita a intencao ao compilador
4. **BoxView para linhas** — use BoxView com HeightRequest=1 e sem WidthRequest para criar separadores horizontais que ocupam toda a largura disponivel
5. **Textos via Resource** — nunca hardcode strings na UI, use arquivos de resource com chaves descritivas como `TitleShareTasks`, `SubtitleConnectionByCode`
6. **Registre pagina + ViewModel + rota** — toda nova pagina exige configuracao no MauiProgram: pagina, ViewModel e rota associada

## Steps

### Step 1: Criar enum de status do fluxo

```csharp
// Models/ConnectionByCodeStatusPage.cs
public enum ConnectionByCodeStatusPage
{
    GeneratingCode,        // Skeleton load enquanto conecta ao hub
    WaitingForJoiner,      // Codigo visivel, aguardando alguem usar
    JoinerConnectedWaitingApproval  // Alguem conectou, aguardando aprovacao
}
```

### Step 2: Criar ViewModel com propriedade sobrescrita

```csharp
// ViewModels/Pages/User/Connection/UserConnectionGeneratorViewModel.cs
public partial class UserConnectionGeneratorViewModel : ViewModelBase
{
    [ObservableProperty]
    public new ConnectionByCodeStatusPage statusPage;
}
```

### Step 3: Criar a pagina XAML

```xml
<ContentPage xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Pages.User.Connection"
             x:DataType="viewmodel:UserConnectionGeneratorViewModel">

    <VerticalStackLayout>
        <Image Source="sweet_cats" HorizontalOptions="Center" />

        <Label Text="{x:Static resourceTexts:ResourceTexts.TitleShareTasks}"
               Style="{StaticResource PageTitle}"
               Margin="0,50,0,10" />

        <Label Text="{x:Static resourceTexts:ResourceTexts.SubtitleConnectionByCode}" />

        <Label Text="123456"
               FontFamily="{x:Static fontFamily:FontFamily.MainFonts}"
               FontSize="60"
               HorizontalOptions="Center"
               Margin="0,30,0,40" />

        <BoxView Color="{AppThemeBinding
                   Light={StaticResource LinesColorLight},
                   Dark={StaticResource LinesColorDark}}"
                 HeightRequest="1" />

        <Button Style="{StaticResource DangerousButtonStyle}"
                Text="{x:Static resourceTexts:ResourceTexts.TitleCancelOperation}"
                Margin="0,70,0,0" />
    </VerticalStackLayout>
</ContentPage>
```

### Step 4: Configurar code-behind

```csharp
public partial class UserConnectionGeneratorPage : ContentPage
{
    public UserConnectionGeneratorPage(UserConnectionGeneratorViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### Step 5: Registrar no MauiProgram

```csharp
// Dentro de AddPages()
builder.Services.AddTransientWithRoute<UserConnectionGeneratorPage,
    UserConnectionGeneratorViewModel>(RoutePages.UserConnectionGeneratorPage);
```

### Step 6: Navegar a partir do Dashboard

```csharp
// DashboardViewModel - apos popup retornar opcao selecionada
var optionSelected = await NavigationService.ShowPopup<OptionResult>();
switch (optionSelected)
{
    case GenerateCode:
        await NavigationService.NavigateTo(RoutePages.UserConnectionGeneratorPage);
        break;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Fluxo com 2+ estados visuais na mesma tela | Crie enum dedicado + esconda/mostre via binding |
| Propriedade do ViewModelBase nao serve pro fluxo | Sobrescreva com `public new` e tipo especifico |
| Precisa de linha separadora simples | BoxView com HeightRequest=1, sem WidthRequest |
| Texto fixo na UI | Extraia para arquivo de Resource com chave descritiva |
| Pagina nova criada | Registre pagina + ViewModel + rota no MauiProgram |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar 3 paginas para 3 estados do mesmo fluxo | Uma pagina com visibilidade controlada por enum |
| Sobrescrever propriedade sem `new` | `public new ConnectionByCodeStatusPage statusPage` |
| Hardcode de strings no XAML | `{x:Static resourceTexts:ResourceTexts.ChaveDescritiva}` |
| Criar linha com `<Line>` ou `<Border>` | `<BoxView HeightRequest="1" />` |
| Esquecer de registrar no MauiProgram | Sempre configurar pagina + ViewModel + rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
