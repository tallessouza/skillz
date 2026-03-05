# Code Examples: Testes de Unidade para ViewModel de Onboarding

## 1. NavigationServiceBuilder (CommonTestUtilities)

```csharp
// Localizado em: CommonTestUtilities/Mobile/Navigation/NavigationServiceBuilder.cs
using Moq;
using PlanShare.App.Navigation;

namespace CommonTestUtilities.Mobile.Navigation;

public class NavigationServiceBuilder
{
    // Retorna Mock<T>, NAO o .Object
    // Porque precisamos do Mock para fazer Verify nos testes
    public static Mock<INavigationService> Build()
        => new Mock<INavigationService>();
}
```

## 2. Classe de testes completa

```csharp
// Localizado em: ViewModels.Tests/Pages/Onboarding/OnboardingViewModelTests.cs
using CommonTestUtilities.Mobile.Navigation;
using Moq;
using PlanShare.App.ViewModels.Pages.Onboarding;
using Shouldly;

namespace ViewModels.Tests.Pages.Onboarding;

public class OnboardingViewModelTests
{
    // Retorna tupla: (ViewModel, Mock do servico)
    private (OnboardingViewModel viewModel, Mock<INavigationService> navigationService) CreateViewModel()
    {
        var navigationService = NavigationServiceBuilder.Build();
        var viewModel = new OnboardingViewModel(navigationService.Object);
        return (viewModel, navigationService);
    }

    [Fact]
    public async Task Sucesso_LoginComEmailEPassword()
    {
        // Arrange
        var (viewModel, navigationService) = CreateViewModel();

        // Act — armazena execucao numa variavel para assert com Shouldly
        var act = async () => await viewModel.LoginComEmailEPasswordCommand.ExecuteAsync(null);

        // Assert 1: nao lanca excecao
        await act.ShouldNotThrowAsync();

        // Assert 2: GoToAsync foi chamado exatamente uma vez
        navigationService.Verify(
            service => service.GoToAsync(Routes.Pages.LoginPage),
            Times.Once
        );
    }
}
```

## 3. A ViewModel sendo testada (referencia)

```csharp
// OnboardingViewModel.cs (simplificado)
public partial class OnboardingViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    public OnboardingViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    private async Task LoginComEmailEPassword()
    {
        await _navigationService.GoToAsync(Routes.Pages.LoginPage);
    }

    [RelayCommand]
    private void LoginComGoogle()
    {
        // Vazia por enquanto — sera testada quando implementada
    }
}
```

## 4. Interface INavigationService (referencia)

```csharp
public interface INavigationService
{
    Task GoToAsync(ShellNavigationState state);
    Task<T> ShowPopup<T>();
}
```

## 5. Variacao: comando void vs async

```csharp
// Comando async (funcao async Task) — usa ExecuteAsync
await viewModel.LoginComEmailEPasswordCommand.ExecuteAsync(null);

// Comando sync (funcao void) — usa Execute, NAO tem ExecuteAsync
viewModel.LoginComGoogleCommand.Execute(null);
```

## 6. Variacao: diferentes Times no Verify

```csharp
// Verificar que foi chamado exatamente uma vez
mock.Verify(s => s.GoToAsync(It.IsAny<ShellNavigationState>()), Times.Once);

// Verificar que NUNCA foi chamado
mock.Verify(s => s.GoToAsync(It.IsAny<ShellNavigationState>()), Times.Never);

// Verificar que foi chamado exatamente 3 vezes
mock.Verify(s => s.GoToAsync(It.IsAny<ShellNavigationState>()), Times.Exactly(3));

// Verificar que foi chamado pelo menos uma vez
mock.Verify(s => s.GoToAsync(It.IsAny<ShellNavigationState>()), Times.AtLeastOnce);
```

## 7. O problema demonstrado na aula (ShellNavigationState)

```csharp
// ISTO FALHA — string nao casa com ShellNavigationState no Verify
navigationService.Verify(
    service => service.GoToAsync(Routes.Pages.LoginPage), // string
    Times.Once
);
// Resultado: Expected 1 call, received 0 calls

// A solucao sera mostrada na parte 2 da aula
// Workaround tipico: usar It.IsAny<ShellNavigationState>()
// ou criar matcher customizado
```

## 8. Estrutura de pastas do projeto de testes

```
ViewModels.Tests/
  Pages/
    Onboarding/
      OnboardingViewModelTests.cs

CommonTestUtilities/
  Mobile/
    Navigation/
      NavigationServiceBuilder.cs
```

## 9. Pacotes NuGet necessarios

```
# No projeto CommonTestUtilities:
NuGet\Install-Package Moq -Version 4.20.72

# No projeto ViewModels.Tests:
NuGet\Install-Package Shouldly -Version 4.3.0
# + atualizar todos os pacotes existentes
```