---
name: rs-csharp-maui-refresh-token-app
description: "Applies transparent refresh token flow in .NET MAUI apps using Refit and DelegatingHandler. Use when user asks to 'implement refresh token', 'handle token expiration', 'renew access token', 'silent token refresh', or 'DelegatingHandler auth'. Covers UseCase pattern for token renewal, Refit interface setup, and transparent request retry after token refresh. Make sure to use this skill whenever implementing authentication token renewal in MAUI/Xamarin apps. Not for backend JWT generation, login flow, or error handling in refresh flow."
---

# Refresh Token Transparente no App (.NET MAUI)

> Implemente a renovacao de tokens de forma transparente no DelegatingHandler, para que o usuario nunca perceba que o access token expirou.

## Rules

1. **Crie um UseCase dedicado para refresh** — `UseRefreshTokenUseCase` isolado, porque separa responsabilidade e permite reutilizacao
2. **Nao use o PlanShareHandler para a interface de refresh da API** — registre `IAuthenticationAPI` com `AddRefitClient` separado, sem o handler, porque senao cria loop infinito de interceptacao
3. **Reenvie a request original apos refresh** — use `base.SendAsync(request)` com o novo token, porque o usuario nao deve perceber a renovacao
4. **Sobrescreva a response original** — atribua o resultado do reenvio na mesma variavel `response`, porque o codigo continua e faz return dela
5. **Devolva os novos tokens do UseCase** — retorne `Result<Tokens>` para que o handler use o novo access token sem acessar storage novamente

## How to write

### UseCase de Refresh Token

```csharp
public class UseRefreshTokenUseCase : IUseRefreshTokenUseCase
{
    private readonly ITokensStorage _tokensStorage;
    private readonly IAuthenticationAPI _authApi;

    public async Task<Result<Tokens>> Execute()
    {
        var tokens = await _tokensStorage.Get();

        var request = new RequestNewTokenJson
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken
        };

        var response = await _authApi.Refresh(request);

        if (response.IsSuccessStatusCode)
        {
            tokens = new Tokens(
                response.Content!.AccessToken,
                response.Content!.RefreshToken
            );

            await _tokensStorage.Save(tokens);
            return Result.Success(tokens);
        }

        return Result.Failure<Tokens>(new List<string>());
    }
}
```

### Interface Refit para Refresh

```csharp
public interface IAuthenticationAPI
{
    [Post("/authentication/refresh")]
    Task<ApiResponse<ResponseTokensJson>> Refresh(
        [Body] RequestNewTokenJson request
    );
}
```

### No DelegatingHandler (PlanShareHandler)

```csharp
// Dentro do if que detecta token expirado:
var result = await _useRefreshTokenUseCase.Execute();

// Reautoriza a request com novo token
request.Headers.Authorization =
    new AuthenticationHeaderValue("Bearer", result.Response.AccessToken);

// Reenvia a mesma request original
response = await base.SendAsync(request, cancellationToken);
```

### Registro no DI (MauiProgram)

```csharp
// UseCase
builder.Services.AddTransient<IUseRefreshTokenUseCase, UseRefreshTokenUseCase>();

// Refit SEM o PlanShareHandler (evita loop infinito)
builder.Services.AddRefitClient<IAuthenticationAPI>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl));
```

## Example

**Before (token expira, request falha sem retry):**
```csharp
// DelegatingHandler so retorna o erro 401
if (response.StatusCode == HttpStatusCode.Unauthorized)
{
    // nada acontece, usuario ve erro
}
return response;
```

**After (refresh transparente + retry):**
```csharp
if (response.StatusCode == HttpStatusCode.Unauthorized)
{
    var errorBody = JsonSerializer.Deserialize<ResponseErrorJson>(content)!;

    if (errorBody.TokenIsExpired)
    {
        var result = await _useRefreshTokenUseCase.Execute();

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", result.Response.AccessToken);

        response = await base.SendAsync(request, cancellationToken);
    }
}
return response;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Interface Refit para refresh | Registre com `AddRefitClient` separado, SEM DelegatingHandler |
| UseCase retorna tokens | Use-os direto no handler, sem voltar ao storage |
| Request original falhou por 401 | Reenvie a mesma `request` com novo token, sobrescrevendo `response` |
| Tempo de expiracao para teste | Reduza para 1 minuto no `appsettings.Development.json` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Registrar `IAuthenticationAPI` com o mesmo handler de auth | Registrar com `AddRefitClient` separado sem handler |
| Criar nova request para reenvio | Reutilizar a mesma `request` recebida no handler |
| Acessar `TokensStorage` de novo apos refresh | Usar tokens retornados pelo UseCase |
| Deixar `response` original quando faz retry | Sobrescrever `response = await base.SendAsync(...)` |
| Tratar erros do refresh nesta etapa | Separar caminho feliz do tratamento de erros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
