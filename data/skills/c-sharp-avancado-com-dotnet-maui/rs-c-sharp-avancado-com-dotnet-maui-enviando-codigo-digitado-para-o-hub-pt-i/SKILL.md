---
name: rs-csharp-maui-signalr-nav-params
description: "Enforces .NET MAUI Shell navigation with query parameter passing between pages and SignalR Hub invocation patterns. Use when user asks to 'navigate between pages', 'pass parameters in MAUI navigation', 'connect to SignalR hub', 'invoke hub method with parameters', or 'create ViewModel with query properties'. Applies QueryProperty attribute pattern, page-to-ViewModel binding, and Hub connection initialization on page load. Make sure to use this skill whenever implementing page navigation with data transfer in .NET MAUI or connecting to SignalR hubs from ViewModels. Not for REST API calls, HTTP clients, or Blazor SignalR scenarios."
---

# Navegacao com Parametros e Invocacao de Hub no .NET MAUI

> Ao navegar entre paginas no .NET MAUI, use QueryProperty para transferir dados e delegue comunicacao com o Hub para a pagina de destino.

## Rules

1. **Delegue responsabilidade de Hub para pagina dedicada** — quando a pagina de origem nao permite manipulacao de elementos (ex: pacote NuGet de input), navegue para uma nova pagina que gerencia a conexao com o Hub, porque controle de UI e comunicacao sao responsabilidades distintas
2. **Use QueryProperty para parametros simples** — `[QueryProperty(nameof(Code), "Code")]` ao inves de `IQueryAttributable` para casos com 1-2 parametros, porque e mais conciso e declarativo
3. **Use nameof() ao inves de string literal** — `nameof(Code)` ao inves de `"Code"`, porque renomear com Rename refactoring atualiza todas as referencias automaticamente
4. **Inicialize conexao Hub no OnAppearing/InitializeAsync** — conecte ao Hub quando a pagina aparece, nao no construtor, porque o QueryProperty ainda nao foi preenchido no construtor
5. **Registre pagina + ViewModel + rota no MauiProgram** — `AddTransient<Page, ViewModel>()` associado a constante de rota, porque sem registro o DI container nao resolve a pagina
6. **Sempre configure BindingContext no code-behind** — receba a ViewModel no construtor e atribua `BindingContext = viewModel`, porque sem isso o data binding nao funciona

## How to write

### QueryProperty para receber parametros de navegacao

```csharp
[QueryProperty(nameof(Code), "Code")]
public partial class UserConnectionJoinerViewModel : ViewModelBase
{
    public string Code { get; set; } = string.Empty;
}
```

### Navegacao com parametro via string interpolation

```csharp
await _navigationService.GoToAsync(
    $"{RoutesPages.UserConnectionJoinerPage}?Code={code}");
```

### Inicializacao de Hub com invocacao de metodo

```csharp
protected override async Task InitializeAsync()
{
    StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.WaitingForJoiner);

    await _useRefreshTokenTemporaryCode.Execute();
    await _hubConnection.StartAsync();

    var result = await _hubConnection.InvokeAsync<Response>("JoinWithCode", Code);

    GeneratedBy = result.Response;
    StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.JoinerConnectedPendingApproval);
}
```

### Code-behind com injecao da ViewModel

```csharp
public partial class UserConnectionJoinerPage : ContentPage
{
    public UserConnectionJoinerPage(UserConnectionJoinerViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## Example

**Before (tudo na mesma pagina, sem delegacao):**
```csharp
// Na ViewModel da pagina de input de codigo
private async Task UserCompletedCodes(string code)
{
    await _hubConnection.StartAsync();
    var result = await _hubConnection.InvokeAsync<Response>("JoinWithCode", code);
    // Tenta esconder/mostrar elementos — nao funciona com pacote NuGet
    IsLoading = true;
    ResultName = result.Response;
}
```

**After (delegando para pagina dedicada):**
```csharp
// ViewModel da pagina de input — apenas navega
private async Task UserCompletedCodes(string code)
{
    await _navigationService.GoToAsync(
        $"{RoutesPages.UserConnectionJoinerPage}?Code={code}");
}

// ViewModel da pagina Joiner — gerencia Hub
[QueryProperty(nameof(Code), "Code")]
public partial class UserConnectionJoinerViewModel : ViewModelBase
{
    public string Code { get; set; } = string.Empty;

    [ObservableProperty]
    public string GeneratedBy { get; set; } = string.Empty;

    protected override async Task InitializeAsync()
    {
        StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.WaitingForJoiner);
        await _hubConnection.StartAsync();
        var result = await _hubConnection.InvokeAsync<Response>("JoinWithCode", Code);
        GeneratedBy = result.Response;
        StatusPage = new ConnectionByCodeStatusPage(StatusPageEnum.JoinerConnectedPendingApproval);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina de origem usa pacote NuGet sem controle total de UI | Delegue comunicacao para nova pagina |
| 1-2 parametros simples (string, int) | Use QueryProperty |
| 3+ parametros ou objetos complexos | Use IQueryAttributable com dicionario |
| Precisa mostrar status de carregamento durante conexao Hub | Use StatusPage observavel na pagina de destino |
| Propriedade sobrescreve base | Use `new` keyword para deixar intencao explicita |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `[QueryProperty("Code", "Code")]` | `[QueryProperty(nameof(Code), "Code")]` |
| Conectar ao Hub no construtor da ViewModel | Conectar no `InitializeAsync` / `OnAppearing` |
| Esconder elementos em pagina de pacote NuGet | Navegar para pagina propria com controle total |
| Esquecer `BindingContext = viewModel` no code-behind | Sempre atribuir no construtor da page |
| Navegar sem registrar rota no MauiProgram | `AddTransient<Page, ViewModel>()` + constante de rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
