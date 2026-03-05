# Code Examples: Estrutura de Projeto e Navegacao .NET MAUI

## 1. AppShell.xaml — versao padrao (antes)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Shell
    x:Class="PlanShare.App.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:PlanShare.App"
    Shell.FlyoutBehavior="Disabled">

    <ShellContent
        Title="Home"
        ContentTemplate="{DataTemplate local:MainPage}"
        Route="MainPage" />

</Shell>
```

## 2. AppShell.xaml — versao configurada (depois)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Shell
    x:Class="PlanShare.App.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:onboarding="clr-namespace:PlanShare.App.Views.Pages.Onboarding">

    <ShellContent
        ContentTemplate="{DataTemplate onboarding:OnboardPage}"
        Shell.NavBarIsVisible="False" />

</Shell>
```

Mudancas feitas:
- Removido `xmlns:local` (nao aponta mais para raiz)
- Adicionado `xmlns:onboarding` apontando para o namespace correto
- Removido `Shell.FlyoutBehavior="Disabled"` (nao necessario sem flyout items)
- Removido `Title` e `Route` do ShellContent
- Adicionado `Shell.NavBarIsVisible="False"`

## 3. OnboardPage.xaml — pagina criada

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="PlanShare.App.Views.Pages.Onboarding.OnboardPage"
    Shell.NavBarIsVisible="False">

    <VerticalStackLayout>
        <Label
            Text="Welcome to .NET MAUI!"
            VerticalOptions="Center"
            HorizontalOptions="Center" />
    </VerticalStackLayout>

</ContentPage>
```

O label "Welcome to .NET MAUI!" vem por padrao ao criar uma nova Content Page. Sera substituido pelo conteudo real do onboarding nas proximas aulas.

## 4. OnboardPage.xaml.cs — code-behind

```csharp
namespace PlanShare.App.Views.Pages.Onboarding;

public partial class OnboardPage : ContentPage
{
    public OnboardPage()
    {
        InitializeComponent();
    }
}
```

Note que o namespace reflete exatamente a estrutura de pastas: `PlanShare.App.Views.Pages.Onboarding`.

## 5. AppShell.xaml.cs — code-behind (vazio por enquanto)

```csharp
namespace PlanShare.App;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
    }
}
```

Futuramente, a logica de selecao de pagina inicial (onboard vs dashboard) sera adicionada aqui.

## 6. Estrutura de pastas final

```
PlanShare.App/
├── MauiProgram.cs
├── App.xaml
├── App.xaml.cs
├── AppShell.xaml
├── AppShell.xaml.cs
├── Views/
│   └── Pages/
│       └── Onboarding/
│           ├── OnboardPage.xaml
│           └── OnboardPage.xaml.cs
└── Resources/
    ├── Fonts/
    ├── Images/         ← imagens padrao removidas
    └── Styles/
```

## 7. Removendo a Navigation Bar

Para remover a barra de navegacao que aparece por padrao:

```xml
<!-- Na propria pagina -->
<ContentPage Shell.NavBarIsVisible="False">

<!-- OU no ShellContent do AppShell -->
<ShellContent Shell.NavBarIsVisible="False" ... />
```

Ambas as abordagens funcionam. O instrutor aplicou no ShellContent.

## 8. Multiplos ShellContent (preparacao futura)

```xml
<Shell>
    <!-- Pagina para primeiro acesso -->
    <ShellContent
        ContentTemplate="{DataTemplate onboarding:OnboardPage}"
        Shell.NavBarIsVisible="False" />

    <!-- Pagina para usuario autenticado -->
    <ShellContent
        ContentTemplate="{DataTemplate dashboard:DashboardPage}"
        Shell.NavBarIsVisible="False" />
</Shell>
```

A selecao de qual exibir sera controlada no code-behind do AppShell baseado no estado de autenticacao do usuario.