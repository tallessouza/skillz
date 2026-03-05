# Code Examples: Refresh Token na API .NET

## 1. TokensDTO com AccessTokenId

```csharp
public record TokensDTO
{
    public string AccessToken { get; init; }
    public string Refresh { get; init; }
    public Guid AccessTokenId { get; init; }
}
```

O `init` impede que outras classes alterem o valor apos a criacao. O `AccessTokenId` foi adicionado para que o UseCase consiga associar o refresh token ao access token correspondente.

## 2. TokenService completo (sem repositorio)

```csharp
public class TokenService : ITokenService
{
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

    private (string Token, Guid AccessTokenId) GenerateAccessToken(Guid userId)
    {
        var accessTokenIdentifier = Guid.CreateVersion7();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("AccessTokenId", accessTokenIdentifier.ToString())
        };

        // ... gera JWT com claims ...

        return (tokenString, accessTokenIdentifier);
    }

    private string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
```

## 3. Interface corrigida (sem Task)

```csharp
// ANTES (errado - tinha async sem necessidade)
public interface ITokenService
{
    Task<TokensDTO> GenerateTokens(Guid userId);
}

// DEPOIS (correto - sincrono)
public interface ITokenService
{
    TokensDTO GenerateTokens(Guid userId);
}
```

## 4. Login UseCase completo

```csharp
public class LoginUseCase
{
    private readonly IUserReadOnlyRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenWriteOnlyRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public LoginUseCase(
        IUserReadOnlyRepository userRepository,
        ITokenService tokenService,
        IRefreshTokenWriteOnlyRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseHashAUserJson> Execute(RequestLoginJson request)
    {
        var user = await _userRepository.GetByEmail(request.Email);
        // ... validacao de senha ...

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
    }
}
```

## 5. Register UseCase — cuidado com commit unico

```csharp
public async Task<ResponseHashAUserJson> Execute(RequestRegisterUserJson request)
{
    // 1. Validacao
    Validate(request);

    // 2. Mapeia request para entidade
    var user = _mapper.Map<User>(request);
    user.Password = _passwordEncrypter.Encrypt(request.Password);

    // 3. Gera tokens
    var tokens = _tokenService.GenerateTokens(user.Id);

    // 4. Adiciona usuario no repositorio
    await _userRepository.Add(user);

    // 5. Adiciona refresh token no repositorio
    await _refreshTokenRepository.Add(new Domain.Entities.RefreshToken
    {
        UserId = user.Id,
        Token = tokens.Refresh,
        AccessTokenId = tokens.AccessTokenId
    });

    // 6. UNICO commit - persiste usuario E refresh token juntos
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
}
```

## 6. Bug do parameter shadowing — antes e depois

```csharp
// ANTES: bug silencioso - deleta TODOS os refresh tokens
public async Task Add(RefreshToken refreshToken)
{
    var existingTokens = await _context.RefreshTokens
        .Where(refreshToken => refreshToken.UserId == refreshToken.UserId)
        .ToListAsync();
    // refreshToken da lambda == refreshToken da lambda (WHERE 1=1)

    _context.RefreshTokens.RemoveRange(existingTokens);
    await _context.RefreshTokens.AddAsync(refreshToken);
}

// DEPOIS: correto - deleta apenas os tokens da pessoa
public async Task Add(RefreshToken refreshToken)
{
    var existingTokens = await _context.RefreshTokens
        .Where(token => token.UserId == refreshToken.UserId)
        .ToListAsync();
    // token = registro no banco, refreshToken = parametro do metodo

    _context.RefreshTokens.RemoveRange(existingTokens);
    await _context.RefreshTokens.AddAsync(refreshToken);
}
```

## 7. Sintaxe new() vs new Type() — comparacao

```csharp
// Forma 1: Target-typed new (versoes recentes do .NET)
return new()
{
    Id = user.Id,
    Name = user.Name,
    Tokens = new()
    {
        AccessToken = tokens.AccessToken,
        RefreshToken = tokens.Refresh
    }
};

// Forma 2: Explicita (preferida pelo instrutor para tipos aninhados)
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