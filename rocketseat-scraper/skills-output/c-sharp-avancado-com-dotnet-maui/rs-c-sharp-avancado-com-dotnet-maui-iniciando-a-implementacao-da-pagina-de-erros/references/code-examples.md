# Code Examples: Pagina de Erros no .NET MAUI

## Estrutura de pastas

```
Views/
  Pages/
    Errors/
      ErrorsPage.xaml
      ErrorsPage.xaml.cs    (CodeBehind)

ViewModels/
  Pages/
    Errors/
      ErrorsViewModel.cs
```

## ErrorsPage.xaml completo

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Errors"
             xmlns:resources="clr-namespace:PlanShare.App.Resources"
             x:Class="PlanShare.App.Views.Pages.Errors.ErrorsPage"
             x:DataType="viewModel:ErrorsViewModel"
             Shell.NavBarIsVisible="False">

    <Button Text="{x:Static resources:ResourcesText.TRY_AGAIN}"
            HeightRequest="60" />
</ContentPage>
```

## ErrorsPage.xaml.cs (CodeBehind)

```csharp
using PlanShare.App.ViewModels.Pages.Errors;

namespace PlanShare.App.Views.Pages.Errors;

public partial class ErrorsPage : ContentPage
{
    public ErrorsPage(ErrorsViewModel errorsViewModel)
    {
        InitializeComponent();
        BindingContext = errorsViewModel;
    }
}
```

## ErrorsViewModel.cs

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace PlanShare.App.ViewModels.Pages.Errors;

public partial class ErrorsViewModel : ObservableObject
{
    // Heranca direta de ObservableObject, sem ViewModelBase
    // Propriedades e comandos serao adicionados nas proximas aulas
}
```

## Registro no MauiProgram.cs

```csharp
// Dentro do metodo AddPages:
appBuilder.Services.AddTransientWithShellRoute<ErrorsPage, ErrorsViewModel>(
    RoutPages.ErrorPage
);
```

## Constante de rota

```csharp
public static class RoutPages
{
    // ... outras rotas ...
    public const string ErrorPage = "error-page";
}
```

## Navegacao para erro no LoginViewModel

```csharp
private async Task DoLogin()
{
    var result = await _loginUseCase.Execute(email, password);

    if (!result.IsSuccess)
    {
        await _navigationService.NavigateToAsync(RoutPages.ErrorPage);
        return;
    }

    // fluxo de sucesso...
}
```

## Navegacao para erro no RegisterViewModel

```csharp
// Mesmo padrao aplicado no registro de conta
var result = await _registerUseCase.Execute(name, email, password);

if (!result.IsSuccess)
{
    await _navigationService.NavigateToAsync(RoutPages.ErrorPage);
    return;
}
```

## Referencia a recurso de texto no XAML

```xml
<!-- Declarar o namespace dos recursos -->
xmlns:resources="clr-namespace:PlanShare.App.Resources"

<!-- Usar com x:Static — acessa o arquivo padrao, NAO o especifico de idioma -->
Text="{x:Static resources:ResourcesText.TRY_AGAIN}"
```

## Checklist de criacao de pagina MAUI (passos obrigatorios)

```
1. [x] Criar ContentPage XAML em Views/Pages/{Feature}/
2. [x] Criar ViewModel em ViewModels/Pages/{Feature}/
3. [x] Registrar com AddTransientWithShellRoute no MauiProgram.cs
4. [x] Vincular ViewModel no CodeBehind (BindingContext = vm)
5. [x] Vincular ViewModel no XAML (xmlns + x:DataType) — recomendado
6. [x] Definir constante de rota em RoutPages
```