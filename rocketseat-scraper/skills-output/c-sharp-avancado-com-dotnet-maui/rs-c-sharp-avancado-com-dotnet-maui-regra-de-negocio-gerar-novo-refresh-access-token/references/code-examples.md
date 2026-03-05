# Code Examples: Refresh Token Use Case

## Exemplo completo do Use Case

```csharp
public class UseRefreshTokenUseCase
{
    private readonly IRefreshTokenReadOnlyRepository _refreshTokenReadOnlyRepository;
    private readonly IRefreshTokenWriteOnlyRepository _refreshTokenWriteOnlyRepository;
    private readonly ITokenService _tokenService;
    private readonly IAccessTokenValidator _accessTokenValidator;
    private readonly IUnitOfWork _unitOfWork;

    public UseRefreshTokenUseCase(
        IRefreshTokenReadOnlyRepository refreshTokenReadOnlyRepository,
        IRefreshTokenWriteOnlyRepository refreshTokenWriteOnlyRepository,
        ITokenService tokenService,
        IAccessTokenValidator accessTokenValidator,
        IUnitOfWork unitOfWork)
    {
        _refreshTokenReadOnlyRepository = refreshTokenReadOnlyRepository;
        _refreshTokenWriteOnlyRepository = refreshTokenWriteOnlyRepository;
        _tokenService = tokenService;
        _accessTokenValidator = accessTokenValidator;
        _unitOfWork = unitOfWork;
    }

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
}
```

## Interfaces relacionadas

### IAccessTokenValidator

```csharp
public interface IAccessTokenValidator
{
    void Validate(string token);
    Guid GetUserIdentifier(string token);
    Guid GetAccessTokenIdentifier(string token);
}
```

### JWT Token Generator — Claims relevantes

```csharp
// No JWTTokenGenerator, ao criar o Access Token:
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // NameId = User ID
    new Claim(JwtRegisteredClaimNames.Jti, accessTokenIdentifier.ToString())  // JTI = Access Token ID
};
```

### JWT Token Validator — Extraindo o Access Token ID

```csharp
public Guid GetAccessTokenIdentifier(string token)
{
    // Extrai o claim JTI do payload do JWT
    var jti = GetClaimValue(token, JwtRegisteredClaimNames.Jti);
    return Guid.Parse(jti);
}
```

## Entidade RefreshToken

```csharp
public class RefreshToken
{
    public long Id { get; set; }
    public string Token { get; set; }
    public Guid AccessTokenId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation property
    public User User { get; set; }
}
```

## Excecoes customizadas

```csharp
public class RefreshTokenNotFoundException : Exception
{
    public RefreshTokenNotFoundException()
        : base("Sessão inválida") { }
}

public class RefreshTokenExpiredException : Exception
{
    public RefreshTokenExpiredException()
        : base("Refresh token expirado") { }
}
```

## Calculo de expiracao — variacao com configuracao

```csharp
// Hardcoded (como na aula — sera melhorado na proxima)
var expireAt = refreshToken.CreatedAt.AddDays(7);

// Melhor: via configuracao
var expireAt = refreshToken.CreatedAt.AddDays(_settings.RefreshTokenExpirationInDays);
```

## Fluxo temporal ilustrado

```
T+0min:   Login → Access Token (10min) + Refresh Token (7 dias)
T+10min:  Access expirou → App usa Refresh → Novos Access + Refresh
T+20min:  Access expirou → App usa Refresh → Novos Access + Refresh
...
T+7dias sem uso: Refresh expirou → Redireciona para login
```