# Code Examples: Corrigindo e Melhorando Testes de Unidade

## 1. Corrigindo ReturnsAsync para Returns

Quando o metodo `GenerateTokens` mudou de `Task<TokensDTO>` para `TokensDTO`:

```csharp
// ANTES — metodo era async
mock.Setup(service => service.GenerateTokens(It.IsAny<User>()))
    .ReturnsAsync(new TokensDTO
    {
        AccessToken = "fake-access-token",
        RefreshToken = "fake-refresh-token"
    });

// DEPOIS — metodo agora e sincrono
mock.Setup(service => service.GenerateTokens(It.IsAny<User>()))
    .Returns(new TokensDTO
    {
        AccessToken = "fake-access-token",
        RefreshToken = "fake-refresh-token"
    });
```

## 2. Builder para RefreshTokenWriteOnlyRepository

```csharp
public class RefreshTokenWriteOnlyRepositoryBuilder
{
    public static IRefreshTokenWriteOnlyRepository Build()
    {
        var mock = new Mock<IRefreshTokenWriteOnlyRepository>();
        // Metodos void nao precisam de setup — mock ja ignora por padrao
        return mock.Object;
    }
}
```

## 3. Atualizando instanciacao de Use Cases nos testes

### RegisterUserUseCase

```csharp
// Criando as dependencias
var refreshTokenWriteOnlyRepositoryBuilder = new RefreshTokenWriteOnlyRepositoryBuilder();

// Passando no construtor — novo parametro adicionado
var useCase = new RegisterUserUseCase(
    userRepository,
    passwordEncrypter,
    tokenService,
    refreshTokenWriteOnlyRepositoryBuilder.Build(),
    unitOfWork
);
```

### LoginUseCase

```csharp
var refreshTokenWriteOnlyRepositoryBuilder = new RefreshTokenWriteOnlyRepositoryBuilder();
var unitOfWorkBuilder = new UnitOfWorkBuilder();

var useCase = new LoginUseCase(
    userRepository,
    passwordEncrypter,
    tokenService,
    refreshTokenWriteOnlyRepositoryBuilder.Build(),
    unitOfWorkBuilder.Build()
);
```

## 4. Condicionando registro de dependencia por ambiente

### DependencyInjectionExtension (Infraestrutura)

```csharp
public static class DependencyInjectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services,
        IConfiguration configuration, IWebHostEnvironment environment)
    {
        AddRepositories(services, environment);
        // ... outros registros
    }

    private static void AddRepositories(IServiceCollection services,
        IWebHostEnvironment environment)
    {
        // Repositorios normais
        services.AddScoped<IUserReadOnlyRepository, UserRepository>();
        services.AddScoped<IUserWriteOnlyRepository, UserRepository>();

        // Registrar APENAS se NAO for ambiente de testes
        if (environment.IsEnvironment("Test") == false)
        {
            services.AddScoped<IRefreshTokenWriteOnlyRepository,
                RefreshTokenWriteOnlyRepository>();
        }
    }
}
```

### CustomWebApplicationFactory (Testes de Integracao)

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Substituir DbContext pelo InMemory
            services.AddDbContext<PlanShareDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));

            // Registrar mock para repositorio incompativel com InMemory
            var mockRefreshTokenRepository =
                new RefreshTokenWriteOnlyRepositoryBuilder();

            services.AddScoped<IRefreshTokenWriteOnlyRepository>(config =>
                mockRefreshTokenRepository.Build());
        });
    }
}
```

## 5. Adicionando assert para refresh token nos testes de integracao

```csharp
[Fact]
public async Task Success()
{
    // ... arrange e act ...

    // Assert — verificar que ambos tokens foram retornados
    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var responseBody = await response.Content
        .ReadFromJsonAsync<ResponseTokenJson>();

    responseBody.Should().NotBeNull();
    responseBody!.AccessToken.Should().NotBeNullOrWhiteSpace();
    responseBody!.RefreshToken.Should().NotBeNullOrWhiteSpace(); // NOVO
}
```

## 6. Padrao AddScoped com factory lambda

```csharp
// ERRADO — AddScoped nao aceita instancia direta
services.AddScoped<IRefreshTokenWriteOnlyRepository>(mockInstance); // Nao compila

// CORRETO — AddScoped aceita factory function
services.AddScoped<IRefreshTokenWriteOnlyRepository>(config =>
    mockRefreshTokenRepository.Build());
```