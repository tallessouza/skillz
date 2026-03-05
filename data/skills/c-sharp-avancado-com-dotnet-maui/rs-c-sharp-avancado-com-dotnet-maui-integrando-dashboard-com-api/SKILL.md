---
name: rs-csharp-maui-integrando-dashboard-api
description: "Applies the full integration pattern between a .NET MAUI dashboard page and a back-end API using Refit, ObservableCollection, and dependency injection. Use when user asks to 'integrate dashboard', 'connect MAUI page to API', 'create Refit interface', 'bind API response to ViewModel', or 'update local storage from API response'. Make sure to use this skill whenever building MAUI pages that consume REST endpoints with Refit. Not for SignalR real-time connections, database schema design, or pure back-end API development."
---

# Integrando Dashboard com API (.NET MAUI + Refit)

> Toda integracao entre pagina MAUI e API segue o fluxo: Interface Refit → UseCase → ViewModel → Page Behavior, com atualizacao do storage local quando a API devolve dados do usuario.

## Rules

1. **Crie interface Refit dedicada por controller** — `IDashboardApi` para `/dashboard`, porque cada controller tem seu contrato independente
2. **Registre no MauiProgram com PlanShareHandler** — todo `AddHttpClient<IInterface>` que precisa de autenticacao deve configurar o handler, porque sem ele o token nao sera enviado
3. **UseCase recebe API + Storage** — o UseCase nao so busca dados da API, mas atualiza o storage local com dados frescos, porque garante consistencia em todo o app
4. **Use records com `with` para imutabilidade** — nunca altere propriedade de record diretamente, use `user = user with { Name = newName }`, porque records sao imutaveis por design
5. **ObservableCollection no Select** — ao converter response da API para models, passe o `.Select()` como parametro do construtor de `ObservableCollection`, porque isso popula a colecao de forma declarativa
6. **Initialize via EventToCommandBehavior** — a chamada ao UseCase acontece quando a pagina aparece, nao no construtor, porque o construtor nao tem contexto de navegacao

## Steps

### Step 1: Ajustar response no back-end

Garantir que o response JSON do controller devolve `Username` e `ConnectedUsers` (nao `Friends`).

```csharp
public class ResponseDashboardJson
{
    public string Username { get; set; }
    public List<ResponseAssignedJson> ConnectedUsers { get; set; }
}
```

### Step 2: Criar interface Refit no app

```csharp
public interface IDashboardApi
{
    [Get("/dashboard")]
    Task<IApiResponse<ResponseDashboardJson>> GetDashboard();
}
```

### Step 3: Registrar no MauiProgram

```csharp
builder.Services
    .AddHttpClient<IDashboardApi>()
    .ConfigureHttpClient(/* base address */)
    .AddHttpMessageHandler<PlanShareHandler>();
```

### Step 4: Criar UseCase com storage update

```csharp
public class GetDashboardUseCase : IGetDashboardUseCase
{
    private readonly IDashboardApi _api;
    private readonly IUserStorage _userStorage;

    public async Task<Result<Dashboard>> Execute()
    {
        var response = await _api.GetDashboard();

        if (response.IsSuccessStatusCode)
        {
            var content = response.Content;

            var dashboard = new Dashboard
            {
                Username = content.Username,
                ConnectedUsers = new ObservableCollection<ConnectedUser>(
                    content.ConnectedUsers.Select(u => new ConnectedUser
                    {
                        Id = u.Id,
                        Name = u.Name,
                        ProfileImageUrl = u.ProfileImageUrl
                    }))
            };

            // Atualizar storage local com nome fresco da API
            var user = await _userStorage.Get();
            user = user with { Name = content.Username };
            await _userStorage.Save(user);

            return Result<Dashboard>.Success(dashboard);
        }

        return Result<Dashboard>.Failure();
    }
}
```

### Step 5: Chamar no ViewModel via Initialize

```csharp
public async Task Initialize()
{
    var result = await _dashboardUseCase.Execute();

    if (result.IsSuccess)
        Dashboard = result.Response;
    else
        await NavigateToErrorPage();

    StatusPage = StatusPage.Default;
}
```

### Step 6: Conectar na Page com Behavior

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior StatusBarColor="..." />
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeCommand}" />
</ContentPage.Behaviors>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API devolve dado do usuario logado | Atualizar storage local no UseCase |
| Record precisa de alteracao parcial | Usar sintaxe `with { Prop = value }` |
| Lista da API precisa virar ObservableCollection | `new ObservableCollection<T>(response.Select(...))` |
| Pagina precisa carregar dados ao aparecer | EventToCommandBehavior no Appearing |
| Multiplos behaviors na mesma pagina | Todos dentro da mesma tag `<ContentPage.Behaviors>` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `user.Name = "novo"` em record | `user = user with { Name = "novo" }` |
| Chamar API no construtor da ViewModel | Chamar via `Initialize` no evento Appearing |
| Criar `AddHttpClient` sem handler de auth | Sempre configurar `AddHttpMessageHandler<PlanShareHandler>()` |
| Usar `Friends` como nome generico | Usar `ConnectedUsers` — nome que reflete o dominio |
| Retornar 204 NoContent em GET de dashboard | Retornar 200 com dados (username sempre existe) |
| Popular ObservableCollection com foreach | Passar Select como parametro do construtor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
