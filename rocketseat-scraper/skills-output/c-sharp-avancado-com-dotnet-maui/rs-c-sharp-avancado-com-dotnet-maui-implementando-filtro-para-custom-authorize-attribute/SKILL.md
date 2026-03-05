---
name: rs-csharp-avancado-custom-authorize-filter
description: "Enforces custom authorization filter pattern in .NET APIs using IAsyncAuthorizationFilter instead of default Authorize attribute. Use when user asks to 'create authorization', 'protect endpoint', 'validate token', 'custom auth attribute', or 'implement authentication filter' in .NET/C#. Applies pattern: extract token from header, validate via injected service, throw typed exceptions. Make sure to use this skill whenever implementing API authorization in .NET MAUI or ASP.NET projects. Not for frontend auth, OAuth flows, or Identity framework configuration."
---

# Custom Authorize Filter no .NET

> Implemente filtros de autorizacao customizados com IAsyncAuthorizationFilter para ter controle total sobre a validacao de tokens na API.

## Rules

1. **Nunca use o atributo Authorize padrao** — implemente IAsyncAuthorizationFilter, porque o Authorize padrao tira controle sobre a logica de autorizacao e nao suporta cenarios como planos de assinatura diferenciados
2. **Separe extracao e validacao do token** — funcao privada para extrair token do header, servico injetado para validar, porque cada responsabilidade deve ser isolada e testavel
3. **Lance exceptions tipadas, nunca retorne bool** — o ValidateToken do JWT nao retorna true/false, ele lanca excecao se invalido, siga esse mesmo padrao com exceptions customizadas
4. **Injete o validador via interface** — use IAccessTokenValidator via construtor, porque permite trocar a implementacao e testar com mocks
5. **Sempre remova o prefixo Bearer do token** — use substring com o tamanho do prefixo + trim, porque o header Authorization vem no formato "Bearer {token}"
6. **Valide nulidade antes de processar** — verifique string.IsNullOrWhiteSpace no token antes de qualquer operacao, porque requisicoes sem token devem falhar rapido

## How to write

### Filtro de autorizacao

```csharp
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
        // Proxima aula: verificar se usuario esta ativo no repositorio
    }

    private static string TokenOnRequest(AuthorizationFilterContext context)
    {
        var authentication = context.HttpContext.Request.Headers.Authorization.ToString();

        if (string.IsNullOrWhiteSpace(authentication))
            throw new UnauthorizedException(ResourceMessagesException.NoToken);

        return authentication["Bearer ".Length..].Trim();
    }
}
```

### Token Validator com JWT

```csharp
public class JwtTokenValidator : JwtTokenHandler, IAccessTokenValidator
{
    public void Validate(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = SecurityKey,
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();
        handler.ValidateToken(token, validationParameters, out _);
        // Se nao lancar excecao, token e valido
    }
}
```

## Example

**Before (usando Authorize padrao):**
```csharp
[Authorize]
[HttpGet("profile")]
public IActionResult GetProfile() { /* ... */ }
```

**After (com filtro customizado):**
```csharp
[AuthenticatedUser] // Atributo customizado que usa o filtro
[HttpGet("profile")]
public IActionResult GetProfile() { /* ... */ }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API com planos de assinatura diferentes | Crie um filtro por plano (BasicPlanFilter, PremiumPlanFilter) |
| Endpoint precisa apenas de autenticacao | Use o AuthenticatedUserFilter base |
| Token invalido ou expirado | Deixe a excecao propagar para o ExceptionFilter tratar |
| ValidateToken retorna SecurityToken via out | Use `out _` para descartar, nao e necessario |
| ValidateAudience/ValidateIssuer | Defina como false se nao usar essas claims |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[Authorize]` sem controle customizado | `[AuthenticatedUser]` com IAsyncAuthorizationFilter |
| `if (token == null) return false;` | `throw new UnauthorizedException(message)` |
| `token.Replace("Bearer ", "")` | `authentication["Bearer ".Length..].Trim()` |
| Instanciar validador com `new` no filtro | Injetar via construtor com interface |
| `handler.ValidateToken(token, params, out var secToken)` | `handler.ValidateToken(token, params, out _)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
