---
name: rs-csharp-avancado-refresh-token-validation
description: "Enforces access token invalidation via refresh token association check in .NET/C# APIs. Use when user asks to 'implement token validation', 'add security layer', 'revoke access token', 'invalidate session', or 'verify refresh token'. Applies pattern: every authenticated request checks if the access token ID exists in the database linked to a refresh token for that user. Make sure to use this skill whenever implementing token-based auth filters or session revocation in C#/.NET. Not for JWT generation, login flows, or token refresh endpoint logic."
---

# Validacao de Access Token via Refresh Token

> Toda requisicao autenticada deve verificar se o Access Token ID existe no banco de dados associado a um Refresh Token do usuario — permitindo invalidacao instantanea de sessoes.

## Rules

1. **Verifique associacao Access Token + User no banco** — alem de validar o JWT (assinatura, expiracao), confirme que o Access Token ID existe na tabela refresh_token para aquele usuario, porque isso permite revogar sessoes instantaneamente ao deletar o refresh token
2. **Retorne 401 generico quando nao encontrar** — use mensagem generica como "usuario nao tem permissao para acessar esse recurso", porque mensagens especificas revelam detalhes de implementacao a atacantes
3. **Cuidado com performance** — cada requisicao autenticada fara 2 acessos ao banco (buscar user + verificar refresh token), entao garanta indices adequados e banco organizado
4. **Nao aplique em endpoints publicos** — register, login e refresh token nao precisam dessa validacao, porque o usuario ainda nao tem ou esta obtendo o token

## How to write

### Repository — verificacao de associacao

```csharp
public async Task<bool> HasRefreshTokenAssociated(User user, Guid accessTokenId)
{
    return await _context.RefreshTokens
        .AnyAsync(rt => rt.UserId == user.Id && rt.AccessTokenId == accessTokenId);
}
```

### Filtro de autorizacao — adicionar verificacao

```csharp
// Apos validar o JWT e buscar o user no banco:
var accessTokenId = _accessTokenValidator.GetAccessTokenIdentifier(token);
var existsRefreshTokenAssociated = await _refreshTokenRepository
    .HasRefreshTokenAssociated(user, accessTokenId);

if (existsRefreshTokenAssociated.IsFalse())
    throw new UnauthorizedException("Usuario nao tem permissao para acessar esse recurso.");
```

## Example

**Before (valida apenas JWT):**
```csharp
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    var token = GetTokenFromHeader(context);
    _accessTokenValidator.ValidateToken(token);
    var userId = _accessTokenValidator.GetUserIdentifier(token);
    var user = await _userRepository.GetById(userId);
    if (user is null)
        throw new UnauthorizedException("...");
    // Fluxo continua — atacante com access token valido ainda acessa tudo
}
```

**After (valida JWT + associacao com refresh token):**
```csharp
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    var token = GetTokenFromHeader(context);
    _accessTokenValidator.ValidateToken(token);
    var userId = _accessTokenValidator.GetUserIdentifier(token);
    var accessTokenId = _accessTokenValidator.GetAccessTokenIdentifier(token);
    var user = await _userRepository.GetById(userId);
    if (user is null)
        throw new UnauthorizedException("...");

    var existsRefreshTokenAssociated = await _refreshTokenRepository
        .HasRefreshTokenAssociated(user, accessTokenId);
    if (existsRefreshTokenAssociated.IsFalse())
        throw new UnauthorizedException("Usuario nao tem permissao para acessar esse recurso.");
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Endpoint requer `[AuthenticatedUser]` | Aplicar validacao de refresh token associado |
| Endpoint publico (login, register) | Nao aplicar |
| Base de dados grande ou com muitos joins | Monitorar performance das 2 queries por request |
| Necessidade de revogar sessao instantaneamente | Deletar refresh token do banco — access token fica invalido imediatamente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Esperar access token expirar para revogar sessao | Deletar refresh token + validar associacao no filtro |
| Retornar mensagem especifica ("refresh token nao encontrado") | Retornar 401 generico |
| Validar apenas assinatura e expiracao do JWT | Validar JWT + existencia no banco |
| Ignorar impacto de 2 queries por request | Monitorar e otimizar indices |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
