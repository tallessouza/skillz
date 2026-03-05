# Code Examples: Refresh Token Transparente no App

## 1. Interface IUseRefreshTokenUseCase

```csharp
public interface IUseRefreshTokenUseCase
{
    Task<Result<Tokens>> Execute();
}
```

Assincrona, sem parametros. Retorna `Result<Tokens>` — o value object/DTO com `AccessToken` e `RefreshToken`.

## 2. UseRefreshTokenUseCase completo

```csharp
public class UseRefreshTokenUseCase : IUseRefreshTokenUseCase
{
    private readonly ITokensStorage _tokensStorage;
    private readonly IAuthenticationAPI _authApi;

    public UseRefreshTokenUseCase(
        ITokensStorage tokensStorage,
        IAuthenticationAPI authApi)
    {
        _tokensStorage = tokensStorage;
        _authApi = authApi;
    }

    public async Task<Result<Tokens>> Execute()
    {
        // 1. Recupera tokens armazenados localmente
        var tokens = await _tokensStorage.Get();

        // 2. Monta request com tokens atuais
        var request = new RequestNewTokenJson
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken
        };

        // 3. Chama API via Refit (sem passar pelo handler!)
        var response = await _authApi.Refresh(request);

        if (response.IsSuccessStatusCode)
        {
            // 4. Cria novo DTO com tokens recebidos
            tokens = new Tokens(
                response.Content!.AccessToken,
                response.Content!.RefreshToken
            );

            // 5. Salva novos tokens no storage local
            await _tokensStorage.Save(tokens);

            // 6. Retorna sucesso com novos tokens
            return Result.Success(tokens);
        }

        // Caminho de erro (tratado na proxima aula)
        return Result.Failure<Tokens>(new List<string>());
    }
}
```

**Nota:** A variavel `tokens` e reutilizada (sobrescrita) na linha 4 para evitar criar outra variavel do mesmo tipo.

## 3. Interface Refit IAuthenticationAPI

```csharp
public interface IAuthenticationAPI
{
    [Post("/authentication/refresh")]
    Task<ApiResponse<ResponseTokensJson>> Refresh(
        [Body] RequestNewTokenJson request
    );
}
```

Mapeamento:
- `POST /authentication/refresh` — rota do `AuthenticationController`
- Body: `RequestNewTokenJson` com AccessToken e RefreshToken
- Response: `ResponseTokensJson` com novos tokens

## 4. PlanShareHandler — trecho do if com refresh

```csharp
private readonly IUseRefreshTokenUseCase _useRefreshTokenUseCase;

// No construtor: recebe via DI
public PlanShareHandler(IUseRefreshTokenUseCase useRefreshTokenUseCase)
{
    _useRefreshTokenUseCase = useRefreshTokenUseCase;
}

// Dentro do SendAsync, no if de token expirado:
if (responseError.TokenIsExpired)
{
    // Executa refresh (caminho feliz)
    var result = await _useRefreshTokenUseCase.Execute();

    // Reautoriza com novo access token
    request.Headers.Authorization =
        new AuthenticationHeaderValue("Bearer", result.Response.AccessToken);

    // Reenvia a request original
    response = await base.SendAsync(request, cancellationToken);
}
```

## 5. Registro no MauiProgram.cs

```csharp
// Registro do UseCase
builder.Services.AddTransient<IUseRefreshTokenUseCase, UseRefreshTokenUseCase>();

// Registro do Refit para IAuthenticationAPI — SEM handler
builder.Services.AddRefitClient<IAuthenticationAPI>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl));
```

**Critico:** Note que `AddRefitClient<IAuthenticationAPI>()` NAO tem `.AddHttpMessageHandler<PlanShareHandler>()`. Isso evita o loop infinito.

## 6. Configuracao de teste — appsettings.Development.json

```json
{
  "Jwt": {
    "ExpiresInMinutes": 1
  }
}
```

Reduzido para 1 minuto para testar o fluxo de refresh. Em producao, usar valor adequado (ex: 15-60 minutos).

## 7. Estrutura de pastas do UseCase

```
UseCases/
└── Authentication/
    └── Refresh/
        ├── IUseRefreshTokenUseCase.cs
        └── UseRefreshTokenUseCase.cs
```

## 8. Estrutura da interface Refit no projeto

```
Data/
└── Network/
    └── API/
        └── IAuthenticationAPI.cs
```