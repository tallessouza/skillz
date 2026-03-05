# Code Examples: Verify Extension Methods

## Estrutura de pastas

```
ViewModels.Tests/
├── Extensions/
│   └── NavigationVerifyExtensions.cs    # Extension methods
├── RegisterAccountViewModelTests.cs
├── LoginViewModelTests.cs
└── ChangePasswordViewModelTests.cs
```

## Classe completa de extensao

```csharp
namespace ViewModels.Tests.Extensions;

public static class NavigationVerifyExtensions
{
    public static void VerifyGoTo(
        this Mock<INavigationService> navigationService,
        string route,
        IList<string> errorMessages,
        Func<Times> times)
    {
        navigationService.Verify(
            service => service.GoToAsync(
                It.Is<ShellNavigationState>(state => IsMatchingShellPage(state, route)),
                It.Is<Dictionary<string, object>>(dict => IsMatchingErrorDictionary(dict, errorMessages))),
            times);
    }

    public static void VerifyGoTo(
        this Mock<INavigationService> navigationService,
        string route,
        Func<Times> times)
    {
        navigationService.Verify(
            service => service.GoToAsync(
                It.Is<ShellNavigationState>(state => IsMatchingShellPage(state, route))),
            times);
    }

    private static bool IsMatchingShellPage(ShellNavigationState state, string route)
        => state.Location.ToString() == route;

    private static bool IsMatchingErrorDictionary(
        Dictionary<string, object> dictionary,
        IList<string> errorMessages)
        => dictionary["Errors"] is IList<string> errors
           && errors.Count == errorMessages.Count
           && errors.All(errorMessages.Contains);
}
```

## Uso em RegisterAccountViewModelTests

```csharp
[Fact]
public async Task Register_WithInvalidData_ShouldNavigateToErrorPage()
{
    // Arrange
    // ... setup do mock e ViewModel

    // Act
    await _viewModel.RegisterCommand.ExecuteAsync(null);

    // Assert — com validacao de erros
    _navigationService.VerifyGoTo(
        RoutPages.ErrorPage,
        new List<string> { "erro1" },
        Times.Once);
}
```

## Uso em OnboardingViewModelTests (navegacao simples)

```csharp
[Fact]
public async Task Navigate_ShouldGoToRegisterPage()
{
    // Act
    await _viewModel.GoToRegisterCommand.ExecuteAsync(null);

    // Assert — sem dicionario de erros
    _navigationService.VerifyGoTo(
        RoutPages.UserRegisterAccountPage,
        Times.Once);
}

[Fact]
public async Task Navigate_ShouldGoToLoginPage()
{
    // Act
    await _viewModel.GoToLoginCommand.ExecuteAsync(null);

    // Assert
    _navigationService.VerifyGoTo(
        RoutPages.LoginPage,
        Times.Once);
}
```

## Evolucao: antes e depois

### Antes — validacao inline (aula anterior)

```csharp
// Funcoes locais na classe de teste
private bool GetValidationForMountPage(ShellNavigationState state)
    => state.Location.ToString() == RoutPages.ErrorPage;

private bool GetValidationForDictionaryErrors(Dictionary<string, object> dictionary)
    => dictionary["Errors"] is IList<string> errors
       && errors.Count == 1
       && errors.Contains("erro1");

// No teste
_navigationService.Verify(
    s => s.GoToAsync(
        It.Is<ShellNavigationState>(state => GetValidationForMountPage(state)),
        It.Is<Dictionary<string, object>>(d => GetValidationForDictionaryErrors(d))),
    Times.Once);
```

### Depois — extension method reutilizavel

```csharp
// No teste (uma linha)
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    new List<string> { "erro1" },
    Times.Once);
```

## Variacao: multiplas mensagens de erro

```csharp
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    new List<string> { "Email invalido", "Senha muito curta", "Nome obrigatorio" },
    Times.Once);
```

## Variacao: verificar que nunca foi chamado

```csharp
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    Times.Never);
```

## Variacao: verificar chamadas multiplas

```csharp
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    new List<string> { "erro1" },
    Times.Exactly(2));
```