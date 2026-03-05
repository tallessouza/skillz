---
name: rs-csharp-dotnet-maui-login-api-integration
description: "Applies the Refit + UseCase + ViewModel pattern when integrating .NET MAUI pages with API endpoints. Use when user asks to 'integrate login', 'connect page to API', 'add Refit endpoint', 'create use case for API call', or 'wire ViewModel to API'. Follows three-step pattern: 1) Refit interface, 2) UseCase with mapping, 3) ViewModel status management with animation. Make sure to use this skill whenever building API communication in .NET MAUI apps. Not for backend API development, database operations, or non-MAUI mobile frameworks."
---

# Integrando Paginas .NET MAUI com API via Refit

> Toda integracao de pagina com API segue tres passos: Interface Refit, UseCase com mapeamento, ViewModel com gerenciamento de status.

## Rules

1. **Separe interfaces Refit por dominio** — `ILoginAPI`, `IUserAPI`, `ITaskAPI`, porque cada controller da API tem responsabilidades distintas e interfaces separadas facilitam manutencao
2. **Endpoints sempre em minuscula** — `[Post("/login")]` nao `[Post("/Login")]`, porque a API usa `RouteTokenTransformerConvention` para lowercase
3. **Mapeamento manual no UseCase** — converta Model para RequestJSON manualmente, porque e mais performatico que AutoMapper em dispositivos moveis
4. **UseCase recebe Model, nao Request** — o UseCase faz a conversao internamente, porque a ViewModel nao deve conhecer detalhes de API
5. **StatusPage controla visibilidade** — use enum `StatusPage` (Default/Sending) com DataTriggers no XAML, porque desacopla estado visual da logica
6. **Registre tudo no DI** — interface Refit, UseCase e ViewModel no `MauiProgram`, porque o container injeta as dependencias automaticamente

## How to write

### Passo 1: Interface Refit

```csharp
// Data/Network/API/ILoginAPI.cs
namespace PlanShare.App.Data.Network.API;

public interface ILoginAPI
{
    [Post("/login")]
    Task<ResponseRegisterUserJSON> Login([Body] RequestLoginJSON request);
}
```

### Passo 2: UseCase com mapeamento

```csharp
// UseCases/Login/DoLoginUseCase.cs
public class DoLoginUseCase : IDoLoginUseCase
{
    private readonly ILoginAPI _loginAPI;

    public DoLoginUseCase(ILoginAPI loginAPI)
    {
        _loginAPI = loginAPI;
    }

    public async Task Execute(Login login)
    {
        var request = new RequestLoginJSON
        {
            Email = login.Email,
            Password = login.Password
        };

        var result = await _loginAPI.Login(request);
    }
}
```

### Passo 3: ViewModel com StatusPage

```csharp
// No construtor da ViewModel, receba o UseCase via DI
public DoLoginViewModel(IDoLoginUseCase doLoginUseCase)
{
    _doLoginUseCase = doLoginUseCase;
}

// Na funcao de login
public async Task DoLogin()
{
    StatusPage = Models.StatusPage.Sending;

    await _doLoginUseCase.Execute(Model);

    StatusPage = Models.StatusPage.Default;
}
```

### Registro no MauiProgram.cs

```csharp
// Refit client
builder.Services.AddRefitClient<ILoginAPI>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiUrl));

// UseCase
builder.Services.AddTransient<IDoLoginUseCase, DoLoginUseCase>();
```

### XAML com DataTriggers

```xml
<xmlns:animation="clr-namespace:PlanShare.App.Components"
 xmlns:models="clr-namespace:PlanShare.App.Models">

<VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Default}">
            <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
    </VerticalStackLayout.Triggers>
    <!-- form fields here -->
</VerticalStackLayout>

<animation:AnimationSendInformationComponent IsVisible="False">
    <animation:AnimationSendInformationComponent.Triggers>
        <DataTrigger TargetType="animation:AnimationSendInformationComponent"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Sending}">
            <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
    </animation:AnimationSendInformationComponent.Triggers>
</animation:AnimationSendInformationComponent>
```

## Example

**Before (tudo misturado na ViewModel):**
```csharp
public async Task DoLogin()
{
    var client = new HttpClient();
    var json = JsonSerializer.Serialize(new { Email = email, Password = password });
    var response = await client.PostAsync("https://api.example.com/login", 
        new StringContent(json));
}
```

**After (com Refit + UseCase + StatusPage):**
```csharp
public async Task DoLogin()
{
    StatusPage = Models.StatusPage.Sending;
    await _doLoginUseCase.Execute(Model);
    StatusPage = Models.StatusPage.Default;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo endpoint na API | Crie interface Refit separada por controller |
| Request e Model tem campos iguais | Mapeie manualmente mesmo assim, porque sao camadas diferentes |
| Resposta identica entre endpoints | Reutilize o mesmo Response JSON (ex: login e register retornam o mesmo) |
| Quer testar se DI funciona | Coloque breakpoint no construtor da ViewModel e verifique se o UseCase nao veio nulo |
| DevTunnel nao conecta | Verifique se o tunel foi "plantado" (Start Tunnel) no Visual Studio |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `new HttpClient()` na ViewModel | Use Refit via interface injetada no UseCase |
| AutoMapper em app mobile | Mapeamento manual por performance |
| Uma interface Refit gigante pra tudo | Uma interface por dominio (Login, User, Task) |
| Esconder/mostrar elementos com codigo C# | Use DataTriggers com StatusPage enum |
| Endpoint com letra maiuscula `/Login` | Sempre minuscula `/login` |
| Esquecer de registrar no DI | Registre interface Refit, UseCase E ViewModel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
