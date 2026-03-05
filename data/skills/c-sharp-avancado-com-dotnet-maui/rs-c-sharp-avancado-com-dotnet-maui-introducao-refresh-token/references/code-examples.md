# Code Examples: Refresh Token — Arquitetura e Implementacao

## Configuracao de expiracao do token (atual no projeto)

```json
// appsettings.development.json
{
  "Settings": {
    "JWT": {
      "SpiritInMinutes": 1000
    }
  }
}
```

> Nota: 1000 minutos (~16.5h) e apenas para desenvolvimento. Em producao, usar 5-20 minutos.

## Geracao do access token (classe existente)

```csharp
// Infrastructure/Security/Tokens/Access/Generator/JWTTokenGenerator.cs

public string Generate(UserIdentifier user)
{
    // ... claims setup ...

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        // linha 32: expiracao baseada em UTC + minutos configurados
        Expires = DateTime.UtcNow.AddMinutes(_expirationTimeInMinutes),
        // ... outras propriedades ...
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
```

## Estrutura da tabela de refresh tokens (a implementar)

```sql
CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Token VARCHAR(100) NOT NULL UNIQUE,  -- valor aleatorio, NAO JWT
    UserId UNIQUEIDENTIFIER NOT NULL,
    CreatedOn DATETIME NOT NULL DEFAULT GETUTCDATE(),
    ExpiresOn DATETIME NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

## Endpoint de refresh token (padrao a implementar)

```csharp
// Pattern do endpoint
[HttpPost("refresh-token")]
public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
{
    // 1. Recebe o refresh token
    // 2. Busca no banco de dados
    // 3. Valida existencia e validade
    // 4. Identifica o usuario associado
    // 5. Gera novo access token + novo refresh token
    // 6. Salva novo refresh token no banco (invalida o antigo)
    // 7. Retorna o novo par de tokens
}
```

## Fluxo no aplicativo (padrao a implementar)

```csharp
// Pattern do interceptor no app
public async Task<HttpResponseMessage> SendWithRefresh(HttpRequestMessage request)
{
    var response = await _httpClient.SendAsync(request);

    if (response.StatusCode == HttpStatusCode.Unauthorized)
    {
        // Token expirou — renovar automaticamente
        var refreshToken = await _secureStorage.GetAsync("refresh_token");
        var newTokens = await CallRefreshEndpoint(refreshToken);

        // Guardar novos tokens
        await _secureStorage.SetAsync("access_token", newTokens.AccessToken);
        await _secureStorage.SetAsync("refresh_token", newTokens.RefreshToken);

        // Refazer a requisicao original com novo access token
        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", newTokens.AccessToken);
        response = await _httpClient.SendAsync(request);
    }

    return response;
}
```

## Resposta do login (antes vs depois)

**Antes (sem refresh token):**
```json
{
    "name": "Wellison",
    "tokens": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

**Depois (com refresh token):**
```json
{
    "name": "Wellison",
    "tokens": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
}
```

> Note que o refresh token e um valor aleatorio simples (UUID/GUID), nao um JWT longo.

## Invalidacao de sessao (pattern)

```csharp
// Para deslogar um dispositivo remoto (estilo WhatsApp)
public async Task RevokeSession(Guid refreshTokenId)
{
    var token = await _repository.GetById(refreshTokenId);
    if (token != null)
    {
        _repository.Remove(token);
        await _unitOfWork.Commit();
    }
    // O access token associado vai expirar naturalmente em minutos
}
```