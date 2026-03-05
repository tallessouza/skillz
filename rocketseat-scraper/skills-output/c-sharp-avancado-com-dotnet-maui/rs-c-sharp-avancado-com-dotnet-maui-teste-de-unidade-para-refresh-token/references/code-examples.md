# Code Examples: Testes de Integracao para Refresh Token

## CustomWebApplicationFactory — Antes (quebrado)

```csharp
private void StartDatabase(PlanShareDbContext dbContext)
{
    var accessTokenGenerator = _scope.ServiceProvider
        .GetRequiredService<IAccessTokenGenerator>();

    var accessToken = accessTokenGenerator.Generate(user);

    dbContext.Users.Add(user);
    dbContext.SaveChanges();

    User = new UserIdentityManager(user, password, accessToken);
}
```

Problema: nenhum RefreshToken e persistido. O filtro de autorizacao vai retornar 401.

## CustomWebApplicationFactory — Depois (corrigido)

```csharp
private void StartDatabase(
    PlanShareDbContext dbContext,
    ITokenService tokenService)
{
    var user = BuildUser();
    var password = "senhaSegura123";

    var tokensDto = tokenService.GenerateTokens(user);

    dbContext.Users.Add(user);
    dbContext.RefreshTokens.Add(new RefreshToken
    {
        Token = tokensDto.Refresh,
        AccessTokenId = tokensDto.AccessTokenId,
        UserId = user.Id
    });
    dbContext.SaveChanges();

    User = new UserIdentityManager(user, password, tokensDto);
}
```

Mudancas chave:
1. `IAccessTokenGenerator` → `ITokenService` (gera todos os tokens de uma vez)
2. Adicionado `RefreshToken` ao DbContext
3. `SaveChanges` movido para o final (apos todas as entidades)
4. `TokensDto` completo passado ao `UserIdentityManager`

## UserIdentityManager — Adicionando GetRefreshToken

```csharp
public class UserIdentityManager
{
    private readonly User _user;
    private readonly string _password;
    private readonly TokensDto _tokensDto;

    public UserIdentityManager(User user, string password, TokensDto tokensDto)
    {
        _user = user;
        _password = password;
        _tokensDto = tokensDto;
    }

    public string GetAccessToken() => _tokensDto.AccessToken;
    public string GetRefreshToken() => _tokensDto.Refresh;
    // ... outras propriedades
}
```

## appsettings.test.json — Configuracao de expiracao

```json
{
  "Settings": {
    "Jwt": {
      "SigningKey": "test-signing-key-que-precisa-ter-tamanho-minimo",
      "ExpirationTimeMinutes": 10,
      "RefreshTokenExpirationDays": 7
    }
  }
}
```

Sem `RefreshTokenExpirationDays`, o valor sera `0` (default de int em C#), causando expiracao imediata.

## Teste de Sucesso — RefreshTokenTest

```csharp
[Fact]
public async Task Success()
{
    var request = new RequestTokenJson
    {
        RefreshToken = _user.GetRefreshToken(),
        AccessToken = _user.GetAccessToken()
    };

    var response = await DoPost($"{BASE_URL}", request);

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var body = await response.Content
        .ReadFromJsonAsync<TokensResponseJson>();

    body.AccessToken.Should().NotBeNullOrWhiteSpace();
    body.RefreshToken.Should().NotBeNullOrWhiteSpace();
}
```

## Teste de Erro — Token Invalido

```csharp
[Theory]
[InlineData("en")]
[InlineData("pt-BR")]
public async Task Error_InvalidRefreshToken(string culture)
{
    var request = new RequestTokenJson
    {
        RefreshToken = "invalid-refresh-token",
        AccessToken = _user.GetAccessToken()
    };

    var response = await DoPost(
        $"{BASE_URL}",
        request,
        culture: culture);

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

    var body = await response.Content
        .ReadFromJsonAsync<ErrorResponseJson>();

    body.Errors.Should().ContainSingle()
        .And.Contain(e => e == ResourceErrorMessages.EXPIRED_SESSION);
}
```

Nota: usa `Theory` + `InlineData` para testar em cada idioma suportado pela API.

## Fluxo do AuthenticatedUserFilter (onde o bug acontecia)

```csharp
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    var token = GetTokenFromHeader(context.HttpContext.Request);
    ValidateToken(token); // lanca excecao se invalido

    var userId = GetUserIdFromToken(token);
    var user = await _userRepository.GetById(userId);

    if (user is null)
        throw new UnauthorizedException();

    var accessTokenId = GetAccessTokenId(token);

    // ESTA LINHA causava o 401 nos testes:
    var hasRefreshToken = await _refreshTokenRepository
        .Exists(userId, accessTokenId);

    if (!hasRefreshToken)
        throw new UnauthorizedException(); // <-- aqui quebrava
}
```

O filtro executa ANTES do controller. Se o RefreshToken nao existe no banco, o request nunca chega ao endpoint.