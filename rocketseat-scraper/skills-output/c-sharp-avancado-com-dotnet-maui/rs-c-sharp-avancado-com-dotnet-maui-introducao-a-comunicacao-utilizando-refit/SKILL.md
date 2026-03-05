---
name: rs-csharp-maui-refit-intro
description: "Enforces Refit library usage for HTTP communication in .NET MAUI apps instead of raw HttpClient. Use when user asks to 'call an API', 'make HTTP request', 'integrate with REST API', 'setup API client' in .NET MAUI or C# mobile projects. Applies patterns: interface-based API clients, dependency injection registration, automatic deserialization. Make sure to use this skill whenever generating HTTP communication code in .NET MAUI projects. Not for ASP.NET API-side HttpClient usage, gRPC, or SignalR communication."
---

# Comunicacao HTTP com Refit no .NET MAUI

> Defina interfaces para comunicacao HTTP e deixe o Refit gerar a implementacao automaticamente.

## Rules

1. **Use Refit em vez de HttpClient direto** — `IUserApiClient` com atributos Refit, nao `new HttpClient()` com `PostAsJsonAsync`, porque Refit elimina boilerplate de serializacao/deserializacao e chamadas manuais
2. **Organize em Data/Network/API** — crie a estrutura `Data/Network/API/` no projeto do app, porque separacao clara facilita manutencao
3. **Compartilhe projetos de comunicacao** — tanto API quanto App devem referenciar o mesmo projeto de requests/responses, porque evita duplicacao de DTOs
4. **Registre via injecao de dependencia** — use `AddRefitClient<T>().ConfigureHttpClient()` no MauiProgram, nao `RestService.For<T>()`, porque integra com o container DI do MAUI
5. **Nomeie interfaces pelo contexto** — `IUserApiClient` com metodo `Register()`, nao `RegisterUser()`, porque o contexto ja esta no nome da interface
6. **Nunca faca `new HttpClient()` em APIs ASP.NET** — use `IHttpClientFactory` em APIs server-side, porque `new HttpClient()` causa socket exhaustion (no MAUI e permitido)

## How to write

### Interface de API com Refit

```csharp
// Data/Network/API/IUserApiClient.cs
public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);
}
```

### Registro no MauiProgram

```csharp
// MauiProgram.cs
builder.Services
    .AddRefitClient<IUserApiClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseApiUrl));
```

## Example

**Before (HttpClient manual):**
```csharp
var httpClient = new HttpClient();
httpClient.BaseAddress = new Uri("https://minha-api.com");

var response = await httpClient.PostAsJsonAsync("/users", request);
var result = await response.Content.ReadFromJsonAsync<ResponseRegisterUserJson>();
```

**After (com Refit):**
```csharp
// Defina a interface
public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);
}

// Registre no DI
builder.Services.AddRefitClient<IUserApiClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseApiUrl));

// Use via injecao de dependencia
var result = await _userApiClient.Register(request);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo endpoint na API | Adicione metodo na interface Refit existente com atributo HTTP correto |
| Endpoint com parametro na rota | Use `[Get("/users/{id}")]` com parametro correspondente |
| Multiplos controllers na API | Crie uma interface Refit por controller (`IUserApiClient`, `IExpenseApiClient`) |
| Precisa passar dados no body | Use atributo `[Body]` no parametro |
| Precisa passar header customizado | Use atributo `[Header("X-Custom")]` no parametro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new HttpClient()` + `PostAsJsonAsync` | Interface Refit com `[Post]` |
| `response.Content.ReadFromJsonAsync<T>()` | Retorno tipado direto na interface Refit |
| `RestService.For<T>(url)` em MAUI | `AddRefitClient<T>().ConfigureHttpClient()` via DI |
| DTOs duplicados entre API e App | Projeto compartilhado de communication referenciado por ambos |
| `httpClient.PutAsJsonAsync("/users/change-password", req)` | `[Put("/users/change-password")] Task ChangePassword([Body] req)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
