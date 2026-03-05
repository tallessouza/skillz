# Code Examples: Testes de Unidade para ViewModel de Error

## Estrutura de pastas do projeto de teste

```
ViewModels.Tests/
└── Pages/
    └── Errors/
        └── ErrorsViewModelTests.cs
```

A convencao e espelhar a estrutura do projeto principal e adicionar "Tests" ao nome da classe.

## ViewModel sendo testada

```csharp
public partial class ErrorsViewModel : ObservableObject, IQueryAttributable
{
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private ObservableCollection<string> errorsList;

    public ErrorsViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    private async Task Close()
    {
        // CORRETO: usar ClosePage() em vez de GoToAsync("..")
        await _navigationService.ClosePage();
    }

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.Count > 0)
        {
            var errors = query["errors"] as List<string>;
            if (errors is not null)
            {
                ErrorsList = new ObservableCollection<string>(errors);
            }
        }
    }
}
```

## Classe de teste completa

```csharp
public class ErrorsViewModelTests
{
    [Fact]
    public async Task Success_Close()
    {
        // Arrange
        var (viewModel, navigationService) = CreateViewModel();

        // Act
        Func<Task> act = async () => await viewModel.CloseCommand.ExecuteAsync(null);

        // Assert
        await act.ShouldNotThrowAsync();

        navigationService.Verify(
            navigationService => navigationService.ClosePage(),
            Times.Once()
        );
    }

    [Fact]
    public void Success_ApplyQueryAttributes()
    {
        // Arrange
        var (viewModel, _) = CreateViewModel();

        // Act
        viewModel.ApplyQueryAttributes(new Dictionary<string, object>
        {
            { "errors", new List<string> { "Error 1", "Error 2" } }
        });

        // Assert
        viewModel.ErrorsList.ShouldNotBeNull();
        viewModel.ErrorsList.ShouldSatisfy(
            errors =>
            {
                errors.Count.ShouldBe(2);
                errors.ShouldContain("Error 1");
                errors.ShouldContain("Error 2");
            }
        );
    }

    private (ErrorsViewModel viewModel, Mock<INavigationService> navigationService) CreateViewModel()
    {
        var navigationService = new NavigationServiceBuilder().Build();
        var viewModel = new ErrorsViewModel(navigationService.Object);
        return (viewModel, navigationService);
    }
}
```

## Correcao: GoToAsync("..") para ClosePage()

```csharp
// ANTES (errado — usando sintaxe direta)
private async Task Close()
{
    await _navigationService.GoToAsync("..");
}

// DEPOIS (correto — usando abstracao ClosePage)
private async Task Close()
{
    await _navigationService.ClosePage();
}
```

A interface `INavigationService` ja define `ClosePage()` que encapsula a logica de fechar a pagina atual. Usar `GoToAsync("..")` diretamente ignora essa abstracao.

## Variacao: Assert antes do Act (descartado)

```csharp
// O instrutor mostrou e depois REMOVEU este padrao:
[Fact]
public void Success_ApplyQueryAttributes_WithPreAssert()
{
    var (viewModel, _) = CreateViewModel();

    // Assert pre-Act (removido — nao agrega valor)
    viewModel.ErrorsList.ShouldBeNull();

    viewModel.ApplyQueryAttributes(new Dictionary<string, object>
    {
        { "errors", new List<string> { "Error 1", "Error 2" } }
    });

    viewModel.ErrorsList.ShouldNotBeNull();
}
```

## Variacao: verificar nao-excecao no ApplyQueryAttributes

```csharp
// O instrutor mencionou que voce PODE fazer isso, mas optou por nao fazer
[Fact]
public void Success_ApplyQueryAttributes_NoException()
{
    var (viewModel, _) = CreateViewModel();

    Action act = () => viewModel.ApplyQueryAttributes(new Dictionary<string, object>
    {
        { "errors", new List<string> { "Error 1" } }
    });

    act.ShouldNotThrow();
    viewModel.ErrorsList.ShouldNotBeNull();
}
```

## Naming conventions nos Verify do Moq

```csharp
// EVITE: nomes genericos como x
navigationService.Verify(
    x => x.ClosePage(),  // "x" nao e descritivo
    Times.Once()
);

// PREFIRA: nomes descritivos
navigationService.Verify(
    navigationService => navigationService.ClosePage(),  // claro
    Times.Once()
);
```

O instrutor explicitamente mencionou que nao gosta de usar `x` como nome de parametro no lambda do Verify, preferindo nomear adequadamente.