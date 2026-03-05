# Code Examples: Configurando Refit no .NET MAUI

## 1. Instalacao dos NuGet Packages

No Visual Studio:
1. Botao direito no projeto `PlanShare.App`
2. "Manage NuGet Packages"
3. Aba "Browse"
4. Pesquisar "Refit"
5. Instalar `Refit`
6. Instalar `Refit.HttpClientFactory`

Via CLI:
```bash
dotnet add package Refit
dotnet add package Refit.HttpClientFactory
```

## 2. Interface completa com atributos

```csharp
using Refit;

public interface IUserApiClient
{
    [Post("/users")]
    Task<ResponseRegisterUserJson> Register([Body] RequestRegisterUserJson request);

    // Exemplo futuro mostrado pelo instrutor (change password)
    [Put("/users/change-password")]
    Task ChangePassword([Body] RequestChangePasswordJson request);
}
```

## 3. Correspondencia com o Controller da API

```csharp
// Backend - UsersController.cs
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RequestRegisterUserJson request)
    {
        // ...
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] RequestChangePasswordJson request)
    {
        // ...
    }
}
```

Mapeamento:
- `UsersController` + `[HttpPost]` → `[Post("/users")]`
- `UsersController` + `[HttpPut("change-password")]` → `[Put("/users/change-password")]`

## 4. Registro no MauiProgram.cs

```csharp
// MauiProgram.cs
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();

        // ... outras configuracoes ...

        ConfigureRefit(builder);

        return builder.Build();
    }

    private static void ConfigureRefit(MauiAppBuilder builder)
    {
        builder.Services
            .AddRefitClient<IUserApiClient>()
            .ConfigureHttpClient(c =>
                c.BaseAddress = new Uri(
                    builder.Configuration.GetValue<string>("ApiUrl")!
                ));
    }
}
```

## 5. appsettings.json com a URL da API

```json
{
    "ApiUrl": "https://sua-api-publica.azurewebsites.net"
}
```

## 6. Verificacao com breakpoint

O instrutor demonstra colocar um breakpoint na linha do `ConfigureHttpClient` e executar com F5. Usando F10 (step over) e hovering sobre a variavel, confirma que `Configuration.GetValue<string>("ApiUrl")` retorna a URL correta armazenada no `appsettings.json`.