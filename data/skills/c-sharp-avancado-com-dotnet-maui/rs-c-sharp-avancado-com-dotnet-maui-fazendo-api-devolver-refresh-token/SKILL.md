---
name: rs-csharp-dotnet-maui-refresh-token-api
description: "Enforces correct refresh token generation and return patterns in .NET/C# APIs. Use when user asks to 'implement refresh token', 'return tokens from API', 'generate access and refresh tokens', 'add token to login endpoint', or 'implement authentication flow in .NET'. Applies rules: token generation class must NOT access repositories, use cases orchestrate persistence, avoid LINQ parameter shadowing, return tokens via DTO. Make sure to use this skill whenever implementing token-based auth in C#/.NET projects. Not for frontend token storage, JWT validation middleware, or token rotation scheduling."
---

# Refresh Token na API .NET

> O UseCase orquestra a persistencia — classes de geracao de token NUNCA acessam repositorios.

## Rules

1. **TokenService so gera tokens** — nunca injete repositorio ou UnitOfWork no TokenService, porque misturar geracao com persistencia causa commits parciais e bugs silenciosos
2. **UseCase orquestra persistencia** — o UseCase decide quando chamar repository.Add e unitOfWork.Commit, porque ele tem visao completa do fluxo e controla a transacao
3. **Um unico Commit por operacao** — nunca tenha dois commits separados no mesmo fluxo, porque se o segundo falhar o primeiro ja persistiu dados inconsistentes
4. **DTO carrega todos os dados necessarios** — o TokensDTO deve incluir AccessTokenId, AccessToken e RefreshToken, porque o UseCase precisa do AccessTokenId para criar a entidade RefreshToken
5. **Evite parameter shadowing em LINQ** — nunca use o mesmo nome do parametro do metodo na expressao lambda do Where, porque o LINQ resolve ambos para o parametro e gera WHERE 1=1
6. **Prefira sintaxe explicita com new** — use `new ResponseTokensJson()` em vez de `new()` quando o tipo nao e obvio no contexto, porque em code review sem IDE a legibilidade cai

## How to write

### TokenService (somente geracao)

```csharp
// TokenService NAO recebe repositorio nem UnitOfWork
public TokensDTO GenerateTokens(Guid userId)
{
    var (accessToken, accessTokenId) = GenerateAccessToken(userId);
    var refreshToken = GenerateRefreshToken();

    return new TokensDTO
    {
        AccessToken = accessToken,
        AccessTokenId = accessTokenId,
        Refresh = refreshToken
    };
}
```

### UseCase orquestrando persistencia

```csharp
var tokens = _tokenService.GenerateTokens(user.Id);

await _refreshTokenRepository.Add(new Domain.Entities.RefreshToken
{
    UserId = user.Id,
    Token = tokens.Refresh,
    AccessTokenId = tokens.AccessTokenId
});

await _unitOfWork.Commit();

return new ResponseHashAUserJson
{
    Id = user.Id,
    Name = user.Name,
    Tokens = new ResponseTokensJson
    {
        AccessToken = tokens.AccessToken,
        RefreshToken = tokens.Refresh
    }
};
```

### LINQ sem parameter shadowing

```csharp
// ERRADO: parametro e lambda com mesmo nome
public async Task Add(RefreshToken refreshToken)
{
    // refreshToken.UserId == refreshToken.UserId → WHERE 1=1!
    var existing = await _context.RefreshTokens
        .Where(refreshToken => refreshToken.UserId == refreshToken.UserId)
        .ToListAsync();
}

// CORRETO: nomes diferentes
public async Task Add(RefreshToken refreshToken)
{
    var existing = await _context.RefreshTokens
        .Where(token => token.UserId == refreshToken.UserId)
        .ToListAsync();
}
```

## Example

**Before (TokenService com responsabilidade demais):**

```csharp
public class TokenService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRefreshTokenRepository _repository;

    public async Task<TokensDTO> GenerateTokens(Guid userId)
    {
        var tokens = GenerateAll(userId);
        var entity = new RefreshToken { UserId = userId, Token = tokens.Refresh };
        await _repository.Add(entity);
        await _unitOfWork.Commit(); // ERRADO: commit escondido
        return tokens;
    }
}
```

**After (responsabilidades separadas):**

```csharp
// TokenService: so gera
public class TokenService
{
    public TokensDTO GenerateTokens(Guid userId)
    {
        var (accessToken, accessTokenId) = GenerateAccessToken(userId);
        var refreshToken = GenerateRefreshToken();
        return new TokensDTO { AccessToken = accessToken, AccessTokenId = accessTokenId, Refresh = refreshToken };
    }
}

// UseCase: orquestra
var tokens = _tokenService.GenerateTokens(user.Id);
await _refreshTokenRepository.Add(new RefreshToken { UserId = user.Id, Token = tokens.Refresh, AccessTokenId = tokens.AccessTokenId });
await _unitOfWork.Commit(); // Commit unico e visivel
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Classe utilitaria quer acessar repositorio | Mova a persistencia para o UseCase |
| Dois commits no mesmo fluxo | Unifique em um unico commit no final |
| Lambda LINQ com mesmo nome do parametro | Renomeie a variavel da lambda (token, t, entry) |
| `new()` sem tipo explicito | Use quando o tipo e obvio pelo contexto; prefira explicito em code review |
| Mesmo resposta em Login e Register | Reutilize o mesmo Response JSON, preencha nos dois UseCase |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `TokenService` com `IUnitOfWork` | `TokenService` retorna DTO puro, sem side effects |
| `await _unitOfWork.Commit()` dentro de service auxiliar | `await _unitOfWork.Commit()` no UseCase |
| `.Where(refreshToken => refreshToken.UserId == refreshToken.UserId)` | `.Where(token => token.UserId == refreshToken.UserId)` |
| Dois `Commit()` separados no mesmo UseCase | Um unico `Commit()` ao final do fluxo |
| `async Task<TokensDTO>` quando nao ha await | `TokensDTO` sincrono (remova async/Task) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
