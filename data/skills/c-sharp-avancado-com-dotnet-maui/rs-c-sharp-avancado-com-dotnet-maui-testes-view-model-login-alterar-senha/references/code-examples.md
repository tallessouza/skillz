# Code Examples: Testes de ViewModel Login e Alterar Senha

## Estrutura de pastas do projeto de teste

```
ViewModels.Test/
├── Pages/
│   ├── Login/
│   │   └── DoLogin/
│   │       └── DoLoginViewModelTest.cs
│   └── ChangePassword/
│       └── ChangeUserPasswordViewModelTest.cs
└── Utilities/
    └── UseCases/
        └── Login/
            └── DoLogin/
                └── DoLoginUseCaseBuilder.cs
```

## DoLoginUseCaseBuilder completo

```csharp
public class DoLoginUseCaseBuilder
{
    public static IDoLoginUseCase Build(Result result)
    {
        var mock = new Mock<IDoLoginUseCase>();

        mock.Setup(u => u.Execute(It.IsAny<LoginRequest>()))
            .ReturnsAsync(result);

        return mock.Object;
    }
}
```

## DoLoginViewModelTest completo

```csharp
public class DoLoginViewModelTest
{
    private Mock<INavigationService> _navigationService;

    private DoLoginViewModel CreateViewModel(Result result)
    {
        var useCase = DoLoginUseCaseBuilder.Build(result);
        _navigationService = new Mock<INavigationService>();

        return new DoLoginViewModel(useCase, _navigationService.Object);
    }

    [Fact]
    public async Task Success_ShouldNavigateToDashboard()
    {
        // Arrange
        var viewModel = CreateViewModel(Result.Success());

        // Act
        var act = () => viewModel.DoLoginCommand.ExecuteAsync(null);

        // Assert
        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        _navigationService.Verify(
            n => n.GoToDashboardPage(),
            Times.Once
        );
    }

    [Fact]
    public async Task Error_ShouldNavigateToErrorPage()
    {
        // Arrange
        var viewModel = CreateViewModel(Result.Failure("Error1"));

        // Act
        var act = () => viewModel.DoLoginCommand.ExecuteAsync(null);

        // Assert
        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        Verify.NavigatedToErrorPage(
            _navigationService,
            expectedRoute: RootPages.ErrorPage,
            expectedErrors: new List<string> { "Error1" },
            times: Times.Once
        );
    }
}
```

## ChangeUserPasswordUseCaseBuilder

```csharp
public class ChangeUserPasswordUseCaseBuilder
{
    public static IChangeUserPasswordUseCase Build(Result result)
    {
        var mock = new Mock<IChangeUserPasswordUseCase>();

        mock.Setup(u => u.Execute(It.IsAny<ChangePasswordRequest>()))
            .ReturnsAsync(result);

        return mock.Object;
    }
}
```

## ChangeUserPasswordViewModelTest completo

```csharp
public class ChangeUserPasswordViewModelTest
{
    private Mock<INavigationService> _navigationService;
    private Mock<IFeedbackService> _feedbackService;

    private ChangeUserPasswordViewModel CreateViewModel(Result result)
    {
        var useCase = ChangeUserPasswordUseCaseBuilder.Build(result);
        _navigationService = new Mock<INavigationService>();
        _feedbackService = new Mock<IFeedbackService>();

        return new ChangeUserPasswordViewModel(
            useCase,
            _navigationService.Object,
            _feedbackService.Object
        );
    }

    [Fact]
    public async Task Success_ShouldClosePageAndShowFeedback()
    {
        // Arrange
        var viewModel = CreateViewModel(Result.Success());

        // Act
        var act = () => viewModel.ChangePasswordCommand.ExecuteAsync(null);

        // Assert
        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        _navigationService.Verify(n => n.ClosePage(), Times.Once);
        _feedbackService.Verify(
            f => f.ShowSuccessFeedback("Senha alterada com sucesso"),
            Times.Once
        );
    }

    [Fact]
    public async Task Error_ShouldNavigateToErrorPage()
    {
        // Arrange
        var viewModel = CreateViewModel(Result.Failure("Error1"));

        // Act
        var act = () => viewModel.ChangePasswordCommand.ExecuteAsync(null);

        // Assert
        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        Verify.NavigatedToErrorPage(
            _navigationService,
            expectedRoute: RootPages.ErrorPage,
            expectedErrors: new List<string> { "Error1" },
            times: Times.Once
        );
    }
}
```

## Padrão do Command Handler sendo testado

```csharp
// DoLoginViewModel - o código de produção que os testes cobrem
public class DoLoginViewModel
{
    public IAsyncRelayCommand DoLoginCommand { get; }

    public DoLoginViewModel(IDoLoginUseCase useCase, INavigationService nav)
    {
        DoLoginCommand = new AsyncRelayCommand(async () =>
        {
            StatusPage = StatusPage.Loading;

            var result = await useCase.Execute(new LoginRequest { /* ... */ });

            if (result.IsSuccess)
            {
                nav.GoToDashboardPage();
            }
            else
            {
                nav.GoPageWithErrors(result.Errors);
            }

            StatusPage = StatusPage.Default;
        });
    }
}
```

## Heurística visual: contando cenários

```
DoLoginViewModel.DoLoginCommand:
  ├── result.IsSuccess → GoToDashboardPage()     → Teste 1: Success
  └── else             → GoPageWithErrors(errors) → Teste 2: Error

ChangeUserPasswordViewModel.ChangePasswordCommand:
  ├── result.IsSuccess → ClosePage() + ShowSuccessFeedback() → Teste 1: Success
  └── else             → GoPageWithErrors(errors)            → Teste 2: Error

Total: 4 testes para 2 ViewModels
```