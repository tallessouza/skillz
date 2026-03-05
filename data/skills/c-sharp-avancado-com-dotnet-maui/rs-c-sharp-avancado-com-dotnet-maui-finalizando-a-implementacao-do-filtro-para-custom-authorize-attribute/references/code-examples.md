# Code Examples: Custom Authorize Filter em ASP.NET

## 1. Filtro completo de autorizacao

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
                throw new UnauthorizedException(
                    ResourceMessagesException.UserWithoutPermission);
        }
        catch (UnauthorizedException ex)
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(ex.GetErrorMessages()));
        }
        catch
        {
            context.Result = new UnauthorizedObjectResult(
                new ResponseErrorJson(
                    ResourceMessagesException.UserWithoutPermission));
        }
    }

    private static string TokenOnRequest(AuthorizationFilterContext context)
    {
        var authentication = context.HttpContext.Request.Headers.Authorization.ToString();

        if (string.IsNullOrWhiteSpace(authentication))
            throw new UnauthorizedException(
                ResourceMessagesException.NoToken);

        return authentication["Bearer ".Length..].Trim();
    }
}
```

## 2. Classe de validacao de token (AccessTokenValidator)

```csharp
public class JwtTokenValidator : IAccessTokenValidator
{
    public void ValidateToken(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            // parametros de validacao (issuer, audience, signing key, etc.)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        tokenHandler.ValidateToken(token, validationParameters, out _);
        // Se invalido, lanca excecao automaticamente
    }

    public Guid GetUserIdentifier(string token)
    {
        return Guid.Parse(GetClaimValue(token, JwtRegisteredClaimNames.NameId));
    }

    private static string GetClaimValue(string token, string claimType)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtSecurityToken = tokenHandler.ReadJwtToken(token);

        return jwtSecurityToken.Claims
            .First(claim => claim.Type == claimType)
            .Value;
    }
}
```

## 3. Implementacao explicita de interface no repositorio

```csharp
public class UserRepository : IUserReadOnlyRepository, IUserUpdateOnlyRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // Chamada via IUserReadOnlyRepository — com AsNoTracking, retorno nullable
    async Task<User?> IUserReadOnlyRepository.GetById(Guid id)
    {
        return await _context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Active && u.Id == id);
    }

    // Chamada via IUserUpdateOnlyRepository — sem AsNoTracking, retorno non-nullable
    async Task<User> IUserUpdateOnlyRepository.GetById(Guid id)
    {
        return await _context.Users
            .SingleAsync(u => u.Active && u.Id == id);
    }

    // outros metodos...
}
```

## 4. Interfaces separadas

```csharp
public interface IUserReadOnlyRepository
{
    Task<bool> ExistActiveUserWithEmail(string email);
    Task<User?> GetByEmail(string email);
    Task<User?> GetById(Guid id);  // nullable, com AsNoTracking
}

public interface IUserUpdateOnlyRepository
{
    Task<User> GetById(Guid id);   // non-nullable, sem AsNoTracking
    void Update(User user);
}
```

## 5. Geracao do token — referencia de claims

```csharp
// Na classe que gera o JWT
var claims = new List<Claim>
{
    new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
    // outras claims...
};
```

A chave `NameId` usada na geracao e a mesma usada na leitura via `GetUserIdentifier`. Consistencia e fundamental.

## 6. Response de erro padronizado

```csharp
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    public ResponseErrorJson(string errorMessage)
    {
        Errors = new List<string> { errorMessage };
    }

    public ResponseErrorJson(List<string> errorMessages)
    {
        Errors = errorMessages;
    }
}
```