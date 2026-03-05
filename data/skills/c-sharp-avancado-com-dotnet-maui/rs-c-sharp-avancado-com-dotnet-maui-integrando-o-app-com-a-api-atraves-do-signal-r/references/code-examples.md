# Code Examples: Integrando SignalR Client em .NET MAUI

## 1. Instalacao do pacote NuGet

Via Package Manager Console:
```
NuGet\Install-Package Microsoft.AspNetCore.SignalR.Client -Version 10.0.2
```

Via Visual Studio: Botao direito no projeto → Manage NuGet Packages → Browse → pesquisar "SignalR" → selecionar `Microsoft.AspNetCore.SignalR.Client` → Install.

## 2. Interface do client

```csharp
// Data/Network/API/IUserConnectionByCodeClient.cs
public interface IUserConnectionByCodeClient
{
    HubConnection CreateClient();
}
```

Nota: o tipo de retorno começa como `void` e depois e alterado para `HubConnection` quando se descobre o tipo retornado pelo `Build()`.

## 3. Implementacao completa

```csharp
// Data/Network/Hubs/UserConnectionByCodeClient.cs
using Microsoft.AspNetCore.SignalR.Client;

public class UserConnectionByCodeClient : IUserConnectionByCodeClient
{
    private readonly string _urlBase;
    private readonly ITokensStorage _tokensStorage;

    public UserConnectionByCodeClient(string urlBase, ITokensStorage tokensStorage)
    {
        _urlBase = urlBase;
        _tokensStorage = tokensStorage;
    }

    public HubConnection CreateClient()
    {
        return new HubConnectionBuilder()
            .WithUrl($"{_urlBase}/connection", options =>
            {
                options.AccessTokenProvider = async () =>
                {
                    var tokens = await _tokensStorage.Get();
                    return tokens.AccessToken;
                };
            })
            .Build();
    }
}
```

### Estrutura de pastas

```
Data/
└── Network/
    ├── API/
    │   └── IUserConnectionByCodeClient.cs
    └── Hubs/
        └── UserConnectionByCodeClient.cs
```

## 4. Registro no DI — MauiProgram.cs

```csharp
// Dentro de MauiProgram.cs, apos AddHttpClient e antes do return

// ERRADO — causa excecao porque string nao e resolvivel pelo DI
// appBuilder.Services.AddTransient<IUserConnectionByCodeClient, UserConnectionByCodeClient>();

// CORRETO — factory lambda resolve manualmente
appBuilder.Services.AddTransient<IUserConnectionByCodeClient>(config =>
    new UserConnectionByCodeClient(
        apiUrl,  // mesma variavel usada para configurar o Refit
        config.GetRequiredService<ITokensStorage>()
    )
);
```

## 5. Uso no ViewModel

```csharp
// ViewModels/Pages/User/ConnectionViewModel.cs
public class ConnectionViewModel : ViewModelBase
{
    private readonly HubConnection _connection;

    public ConnectionViewModel(IUserConnectionByCodeClient userConnectionCodeClient)
    {
        _connection = userConnectionCodeClient.CreateClient();
    }

    // Chamado quando a pagina abre (similar ao UserProfileViewModel)
    [RelayCommand]
    private async Task InitializeAsync()
    {
        StatusPage = ConnectionByCodeStatusPage.GeneratingCode;
        await _connection.StartAsync();

        // Proxima aula: invocar GenerateCode no hub
        // await _connection.InvokeAsync("GenerateCode");
    }
}
```

## 6. Referencia: lado do servidor (hub mapeado)

```csharp
// PlanShare.API/Program.cs
app.MapHub<UserConnectionsHub>("/connection");
```

A URL `/connection` e o endpoint que o client usa para conectar. O client combina a URL base da API com esse path.