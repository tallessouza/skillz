---
name: rs-csharp-dotnet-maui-custom-authorize-filter
description: "Enforces custom JWT authorization filter patterns in ASP.NET/C# projects. Use when user asks to 'implement authentication filter', 'create authorize attribute', 'validate JWT token', 'protect endpoints', or 'add authorization middleware'. Applies rules: explicit interface implementation for shared methods, AsNoTracking for read-only queries, SingleOrDefaultAsync over SingleAsync for nullable results, try-catch in filters since exception filters dont catch pre-controller errors. Make sure to use this skill whenever implementing custom authorization or authentication filters in .NET. Not for generating JWT tokens, login flows, or refresh token logic."
---

# Custom Authorize Filter em ASP.NET

> Filtros de autorizacao customizados exigem tratamento explicito de excecoes porque exception filters da API so capturam excecoes apos a requisicao chegar no controller.

## Rules

1. **Use AsNoTracking para consultas read-only** — `_context.Users.AsNoTracking().SingleOrDefaultAsync(...)` nao `_context.Users.SingleAsync(...)`, porque o Entity Framework prepara entidades para update por padrao, consumindo memoria desnecessariamente
2. **Use SingleOrDefaultAsync quando o resultado pode ser nulo** — nao `SingleAsync`, porque SingleAsync lanca excecao se nao encontrar, e voce precisa tratar nulo manualmente no filtro
3. **Implemente interfaces explicitamente quando metodos compartilham assinatura** — `IUserReadOnlyRepository.GetById()` e `IUserUpdateOnlyRepository.GetById()` com logicas diferentes, porque o compilador nao diferencia metodos com mesma assinatura
4. **Envolva o filtro inteiro em try-catch** — exception filters da API nao capturam excecoes em authorization filters, porque filtros executam ANTES da requisicao chegar no controller
5. **Receba a interface correta via DI** — `IUserReadOnlyRepository` para verificar existencia, nao `IUserUpdateOnlyRepository`, porque voce nao vai atualizar dados no filtro de autorizacao
6. **Retorne UnauthorizedObjectResult com mensagem generica para excecoes inesperadas** — nao exponha detalhes internos, apenas para `UnauthorizedException` customizada retorne a mensagem especifica

## How to write

### Estrutura do filtro de autorizacao

```csharp
public class AuthenticateUserFilter : IAsyncAuthorizationFilter
{
    private readonly IAccessTokenValidator _accessTokenValidator;
    private readonly IUserReadOnlyRepository _repository;

    public AuthenticateUserFilter(
        IAccessTokenValidator accessTokenValidator,
        IUserReadOnlyRepository repository)
    {
        _accessTokenValidator = accessTokenValidator;
        _repository = repository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        try
        {
            var token = TokenOnRequest(context);
            _accessTokenValidator.ValidateToken(token);
            var userIdentifier = _accessTokenValidator.GetUserIdentifier(token);

            var user = await _repository.GetById(userIdentifier);
            if (user is null)
                throw new UnauthorizedException(ResourceMessagesException.UserWithoutPermission);
        }
        catch (UnauthorizedException ex)
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(ex.GetErrorMessages()));
        }
        catch
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(ResourceMessagesException.UserWithoutPermission));
        }
    }

    private static string TokenOnRequest(AuthorizationFilterContext context)
    {
        // extrair token do header Authorization
    }
}
```

### Implementacao explicita de interface

```csharp
// No repositorio: duas implementacoes do mesmo metodo
async Task<User?> IUserReadOnlyRepository.GetById(Guid id)
{
    return await _context.Users
        .AsNoTracking()
        .SingleOrDefaultAsync(u => u.Active && u.Id == id);
}

async Task<User> IUserUpdateOnlyRepository.GetById(Guid id)
{
    return await _context.Users
        .SingleAsync(u => u.Active && u.Id == id);
}
```

## Example

**Before (erros comuns):**
```csharp
// Usando SingleAsync - lanca excecao se nao encontrar
var user = await _context.Users.SingleAsync(u => u.Id == id);

// Sem AsNoTracking - Entity Framework rastreia para update
var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);

// Recebendo interface errada no filtro
public AuthenticateUserFilter(IUserUpdateOnlyRepository repo) { }

// Sem try-catch - exception filter da API nao vai capturar
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    var token = TokenOnRequest(context);
    _validator.ValidateToken(token); // excecao nao tratada
}
```

**After (com esta skill aplicada):**
```csharp
// SingleOrDefaultAsync - retorna null se nao encontrar
var user = await _context.Users
    .AsNoTracking()
    .SingleOrDefaultAsync(u => u.Active && u.Id == id);

// Interface correta para read-only
public AuthenticateUserFilter(IUserReadOnlyRepository repo) { }

// Try-catch obrigatorio no filtro
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    try
    {
        var token = TokenOnRequest(context);
        _validator.ValidateToken(token);
        // ...
    }
    catch (UnauthorizedException ex)
    {
        context.Result = new UnauthorizedObjectResult(
            new ResponseErrorJson(ex.GetErrorMessages()));
    }
    catch
    {
        context.Result = new UnauthorizedObjectResult(
            new ResponseErrorJson(ResourceMessagesException.UserWithoutPermission));
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Consulta no filtro de autorizacao | Sempre AsNoTracking + SingleOrDefaultAsync |
| Duas interfaces precisam do mesmo metodo com logica diferente | Implementacao explicita de interface (remova `public`, prefixe com `INomeInterface.`) |
| Funcao no filtro nao usa propriedades da classe | Marque como `static` (performance) |
| Excecao em authorization filter | Try-catch obrigatorio, exception filter da API nao captura |
| Retorno pode ser nulo | `Task<User?>` com `?` no tipo de retorno |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `SingleAsync` quando resultado pode nao existir | `SingleOrDefaultAsync` |
| Consulta read-only sem `AsNoTracking()` | `.AsNoTracking().SingleOrDefaultAsync(...)` |
| `IUserUpdateOnlyRepository` no filtro de autorizacao | `IUserReadOnlyRepository` |
| Filtro de autorizacao sem try-catch | Envolva todo o codigo em try-catch |
| Expor detalhes de excecao no catch generico | Mensagem generica: "sem permissao" |
| Dois metodos `public` com mesma assinatura | Implementacao explicita: `IInterface.Method()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
