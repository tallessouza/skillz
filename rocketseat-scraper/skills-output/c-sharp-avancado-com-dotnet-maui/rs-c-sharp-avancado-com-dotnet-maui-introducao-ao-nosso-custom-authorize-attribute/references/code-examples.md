# Code Examples: Custom Authorize Attribute

## Cenario 1: Endpoint sem protecao (o problema)

```csharp
// UsersController.cs — endpoint publico (qualquer um acessa)
[HttpGet]
[Route("users")]
public async Task<IActionResult> GetProfile(
    [FromServices] IGetUserProfileUseCase useCase)
{
    var response = await useCase.Execute();
    return Ok(response);
}
```

```csharp
// GetUserProfileUseCase.cs — tenta ler token que pode nao existir
public class GetUserProfileUseCase : IGetUserProfileUseCase
{
    private readonly ILoggedUser _loggedUser;
    private readonly IMapper _mapper;

    public async Task<UserProfileJson> Execute()
    {
        var user = await _loggedUser.User();

        return _mapper.Map<UserProfileJson>(user);
    }
}
```

```csharp
// LoggedUser.cs — acessa header sem validacao
public class LoggedUser : ILoggedUser
{
    public async Task<User> User()
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = TokenValue(); // Pode ser vazio!

        // Se token vazio, lanca excecao ao acessar string como array
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var userId = jwtToken.Claims.First(c => c.Type == "sub").Value;

        return await _userRepository.GetByIdAsync(Guid.Parse(userId));
    }

    private string TokenValue()
    {
        var authorization = _httpContext.HttpContext!
            .Request.Headers.Authorization.ToString();

        // Se authorization esta vazio, Split(" ")[1] lanca excecao
        return authorization.Split(" ")[1];
    }
}
```

## Cenario 2: Authorize padrao da Microsoft (Cache Flow)

```csharp
// Program.cs — configuracao padrao
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        // ... parametros de validacao
    };
});
```

```csharp
// ReportController.cs — usando Authorize padrao com Roles
[Authorize(Roles = "admin")]
[HttpGet]
public async Task<IActionResult> GenerateReport()
{
    // Problema 1: se usuario foi deletado, ainda passa
    // Problema 2: role "admin" esta exposta no payload do JWT
    // Problema 3: se role foi removida do banco, token antigo ainda funciona
    var report = await _useCase.Execute();
    return File(report, "application/pdf");
}
```

## Cenario 3: Fluxo de autenticacao via Swagger (demonstracao)

```
1. POST /login
   Body: { "email": "bruce@wayne.com", "password": "123456789" }
   Response: { "id": "...", "name": "Bruce", "token": "eyJhbG..." }

2. Swagger Authorize:
   Value: "Bearer eyJhbG..."
   → Cadeado fecha (token enviado em todas as requisicoes)

3. GET /users
   Header: Authorization: Bearer eyJhbG...
   → Token lido do header → JWT decodificado → usuario encontrado
   Response: { "name": "Bruce", "email": "bruce@wayne.com" }
```

## Cenario 4: Estrutura do JWT (o que deve e nao deve conter)

```json
// ERRADO — payload expoe informacoes sensiveis
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Bruce Wayne",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "exp": 1700000000
}

// CORRETO — payload minimo, so o ID
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "exp": 1700000000
}
```

## Cenario 5: Estrutura do Controller com endpoints mistos

```csharp
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    // Publico — qualquer pessoa pode criar conta
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserJson request,
        [FromServices] IRegisterUserUseCase useCase)
    {
        var response = await useCase.Execute(request);
        return Created(string.Empty, response);
    }

    // Protegido — so usuario autenticado e existente
    [AuthenticatedUser]
    [HttpGet]
    public async Task<IActionResult> GetProfile(
        [FromServices] IGetUserProfileUseCase useCase)
    {
        var response = await useCase.Execute();
        return Ok(response);
    }

    // Protegido — so usuario autenticado e existente
    [AuthenticatedUser]
    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateUserJson request,
        [FromServices] IUpdateUserProfileUseCase useCase)
    {
        await useCase.Execute(request);
        return NoContent();
    }
}
```