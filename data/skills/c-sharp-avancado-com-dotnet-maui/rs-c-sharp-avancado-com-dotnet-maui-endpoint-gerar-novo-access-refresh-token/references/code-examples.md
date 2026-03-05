# Code Examples: Endpoint para Refresh Token

## Estrutura completa de arquivos

```
API/
├── Controllers/
│   ├── AuthenticationController.cs    ← NOVO
│   └── LoginController.cs            ← existente
│
Application/
├── UseCases/
│   └── Token/
│       └── RefreshToken/
│           ├── IRefreshTokenUseCase.cs    ← NOVO (interface)
│           └── RefreshTokenUseCase.cs     ← NOVO (implementacao)
├── DependencyInjectionExtension.cs        ← EDITAR (adicionar use case)
│
Communication/
├── Request/
│   └── RequestNewTokenJson.cs             ← NOVO
├── Response/
│   └── ResponseTokensJson.cs             ← ja existe (login/registro)
```

## AuthenticationController completo

```csharp
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ResponseTokensJson), StatusCodes.Status200OK)]
    public async Task<IActionResult> Refresh(
        [FromServices] IRefreshTokenUseCase useCase,
        [FromBody] RequestNewTokenJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }
}
```

## Interface IRefreshTokenUseCase

```csharp
namespace Application.UseCases.Token.RefreshToken;

public interface IRefreshTokenUseCase
{
    Task<ResponseTokensJson> Execute(RequestNewTokenJson request);
}
```

## Classe RefreshTokenUseCase (casco inicial)

```csharp
namespace Application.UseCases.Token.RefreshToken;

public class RefreshTokenUseCase : IRefreshTokenUseCase
{
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenReadOnlyRepository _readRepository;
    private readonly IRefreshTokenWriteOnlyRepository _writeRepository;
    private readonly IAccessTokenValidator _accessTokenValidator;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenUseCase(
        ITokenService tokenService,
        IRefreshTokenReadOnlyRepository readRepository,
        IRefreshTokenWriteOnlyRepository writeRepository,
        IAccessTokenValidator accessTokenValidator,
        IUnitOfWork unitOfWork)
    {
        _tokenService = tokenService;
        _readRepository = readRepository;
        _writeRepository = writeRepository;
        _accessTokenValidator = accessTokenValidator;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseTokensJson> Execute(RequestNewTokenJson request)
    {
        // Validacoes e geracao de novos tokens — implementado na proxima aula
        throw new NotImplementedException();
    }
}
```

## RequestNewTokenJson

```csharp
namespace Communication.Request;

public class RequestNewTokenJson
{
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
}
```

## Registro no DI Container

```csharp
// DependencyInjectionExtension.cs
public static class DependencyInjectionExtension
{
    // ... metodo existente ...

    private static void AddUseCases(IServiceCollection services)
    {
        // Use cases existentes...
        services.AddScoped<IRefreshTokenUseCase, RefreshTokenUseCase>();
    }
}
```

## Resultado no Swagger

Ao executar a API (F5), o Swagger exibe:

```
Authentication
  POST /authentication/refresh

Request Body:
{
  "refreshToken": "string",
  "accessToken": "string"
}

Responses:
  200 OK
  {
    "accessToken": "string",
    "refreshToken": "string"
  }
```

## Comparacao: LoginController vs AuthenticationController

```csharp
// LoginController (existente) — contexto especifico
[Route("[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Login(
        [FromServices] ILoginUseCase useCase,
        [FromBody] RequestLoginJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }
}

// AuthenticationController (novo) — contexto amplo
// Pode absorver Login, Refresh, Logout, 2FA
[Route("[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(...) { ... }

    // Futuro: [HttpPost("login")]
    // Futuro: [HttpPost("logout")]
    // Futuro: [HttpPost("2fa")]
}
```