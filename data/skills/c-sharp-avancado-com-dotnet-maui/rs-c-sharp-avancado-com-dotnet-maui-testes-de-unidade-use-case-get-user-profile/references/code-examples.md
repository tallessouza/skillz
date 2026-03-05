# Code Examples: Testes de Unidade para UseCase Get User Profile

## O Use Case sendo testado

```csharp
public class GetUserProfileUseCase
{
    private readonly ILoggedUser _loggedUser;

    public GetUserProfileUseCase(ILoggedUser loggedUser)
    {
        _loggedUser = loggedUser;
    }

    public async Task<ResponseUserProfileJson> Execute()
    {
        var user = await _loggedUser.Get();

        return new ResponseUserProfileJson
        {
            Name = user.Name,
            Email = user.Email
        };
    }
}
```

## Interface ILoggedUser

```csharp
public interface ILoggedUser
{
    Task<User> Get();
}
```

## Builder completo para ILoggedUser

```csharp
// CommonTestUtilities/Services/LoggedUser/LoggedUserBuilder.cs
public class LoggedUserBuilder
{
    public static ILoggedUser Build(User user)
    {
        var mock = new Mock<ILoggedUser>();

        mock.Setup(loggedUser => loggedUser.Get())
            .ReturnsAsync(user);

        return mock.Object;
    }
}
```

## Builder completo para entidade User

```csharp
// CommonTestUtilities/Entities/UserBuilder.cs
public class UserBuilder
{
    public static User Build()
    {
        return new Faker<User>()
            .RuleFor(u => u.Name, f => f.Person.FullName)
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Password, f => f.Internet.Password())
            .Generate();
    }
}
```

Nota: campos da `EntityBase` (Id, Active, CreatedOn) sao inicializados automaticamente pela classe base, entao o Builder nao precisa configura-los.

## Entidade User e sua heranca

```csharp
// Domain/Entities/User.cs
public class User : EntityBase
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

// Domain/Entities/EntityBase.cs
public class EntityBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool Active { get; set; } = true;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
```

## Teste completo

```csharp
// Tests/UseCase/User/Profile/GetUserProfileUseCaseTest.cs
public class GetUserProfileUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        // Arrange
        var user = UserBuilder.Build();
        var useCase = CreateUseCase(user);

        // Act
        var response = await useCase.Execute();

        // Assert
        response.Should().NotBeNull();
        response.Name.Should().Be(user.Name);
        response.Email.Should().Be(user.Email);
    }

    private GetUserProfileUseCase CreateUseCase(User user)
    {
        var loggedUser = LoggedUserBuilder.Build(user);
        return new GetUserProfileUseCase(loggedUser);
    }
}
```

## Estrutura de pastas resultante

```
Tests/
├── UseCase/
│   └── User/
│       └── Profile/
│           └── GetUserProfileUseCaseTest.cs
│
CommonTestUtilities/
├── Entities/
│   └── UserBuilder.cs
├── Services/
│   └── LoggedUser/
│       └── LoggedUserBuilder.cs
```

## Grafo de dependencias do projeto

```
UseCase.Tests
├── CommonTestUtilities
└── PlanShare.Application
    └── PlanShare.Domain  ← acessivel transitivamente
```