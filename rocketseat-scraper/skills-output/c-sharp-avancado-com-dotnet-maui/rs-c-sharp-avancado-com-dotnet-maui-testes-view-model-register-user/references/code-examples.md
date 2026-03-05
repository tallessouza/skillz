# Code Examples: Testes de Unidade para ViewModel de Registrar User

## 1. HasherUserUseCaseBuilder completo

```csharp
// Tests/Common/TestUtilities/UseCases/User/Hasher/HasherUserUseCaseBuilder.cs
using Moq;
using ProjectName.UseCases.User.Hasher;
using ProjectName.Models;

public class HasherUserUseCaseBuilder
{
    public static IHasherUserUseCase Build(Result result)
    {
        var mock = new Mock<IHasherUserUseCase>();

        mock.Setup(useCase => useCase.Execute(
            It.IsAny<UserHasherAccount>()
        )).ReturnsAsync(result);

        return mock.Object;
    }
}
```

**Pontos-chave:**
- Metodo estatico `Build` — nao precisa instanciar o builder
- `It.IsAny<UserHasherAccount>()` — aceita qualquer input
- `ReturnsAsync(result)` — o resultado vem do parametro, nao e hardcoded
- Retorna `mock.Object` — a interface implementada, nao o Mock wrapper

## 2. Classe de teste completa

```csharp
// Tests/Pages/ViewModels/User/Hasher/HasherUserAccountViewModelTests.cs
using FluentAssertions;
using Moq;
using Xunit;

public class HasherUserAccountViewModelTests
{
    // Helper que cria a ViewModel com mocks
    private (HasherUserAccountViewModel viewModel, Mock<INavigationService> navigation)
        CreateViewModel(Result result)
    {
        var navigation = NavigationServiceBuilder.Build();
        var useCase = HasherUserUseCaseBuilder.Build(result);

        var viewModel = new HasherUserAccountViewModel(
            navigation.Object,
            useCase
        );

        return (viewModel, navigation);
    }

    [Fact]
    public async Task SuccessGoToLogin()
    {
        // Result.Success() usado como placeholder — nao sera utilizado
        var (viewModel, navigationMock) = CreateViewModel(Result.Success());

        var act = async () => await viewModel.GoToLoginCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        navigationMock.Verify(
            nav => nav.GoToAsync("../LoginPage"),
            Times.Once
        );
    }

    [Fact]
    public async Task RegisterAccountExecutedWithSuccess()
    {
        var (viewModel, navigationMock) = CreateViewModel(Result.Success());

        var act = async () => await viewModel.RegisterAccountCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        navigationMock.Verify(
            nav => nav.GoToDashboardPage(),
            Times.Once
        );
    }

    [Fact]
    public async Task RegisterAccountExecutedWithError()
    {
        // Cenario de erro — sera detalhado na proxima aula
        var errorMessages = new List<string> { "Email invalido", "Senha fraca" };
        var (viewModel, navigationMock) = CreateViewModel(Result.Failure(errorMessages));

        var act = async () => await viewModel.RegisterAccountCommand.ExecuteAsync(null);

        await act.Should().NotThrowAsync();
        viewModel.StatusPage.Should().Be(StatusPage.Default);
        // Verificacao da navegacao para pagina de erro com parametros
        // (detalhado na proxima aula)
    }
}
```

## 3. ViewModel sendo testada (referencia)

```csharp
public class HasherUserAccountViewModel
{
    private readonly INavigationService _navigationService;
    private readonly IHasherUserUseCase _useCase;

    public StatusPage StatusPage { get; set; } = StatusPage.Default;

    public IAsyncRelayCommand GoToLoginCommand { get; }
    public IAsyncRelayCommand RegisterAccountCommand { get; }

    public HasherUserAccountViewModel(
        INavigationService navigationService,
        IHasherUserUseCase useCase)
    {
        _navigationService = navigationService;
        _useCase = useCase;

        GoToLoginCommand = new AsyncRelayCommand(GoToLogin);
        RegisterAccountCommand = new AsyncRelayCommand(RegisterAccount);
    }

    private async Task GoToLogin()
    {
        await _navigationService.GoToAsync("../LoginPage");
    }

    private async Task RegisterAccount()
    {
        StatusPage = StatusPage.Sending;

        var result = await _useCase.Execute(new UserHasherAccount
        {
            Name = Name,
            Email = Email,
            Password = Password
        });

        if (result.IsSuccess)
        {
            await _navigationService.GoToDashboardPage();
        }
        else
        {
            await _navigationService.GoToAsync("ErrorPage",
                new Dictionary<string, object>
                {
                    { "Messages", result.ErrorMessages }
                });
        }

        StatusPage = StatusPage.Default;
    }
}
```

## 4. Padrao de debug dos testes

O instrutor demonstra o fluxo de debug:

```
1. Colocar breakpoint no inicio do teste
2. Botao direito → Debug Tests
3. F10 para step over
4. F11 para step into (entrar no comando/funcao)
5. Verificar valores em cada passo:
   - StatusPage mudou para Sending? ✓
   - UseCase devolveu resultado esperado? ✓
   - Navegou para pagina correta? ✓
   - StatusPage voltou para Default? ✓
```