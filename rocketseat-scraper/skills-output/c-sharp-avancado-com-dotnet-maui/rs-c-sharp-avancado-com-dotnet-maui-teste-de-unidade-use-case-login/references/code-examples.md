# Code Examples: Teste de Unidade para UseCase Login

## UseCase sendo testado

```csharp
public class DoLoginUseCase
{
    private readonly IUserReadOnlyRepository _repository;
    private readonly IPasswordEncrypter _passwordEncrypter;
    private readonly ITokenService _tokenService;

    public DoLoginUseCase(
        IUserReadOnlyRepository repository,
        IPasswordEncrypter passwordEncrypter,
        ITokenService tokenService)
    {
        _repository = repository;
        _passwordEncrypter = passwordEncrypter;
        _tokenService = tokenService;
    }

    public async Task<ResponseLoginJson> Execute(RequestLoginJson request)
    {
        var user = await _repository.GetUserByEmail(request.Email);

        if (user is null)
            throw new InvalidLoginException();

        var passwordMatch = _passwordEncrypter.Verify(request.Password, user.Password);

        if (passwordMatch.IsFalse()) // extension method para legibilidade
            throw new InvalidLoginException();

        var tokens = _tokenService.Generate(user);

        return new ResponseLoginJson
        {
            Id = user.Id,
            Name = user.Name,
            Tokens = tokens
        };
    }
}
```

## Builder do UserReadOnlyRepository (mock)

```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mock;

    public UserReadOnlyRepositoryBuilder()
    {
        _mock = new Mock<IUserReadOnlyRepository>();
    }

    // Metodo existente de aulas anteriores
    public UserReadOnlyRepositoryBuilder ExistActiveUserWithEmail(string email)
    {
        _mock.Setup(r => r.ExistActiveUserWithEmail(email)).ReturnsAsync(true);
        return this;
    }

    // Metodo adicionado nesta aula
    public UserReadOnlyRepositoryBuilder GetUserByEmail(User user)
    {
        _mock.Setup(r => r.GetUserByEmail(user.Email)).ReturnsAsync(user);
        return this;
    }

    public IUserReadOnlyRepository Build() => _mock.Object;
}
```

## Classe de teste completa

```csharp
public class DoLoginUseCaseTests
{
    [Fact]
    public async Task Success()
    {
        var (user, password) = UserBuilder.Build();
        var useCase = CreateUseCase(user);

        var result = await useCase.Execute(new RequestLoginJson
        {
            Email = user.Email,
            Password = password
        });

        result.Should().NotBeNull();
        result.Tokens.Should().NotBeNull();
        result.Id.Should().Be(user.Id);
        result.Name.Should().Be(user.Name);
    }

    [Fact]
    public async Task Error_Invalid_User()
    {
        // Request com dados aleatorios (Bogus)
        var request = RequestLoginJsonBuilder.Build();

        // Sem passar entidade = mock retorna null
        var useCase = CreateUseCase();

        Func<Task> act = async () => await useCase.Execute(request);

        var exception = await act.Should().ThrowAsync<InvalidLoginException>();
        exception.Where(e => e.StatusCode == HttpStatusCode.Unauthorized);
        exception.Where(e => e.Errors.Count == 1);
        exception.Where(e => e.Errors.Contains("E-mail e/ou senha invalidos"));
    }

    [Fact]
    public async Task Error_Invalid_Password()
    {
        var (user, _) = UserBuilder.Build(); // descarta senha correta

        // Request com senha aleatoria (errada) mas email correto
        var request = RequestLoginJsonBuilder.Build();
        request.Email = user.Email;

        var useCase = CreateUseCase(user);

        Func<Task> act = async () => await useCase.Execute(request);

        var exception = await act.Should().ThrowAsync<InvalidLoginException>();
        exception.Where(e => e.StatusCode == HttpStatusCode.Unauthorized);
    }

    private DoLoginUseCase CreateUseCase(User? user = null)
    {
        var passwordEncrypter = PasswordEncrypterBuilder.Build();
        var userRepository = new UserReadOnlyRepositoryBuilder();
        var tokenService = TokenServiceBuilder.Build();

        if (user is not null)
        {
            userRepository.GetUserByEmail(user);
        }

        return new DoLoginUseCase(
            userRepository.Build(),
            passwordEncrypter,
            tokenService);
    }
}
```

## RequestLoginJsonBuilder

```csharp
public class RequestLoginJsonBuilder
{
    public static RequestLoginJson Build()
    {
        return new Faker<RequestLoginJson>()
            .RuleFor(r => r.Email, f => f.Internet.Email())
            .RuleFor(r => r.Password, f => f.Internet.Password())
            .Generate();
    }
}
```

## Variacao: cenario de senha invalida com controle explicito

```csharp
[Fact]
public async Task Error_Invalid_Password_Explicit()
{
    var (user, correctPassword) = UserBuilder.Build();

    // Gera senha diferente da correta
    var wrongPassword = new Faker().Internet.Password() + "!WRONG";

    var useCase = CreateUseCase(user);

    var result = async () => await useCase.Execute(new RequestLoginJson
    {
        Email = user.Email,
        Password = wrongPassword
    });

    await result.Should().ThrowAsync<InvalidLoginException>();
}
```

## Padrao de organizacao de pastas

```
Tests/
├── UseCases/
│   ├── Register/
│   │   └── RegisterUserUseCaseTests.cs
│   └── Login/
│       └── DoLogin/
│           └── DoLoginUseCaseTests.cs
├── Validators/
│   └── ...
└── Builders/
    ├── UserBuilder.cs
    ├── RequestLoginJsonBuilder.cs
    ├── UserReadOnlyRepositoryBuilder.cs
    ├── PasswordEncrypterBuilder.cs
    └── TokenServiceBuilder.cs
```