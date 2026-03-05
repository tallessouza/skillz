# Code Examples: Refit API Interface para PUT com 204 No Content

## Exemplo completo da interface IUserAPI

```csharp
public interface IUserAPI
{
    // POST /users — cria usuario, retorna dados (200 com corpo)
    [Post("/users")]
    Task<IApiResponse<ResponseRegisterUserJSON>> Register(
        [Body] RequestRegisterUserJSON request
    );

    // PUT /users — atualiza perfil, retorna 204 No Content
    [Put("/users")]
    Task<IApiResponse> UpdateProfile(
        [Body] RequestUpdateUserJSON request
    );
}
```

## Controller da API (referencia)

```csharp
// O controller define o verbo e o retorno
[HttpPut]
public IActionResult UpdateProfile([FromBody] RequestUpdateUserJSON request)
{
    // ... logica de atualizacao ...
    return NoContent(); // 204 — sem corpo na resposta
}
```

## Interface do Use Case

```csharp
using PlanShare.App.Models.ValueObjects;

public interface IUpdateUserUseCase
{
    // Result sem tipo generico — apenas sucesso ou erro
    Task<Result> Execute(Models.User user);
}
```

## Classe do Use Case (esqueleto)

```csharp
public class UpdateUserUseCase : IUpdateUserUseCase
{
    public async Task<Result> Execute(Models.User user)
    {
        // Implementacao na parte 2
        throw new NotImplementedException();
    }
}
```

## Registro no MauiProgram

```csharp
// Dentro do metodo de configuracao de servicos
builder.Services.AddTransient<IUpdateUserUseCase, UpdateUserUseCase>();
```

## Comparacao: tres formas de lidar com 204 no Refit

```csharp
// 1. ERRADO mas funciona — ApiResponse<string>
[Put("/users")]
Task<ApiResponse<string>> UpdateProfile([Body] RequestUpdateUserJSON request);
// .Content sera null/vazio. Semanticamente incorreto.

// 2. FUNCIONA — IApiResponse<string>
[Put("/users")]
Task<IApiResponse<string>> UpdateProfile([Body] RequestUpdateUserJSON request);
// Mesmo problema semantico, mas usa interface.

// 3. CORRETO — IApiResponse sem generico
[Put("/users")]
Task<IApiResponse> UpdateProfile([Body] RequestUpdateUserJSON request);
// Expressa a intencao real. Acesso a StatusCode, Error, IsSuccessStatusCode.
```

## Propriedades disponiveis em IApiResponse (sem generico)

```csharp
// Apos chamar o endpoint:
var response = await _userApi.UpdateProfile(request);

// Propriedades disponiveis:
response.StatusCode        // HttpStatusCode.NoContent (204)
response.IsSuccessStatusCode // true
response.Error             // null se sucesso
response.RequestMessage    // HttpRequestMessage original
```

## Quando usar IApiResponse<T> vs IApiResponse

```csharp
// Com tipo — endpoint retorna corpo (200 OK com JSON)
Task<IApiResponse<ResponseRegisterUserJSON>> Register(...);
// Uso: response.Content.Name, response.Content.Email

// Sem tipo — endpoint retorna apenas status (204 No Content)
Task<IApiResponse> UpdateProfile(...);
// Uso: response.IsSuccessStatusCode, response.StatusCode
```