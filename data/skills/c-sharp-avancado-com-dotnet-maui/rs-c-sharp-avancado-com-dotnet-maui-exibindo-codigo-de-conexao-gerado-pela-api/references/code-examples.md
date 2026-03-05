# Code Examples: Exibindo Codigo de Conexao Gerado pela API

## ViewModel completa (fluxo relevante)

```csharp
public partial class UserConnectionGeneratorViewModel : ObservableObject
{
    private readonly HubConnection _connection;

    // Codigo temporario - remover apos implementar Dashboard
    private readonly IUseRefreshTokenUseCase _useRefreshToken;

    [ObservableProperty]
    private string connectionCode;

    [ObservableProperty]
    private StatusPageEnum statusPage;

    public UserConnectionGeneratorViewModel(
        HubConnection connection,
        IUseRefreshTokenUseCase useRefreshToken) // temporario
    {
        _connection = connection;
        _useRefreshToken = useRefreshToken; // temporario
    }

    [RelayCommand]
    private async Task Initialize()
    {
        StatusPage = StatusPageEnum.GeneratingCode;

        // Codigo temporario - garante token valido
        await _useRefreshToken.ExecuteSilent();

        await _connection.StartAsync();

        var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");

        StatusPage = StatusPageEnum.ConnectionByCode;
        ConnectionCode = result.Response!;
    }
}
```

## XAML — Binding do codigo e EventToCommandBehavior

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Class="PlanShare.Views.UserConnectionGeneratorView"
             x:Name="PageUserConnectionGeneratorView">

    <ContentPage.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding InitializeCommand}" />
    </ContentPage.Behaviors>

    <!-- Onde antes era texto fixo "123456" -->
    <Label Text="{Binding ConnectionCode}" />

</ContentPage>
```

## Hub server-side (referencia do que esta sendo chamado)

```csharp
public class UserConnectionsHub : Hub
{
    public async Task<HubOperationResult<string>> GenerateCode()
    {
        // Gera codigo, ex: "486998"
        var code = _connectionService.Generate(Context.UserIdentifier);
        return new HubOperationResult<string>
        {
            Success = true,
            Response = code
        };
    }
}
```

## InvokeAsync com parametros (variacao)

```csharp
// Sem parametros
var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");

// Com parametros
var result = await _connection.InvokeAsync<HubOperationResult<bool>>(
    "JoinByCode",
    "486998"
);

// Com multiplos parametros
var result = await _connection.InvokeAsync<HubOperationResult<UserDto>>(
    "UpdateUser",
    userId,
    newName,
    isActive
);
```

## Pattern de replicacao do EventToCommandBehavior

```xml
<!-- Pagina original (UserProfile) -->
<ContentPage x:Name="PageUserProfile">
    <ContentPage.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding InitializeCommand}" />
    </ContentPage.Behaviors>
</ContentPage>

<!-- Nova pagina (UserConnectionGenerator) — mesmo pattern -->
<ContentPage x:Name="PageUserConnectionGeneratorView">
    <ContentPage.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding InitializeCommand}" />
    </ContentPage.Behaviors>
</ContentPage>
```

## Checklist de erros comuns demonstrados na aula

```
1. Injetou dependencia mas esqueceu de atribuir ao campo:
   ❌ Construtor recebe useCase, mas _useCase fica null
   ✅ _useRefreshToken = useRefreshToken;

2. Esqueceu de configurar EventToCommandBehavior:
   ❌ Initialize nunca e chamado
   ✅ Adicionar Behavior no XAML da pagina

3. Nome do metodo digitado errado:
   ❌ InvokeAsync<T>("generatecode") — case sensitive
   ✅ Copie exatamente: "GenerateCode"

4. Token expirado ao fazer StartAsync:
   ❌ Handshake falha silenciosamente
   ✅ Valide/renove token antes de StartAsync
```