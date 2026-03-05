---
name: rs-csharp-dotnet-maui-refresh-token-endpoint
description: "Applies refresh token endpoint pattern when building authentication flows in ASP.NET Core APIs. Use when user asks to 'create refresh token endpoint', 'implement token renewal', 'add authentication controller', or 'build token refresh flow' in C#/.NET projects. Enforces correct controller organization, Swagger documentation, use case injection, and request/response typing. Make sure to use this skill whenever implementing token refresh or authentication endpoints in .NET. Not for frontend token handling, JWT generation logic, or database schema design."
---

# Endpoint para Refresh Token em ASP.NET Core

> Crie endpoints de refresh token em um AuthenticationController dedicado, com documentação Swagger, injecao de use case, e tipagem correta de request/response.

## Rules

1. **Agrupe endpoints de autenticacao em um AuthenticationController** — login, refresh, logout e 2FA pertencem ao mesmo contexto, porque facilita evolucao e organizacao do projeto
2. **Use API Controller, nao MVC Controller** — ao criar no Visual Studio, selecione a opcao API > API Controller, porque MVC controllers trazem dependencias desnecessarias
3. **Simplifique a rota removendo o prefixo api/** — deixe apenas o nome do controller na rota (`[Route("[controller]")]`), porque a rota fica mais limpa
4. **Use POST para refresh token** — porque o endpoint recebe dados no body (GET/DELETE nao aceitam body) e cria um novo token (semantica de criacao = POST)
5. **Documente com ProducesResponseType** — passe typeof e StatusCodes para cada resposta possivel, porque o Swagger gera documentacao automatica
6. **Registre o use case no DI container** — adicione no metodo `AddUseCases` do DependencyInjectionExtension, porque sem isso o endpoint lanca excecao em runtime

## How to write

### AuthenticationController

```csharp
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

### Interface do Use Case

```csharp
public interface IRefreshTokenUseCase
{
    Task<ResponseTokensJson> Execute(RequestNewTokenJson request);
}
```

### Request DTO

```csharp
public class RequestNewTokenJson
{
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
}
```

### Use Case com dependencias

```csharp
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
        // Implementacao na proxima aula
        throw new NotImplementedException();
    }
}
```

### Registro no DI

```csharp
// Em DependencyInjectionExtension.cs, metodo AddUseCases
services.AddScoped<IRefreshTokenUseCase, RefreshTokenUseCase>();
```

## Example

**Before (endpoint no controller errado, sem documentacao):**
```csharp
// LoginController.cs — misturando contextos
[HttpPost("refresh")]
public async Task<IActionResult> Refresh([FromBody] object request)
{
    // sem tipagem, sem documentacao, sem use case
    return Ok();
}
```

**After (com esta skill aplicada):**
```csharp
// AuthenticationController.cs — contexto correto
[HttpPost("refresh")]
[ProducesResponseType(typeof(ResponseTokensJson), StatusCodes.Status200OK)]
public async Task<IActionResult> Refresh(
    [FromServices] IRefreshTokenUseCase useCase,
    [FromBody] RequestNewTokenJson request)
{
    var response = await useCase.Execute(request);
    return Ok(response);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint recebe dados e cria recurso | Use POST |
| Endpoint pertence a autenticacao | Coloque no AuthenticationController |
| Projeto ja tem LoginController separado | Considere migrar login para AuthenticationController (ajuste testes e app) |
| Use case precisa de multiplos servicos | Injete via construtor, armazene em campos `private readonly` |
| Endpoint tem resposta tipada | Adicione `ProducesResponseType` com typeof e StatusCode |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar endpoint sem `ProducesResponseType` | Documente cada tipo de resposta para o Swagger |
| Receber `object` ou `dynamic` no body | Crie um DTO tipado (`RequestNewTokenJson`) |
| Colocar logica de negocio no controller | Delegue para um use case injetado via `[FromServices]` |
| Esquecer de registrar use case no DI | Adicione no `AddUseCases` do `DependencyInjectionExtension` |
| Usar GET para refresh token | Use POST porque recebe body e cria recurso |
| Criar MVC Controller para API | Selecione API Controller na criacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
