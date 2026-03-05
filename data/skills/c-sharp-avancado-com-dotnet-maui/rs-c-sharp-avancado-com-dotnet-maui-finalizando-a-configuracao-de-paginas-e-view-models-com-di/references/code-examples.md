# Code Examples: Configuracao de DI para Pages e ViewModels no .NET MAUI

## Exemplo completo: MauiProgram.cs

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();

        // Pagina normal — registra Page + ViewModel + rota
        builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>("DoLogin");
        builder.Services.AddTransientWithShellRoute<RegisterUserAccountPage, RegisterUserAccountViewModel>("RegisterUserAccount");

        // Pagina especial (declarada no AppShell) — registra APENAS a ViewModel
        builder.Services.AddTransient<OnboardingViewModel>();

        return builder.Build();
    }
}
```

## ViewModelBase

```csharp
// ViewModels/Pages/ViewModelBase.cs
namespace PlanShare.App.ViewModels.Pages;

public abstract partial class ViewModelBase : ObservableObject
{
    // Futuramente: propriedades compartilhadas como IsLoading, CurrentUser, etc.
}
```

## ViewModel concreta

```csharp
// ViewModels/Pages/User/Register/RegisterUserAccountViewModel.cs
namespace PlanShare.App.ViewModels.Pages.User.Register;

public partial class RegisterUserAccountViewModel : ViewModelBase
{
}
```

## Code-Behind com DI

```csharp
public partial class RegisterUserAccountPage : ContentPage
{
    public RegisterUserAccountPage(RegisterUserAccountViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## XAML com DataType

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.User.Register"
             x:DataType="viewModel:RegisterUserAccountViewModel"
             x:Class="PlanShare.App.Pages.User.Register.RegisterUserAccountPage">
    <!-- conteudo -->
</ContentPage>
```

## OnboardingPage Code-Behind

```csharp
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## O que NAO fazer: registro duplicado de rota

```csharp
// ERRADO — vai lancar excecao em tempo de execucao
builder.Services.AddTransientWithShellRoute<OnboardingPage, OnboardingViewModel>("Onboarding");
// Porque OnboardingPage ja tem rota definida no AppShell:
// <ShellContent ContentTemplate="{DataTemplate local:OnboardingPage}" Route="Onboarding" />

// CORRETO
builder.Services.AddTransient<OnboardingViewModel>();
```