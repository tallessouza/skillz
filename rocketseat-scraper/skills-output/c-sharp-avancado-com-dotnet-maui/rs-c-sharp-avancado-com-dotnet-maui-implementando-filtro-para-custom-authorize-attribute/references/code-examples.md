# Code Examples: Custom Authorize Filter

## Estrutura de pastas do projeto

```
API/
├── Filters/
│   ├── ExceptionFilter.cs          # Ja existente
│   └── AuthenticatedUserFilter.cs  # Novo filtro
Infrastructure/
└── Security/
    └── Tokens/
        ├── Access/
        │   └── JwtTokenHandler.cs   # Classe abstrata (shared)
        ├── Generator/
        │   └── JwtTokenGenerator.cs # Gera tokens
        └── Validator/
            └── JwtTokenValidator.cs # Valida tokens
```

## AuthenticatedUserFilter completo

```csharp
using Microsoft.AspNetCore.Mvc.Filters;

public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    private readonly IAccessTokenValidator _accessTokenValidator;

    public AuthenticatedUserFilter(IAccessTokenValidator accessTokenValidator)
    {
        _accessTokenValidator = accessTokenValidator;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = TokenOnRequest(context);

        _accessTokenValidator.Validate(token);

        // Continuacao na proxima aula:
        // Verificar no repositorio se o usuario esta ativo
    }

    private static string TokenOnRequest(AuthorizationFilterContext context)
    {
        var authentication = context.HttpContext
            .Request
            .Headers
            .Authorization
            .ToString();

        if (string.IsNullOrWhiteSpace(authentication))
            throw new UnauthorizedException(ResourceMessagesException.NoToken);

        // Remove o prefixo "Bearer " do token
        // "Bearer ".Length = 7, pega da posicao 7 ate o final
        return authentication["Bearer ".Length..].Trim();
    }
}
```

## JwtTokenHandler — classe abstrata compartilhada

```csharp
public abstract class JwtTokenHandler
{
    protected SymmetricSecurityKey SecurityKey { get; }

    protected JwtTokenHandler(string signingKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(signingKey);
        SecurityKey = new SymmetricSecurityKey(keyBytes);
    }
}
```

## JwtTokenGenerator — geracao do token

```csharp
public class JwtTokenGenerator : JwtTokenHandler
{
    private readonly uint _expirationTimeInMinutes;

    public JwtTokenGenerator(uint expirationTimeInMinutes, string signingKey)
        : base(signingKey)
    {
        _expirationTimeInMinutes = expirationTimeInMinutes;
    }

    public (string token, string accessTokenIdentifier) Generate(User user)
    {
        // ID unico para o token (importante para Refresh Token)
        var accessTokenIdentifier = Guid.CreateVersion7().ToString(); // .NET 9
        // Ou: Guid.NewGuid().ToString() para versoes anteriores

        var claims = new List<Claim>
        {
            new Claim("AccessTokenIdentifier", accessTokenIdentifier),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Expires = DateTime.UtcNow.AddMinutes(_expirationTimeInMinutes),
            Subject = new ClaimsIdentity(claims),
            SigningCredentials = new SigningCredentials(
                SecurityKey,
                SecurityAlgorithms.HmacSha256Signature)
        };

        var handler = new JwtSecurityTokenHandler();
        var securityToken = handler.CreateToken(tokenDescriptor);
        var token = handler.WriteToken(securityToken);

        // Retorna tuple com dois valores
        return (token, accessTokenIdentifier);
    }
}
```

## JwtTokenValidator — validacao do token

```csharp
public class JwtTokenValidator : JwtTokenHandler, IAccessTokenValidator
{
    public JwtTokenValidator(string signingKey) : base(signingKey) { }

    public void Validate(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,  // Nao valida audience
            ValidateIssuer = false,    // Nao valida issuer
            IssuerSigningKey = SecurityKey,
            ClockSkew = TimeSpan.Zero  // Precisao na expiracao
        };

        var handler = new JwtSecurityTokenHandler();

        // Se nao lancar excecao, token e valido
        // out _ descarta o SecurityToken retornado
        handler.ValidateToken(token, validationParameters, out _);
    }
}
```

## Registro na injecao de dependencia

```csharp
// No Program.cs ou no metodo de configuracao de servicos
services.AddScoped<IAccessTokenValidator, JwtTokenValidator>();
services.AddScoped<AuthenticatedUserFilter>();
```

## Comparacao: ExceptionFilter vs AuthorizationFilter

```csharp
// Padrao ja existente no projeto — filtro de excecao
public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        // Toda excecao cai aqui
    }
}

// Novo padrao — filtro de autorizacao
public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        // Toda requisicao a endpoint marcado cai aqui
    }
}
```

## Cenario real: filtros por plano de assinatura

```csharp
// Exemplo conceitual baseado na experiencia do instrutor
public class BasicPlanFilter : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = TokenOnRequest(context);
        // Validar token + verificar se plano do usuario >= Basic
    }
}

public class PremiumPlanFilter : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = TokenOnRequest(context);
        // Validar token + verificar se plano do usuario == Premium
    }
}

// Uso nos controllers:
[BasicPlan]
[HttpGet("basic-feature")]
public IActionResult BasicFeature() { /* ... */ }

[PremiumPlan]
[HttpGet("premium-feature")]
public IActionResult PremiumFeature() { /* ... */ }
```