# Code Examples: Inicializando Banco em Memória com Dados

## Exemplo completo: CustomWebApplicationFactory

O código final do factory após as modificações da aula:

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public UserIdentityManager User { get; private set; } = default!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Configuração do DbContext em memória (feita em aulas anteriores)
            // Remove o DbContext real e adiciona o in-memory
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<PlanShareDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<PlanShareDbContext>(options =>
                options.UseInMemoryDatabase("InMemoryDbForTesting"));

            // Criar escopo para acessar serviços configurados
            using var scope = services.BuildServiceProvider().CreateScope();

            // Resolver DbContext do DI
            var dbContext = scope.ServiceProvider
                .GetRequiredService<PlanShareDbContext>();

            // Resolver gerador de token do DI
            var accessTokenGenerator = scope.ServiceProvider
                .GetRequiredService<IAccessTokenGenerator>();

            // Garantir banco limpo
            dbContext.Database.EnsureDeleted();

            // Popular banco com dados iniciais
            StartDatabase(dbContext, accessTokenGenerator);
        });
    }

    private void StartDatabase(
        PlanShareDbContext dbContext,
        IAccessTokenGenerator accessTokenGenerator)
    {
        // UserBuilder gera entidade com dados aleatórios (Bogus)
        // A senha retornada é plaintext; dentro da entidade está criptografada
        var (user, password) = UserBuilder.Build();

        // Add síncrono — não usar AddAsync no factory
        dbContext.Users.Add(user);
        // SaveChanges síncrono — não usar SaveChangesAsync no factory
        dbContext.SaveChanges();

        // Gerar token real usando a mesma implementação de produção
        // .Token descarta o AccessTokenIdentifier (usado para RefreshToken)
        var tokensDto = new TokensDto
        {
            AccessToken = accessTokenGenerator.Generate(user).Token,
            RefreshToken = string.Empty  // será implementado depois
        };

        // Armazenar tudo no manager encapsulado
        User = new UserIdentityManager(user, password, tokensDto);
    }
}
```

## Exemplo completo: UserIdentityManager

Classe criada na pasta `Resources` do projeto de testes:

```csharp
// WebAPI.Tests/Resources/UserIdentityManager.cs
using PlanShare.Domain.Entities;
using PlanShare.Communication.Responses;

public class UserIdentityManager
{
    private readonly PlanShare.Domain.Entities.User _user;
    private readonly string _password;
    private readonly TokensDto _tokens;

    // Construtor obriga passar os três parâmetros
    public UserIdentityManager(
        PlanShare.Domain.Entities.User user,
        string password,
        TokensDto tokens)
    {
        _user = user;
        _password = password;
        _tokens = tokens;
    }

    // Apenas métodos públicos — nunca expor entidade ou DTO diretamente
    public string GetPassword() => _password;
    public string GetEmail() => _user.Email;
    public string GetAccessToken() => _tokens.AccessToken;
}
```

**Nota sobre namespace:** O instrutor menciona que `User` conflita com o nome da pasta, então é necessário usar o caminho completo `PlanShare.Domain.Entities.User`.

## Padrão de resolução de serviços via escopo

```csharp
// Criar escopo a partir do service provider
using var scope = services.BuildServiceProvider().CreateScope();

// Resolver qualquer serviço registrado no DI
var dbContext = scope.ServiceProvider
    .GetRequiredService<PlanShareDbContext>();

var accessTokenGenerator = scope.ServiceProvider
    .GetRequiredService<IAccessTokenGenerator>();
```

Este padrão permite acessar qualquer serviço configurado no DI container durante a fase de setup do factory. O `using` garante que o escopo é descartado após o uso.

## Referência: Como o token é gerado em produção

O instrutor navegou até a implementação do `TokenService.GenerateTokens` para entender o processo:

```csharp
// TokenService (implementação de produção — referência)
public async Task<TokensDto> GenerateTokens(User user)
{
    var tokenIdentifier = Guid.NewGuid(); // ID do access token (para refresh)
    var accessToken = _accessTokenGenerator.Generate(user);
    // ... refresh token logic (async) ...
    return new TokensDto { AccessToken = accessToken.Token, RefreshToken = ... };
}
```

No factory, simplificamos usando apenas `IAccessTokenGenerator.Generate(user).Token` diretamente, sem a parte async do refresh token.