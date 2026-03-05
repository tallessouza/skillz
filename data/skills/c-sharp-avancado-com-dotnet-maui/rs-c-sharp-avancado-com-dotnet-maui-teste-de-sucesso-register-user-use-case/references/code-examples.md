# Code Examples: Testes de Sucesso para UseCase

## UnitOfWorkBuilder (metodo estatico, sem configuracao)

```csharp
public class UnitOfWorkBuilder
{
    public static IUnitOfWork Build()
    {
        var mock = new Mock<IUnitOfWork>();
        return mock.Object;
    }
}
```

Nao precisa de setup — `Commit()` e chamado mas nao precisa retornar nada especifico.

## UserWriteOnlyRepositoryBuilder (metodo estatico)

```csharp
public class UserWriteOnlyRepositoryBuilder
{
    public static IUserWriteOnlyRepository Build()
    {
        var mock = new Mock<IUserWriteOnlyRepository>();
        return mock.Object;
    }
}
```

## UserReadOnlyRepositoryBuilder (instancia, configuracao variavel)

```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mock;

    public UserReadOnlyRepositoryBuilder()
    {
        _mock = new Mock<IUserReadOnlyRepository>();
    }

    public UserReadOnlyRepositoryBuilder ExistsByEmail(string email)
    {
        _mock.Setup(r => r.ExistsByEmail(email))
            .ReturnsAsync(true);
        return this;
    }

    public IUserReadOnlyRepository Build() => _mock.Object;
}
```

Uso para cenario de sucesso (email NAO existe):
```csharp
var readOnlyRepository = new UserReadOnlyRepositoryBuilder();
// Nao chama ExistsByEmail() — default bool = false
var repo = readOnlyRepository.Build();
```

Uso para cenario de erro (email JA existe):
```csharp
var readOnlyRepository = new UserReadOnlyRepositoryBuilder()
    .ExistsByEmail("existing@email.com");
var repo = readOnlyRepository.Build();
```

## PasswordEncrypterBuilder (instancia com setup fixo no construtor)

```csharp
public class PasswordEncrypterBuilder
{
    private readonly IPasswordEncrypter _passwordEncrypter;

    public PasswordEncrypterBuilder()
    {
        var mock = new Mock<IPasswordEncrypter>();
        mock.Setup(e => e.Encrypt(It.IsAny<string>()))
            .Returns("PasswordEncrypted");
        _passwordEncrypter = mock.Object;
    }

    public IPasswordEncrypter Build() => _passwordEncrypter;
}
```

Pontos chave:
- `It.IsAny<string>()` — nao importa qual senha chega
- `.Returns()` (nao `ReturnsAsync`) — `Encrypt` retorna `string`, nao `Task<string>`
- Setup no construtor — comportamento e sempre o mesmo

## TokenServiceBuilder (metodo estatico com setup assincrono)

```csharp
public class TokenServiceBuilder
{
    public static ITokenService Build()
    {
        var mock = new Mock<ITokenService>();
        mock.Setup(ts => ts.GenerateTokens(It.IsAny<User>()))
            .ReturnsAsync(new TokensDTO
            {
                AccessToken = "MockAccessToken",
                RefreshToken = "MockRefreshToken"
            });
        return mock.Object;
    }
}
```

Pontos chave:
- `It.IsAny<User>()` — nao importa qual user chega
- `.ReturnsAsync()` — `GenerateTokens` retorna `Task<TokensDTO>`
- Valores fake nos tokens — e mock, nao precisa ser realista

## RequestRegisterUserBuilder (usando Bogus)

```csharp
public class RequestRegisterUserBuilder
{
    public static RequestRegisterUserJson Build()
    {
        return new Faker<RequestRegisterUserJson>()
            .RuleFor(r => r.Name, f => f.Person.FullName)
            .RuleFor(r => r.Email, f => f.Internet.Email())
            .RuleFor(r => r.Password, f => f.Internet.Password())
            .Generate();
    }
}
```

## Teste completo de sucesso

```csharp
public class RegisterUserUseCaseTests
{
    [Fact]
    public async Task Success()
    {
        var request = RequestRegisterUserBuilder.Build();
        var useCase = CreateUseCase();

        var result = await useCase.Execute(request);

        result.ShouldNotBeNull();
        result.Name.Should().Be(request.Name);
    }

    private RegisterUserUseCase CreateUseCase()
    {
        var unitOfWork = UnitOfWorkBuilder.Build();
        var userWriteOnlyRepository = UserWriteOnlyRepositoryBuilder.Build();
        var readOnlyRepository = new UserReadOnlyRepositoryBuilder();
        var passwordEncrypter = new PasswordEncrypterBuilder().Build();
        var tokenService = TokenServiceBuilder.Build();

        return new RegisterUserUseCase(
            unitOfWork,
            userWriteOnlyRepository,
            readOnlyRepository.Build(),
            passwordEncrypter,
            tokenService
        );
    }
}
```

## Instalacao do Shouldly

Via NuGet Package Manager:
1. Botao direito no projeto de testes → Manage NuGet Packages
2. Browse → buscar "Shouldly"
3. Instalar

Ou via CLI:
```bash
dotnet add package Shouldly
```

## Assertions com Shouldly vs Assert tradicional

```csharp
// Tradicional (menos legivel)
Assert.NotNull(result);
Assert.Equal(request.Name, result.Name);

// Com Shouldly (mais fluente)
result.ShouldNotBeNull();
result.Name.Should().Be(request.Name);
```