# Code Examples: Testes de ViewModel de Perfil

## Estrutura completa da classe de teste

```csharp
public class UserProfileViewModelTests
{
    private (UserProfileViewModel vm, Mock<INavigationService> nav) CreateViewModel(
        Result<User> result)
    {
        var navMock = new Mock<INavigationService>();
        var updateUseCase = new UpdateUserUseCaseBuilder().Build(result).Object;
        var getProfileUseCase = new GetUserProfileUseCaseBuilder().Build(result).Object;

        var vm = new UserProfileViewModel(
            navMock.Object,
            getProfileUseCase,
            updateUseCase,
            null,
            null);

        return (vm, navMock);
    }

    [Fact]
    public async Task Success_ChangePassword()
    {
        var user = UserBuilder.Build();
        var (viewModel, navigationService) = CreateViewModel(Result<User>.Success(user));

        var act = async () => await viewModel.ChangePasswordCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        navigationService.VerifyGoTo("UserChangePasswordPage", Times.Once());
    }

    [Fact]
    public async Task UpdateProfile_Execute_WithValidResult()
    {
        var user = UserBuilder.Build();
        var (viewModel, navigationService) = CreateViewModel(Result<User>.Success(user));

        var act = async () => await viewModel.UpdateProfileCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        navigationService.Verify(
            n => n.ShowSuccessFeedback("Perfil atualizado com sucesso!"),
            Times.Once());
    }

    [Fact]
    public async Task UpdateProfile_Execute_WithInvalidResult()
    {
        var (viewModel, navigationService) = CreateViewModel(
            Result<User>.Failure(new[] { "error 1" }));

        var act = async () => await viewModel.UpdateProfileCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        navigationService.VerifyGoToPageWithErrors(
            new List<string> { "error 1" },
            Times.Once());
    }

    [Fact]
    public async Task Initialize_Execute_WithValidResult()
    {
        var user = UserBuilder.Build();
        var (viewModel, _) = CreateViewModel(Result<User>.Success(user));

        var act = async () => await viewModel.InitializeCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        viewModel.Model.Should().NotBeNull();
        viewModel.Model.Name.Should().Be(user.Name);
        viewModel.Model.Email.Should().Be(user.Email);
    }

    [Fact]
    public async Task Initialize_Execute_WithInvalidResult()
    {
        var (viewModel, navigationService) = CreateViewModel(
            Result<User>.Failure(new[] { "error 1" }));

        var act = async () => await viewModel.InitializeCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        navigationService.VerifyGoToPageWithErrors(
            new List<string> { "error 1" },
            Times.Once());
    }
}
```

## UserBuilder completo

```csharp
using Bogus;
using PlanShare.App.Models;

namespace CommonTestUtilities.Models;

public class UserBuilder
{
    public static User Build()
    {
        return new Faker<User>()
            .RuleFor(u => u.Name, f => f.Person.FirstName)
            .RuleFor(u => u.Email, f => f.Person.Email)
            .Generate();
    }
}
```

## GetUserProfileUseCaseBuilder

```csharp
using Moq;
using PlanShare.App.Models;
using PlanShare.App.UseCases;

namespace CommonTestUtilities.UseCases.Profile;

public class GetUserProfileUseCaseBuilder
{
    private readonly Mock<IGetUserProfileUseCase> _mock;

    public GetUserProfileUseCaseBuilder()
    {
        _mock = new Mock<IGetUserProfileUseCase>();
    }

    public GetUserProfileUseCaseBuilder Build(Result<User> result)
    {
        _mock.Setup(u => u.Execute()).ReturnsAsync(result);
        return this;
    }

    public IGetUserProfileUseCase Object => _mock.Object;
}
```

## UpdateUserUseCaseBuilder

```csharp
using Moq;
using PlanShare.App.Models;
using PlanShare.App.UseCases;

namespace CommonTestUtilities.UseCases.Update;

public class UpdateUserUseCaseBuilder
{
    private readonly Mock<IUpdateUserUseCase> _mock;

    public UpdateUserUseCaseBuilder()
    {
        _mock = new Mock<IUpdateUserUseCase>();
    }

    // Result<User> aceito aqui porque herda de Result
    public UpdateUserUseCaseBuilder Build(Result<User> result)
    {
        _mock.Setup(u => u.Execute()).ReturnsAsync(result);
        return this;
    }

    public IUpdateUserUseCase Object => _mock.Object;
}
```

## Organizacao de pastas

```
CommonTestUtilities/
├── Models/
│   └── UserBuilder.cs              ← Bogus + Faker<User>
├── UseCases/
│   ├── Profile/
│   │   └── GetUserProfileUseCaseBuilder.cs
│   └── Update/
│       └── UpdateUserUseCaseBuilder.cs

ViewModels.Tests/
├── Pages/
│   └── User/
│       └── Profile/
│           └── UserProfileViewModelTests.cs
```

## Heranca Result — demonstracao

```csharp
// Result<User> HERDA de Result
// Entao isso funciona:
Result baseResult = Result<User>.Success(user);  // OK: filho → mae

// Isso NAO funciona:
// Result<User> typedResult = Result.Success();  // ERRO: mae → filho
```