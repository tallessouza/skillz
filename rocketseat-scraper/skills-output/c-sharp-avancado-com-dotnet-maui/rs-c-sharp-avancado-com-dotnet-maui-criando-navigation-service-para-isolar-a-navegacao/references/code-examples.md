# Code Examples: Navigation Service para Isolar Navegacao

## Exemplo completo passo a passo

### 1. Criar a interface INavigationService

Dentro da pasta `navigation/`:

```csharp
namespace MeuApp.Navigation;

public interface INavigationService
{
    Task GoToAsync(ShellNavigationState state);
}
```

### 2. Criar a classe NavigationService

Mesma pasta:

```csharp
namespace MeuApp.Navigation;

public class NavigationService : INavigationService
{
    public async Task GoToAsync(ShellNavigationState state) =>
        await Shell.Current.GoToAsync(state);
}
```

O instrutor simplifica em uma linha usando expression body, ja que e uma unica chamada.

### 3. Registrar no MauiProgram.cs

Criar metodo de extensao separado para manter organizacao:

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            // ... outras configuracoes
            .AddNavigationService();  // Adicionar aqui

        return builder.Build();
    }

    private static MauiAppBuilder AddNavigationService(this MauiAppBuilder appBuilder)
    {
        appBuilder.Services.AddSingleton<INavigationService, NavigationService>();
        return appBuilder;
    }
}
```

Nota do instrutor: "A ordem aqui faz diferenca? Nao, aqui e so configuracao de injecao de dependencia, nao precisa se preocupar com nenhuma ordem."

### 4. Refatorar a ViewModel

**Antes:**
```csharp
public partial class OnBoardViewModel : ObservableObject
{
    [RelayCommand]
    async Task GoToLogin()
    {
        await Shell.Current.GoToAsync(RoutePages.LoginPage);
    }

    [RelayCommand]
    async Task GoToRegister()
    {
        await Shell.Current.GoToAsync(RoutePages.RegisterPage);
    }
}
```

**Depois:**
```csharp
public partial class OnBoardViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    public OnBoardViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    async Task GoToLogin()
    {
        await _navigationService.GoToAsync(RoutePages.LoginPage);
    }

    [RelayCommand]
    async Task GoToRegister()
    {
        await _navigationService.GoToAsync(RoutePages.RegisterPage);
    }
}
```

### 5. Verificacao com breakpoint

O instrutor coloca breakpoint no construtor da ViewModel para confirmar que:
- A instancia de `NavigationService` chega via DI (nao e nula)
- A referencia e salva na propriedade `_navigationService`
- Os botoes de navegacao continuam funcionando normalmente

### Exemplo futuro: teste de unidade

```csharp
[Fact]
public async Task GoToLogin_ShouldNavigateToLoginPage()
{
    // Arrange
    var mockNavigation = new Mock<INavigationService>();
    var viewModel = new OnBoardViewModel(mockNavigation.Object);

    // Act
    viewModel.GoToLoginCommand.Execute(null);

    // Assert
    mockNavigation.Verify(n => n.GoToAsync(It.IsAny<ShellNavigationState>()), Times.Once);
}
```

Este exemplo nao foi mostrado na aula mas e o objetivo final da refatoracao: testar a ViewModel sem app executando.