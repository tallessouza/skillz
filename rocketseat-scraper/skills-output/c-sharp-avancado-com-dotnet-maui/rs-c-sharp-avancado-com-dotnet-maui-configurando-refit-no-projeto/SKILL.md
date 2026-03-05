---
name: rs-csharp-maui-configurando-refit
description: "Applies Refit HTTP client configuration patterns in .NET MAUI projects. Use when user asks to 'configure Refit', 'setup API client', 'add HTTP client in MAUI', 'integrate REST API in .NET MAUI', or 'create typed HTTP interface'. Covers NuGet package installation, interface decoration with attributes, dependency injection registration, and base URL configuration from appsettings. Make sure to use this skill whenever setting up Refit or typed HTTP clients in .NET MAUI projects. Not for raw HttpClient usage, gRPC, SignalR, or non-MAUI .NET projects."
---

# Configurando Refit no .NET MAUI

> Configurar o Refit corretamente significa decorar a interface com atributos HTTP, registrar no DI container, e apontar para a URL base vinda da configuracao.

## Rules

1. **Instale ambos os pacotes** — `Refit` e `Refit.HttpClientFactory`, porque o segundo permite registrar o client no container de DI do MAUI
2. **Decore parametros com `[Body]`** — todo parametro que vai no corpo da requisicao precisa do atributo `[Body]`, porque sem ele o Refit nao sabe onde enviar o objeto
3. **Decore metodos com o verbo HTTP correto** — `[Post("/path")]`, `[Put("/path")]`, porque o Refit usa esses atributos para gerar a implementacao automaticamente
4. **Sempre inicie o path com barra** — `"/users"` nao `"users"`, porque sem a barra o Refit concatena incorretamente com a URL base
5. **O path reflete o controller + rota** — se o controller e `UsersController` com rota `change-password`, o path e `"/users/change-password"`, porque o nome do controller (sem sufixo) e sempre o primeiro segmento
6. **Leia a URL base da configuracao** — use `Configuration.GetValue<string>("ApiUrl")` em vez de hardcoded, porque permite trocar entre ambientes sem recompilar

## How to write

### Interface com atributos Refit

```csharp
using Refit;

public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);

    [Put("/users/change-password")]
    Task ChangePassword([Body] RequestChangePasswordJson request);
}
```

### Registro no MauiProgram

```csharp
// Em MauiProgram.cs, dentro do metodo de configuracao de servicos
builder.Services
    .AddRefitClient<IUserApiClient>()
    .ConfigureHttpClient(c =>
        c.BaseAddress = new Uri(builder.Configuration.GetValue<string>("ApiUrl")!));
```

## Example

**Before (interface sem atributos Refit):**
```csharp
public interface IUserApiClient
{
    Task<ResponseRegisterUserJson> Register(RequestRegisterUserJson request);
}
```

**After (com atributos Refit configurados):**
```csharp
using Refit;

public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint recebe dados no body | Adicionar `[Body]` antes do parametro |
| Controller tem rota aninhada | Concatenar: `"/controller/sub-rota"` |
| URL base pode mudar por ambiente | Ler de `appsettings.json` via `Configuration.GetValue` |
| Warning de nullable na URL | Usar `!` (null-forgiving) quando ha certeza que o valor existe |
| Novo endpoint na API | Adicionar metodo na interface com verbo e path corretos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[Post("users")]` (sem barra) | `[Post("/users")]` |
| `Task Register(RequestJson request)` (sem Body) | `Task Register([Body] RequestJson request)` |
| `c.BaseAddress = new Uri("http://hardcoded")` | `c.BaseAddress = new Uri(config.GetValue<string>("ApiUrl")!)` |
| Instalar so `Refit` sem `HttpClientFactory` | Instalar `Refit` + `Refit.HttpClientFactory` |
| Criar implementacao manual da interface | Deixar o Refit gerar automaticamente via DI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
