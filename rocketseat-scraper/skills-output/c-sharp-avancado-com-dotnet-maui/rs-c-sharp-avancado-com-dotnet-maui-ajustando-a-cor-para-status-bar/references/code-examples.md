# Code Examples: Status Bar Styling no .NET MAUI

## Exemplo 1: Cor fixa para teste rapido

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Class="PlanShare.Pages.OnBoardPage">

    <ContentPage.Behaviors>
        <toolkit:StatusBarBehavior StatusBarColor="Red" />
    </ContentPage.Behaviors>

    <!-- conteudo da pagina -->
</ContentPage>
```

Resultado: barra de status fica vermelha, icones mantem cor padrao.

## Exemplo 2: Cor fixa + estilo dos icones

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior
        StatusBarColor="Red"
        StatusBarStyle="DarkContent" />
</ContentPage.Behaviors>
```

- `LightContent` → icones brancos (para fundos escuros)
- `DarkContent` → icones pretos (para fundos claros)

## Exemplo 3: Completo com AppThemeBinding (producao)

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Class="PlanShare.Pages.OnBoardPage">

    <ContentPage.Behaviors>
        <toolkit:StatusBarBehavior
            StatusBarColor="{AppThemeBinding
                Light={StaticResource PageBackgroundColorLight},
                Dark={StaticResource PageBackgroundColorDark}}"
            StatusBarStyle="{AppThemeBinding
                Light=DarkContent,
                Dark=LightContent}" />
    </ContentPage.Behaviors>

    <!-- conteudo da pagina -->
</ContentPage>
```

Notas:
- `PageBackgroundColorLight` e `PageBackgroundColorDark` sao recursos definidos em `App.xaml` ou `Resources/Styles/`
- O StatusBarStyle e INVERTIDO em relacao ao tema para garantir contraste

## Exemplo 4: Estrategia de paginas raiz

### OnBoardPage.xaml (pagina raiz 1)
```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior
        StatusBarColor="{AppThemeBinding
            Light={StaticResource PageBackgroundColorLight},
            Dark={StaticResource PageBackgroundColorDark}}"
        StatusBarStyle="{AppThemeBinding
            Light=DarkContent,
            Dark=LightContent}" />
</ContentPage.Behaviors>
```

### DashboardPage.xaml (pagina raiz 2)
```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior
        StatusBarColor="{AppThemeBinding
            Light={StaticResource PageBackgroundColorLight},
            Dark={StaticResource PageBackgroundColorDark}}"
        StatusBarStyle="{AppThemeBinding
            Light=DarkContent,
            Dark=LightContent}" />
</ContentPage.Behaviors>
```

### LoginPage.xaml (pagina intermediaria — SEM StatusBarBehavior)
```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Pages.LoginPage">

    <!-- Sem ContentPage.Behaviors — herda da pagina anterior -->

</ContentPage>
```

## Fluxo de heranca visual

```
OnBoard (define azul)
  └── Login (herda azul)
       └── Register (herda azul)

Dashboard (define azul)
  └── Profile (herda azul)
       └── Settings (herda azul)
            └── SpecialPage (define vermelho)
                 └── volta para Settings → VERMELHO
                      └── volta para Profile → VERMELHO
                           └── volta para Dashboard → AZUL (redefine)
```