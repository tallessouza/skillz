---
name: rs-csharp-maui-refresh-token-usecase
description: "Applies refresh token validation and renewal patterns when implementing authentication flows in C#/.NET. Use when user asks to 'implement refresh token', 'renew access token', 'validate refresh token', 'token rotation', or 'authentication use case'. Enforces: database lookup, access token ID cross-validation, expiration check, new token generation and persistence. Make sure to use this skill whenever building token refresh logic in .NET projects. Not for JWT generation, login flows, or frontend token storage."
---

# Regra de Negocio: Refresh Token Use Case

> Ao implementar refresh token, valide existencia, correspondencia de Access Token ID, e expiracao ANTES de gerar novos tokens.

## Rules

1. **Busque o Refresh Token no banco antes de qualquer operacao** — `repository.Get(request.RefreshToken)`, porque sem a entidade nao ha como validar nada
2. **Valide em 3 camadas sequenciais** — existencia → Access Token ID match → expiracao, porque cada camada rejeita cenarios distintos com excecoes especificas
3. **Cross-valide o Access Token ID** — compare o ID armazenado no payload do JWT (claim JTI) com o ID salvo junto ao Refresh Token no banco, porque isso garante que o par access+refresh e legitimo
4. **Nunca exponha detalhes nas excecoes de seguranca** — lance "sessao invalida" tanto para token nao encontrado quanto para ID mismatch, porque detalhes ajudam atacantes
5. **Persista o novo Refresh Token antes de retornar** — `repository.Add()` + `unitOfWork.Commit()`, porque sem persistencia o proximo refresh falhara
6. **Nunca deixe numeros magicos para expiracao** — extraia valores como 7 dias e 10 minutos para configuracao, porque valores fixos no codigo sao impossiveis de ajustar por ambiente

## How to write

### Use Case Execute (caminho feliz + validacoes)

```csharp
public ResponseTokenJson Execute(RequestUseRefreshTokenJson request)
{
    // 1. Buscar entidade no banco
    var refreshToken = _refreshTokenReadOnlyRepository.Get(request.RefreshToken);

    // 2. Validacao: existe?
    if (refreshToken is null)
        throw new RefreshTokenNotFoundException();

    // 3. Validacao: Access Token ID confere?
    var accessTokenId = _accessTokenValidator
        .GetAccessTokenIdentifier(request.AccessToken);

    if (refreshToken.AccessTokenId != accessTokenId)
        throw new RefreshTokenNotFoundException(); // mesma excecao, sem detalhes

    // 4. Validacao: expirou?
    var expireAt = refreshToken.CreatedAt.AddDays(7);
    if (DateTime.UtcNow > expireAt)
        throw new RefreshTokenExpiredException();

    // 5. Gerar novos tokens (usa navigation property User)
    var tokens = _tokenService.GenerateTokens(refreshToken.User);

    // 6. Persistir novo refresh token
    _refreshTokenWriteOnlyRepository.Add(new RefreshToken
    {
        UserId = refreshToken.UserId,
        Token = tokens.Refresh,
        AccessTokenId = tokens.AccessTokenId
    });

    _unitOfWork.Commit();

    // 7. Retornar novos tokens
    return new ResponseTokenJson
    {
        RefreshToken = tokens.Refresh,
        AccessToken = tokens.Access
    };
}
```

## Example

**Before (sem validacoes, inseguro):**
```csharp
public ResponseTokenJson Execute(RequestUseRefreshTokenJson request)
{
    var refreshToken = _repository.Get(request.RefreshToken);
    var tokens = _tokenService.GenerateTokens(refreshToken.User);
    return new ResponseTokenJson
    {
        RefreshToken = tokens.Refresh,
        AccessToken = tokens.Access
    };
}
```

**After (com todas as validacoes):**
```csharp
public ResponseTokenJson Execute(RequestUseRefreshTokenJson request)
{
    var refreshToken = _refreshTokenReadOnlyRepository.Get(request.RefreshToken);

    if (refreshToken is null)
        throw new RefreshTokenNotFoundException();

    var accessTokenId = _accessTokenValidator
        .GetAccessTokenIdentifier(request.AccessToken);
    if (refreshToken.AccessTokenId != accessTokenId)
        throw new RefreshTokenNotFoundException();

    var expireAt = refreshToken.CreatedAt.AddDays(7);
    if (DateTime.UtcNow > expireAt)
        throw new RefreshTokenExpiredException();

    var tokens = _tokenService.GenerateTokens(refreshToken.User);

    _refreshTokenWriteOnlyRepository.Add(new RefreshToken
    {
        UserId = refreshToken.UserId,
        Token = tokens.Refresh,
        AccessTokenId = tokens.AccessTokenId
    });
    _unitOfWork.Commit();

    return new ResponseTokenJson
    {
        RefreshToken = tokens.Refresh,
        AccessToken = tokens.Access
    };
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Refresh token nao encontrado no banco | Lance excecao generica "sessao invalida" |
| Access Token ID nao bate com o do banco | Mesma excecao generica (nao revele o motivo real) |
| Refresh token expirado | Lance excecao especifica para redirecionar ao login |
| Usuario usa app regularmente | Refresh token renova a cada ciclo, nunca expira na pratica |
| Usuario fica 7+ dias sem usar | Refresh token expira, forca novo login |
| Precisa da entidade User | Use navigation property do RefreshToken (`refreshToken.User`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Gerar tokens sem validar existencia do refresh token | Valide existencia primeiro |
| Retornar mensagem "Access Token ID invalido" | Use mensagem generica "sessao invalida" |
| Deixar `AddDays(7)` hardcoded | Extraia para configuracao |
| Esquecer `unitOfWork.Commit()` apos Add | Sempre persista antes de retornar |
| Criar entidade RefreshToken com navigation property User | Use `UserId` (FK) ao criar novas entidades |
| Validar expiracao antes de validar existencia | Siga a ordem: existencia → ID match → expiracao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
