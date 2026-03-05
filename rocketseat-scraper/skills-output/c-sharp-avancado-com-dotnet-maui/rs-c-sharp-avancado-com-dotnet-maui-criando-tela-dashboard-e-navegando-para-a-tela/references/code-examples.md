# Code Examples: Dashboard Page e Navegacao Root

## Exemplo completo: DashboardPage.xaml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Dashboard"
             x:Class="PlanShare.App.Views.Pages.Dashboard.DashboardPage"
             x:DataType="viewModel:DashboardViewModel"
             Shell.NavBarIsVisible="False">

    <Label Text="Dashboard" />

</ContentPage>
```

## Exemplo completo: DashboardPage.xaml.cs (CodeBehind)

```csharp
namespace PlanShare.App.Views.Pages.Dashboard;

public partial class DashboardPage : ContentPage
{
    public DashboardPage(DashboardViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## Exemplo completo: DashboardViewModel.cs

```csharp
namespace PlanShare.App.ViewModels.Pages.Dashboard;

public partial class DashboardViewModel : ViewModelBase
{
}
```

## Registro no MauiProgram.cs

```csharp
// Apenas a ViewModel — pagina registrada via AppShell
builder.Services.AddTransient<DashboardViewModel>();
```

## AppShell.xaml com duas paginas root

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:onboarding="clr-namespace:PlanShare.App.Views.Pages.Onboarding"
       xmlns:dashboard="clr-namespace:PlanShare.App.Views.Pages.Dashboard"
       x:Class="PlanShare.App.AppShell">

    <!-- ORDEM IMPORTA: primeiro item = pagina inicial -->
    <ShellContent ContentTemplate="{DataTemplate onboarding:OnboardingPage}"
                  Route="{x:Static routes:Pages.OnboardingPage}" />

    <ShellContent ContentTemplate="{DataTemplate dashboard:DashboardPage}"
                  Route="{x:Static routes:Pages.DashboardPage}" />

</Shell>
```

## Navegacao root no LoginViewModel

```csharp
// Dentro do metodo de login
if (result.IsSuccess)
{
    // Double slash = fecha tudo, define como root
    await Shell.Current.GoToAsync($"//{Routes.Pages.DashboardPage}");
}
else
{
    // Navegacao normal (empilha)
    await Shell.Current.GoToAsync(Routes.Pages.ErrorPage);
}
```

## Navegacao root no RegisterViewModel (mesmo padrao)

```csharp
if (result.IsSuccess)
{
    await Shell.Current.GoToAsync($"//{Routes.Pages.DashboardPage}");
}
else
{
    await Shell.Current.GoToAsync(Routes.Pages.ErrorPage);
}
```

## Constante de rota

```csharp
namespace PlanShare.App.Navigation;

public static class Pages
{
    public const string OnboardingPage = "OnboardingPage";
    public const string DashboardPage = "DashboardPage";
    public const string ErrorPage = "ErrorPage";
}
```

## Comparacao: navegacao normal vs root

```csharp
// ERRADO para login -> dashboard: empilha, login fica "embaixo"
await Shell.Current.GoToAsync(Routes.Pages.DashboardPage);

// CORRETO: fecha tudo, dashboard vira main page
await Shell.Current.GoToAsync($"//{Routes.Pages.DashboardPage}");
```