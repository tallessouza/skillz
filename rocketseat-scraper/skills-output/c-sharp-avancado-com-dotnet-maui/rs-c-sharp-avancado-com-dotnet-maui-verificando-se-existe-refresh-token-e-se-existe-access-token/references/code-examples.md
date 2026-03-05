# Code Examples: Validacao de Access Token via Refresh Token

## 1. Implementacao do repositorio

### Interface (read-only)

```csharp
public interface IRefreshTokenReadOnlyRepository
{
    // ... metodos existentes ...
    Task<bool> HasRefreshTokenAssociated(Entities.User user, Guid accessTokenId);
}
```

**Nota:** O namespace completo `Entities.User` e necessario para evitar conflito com a pasta `User` no projeto.

### Implementacao concreta

```csharp
public class RefreshTokenRepository : IRefreshTokenReadOnlyRepository
{
    private readonly AppDbContext _context;

    public async Task<bool> HasRefreshTokenAssociated(Entities.User user, Guid accessTokenId)
    {
        return await _context.RefreshTokens
            .AnyAsync(refreshToken =>
                refreshToken.UserId == user.Id
                && refreshToken.AccessTokenId == accessTokenId);
    }
}
```

**Por que `AnyAsync`?** Porque precisamos apenas de um booleano (existe ou nao), nao da entidade inteira. Mais performatico que `FirstOrDefaultAsync` + null check.

## 2. Filtro de autorizacao completo (apos modificacao)

```csharp
public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    private readonly IAccessTokenValidator _accessTokenValidator;
    private readonly IUserReadOnlyRepository _userRepository;
    private readonly IRefreshTokenReadOnlyRepository _refreshTokenRepository;

    public AuthenticatedUserFilter(
        IAccessTokenValidator accessTokenValidator,
        IUserReadOnlyRepository userRepository,
        IRefreshTokenReadOnlyRepository refreshTokenRepository)
    {
        _accessTokenValidator = accessTokenValidator;
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = GetTokenFromHeader(context);

        _accessTokenValidator.ValidateToken(token);

        var userId = _accessTokenValidator.GetUserIdentifier(token);
        var accessTokenId = _accessTokenValidator.GetAccessTokenIdentifier(token);

        var user = await _userRepository.GetById(userId);
        if (user is null)
            throw new UnauthorizedException("Usuario nao tem permissao.");

        var existsRefreshTokenAssociated = await _refreshTokenRepository
            .HasRefreshTokenAssociated(user, accessTokenId);
        if (existsRefreshTokenAssociated.IsFalse())
            throw new UnauthorizedException("Usuario nao tem permissao para acessar esse recurso.");
    }
}
```

## 3. Fluxo de teste manual (Swagger)

### Passo 1: Login
```
POST /api/users/login
Body: { "email": "user@email.com", "password": "123456789" }
Response 200: { "accessToken": "eyJ...", "refreshToken": "..." }
```

### Passo 2: Autorizar no Swagger
```
Authorize → Bearer eyJ...  (access token)
```

### Passo 3: Chamar endpoint protegido
```
GET /api/users/profile → 200 OK (refresh token existe no banco)
```

### Passo 4: Simular revogacao (deletar refresh token do banco)
```sql
DELETE FROM refresh_tokens WHERE user_id = '...';
```

### Passo 5: Chamar endpoint protegido novamente
```
GET /api/users/profile → 401 Unauthorized
```

O access token continua valido (nao expirou), mas a ausencia do refresh token no banco causa o bloqueio.

## 4. Endpoints que NAO recebem o atributo

```csharp
// Estes endpoints NAO usam [AuthenticatedUser]:
[HttpPost("register")]  // Pessoa ainda nao tem token
public async Task<IActionResult> Register(...) { }

[HttpPost("login")]     // Pessoa esta se identificando
public async Task<IActionResult> Login(...) { }

// Estes endpoints USAM [AuthenticatedUser]:
[AuthenticatedUser]
[HttpPut("profile")]    // Precisa saber quem esta atualizando
public async Task<IActionResult> UpdateProfile(...) { }

[AuthenticatedUser]
[HttpGet("profile")]    // Precisa saber de quem e o perfil
public async Task<IActionResult> GetProfile(...) { }

[AuthenticatedUser]
[HttpPut("password")]   // Precisa saber quem esta alterando
public async Task<IActionResult> ChangePassword(...) { }
```