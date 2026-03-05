# Code Examples: Navegacao de Paginas no .NET MAUI

## 1. Criando a pagina DoLoginPage

Ao criar a pagina no Visual Studio: **Botao direito > Add > New Item > .NET MAUI > .NET MAUI Content Page (XAML)**

```xml
<!-- DoLoginPage.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Views.Pages.Login.DoLogin.DoLoginPage"
             Title="DoLoginPage">
    <VerticalStackLayout>
        <Label Text="Login" />
    </VerticalStackLayout>
</ContentPage>
```

Nota: O titulo `Title="DoLoginPage"` aparece na NavBar. Pode ser alterado ou deixado vazio.

## 2. Metodo de extensao AddPages completo

```csharp
// MauiProgram.cs
using PlanShare.Views.Pages.Login.DoLogin;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .AddPages()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        return builder.Build();
    }

    private static MauiAppBuilder AddPages(this MauiAppBuilder appBuilder)
    {
        Routing.RegisterRoute(nameof(DoLoginPage), typeof(DoLoginPage));
        return appBuilder;
    }
}
```

### Detalhes importantes:
- `private static` — estatico para ser metodo de extensao
- `this MauiAppBuilder appBuilder` — o `this` torna metodo de extensao
- Retorna `MauiAppBuilder` — permite encadeamento fluente
- `Routing.RegisterRoute` recebe: string da rota + typeof da pagina

## 3. Navegacao na ViewModel

```csharp
// OnboardViewModel.cs
public partial class OnboardViewModel : ObservableObject
{
    [RelayCommand]
    private async Task LoginWithEmailAndPassword()
    {
        await Shell.Current.GoToAsync(nameof(DoLoginPage));
    }
}
```

### Evolucao do codigo:
```csharp
// ANTES (void, sem navegacao)
[RelayCommand]
private void LoginWithEmailAndPassword()
{
    // apenas debug
}

// DEPOIS (async Task, com navegacao)
[RelayCommand]
private async Task LoginWithEmailAndPassword()
{
    await Shell.Current.GoToAsync(nameof(DoLoginPage));
}
```

Mudancas necessarias:
1. `void` → `async Task`
2. Adicionar `await Shell.Current.GoToAsync(...)`
3. Usar `nameof()` em vez de string hardcoded

## 4. AppShell.xaml — paginas raiz

```xml
<!-- AppShell.xaml — paginas que podem ser a primeira do app -->
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:pages="clr-namespace:PlanShare.Views.Pages.Onboard"
       x:Class="PlanShare.AppShell">

    <ShellContent
        ContentTemplate="{DataTemplate pages:OnboardPage}"
        Route="MainPage" />
</Shell>
```

## 5. Escondendo a NavBar (paginas raiz)

```xml
<!-- OnboardPage.xaml — pagina raiz, sem NavBar -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             Shell.NavBarIsVisible="False">
    <!-- conteudo -->
</ContentPage>
```

```xml
<!-- DoLoginPage.xaml — pagina interna, COM NavBar (padrao) -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             Title="">
    <!-- NavBar aparece com botao de voltar -->
    <VerticalStackLayout>
        <Label Text="Login" />
    </VerticalStackLayout>
</ContentPage>
```

## 6. Estrutura de pastas do projeto

```
Views/
└── Pages/
    ├── Onboard/
    │   └── OnboardPage.xaml
    └── Login/
        ├── DoLogin/
        │   └── DoLoginPage.xaml
        └── ForgotPassword/    (futuro)
            └── ...
```