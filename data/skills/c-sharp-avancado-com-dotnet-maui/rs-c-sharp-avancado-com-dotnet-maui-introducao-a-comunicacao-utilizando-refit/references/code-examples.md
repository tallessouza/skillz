# Code Examples: Comunicacao HTTP com Refit no .NET MAUI

## 1. Interface Refit completa

```csharp
// Data/Network/API/IUserApiClient.cs
using PlanShare.Communication.Requests;
using PlanShare.Communication.Responses;
using Refit;

public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);
}
```

## 2. Exemplo da documentacao do Refit (GitHub API)

```csharp
public interface IGitHubApi
{
    [Get("/users/{user}")]
    Task<User> GetUser(string user);
}
```

O `{user}` na rota corresponde ao parametro `string user` do metodo. O Refit faz a substituicao automaticamente.

## 3. Registro no MauiProgram.cs

```csharp
// MauiProgram.cs
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        
        // ... outras configuracoes ...
        
        builder.Services
            .AddRefitClient<IUserApiClient>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseApiUrl));
        
        return builder.Build();
    }
}
```

## 4. Forma nativa com HttpClient (para comparacao)

```csharp
// Como seria SEM Refit — mais verboso
public static void AddHttpClients(this IServiceCollection services)
{
    var httpClient = new HttpClient();
    httpClient.BaseAddress = new Uri("https://sua-api-url.com");
    
    // POST para registrar usuario
    var response = await httpClient.PostAsJsonAsync("/users", request);
    
    // Deserializar resposta manualmente
    var result = await response.Content.ReadFromJsonAsync<ResponseRegisterUserJson>();
}
```

## 5. Outros verbos HTTP com Refit

```csharp
public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);
    
    [Put("/users/change-password")]
    Task ChangePassword([Body] RequestChangePasswordJson request);
    
    [Get("/users/{id}")]
    Task<ResponseUserJson> GetById(string id);
    
    [Delete("/users/{id}")]
    Task Delete(string id);
}
```

## 6. Adicionando referencia ao projeto de comunicacao

No Visual Studio:
1. Botao direito em `Dependencies` (dentro do projeto App)
2. Add Project Reference
3. Selecionar `PlanShare.Communication`
4. Clicar OK

Isso permite usar `RequestRegisterUserJson` e `ResponseRegisterUserJson` tanto na API quanto no App.

## 7. Controller da API (referencia)

```csharp
// UsersController.cs (lado da API)
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RequestRegisterUserJson request)
    {
        // processar registro
        return Created("", new ResponseRegisterUserJson { /* ... */ });
    }
    
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] RequestChangePasswordJson request)
    {
        // processar troca de senha
        return NoContent();
    }
}
```

A rota do Refit (`[Post("/users")]`) corresponde ao controller (`[Route("[controller]")]` onde controller = "users").