# Code Examples: Tratamento de Erros na Comunicação App-API com Refit

## Exemplo 1: Interface Refit ANTES (sem tratamento)

```csharp
// Planshare.App — ILoginApi.cs
public interface ILoginApi
{
    [Post("/login")]
    Task<ResponseHasTheUserJson> Login([Body] RequestLoginJson request);
}

public interface IUserApi
{
    [Post("/user")]
    Task<ResponseHasTheUserJson> Register([Body] RequestRegisterUserJson request);
}
```

**Problema:** Se a API retornar 401, o Refit tenta deserializar o JSON de erro no tipo `ResponseHasTheUserJson` e lança exceção.

## Exemplo 2: Interface Refit DEPOIS (com ApiResponse)

```csharp
// Planshare.App — ILoginApi.cs
public interface ILoginApi
{
    [Post("/login")]
    Task<ApiResponse<ResponseHasTheUserJson>> Login([Body] RequestLoginJson request);
}

// Planshare.App — IUserApi.cs
public interface IUserApi
{
    [Post("/user")]
    Task<ApiResponse<ResponseHasTheUserJson>> Register([Body] RequestRegisterUserJson request);
}
```

**Nota:** `ApiResponse` vem do namespace do Refit. É uma classe do pacote NuGet que já foi instalado.

## Exemplo 3: Login Use Case completo

```csharp
// Planshare.App.UseCases — LoginUseCase.cs
public class LoginUseCase
{
    private readonly ILoginApi _loginApi;

    public LoginUseCase(ILoginApi loginApi)
    {
        _loginApi = loginApi;
    }

    public async Task Execute(RequestLoginJson request)
    {
        var response = await _loginApi.Login(request);

        if (response.IsSuccessStatusCode)
        {
            // Content é do tipo ResponseHasTheUserJson, já deserializado
            var id = response.Content.Id;
            var name = response.Content.Name;
            var accessToken = response.Content.Tokens.AccessToken;
            var refreshToken = response.Content.Tokens.RefreshToken;

            // Criar records e armazenar internamente no app
            // ...
        }
        else
        {
            // Erro: response.Error.Content é string JSON
            // Deserialização do erro será feita na próxima etapa
            var errorJson = response.Error.Content;
        }
    }
}
```

## Exemplo 4: Register Use Case com mesma correção

```csharp
// Planshare.App.UseCases — RegisterUseCase.cs
public async Task Execute(RequestRegisterUserJson request)
{
    var response = await _userApi.Register(request);

    if (response.IsSuccessStatusCode)
    {
        var id = response.Content.Id;
        var name = response.Content.Name;
        var tokens = response.Content.Tokens;

        // Armazenar dados do usuário...
    }
    else
    {
        var errorContent = response.Error.Content;
        // Tratar erro...
    }
}
```

## Exemplo 5: Verificação com StatusCode específico

```csharp
var response = await _loginApi.Login(request);

if (response.IsSuccessStatusCode)
{
    // Sucesso — acessar Content
}
else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
    // 401 — credenciais inválidas
}
else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
{
    // 400 — dados inválidos
}
else
{
    // Outro erro (500, etc.)
}
```

## Exemplo 6: O que o API retorna em cada caso

### Caso de sucesso (200 OK):
```json
{
    "id": "guid-do-usuario",
    "name": "Bruce",
    "tokens": {
        "accessToken": "eyJ...",
        "refreshToken": "eyJ..."
    }
}
```
Acessível via `response.Content` (já deserializado em `ResponseHasTheUserJson`).

### Caso de erro (401 Unauthorized):
```json
{
    "errors": ["Invalid login credentials"]
}
```
Acessível via `response.Error.Content` (como **string**, precisa deserializar manualmente).

## Exemplo 7: Debugging — propriedades do ApiResponse no Visual Studio

```
response (ApiResponse<ResponseHasTheUserJson>)
├── IsSuccessStatusCode: true/false
├── StatusCode: OK (200) / Unauthorized (401) / BadRequest (400)
├── Content: ResponseHasTheUserJson  ← só preenchido se sucesso
│   ├── Id: "guid"
│   ├── Name: "Bruce"
│   └── Tokens: { AccessToken, RefreshToken }
└── Error: ApiException              ← só preenchido se erro
    └── Content: "{ \"errors\": [...] }"  ← string JSON
```