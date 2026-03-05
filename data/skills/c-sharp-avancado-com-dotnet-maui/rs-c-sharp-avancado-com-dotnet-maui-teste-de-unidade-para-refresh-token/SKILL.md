---
name: rs-csharp-teste-refresh-token
description: "Applies integration test patterns for Refresh Token flows in .NET/C# APIs. Use when user asks to 'fix broken integration tests', 'test refresh token', 'add authentication to test setup', or 'configure test database for tokens'. Ensures test infrastructure includes RefreshToken entity seeding, proper appsettings.test.json configuration, and token validation in CustomWebApplicationFactory. Make sure to use this skill whenever writing or debugging integration tests that involve authenticated endpoints with refresh token validation. Not for unit tests, frontend token handling, or OAuth provider configuration."
---

# Testes de Integracao para Refresh Token em .NET

> Ao testar endpoints autenticados com refresh token, o setup do teste deve reproduzir todo o fluxo de autenticacao incluindo a persistencia do RefreshToken no banco em memoria.

## Rules

1. **Sempre persista o RefreshToken no banco de testes** — alem da entidade User, adicione a entidade RefreshToken no `StartDatabase`, porque filtros de autorizacao validam a existencia do refresh token no banco
2. **Use ITokenService real no setup** — chame `tokenService.GenerateTokens(user)` em vez de criar tokens manualmente, porque garante que AccessTokenId e RefreshToken sejam consistentes
3. **Configure expiracoes no appsettings.test.json** — valores como `RefreshTokenExpirationDays` tem default zero (int default), o que causa expiracao imediata e falhas confusas
4. **Ordene SaveChanges por ultimo** — adicione User e RefreshToken ao DbContext antes de chamar `SaveChanges`, porque entidades precisam ser persistidas juntas
5. **Exponha tokens no UserIdentityManager** — crie metodo `GetRefreshToken()` para que testes de integracao acessem o refresh token gerado no setup
6. **Debugue a partir do filtro de autorizacao** — quando um endpoint retorna 401 inesperado, o problema esta no filtro (ex: `AuthenticatedUserFilter`) e nao no controller

## Steps

### Step 1: Atualizar CustomWebApplicationFactory.StartDatabase

Substituir `IAccessTokenGenerator` por `ITokenService` e persistir o RefreshToken:

```csharp
var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
var tokens = tokenService.GenerateTokens(user);

dbContext.RefreshTokens.Add(new RefreshToken
{
    Token = tokens.Refresh,
    AccessTokenId = tokens.AccessTokenId,
    UserId = user.Id
});

dbContext.Users.Add(user);
dbContext.SaveChanges(); // por ultimo, apos todas as entidades
```

### Step 2: Expor RefreshToken no UserIdentityManager

```csharp
public string GetRefreshToken() => _tokensDto.Refresh;
```

### Step 3: Configurar appsettings.test.json

```json
{
  "Settings": {
    "Jwt": {
      "RefreshTokenExpirationDays": 7
    }
  }
}
```

### Step 4: Implementar teste de sucesso

```csharp
var request = new RequestTokenJson
{
    RefreshToken = _user.GetRefreshToken(),
    AccessToken = _user.GetAccessToken()
};

var response = await DoPost(baseUrl, request);
response.StatusCode.Should().Be(HttpStatusCode.OK);

var body = await response.Content.ReadAsStringAsync();
// Verificar que AccessToken e RefreshToken nao sao nulos
```

### Step 5: Implementar teste de erro (token invalido)

```csharp
var request = new RequestTokenJson
{
    RefreshToken = "invalid-refresh-token",
    AccessToken = _user.GetAccessToken()
};

var response = await DoPost(baseUrl, request);
response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Teste retorna 401 inesperado | Colocar breakpoint no filtro de autorizacao, nao no controller |
| `int` de configuracao com valor zero | Verificar se appsettings.test.json tem a secao correspondente |
| Token expira durante debug | Aumentar expiracao no appsettings.test.json (debug e lento) |
| Teste precisa de refresh token | Usar `UserIdentityManager.GetRefreshToken()` |
| Multiplos idiomas na API | Testar mensagens de erro com `InlineData` para cada cultura suportada |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Criar tokens manualmente no setup | Usar `ITokenService.GenerateTokens(user)` |
| Chamar SaveChanges antes de adicionar RefreshToken | Adicionar todas as entidades, depois SaveChanges |
| Ignorar configuracao de expiracao no test | Copiar secao de expiracao para appsettings.test.json |
| Debugar 401 no controller | Debugar no filtro de autorizacao (`OnAuthorizationAsync`) |
| Omitir `GetRefreshToken` do UserIdentityManager | Expor metodo para testes acessarem o token |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
