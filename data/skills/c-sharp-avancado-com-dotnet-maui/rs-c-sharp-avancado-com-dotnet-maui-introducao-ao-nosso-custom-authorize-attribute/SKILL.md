---
name: rs-csharp-custom-authorize-attribute
description: "Enforces custom authorization attribute patterns in ASP.NET Core APIs instead of default Microsoft Authorize. Use when user asks to 'protect endpoint', 'add authentication', 'authorize controller', 'validate JWT token', or 'restrict API access'. Applies rules: minimal JWT payload (ID only), server-side permission validation, block requests before business logic execution. Make sure to use this skill whenever implementing API authorization in .NET projects. Not for frontend auth flows, login UI, or token generation logic."
---

# Custom Authorize Attribute em ASP.NET Core

> Crie seus proprios atributos de autorizacao ao inves de depender do Authorize padrao da Microsoft, mantendo o token JWT enxuto e validando permissoes no servidor.

## Rules

1. **Token JWT so contem o ID do usuario** — nunca coloque roles, permissoes ou dados sensiveis no payload, porque qualquer pessoa pode decodificar o payload no jwt.io e direcionar ataques com essa informacao
2. **Valide permissoes no banco de dados, nao no token** — porque se uma permissao for removida, o token antigo ainda carrega a permissao antiga ate expirar
3. **Bloqueie antes da regra de negocio** — se nao ha token valido, a requisicao nao deve chegar ao use case, porque executar logica de negocio sem usuario autenticado desperdiça recursos e gera erros 500 confusos
4. **Verifique se o usuario ainda existe** — um token valido nao significa usuario ativo; a conta pode ter sido deletada apos o token ser gerado
5. **Crie atributos especificos por nivel de permissao** — um atributo para usuario comum, outro para admin, outro para roles especificas, porque cada nivel tem validacoes diferentes
6. **Nao use o Authorize padrao da Microsoft** — ele so valida assinatura e expiracao do token, nao verifica existencia do usuario nem permissoes atualizadas no banco

## How to write

### Custom Authorize Attribute (estrutura base)

```csharp
// Atributo customizado que valida token E existencia do usuario
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthenticatedUserAttribute : TypeFilterAttribute
{
    public AuthenticatedUserAttribute() : base(typeof(AuthenticatedUserFilter))
    {
    }
}

public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    private readonly ITokenHandler _tokenHandler;
    private readonly IUserRepository _userRepository;

    public AuthenticatedUserFilter(
        ITokenHandler tokenHandler,
        IUserRepository userRepository)
    {
        _tokenHandler = tokenHandler;
        _userRepository = userRepository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = GetTokenFromHeader(context.HttpContext.Request);

        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedObjectResult(
                new { message = "Token not provided" });
            return;
        }

        var userId = _tokenHandler.ValidateAndGetUserId(token);

        if (userId == Guid.Empty)
        {
            context.Result = new UnauthorizedObjectResult(
                new { message = "Invalid or expired token" });
            return;
        }

        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null)
        {
            context.Result = new UnauthorizedObjectResult(
                new { message = "User not found" });
            return;
        }
    }

    private static string? GetTokenFromHeader(HttpRequest request)
    {
        var authorization = request.Headers.Authorization.ToString();
        if (string.IsNullOrEmpty(authorization)) return null;

        return authorization.Split(" ").Last();
    }
}
```

### Uso no Controller

```csharp
[AuthenticatedUser] // Atributo customizado, nao o Authorize da Microsoft
[HttpGet]
public async Task<IActionResult> GetProfile()
{
    var response = await _useCase.Execute();
    return Ok(response);
}
```

## Example

**Before (problema — Authorize padrao):**
```csharp
// Token expirado? Bloqueia. Token invalido? Bloqueia.
// Mas usuario deletado com token valido? Passa.
// Permissao removida mas ainda no token? Passa.
[Authorize(Roles = "admin")]
[HttpGet]
public async Task<IActionResult> GetProfile()
{
    // Executa regra de negocio mesmo sem validacoes adequadas
    var response = await _useCase.Execute();
    return Ok(response);
}
```

**After (com atributo customizado):**
```csharp
// Valida token + existencia do usuario + permissoes no banco
[AuthenticatedUser]
[HttpGet]
public async Task<IActionResult> GetProfile()
{
    // So chega aqui se usuario existe e token e valido
    var response = await _useCase.Execute();
    return Ok(response);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint publico (login, registro) | Nenhum atributo de autorizacao |
| Endpoint para usuario logado | `[AuthenticatedUser]` customizado |
| Endpoint para admin | `[AdminUser]` customizado com checagem de role no banco |
| Precisa de role especifica | Crie atributo customizado que consulta permissoes no banco |
| Token JWT payload | Armazene apenas o ID do usuario |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `[Authorize]` padrao da Microsoft | `[AuthenticatedUser]` customizado |
| Roles no payload do JWT (`"role": "admin"`) | Consultar role no banco dentro do filtro de autorizacao |
| Deixar endpoint sem protecao e tratar erro 500 | Bloquear no atributo antes da regra de negocio |
| `builder.Services.AddAuthentication()` com Bearer padrao | Implementar `IAsyncAuthorizationFilter` proprio |
| Confiar que token valido = usuario valido | Sempre buscar usuario no banco apos validar token |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
