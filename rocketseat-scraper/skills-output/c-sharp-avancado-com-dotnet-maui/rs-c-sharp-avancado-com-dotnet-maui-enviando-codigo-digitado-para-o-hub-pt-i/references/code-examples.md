# Code Examples: Navegacao com Parametros e Hub no .NET MAUI

## 1. Estrutura da ViewModel com QueryProperty

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace PlanShare.ViewModels;

[QueryProperty(nameof(Code), "Code")]
public partial class UserConnectionJoinerViewModel : ViewModelBase
{
    private readonly HubConnection _hubConnection;
    private readonly IUseRefreshTokenTemporaryCode _useRefreshTokenTemporaryCode;

    public string Code { get; set; } = string.Empty;

    [ObservableProperty]
    public string GeneratedBy { get; set; } = string.Empty;

    public new ConnectionByCodeStatusPage StatusPage { get; set; }

    public UserConnectionJoinerViewModel(
        INavigationService navigationService,
        HubConnection hubConnection,
        IUseRefreshTokenTemporaryCode useRefreshTokenTemporaryCode)
        : base(navigationService)
    {
        _hubConnection = hubConnection;
        _useRefreshTokenTemporaryCode = useRefreshTokenTemporaryCode;
    }

    protected override async Task InitializeAsync()
    {
        StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.WaitingForJoiner);

        await _useRefreshTokenTemporaryCode.Execute();
        await _hubConnection.StartAsync();

        var result = await _hubConnection.InvokeAsync<Response>("JoinWithCode", Code);

        GeneratedBy = result.Response;
        StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.JoinerConnectedPendingApproval);
    }
}
```

## 2. Navegacao com parametro via string interpolation

```csharp
// Na UserCodeConnectionViewModel
private async Task UserCompletedCodes(string code)
{
    // Sintaxe: rota?NomeParametro={valor}
    await _navigationService.GoToAsync(
        $"{RoutesPages.UserConnectionJoinerPage}?Code={code}");
}
```

## 3. XAML da pagina com namespaces necessarios

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:fonts="clr-namespace:PlanShare.Resources.Fonts"
             xmlns:models="clr-namespace:PlanShare.Models"
             xmlns:resource="clr-namespace:PlanShare.Resources.Text"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             xmlns:vm="clr-namespace:PlanShare.ViewModels"
             x:DataType="vm:UserConnectionJoinerViewModel"
             x:Name="PageUserConnectionJoiner"
             x:Class="PlanShare.Views.Pages.User.Connection.UserConnectionJoinerPage">

    <!-- Conteudo da pagina -->

</ContentPage>
```

## 4. Code-behind com injecao de dependencia

```csharp
namespace PlanShare.Views.Pages.User.Connection;

public partial class UserConnectionJoinerPage : ContentPage
{
    public UserConnectionJoinerPage(UserConnectionJoinerViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## 5. Registro no MauiProgram

```csharp
// Em MauiProgram.cs, no metodo AddPages
builder.Services.AddTransient<UserConnectionJoinerPage>();
builder.Services.AddTransient<UserConnectionJoinerViewModel>();

// Registro da rota
Routing.RegisterRoute(RoutesPages.UserConnectionJoinerPage, typeof(UserConnectionJoinerPage));
```

## 6. Constante de rota

```csharp
public static class RoutesPages
{
    // ... outras rotas
    public const string UserConnectionJoinerPage = "user_connection_joiner_page";
}
```

## 7. Comparacao: QueryProperty vs IQueryAttributable

```csharp
// Opcao 1: QueryProperty (simples, 1-2 params)
[QueryProperty(nameof(Code), "Code")]
public partial class JoinerViewModel : ViewModelBase
{
    public string Code { get; set; } = string.Empty;
}

// Opcao 2: IQueryAttributable (complexo, 3+ params)
public partial class JoinerViewModel : ViewModelBase, IQueryAttributable
{
    public string Code { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        Code = query["Code"] as string ?? string.Empty;
        UserId = query["UserId"] as string ?? string.Empty;
    }
}
```

## 8. Fluxo de status durante conexao

```csharp
// Sequencia de status que o usuario ve:
// 1. WaitingForJoiner — "Conectando ao servidor, aguarde..."
// 2. (conexao acontece, hub invocado)
// 3. JoinerConnectedPendingApproval — "Conectado! Aguardando aprovacao..."

StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.WaitingForJoiner);
// ... conexao e invocacao ...
StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.JoinerConnectedPendingApproval);
```