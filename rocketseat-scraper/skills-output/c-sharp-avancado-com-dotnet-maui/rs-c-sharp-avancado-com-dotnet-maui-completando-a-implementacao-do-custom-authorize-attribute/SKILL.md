---
name: rs-csharp-maui-custom-authorize-attribute
description: "Applies custom authorization attribute pattern in ASP.NET Core with TypeFilterAttribute. Use when user asks to 'protect endpoints', 'add authentication', 'create authorize attribute', 'implement auth filter', or 'restrict access to controller'. Covers token validation, expiration handling, and AuthenticatedUserAttribute creation. Make sure to use this skill whenever implementing endpoint authorization in .NET APIs. Not for JWT token generation, refresh token flows, or frontend authentication logic."
---

# Custom Authorize Attribute com TypeFilterAttribute

> Implemente atributos de autorizacao customizados usando TypeFilterAttribute para controlar acesso a endpoints com validacao completa de token.

## Rules

1. **Use TypeFilterAttribute como base** — `class AuthenticatedUserAttribute : TypeFilterAttribute<AuthenticatedUserFilter>`, porque o .NET registra automaticamente sem configuracao adicional no Program.cs
2. **Trate excecoes NO filtro, nao no exception filter** — o exception filter so captura excecoes DEPOIS que a request chega no controller; no filtro de autorizacao, use try-catch proprio
3. **Separe catch por tipo de excecao** — `UnauthorizedException` (sua), `SecurityTokenExpiredException` (token expirado), e `Exception` generico, porque cada cenario exige resposta diferente ao cliente
4. **Sinalize token expirado com flag booleana** — adicione `TokenIsExpired` no response JSON para o app redirecionar ao login, porque status 401 sozinho nao diferencia token invalido de expirado
5. **Use sealed na classe do atributo** — `sealed class AuthenticatedUserAttribute`, porque nenhuma classe deve herdar do seu atributo customizado
6. **Configure AttributeUsage com Class e Method** — `[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]`, porque o atributo pode decorar controllers inteiros ou metodos individuais

## How to write

### Filtro de autorizacao (AuthenticatedUserFilter)

```csharp
public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        try
        {
            var token = GetTokenOnRequest(context.HttpContext);
            var claims = ValidateToken(token);
            var userId = ExtractUserId(claims);
            var user = await _repository.GetById(userId);

            if (user is null)
                throw new UnauthorizedException("User not found");
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
}
```

### Atributo customizado (AuthenticatedUserAttribute)

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AuthenticatedUserAttribute : TypeFilterAttribute<AuthenticatedUserFilter>
{
}
```

### Uso no controller

```csharp
// Classe inteira protegida
[AuthenticatedUser]
public class WorkItemController : ControllerBase { }

// Metodos individuais protegidos
public class UserController : ControllerBase
{
    // Publico - sem atributo
    [HttpPost("register")]
    public async Task<IActionResult> Register() { }

    // Protegido
    [AuthenticatedUser]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile() { }

    [AuthenticatedUser]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile() { }
}
```

## Example

**Before (sem tratamento de token expirado):**
```csharp
catch (Exception)
{
    context.Result = new UnauthorizedObjectResult(
        new ResponseErrorJson(new List<string> { "Unauthorized" }));
}
```

**After (com tratamento granular):**
```csharp
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
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Todos os endpoints do controller precisam de auth | Coloque `[AuthenticatedUser]` na classe |
| Apenas alguns endpoints precisam de auth | Coloque `[AuthenticatedUser]` nos metodos individuais |
| Token invalido (formato errado, chave errada) | Catch generico → 401 sem detalhes |
| Token expirado mas valido | `SecurityTokenExpiredException` → 401 com `TokenIsExpired = true` |
| Usuario nao encontrado no banco | Lance `UnauthorizedException` → 401 com mensagem |
| Nao precisa usar nome completo do atributo | `[AuthenticatedUser]` funciona, .NET remove o sufixo `Attribute` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Configurar atributo no Program.cs | TypeFilterAttribute registra automaticamente |
| `[AttributeUsage(AttributeTargets.Class \|\| ...)]` (dois pipes) | `[AttributeUsage(AttributeTargets.Class \| ...)]` (um pipe — operacao bitwise) |
| Confiar no exception filter para erros de auth | Try-catch dentro do filtro de autorizacao |
| Retornar 401 generico para token expirado | Retornar 401 com `TokenIsExpired = true` |
| Classe de atributo sem `sealed` | `sealed class` para impedir heranca |
| `context.Result` sem `UnauthorizedObjectResult` | Usar `UnauthorizedObjectResult` para status 401 correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
