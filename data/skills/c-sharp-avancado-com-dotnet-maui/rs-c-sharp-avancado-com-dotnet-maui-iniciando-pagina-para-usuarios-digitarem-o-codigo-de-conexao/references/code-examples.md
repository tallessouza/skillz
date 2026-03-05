# Code Examples: Pagina de Codigo de Conexao com PinCodes.Authorization.Maui

## 1. ViewModel completa

```csharp
namespace PlainShare.App.ViewModels.Pages.User.Connection;

public partial class UserCodeConnectionViewModel : ViewModelBase
{
    public UserCodeConnectionViewModel(INavigationService navigationService)
        : base(navigationService) { }

    [RelayCommand]
    private async Task CodeCompleted(string code)
    {
        // O parametro 'code' contem o PIN completo digitado pelo usuario
        // Aqui voce navegaria para a proxima pagina passando o codigo
    }
}
```

## 2. Arquivo XAML completo

```xml
<?xml version="1.0" encoding="utf-8" ?>
<pinCode:CodePage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:pinCode="clr-namespace:PinCodes.Authorization.Views.Pages;assembly=PinCodes.Authorization"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:fonts="clr-namespace:PlainShare.App.Resources.Fonts"
    xmlns:resource="clr-namespace:PlainShare.App.Resources"
    xmlns:viewModel="clr-namespace:PlainShare.App.ViewModels.Pages.User.Connection"
    x:DataType="viewModel:UserCodeConnectionViewModel"
    x:Class="PlainShare.App.Views.Pages.User.Connection.UserCodeConnectionPage"
    x:Name="PageUserCodeConnection"
    CallbackCodeFinishCommand="{Binding Source={x:Reference PageUserCodeConnection}, Path=BindingContext.CodeCompletedCommand}">
</pinCode:CodePage>
```

## 3. CodeBehind completo

```csharp
using PinCodes.Authorization.Views.Pages;
using PlainShare.App.ViewModels.Pages.User.Connection;

namespace PlainShare.App.Views.Pages.User.Connection;

public partial class UserCodeConnectionPage : CodePage
{
    public UserCodeConnectionPage(UserCodeConnectionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## 4. Registro no MauiProgram.cs

```csharp
// Dentro do metodo que registra paginas:
private static void AddPages(IServiceCollection services)
{
    // ... outras paginas ...
    services.AddTransient<UserCodeConnectionPage, UserCodeConnectionViewModel>();
}
```

## 5. Constante de rota

```csharp
public static class RoutePages
{
    // ... outras constantes ...
    public const string UserCodeConnectionPage = "UserCodeConnectionPage";
}
```

## 6. Navegacao a partir do Dashboard

```csharp
// Na DashboardViewModel, dentro do switch do pop-up de conexao:
case "use_code":
    await _navigationService.NavigateToAsync(RoutePages.UserCodeConnectionPage);
    break;
```

## 7. Exemplo de renomear o command

Se voce quiser dar outro nome ao command:

```csharp
// Na ViewModel:
[RelayCommand]
private async Task ProcessConnectionCode(string code)
{
    // ...
}
```

```xml
<!-- No XAML, atualize o binding: -->
CallbackCodeFinishCommand="{Binding Source={x:Reference PageUserCodeConnection}, Path=BindingContext.ProcessConnectionCodeCommand}"
```

Note o sufixo `Command` adicionado automaticamente pelo source generator do CommunityToolkit.

## 8. Instalacao do pacote NuGet

Via Package Manager Console:
```
NuGet\Install-Package PinCodes.Authorization.Maui -Version 4.0.0
```

Via .NET CLI:
```
dotnet add package PinCodes.Authorization.Maui --version 4.0.0
```

Verificacao no `.csproj`:
```xml
<ItemGroup>
    <!-- ... outros pacotes ... -->
    <PackageReference Include="PinCodes.Authorization.Maui" Version="4.0.0" />
</ItemGroup>
```