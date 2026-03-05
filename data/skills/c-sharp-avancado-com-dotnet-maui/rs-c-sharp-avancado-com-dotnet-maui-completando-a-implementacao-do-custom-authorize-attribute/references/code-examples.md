# Code Examples: Custom Authorize Attribute

## ResponseErrorJson com TokenIsExpired

```csharp
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }
    public bool TokenIsExpired { get; set; } // default e false

    public ResponseErrorJson(List<string> errors)
    {
        Errors = errors;
    }
}
```

## AuthenticatedUserFilter completo

```csharp
public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    private readonly IUserReadOnlyRepository _repository;

    public AuthenticatedUserFilter(IUserReadOnlyRepository repository)
    {
        _repository = repository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        try
        {
            var token = GetTokenOnRequest(context.HttpContext);

            if (string.IsNullOrEmpty(token))
                throw new UnauthorizedException("No token provided");

            var claims = ValidateToken(token);
            var userId = ExtractUserIdFromClaims(claims);

            var user = await _repository.GetByIdActive(userId);

            if (user is null)
                throw new UnauthorizedException("User not found");

            // Se chegou aqui sem excecao, request prossegue para o controller
        }
        catch (SecurityTokenExpiredException)
        {
            var response = new ResponseErrorJson(new List<string> { "Token Expired" })
            {
                TokenIsExpired = true
            };
            context.Result = new UnauthorizedObjectResult(response);
        }
        catch (UnauthorizedException ex)
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(ex.Messages));
        }
        catch
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(new List<string> { "No permission" }));
        }
    }

    private string GetTokenOnRequest(HttpContext httpContext)
    {
        var authorization = httpContext.Request.Headers.Authorization.ToString();

        if (string.IsNullOrWhiteSpace(authorization))
            return string.Empty;

        // Remove "Bearer " prefix
        return authorization["Bearer ".Length..].Trim();
    }
}
```

## AuthenticatedUserAttribute

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AuthenticatedUserAttribute : TypeFilterAttribute<AuthenticatedUserFilter>
{
}
```

## Uso em controller com endpoints mistos

```csharp
// UserController - alguns endpoints publicos, outros protegidos
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Publico - qualquer pessoa pode se registrar
    }

    [AuthenticatedUser]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        // Protegido - precisa de token valido
    }

    [AuthenticatedUser]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // Protegido
    }

    [AuthenticatedUser]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        // Protegido
    }
}
```

## Uso em controller totalmente protegido

```csharp
// WorkItemController - todos os endpoints precisam de autenticacao
[AuthenticatedUser]  // Aplicado na classe inteira
[ApiController]
[Route("api/[controller]")]
public class WorkItemController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkItemRequest request) { }

    [HttpGet]
    public async Task<IActionResult> GetAll() { }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) { }
}
```

## Teste via Swagger

```
1. GET /api/user/profile sem token → 401 { errors: [...], tokenIsExpired: false }
2. POST /api/user/login com credenciais → 200 { token: "eyJ..." }
3. Authorize no Swagger: "Bearer eyJ..."
4. GET /api/user/profile com token → 200 { name: "Bruce Wayne", email: "bruce@wayne.com" }
5. Aguardar token expirar → 401 { errors: ["Token Expired"], tokenIsExpired: true }
```