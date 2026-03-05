---
name: rs-csharp-signalr-client-integration
description: "Applies SignalR client integration patterns when connecting .NET MAUI apps to ASP.NET Core hubs. Use when user asks to 'connect to SignalR', 'integrate with hub', 'real-time connection', 'setup SignalR client', or 'configure HubConnection in MAUI'. Covers NuGet setup, HubConnectionBuilder configuration, access token provider, and DI registration with custom factory. Make sure to use this skill whenever building real-time features in .NET MAUI with SignalR. Not for server-side hub creation, SignalR scaling, or JavaScript SignalR clients."
---

# Integrando SignalR Client em .NET MAUI

> Configure o HubConnectionBuilder com autenticacao e injete via DI usando factory pattern quando o construtor precisa de parametros nao-resolvidos automaticamente.

## Rules

1. **Instale o pacote correto** — `Microsoft.AspNetCore.SignalR.Client`, porque e o client oficial da Microsoft para conectar a hubs SignalR
2. **Crie interface + classe para o client** — separe a criacao do HubConnection em uma classe dedicada, porque permite injecao de dependencia e testabilidade
3. **Use factory no DI quando ha parametros string** — o container nao resolve strings automaticamente, entao use `AddTransient<IInterface>(config => new Classe(url, config.GetRequiredService<IDep>()))`, porque passar a classe diretamente causa excecao
4. **Configure AccessTokenProvider no WithUrl** — passe o token via `options.AccessTokenProvider = async () => { ... }`, porque o SignalR precisa do token para identificar o usuario conectado
5. **Armazene HubConnection, nao o client** — no ViewModel, chame `CreateClient()` uma vez e guarde o `HubConnection` como propriedade privada, porque e o HubConnection que voce usa para Start/Invoke
6. **Inicie conexao no InitializeAsync** — chame `await _connection.StartAsync()` quando a pagina abrir, porque a conexao deve estar ativa antes de invocar metodos do hub

## How to write

### Interface do SignalR Client

```csharp
public interface IUserConnectionByCodeClient
{
    HubConnection CreateClient();
}
```

### Implementacao com HubConnectionBuilder

```csharp
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

### Registro no DI com factory pattern

```csharp
// Em MauiProgram.cs, ANTES do return
appBuilder.Services.AddTransient<IUserConnectionByCodeClient>(config =>
    new UserConnectionByCodeClient(
        apiUrl,  // string da URL base da API
        config.GetRequiredService<ITokensStorage>()
    )
);
```

### Uso no ViewModel

```csharp
public class ConnectionViewModel : ViewModelBase
{
    private readonly HubConnection _connection;

    public ConnectionViewModel(IUserConnectionByCodeClient userConnectionCodeClient)
    {
        _connection = userConnectionCodeClient.CreateClient();
    }

    private async Task InitializeAsync()
    {
        StatusPage = ConnectionByCodeStatusPage.GeneratingCode;
        await _connection.StartAsync();
        // Invoke hub methods na proxima etapa
    }
}
```

## Example

**Before (DI incorreto — causa excecao):**
```csharp
// O container nao sabe resolver o parametro string "urlBase"
appBuilder.Services.AddTransient<IUserConnectionByCodeClient, UserConnectionByCodeClient>();
```

**After (DI com factory — funciona):**
```csharp
appBuilder.Services.AddTransient<IUserConnectionByCodeClient>(config =>
    new UserConnectionByCodeClient(
        apiUrl,
        config.GetRequiredService<ITokensStorage>()
    )
);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Classe precisa de string no construtor | Use factory no AddTransient com lambda |
| Classe precisa apenas de interfaces | Use `AddTransient<IFoo, Foo>()` diretamente |
| Hub requer autenticacao | Configure `AccessTokenProvider` no `WithUrl` options |
| URL do hub e relativa ao base | Concatene: `$"{urlBase}/endpoint-do-hub"` |
| Precisa chamar metodo do hub | Use `_connection.InvokeAsync("MethodName")` apos StartAsync |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `AddTransient<IClient, Client>()` com string no construtor | `AddTransient<IClient>(cfg => new Client(url, cfg.GetRequiredService<IDep>()))` |
| Guardar o IClient no ViewModel | Guardar o `HubConnection` retornado por `CreateClient()` |
| Criar HubConnection sem AccessTokenProvider | Configurar `options.AccessTokenProvider` no `WithUrl` |
| Chamar metodos do hub sem `StartAsync` | Sempre `await _connection.StartAsync()` antes de invocar |
| Hardcodar URL do hub | Usar URL base do configuration + path do hub |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
