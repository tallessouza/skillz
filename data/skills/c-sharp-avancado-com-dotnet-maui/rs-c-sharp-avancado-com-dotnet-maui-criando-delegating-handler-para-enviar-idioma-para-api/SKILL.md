---
name: rs-csharp-dotnet-maui-delegating-handler
description: "Applies DelegatingHandler pattern to intercept HTTP requests in .NET MAUI apps with Refit. Use when user asks to 'add headers to requests', 'send language header', 'intercept HTTP calls', 'configure HttpClient middleware', or 'localize API error messages'. Ensures automatic header injection without polluting business logic. Make sure to use this skill whenever configuring HTTP clients in .NET MAUI with cross-cutting concerns like culture, auth tokens, or custom headers. Not for server-side middleware, ASP.NET pipeline, or Refit interface definition."
---

# DelegatingHandler para Interceptar Requisicoes HTTP

> Utilize DelegatingHandler para injetar headers automaticamente em todas as requisicoes HTTP, mantendo a regra de negocio limpa e desacoplada de concerns de infraestrutura.

## Rules

1. **Nunca passe headers como parametro de regra de negocio** — use DelegatingHandler para injetar automaticamente, porque headers sao concern de infraestrutura e nao de dominio
2. **Herde de DelegatingHandler e faca override de SendAsync** — este e o ponto de interceptacao antes da requisicao sair do app, funciona como um middleware do lado do cliente HTTP
3. **Limpe a lista antes de adicionar** — faca `Clear()` no header antes de `Add()`, porque pode haver valores residuais
4. **Pegue o idioma do dispositivo dinamicamente** — use `CultureInfo.CurrentCulture.Name`, nunca hardcode `"pt-BR"`
5. **Registre o handler como Singleton** — e adicione via `AddHttpMessageHandler<T>()` em cada Refit client configurado
6. **Repita AddHttpMessageHandler para cada interface Refit** — infelizmente e necessario para cada `AddRefitClient`, mas o codigo do handler nao duplica

## How to write

### DelegatingHandler

```csharp
public class PlanShareHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var culture = CultureInfo.CurrentCulture.Name;

        request.Headers.AcceptLanguage.Clear();
        request.Headers.AcceptLanguage.Add(
            new StringWithQualityHeaderValue(culture));

        return await base.SendAsync(request, cancellationToken);
    }
}
```

### Registro no DI (MauiProgram.cs)

```csharp
// 1. Registrar o handler como singleton
builder.Services.AddSingleton<PlanShareHandler>();

// 2. Para CADA AddRefitClient, adicionar o handler
builder.Services
    .AddRefitClient<ILoginApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

builder.Services
    .AddRefitClient<IUserApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();
```

## Example

**Before (header na regra de negocio — errado):**

```csharp
// Interface Refit poluida com parametro de header
public interface ILoginApi
{
    [Post("/api/login")]
    Task<ApiResponse<ResponseJson>> Login(
        [Body] RequestLoginJson request,
        [Header("Accept-Language")] string culture);
}

// Use case com responsabilidade que nao e dele
public class DoLoginUseCase
{
    public async Task Execute(string email, string password)
    {
        var result = await _api.Login(
            new RequestLoginJson { Email = email, Password = password },
            "pt-BR"); // regra de negocio conhecendo infraestrutura
    }
}
```

**After (DelegatingHandler — correto):**

```csharp
// Interface Refit limpa
public interface ILoginApi
{
    [Post("/api/login")]
    Task<ApiResponse<ResponseJson>> Login([Body] RequestLoginJson request);
}

// Use case sem conhecimento de headers
public class DoLoginUseCase
{
    public async Task Execute(string email, string password)
    {
        var result = await _api.Login(
            new RequestLoginJson { Email = email, Password = password });
        // Header Accept-Language injetado automaticamente pelo handler
    }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa enviar header em toda requisicao | DelegatingHandler |
| Header varia por endpoint | Parametro `[Header]` no Refit e aceitavel |
| Auth token em toda requisicao | DelegatingHandler (mesmo padrao) |
| Valor vem do dispositivo (cultura, versao) | Capture dinamicamente no handler |
| Multiplas interfaces Refit | Registre handler uma vez, `AddHttpMessageHandler` em cada client |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[Header("Accept-Language")] string culture` em toda interface | `DelegatingHandler` com inject automatico |
| `"pt-BR"` hardcoded no handler | `CultureInfo.CurrentCulture.Name` |
| Handler como Transient | Handler como Singleton |
| Esquecer `AddHttpMessageHandler` em algum Refit client | Adicionar para todos os `AddRefitClient` |
| Adicionar header sem `Clear()` antes | `Clear()` + `Add()` para evitar duplicatas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
