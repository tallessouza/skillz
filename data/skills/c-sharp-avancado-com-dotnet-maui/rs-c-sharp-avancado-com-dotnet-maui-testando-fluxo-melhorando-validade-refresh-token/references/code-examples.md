# Code Examples: Configuracao Injetavel e Refresh Token

## Exemplo completo: Classe de configuracao

```csharp
// Dentro da pasta RefreshToken, ao lado do Use Case
public class TokenSettings
{
    public int RefreshTokenValidIn { get; init; }
}
```

## Exemplo completo: appsettings.Development.json

```json
{
  "Settings": {
    "ConnectionStrings": {
      "DefaultConnection": "..."
    },
    "RefreshToken": {
      "RefreshTokenValidIn": 7
    }
  }
}
```

Para producao, `appsettings.Production.json` poderia ter:

```json
{
  "Settings": {
    "RefreshToken": {
      "RefreshTokenValidIn": 30
    }
  }
}
```

## Exemplo completo: Registro no DI

```csharp
public static class DependencyInjectionExtension
{
    public static void AddTokenService(this IServiceCollection services)
    {
        // Registra o binding da secao do JSON para a classe
        services.AddOptions<TokenSettings>()
            .BindConfiguration("Settings:RefreshToken");

        // Outros registros do token service...
    }
}
```

## Exemplo completo: Use Case com injecao

```csharp
public class UseRefreshTokenUseCase
{
    private readonly TokenSettings _tokenSettings;
    // ... outros repositorios

    public UseRefreshTokenUseCase(
        IOptions<TokenSettings> tokenSettings,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _tokenSettings = tokenSettings.Value;
        // ... outras atribuicoes
    }

    public ResponseTokensJson Execute(RequestNewTokenJson request)
    {
        // Busca refresh token no banco
        var refreshToken = _repository.GetByToken(request.RefreshToken);
        if (refreshToken is null)
            throw new UnauthorizedException("Refresh token not found");

        // Extrai Access Token ID do payload
        var accessTokenId = ExtractTokenId(request.AccessToken);

        // Valida se o Access Token bate
        if (accessTokenId != refreshToken.AccessTokenId)
            throw new UnauthorizedException("Invalid access token");

        // Calcula expiracao usando valor configuravel
        var expireAt = refreshToken.CreatedAt
            .AddDays(_tokenSettings.RefreshTokenValidIn);

        if (DateTime.UtcNow > expireAt)
            throw new ForbiddenException("Refresh token expired");

        // Gera novos tokens
        var newAccessToken = GenerateAccessToken();
        var newRefreshToken = GenerateRefreshToken(newAccessToken.Id);

        // Deleta antigos, persiste novos
        _repository.Delete(refreshToken);
        _repository.Add(newRefreshToken);
        _repository.SaveChanges();

        return new ResponseTokensJson
        {
            AccessToken = newAccessToken.Value,
            RefreshToken = newRefreshToken.Value
        };
    }
}
```

## Exemplo: Documentacao do endpoint com status codes

```csharp
[HttpPost("refresh")]
[ProducesResponseType(typeof(ResponseTokensJson), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status403Forbidden)]
public IActionResult Refresh([FromBody] RequestNewTokenJson request)
{
    var response = _useCase.Execute(request);
    return Ok(response);
}
```

## Exemplo: Variantes de IOptions

```csharp
// IOptions — valor fixo, nao recarrega
public UseRefreshTokenUseCase(IOptions<TokenSettings> tokenSettings)
{
    _tokenSettings = tokenSettings.Value;
}

// IOptionsSnapshot — recarrega por request (scoped)
public UseRefreshTokenUseCase(IOptionsSnapshot<TokenSettings> tokenSettings)
{
    _tokenSettings = tokenSettings.Value; // .Value mesmo
}

// IOptionsMonitor — recarrega automatico (singleton)
public UseRefreshTokenUseCase(IOptionsMonitor<TokenSettings> tokenSettings)
{
    _tokenSettings = tokenSettings.CurrentValue; // .CurrentValue, nao .Value
}
```