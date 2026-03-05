---
name: rs-csharp-maui-autorizando-requisicoes
description: "Applies transparent HTTP authorization pattern using DelegatingHandler in .NET MAUI with Refit. Use when user asks to 'add authentication to API calls', 'pass token in requests', 'implement bearer token', 'authorize HTTP requests', or 'configure Refit auth'. Enforces handler-based token injection over per-method authorization attributes, keeping use cases free of auth concerns. Make sure to use this skill whenever implementing authenticated API communication in .NET MAUI apps. Not for login/register flows, token generation, or refresh token rotation logic."
---

# Autorizando Requisicoes com DelegatingHandler

> Injete tokens de autenticacao de forma transparente via DelegatingHandler, nunca via parametros nos use cases.

## Rules

1. **Use DelegatingHandler para injetar tokens** — nunca passe tokens como parametro nas funcoes da interface Refit, porque isso polui os use cases com responsabilidade de autenticacao
2. **Valide antes de injetar** — verifique `string.IsNullOrWhiteSpace` no access token antes de adicionar ao header, porque na primeira execucao (login/registro) o token ainda nao existe
3. **Centralize no handler** — toda logica de autorizacao fica no handler, porque futuramente o refresh token tambem sera tratado ali, de forma transparente para o usuario
4. **Use cases nao conhecem tokens** — exceto login e registro que precisam salvar tokens, nenhum use case deve receber `ITokenStorage` como dependencia para fins de autorizacao

## How to write

### DelegatingHandler com token injection

```csharp
public class AuthorizationHandler : DelegatingHandler
{
    private readonly ITokenStorage _tokenStorage;

    public AuthorizationHandler(ITokenStorage tokenStorage)
    {
        _tokenStorage = tokenStorage;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var tokens = await _tokenStorage.Get();

        if (!string.IsNullOrWhiteSpace(tokens.AccessToken))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", tokens.AccessToken);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
```

### Interface Refit limpa (sem authorize attribute)

```csharp
public interface IUserAPI
{
    [Get("/users")]
    Task<ResponseUserProfileJson> GetProfile();
}
```

## Example

**Before (token no parametro — polui o use case):**

```csharp
// Interface Refit
public interface IUserAPI
{
    [Get("/users")]
    Task<ResponseUserProfileJson> GetProfile(
        [Authorize("Bearer")] string token);
}

// Use case precisa conhecer tokens
public class GetProfileUseCase
{
    private readonly IUserAPI _api;
    private readonly ITokenStorage _tokenStorage;

    public async Task Execute()
    {
        var tokens = await _tokenStorage.Get();
        var profile = await _api.GetProfile(tokens.AccessToken);
    }
}
```

**After (handler transparente):**

```csharp
// Interface Refit limpa
public interface IUserAPI
{
    [Get("/users")]
    Task<ResponseUserProfileJson> GetProfile();
}

// Use case nao sabe de tokens
public class GetProfileUseCase
{
    private readonly IUserAPI _api;

    public async Task Execute()
    {
        var profile = await _api.GetProfile();
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint precisa de autenticacao | Handler injeta automaticamente, nao mude a interface |
| Endpoint publico (login, registro) | Handler detecta token vazio e envia sem Authorization header |
| Precisa enviar cultura + token | Separe em funcoes privadas dentro do mesmo handler |
| Futuro refresh token | Implemente no handler — transparente para toda a app |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `[Authorize("Bearer")] string token` em cada metodo Refit | Handler unico injeta em todas as chamadas |
| Injetar `ITokenStorage` em use cases de leitura | Injetar apenas no handler |
| Enviar token sem validar existencia | `if (!string.IsNullOrWhiteSpace(tokens.AccessToken))` |
| Duplicar logica de auth em multiplos use cases | Centralizar no DelegatingHandler |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
