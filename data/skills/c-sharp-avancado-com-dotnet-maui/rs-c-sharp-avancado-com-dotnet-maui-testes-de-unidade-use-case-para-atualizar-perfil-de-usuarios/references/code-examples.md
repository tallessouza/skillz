# Code Examples: Testes de Unidade para UseCase Update User Profile

## UserUpdateOnlyRepositoryBuilder completo

```csharp
using Moq;
using PlanShare.Domain.Entities;
using PlanShare.Domain.Repositories;

namespace CommonTestUtilities.Repositories;

public class UserUpdateOnlyRepositoryBuilder
{
    public static IUserUpdateOnlyRepository Build(User user)
    {
        var mock = new Mock<IUserUpdateOnlyRepository>();

        // GetById retorna a entidade recebida — void Update nao precisa de setup
        mock.Setup(r => r.GetById(user.Id)).ReturnsAsync(user);

        return mock.Object;
    }
}
```

## UpdateUserUseCaseTests completo

```csharp
using CommonTestUtilities.Repositories;
using CommonTestUtilities.Services.LoggedUser;
using PlanShare.Application.UseCases.User.Update;
using PlanShare.Domain.Extensions;

namespace UseCases.Tests.User.Update;

public class UpdateUserUseCaseTests
{
    public UpdateUserUseCase CreateUseCase(
        PlanShare.Domain.Entities.User user,
        string? emailAlreadyExist = null)
    {
        var loggedUser = LoggedUserBuilder.Build(user);
        var userUpdateOnlyRepository = UserUpdateOnlyRepositoryBuilder.Build(user);
        var unitOfWork = UnitOfWorkBuilder.Build();

        var userReadOnlyRepository = new UserReadOnlyRepositoryBuilder();
        if (emailAlreadyExist.NotEmpty())
            userReadOnlyRepository.ExistActiveUserWithEmail(emailAlreadyExist);

        return new UpdateUserUseCase(
            loggedUser,
            userUpdateOnlyRepository,
            userReadOnlyRepository.Build(),
            unitOfWork);
    }

    [Fact]
    public async Task Success()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserBuilder.Build();

        var useCase = CreateUseCase(user);

        Func<Task> act = async () => await useCase.Execute(request);

        await act.Should().NotThrowAsync();

        // Assertions por referencia — o UseCase alterou o objeto original
        user.Name.Should().Be(request.Name);
        user.Email.Should().Be(request.Email);
    }

    [Fact]
    public async Task Error_Email_Already_Exists()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserBuilder.Build();

        // Configura mock para simular e-mail duplicado
        var useCase = CreateUseCase(user, emailAlreadyExist: request.Email);

        Func<Task> act = async () => await useCase.Execute(request);

        var exception = await act.Should().ThrowAsync<OnValidationException>();
        exception.Where(e => e.Errors.Contains("Email already exists"));
    }

    [Fact]
    public async Task Error_Name_Empty()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserBuilder.Build();
        request.Name = string.Empty; // Forca erro de validacao

        var useCase = CreateUseCase(user);

        Func<Task> act = async () => await useCase.Execute(request);

        var exception = await act.Should().ThrowAsync<OnValidationException>();
        exception.Where(e => e.Errors.Contains("Name cannot be empty"));
    }
}
```

## Comparacao: Interface do LoggedUser vs UpdateOnlyRepository

```csharp
// LoggedUser — AsNoTracking (somente leitura, performance)
public async Task<User> Get()
{
    return await dbContext.Users
        .AsNoTracking()
        .FirstAsync(u => u.Active && u.Id == identifier);
}

// UpdateOnlyRepository — sem AsNoTracking (rastreamento ativo)
public async Task<User> GetById(long id)
{
    return await dbContext.Users
        .SingleAsync(u => u.Active && u.Id == id);
}
```

## Padrao de builder: estatico vs instancia

```csharp
// ESTATICO — quando retorno e sempre o mesmo, sem condicoes
public class UnitOfWorkBuilder
{
    public static IUnitOfWork Build()
    {
        var mock = new Mock<IUnitOfWork>();
        return mock.Object;
    }
}

// INSTANCIA — quando precisa configuracao condicional
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mock;

    public UserReadOnlyRepositoryBuilder()
    {
        _mock = new Mock<IUserReadOnlyRepository>();
    }

    public void ExistActiveUserWithEmail(string email)
    {
        _mock.Setup(r => r.ExistActiveUserWithEmail(email)).ReturnsAsync(true);
    }

    public IUserReadOnlyRepository Build() => _mock.Object;
}
```

## Derivando cenarios de teste a partir do UseCase

```csharp
// Analise do Execute() para identificar cenarios:
public async Task Execute(RequestUpdateUser request)
{
    var user = await _loggedUser.Get();           // cenario: sempre funciona

    Validate(request, user.Email);                // cenario: erro de validacao (nome vazio)

    // if email changed, check duplicate           // cenario: e-mail duplicado
    if (!user.Email.Equals(request.Email))
    {
        var exists = await _repo.ExistActiveUserWithEmail(request.Email);
        if (exists)
            throw new OnValidationException("Email already exists");
    }

    var dbUser = await _updateRepo.GetById(user.Id);  // cenario: sempre funciona
    dbUser.Name = request.Name;                         // assertion por referencia
    dbUser.Email = request.Email;                       // assertion por referencia

    _updateRepo.Update(dbUser);
    await _unitOfWork.Commit();
    // Resultado: 3 cenarios (sucesso, validacao, duplicidade)
}
```