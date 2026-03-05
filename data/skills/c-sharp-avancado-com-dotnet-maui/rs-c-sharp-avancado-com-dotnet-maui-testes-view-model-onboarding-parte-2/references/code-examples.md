# Code Examples: Verificacao de Navegacao em Testes de ViewModel

## Exemplo 1: Teste que falha (problema original)

```csharp
[Fact]
public async Task GoToLoginPage_ShouldNavigateToLoginRoute()
{
    var mockNavigationService = new Mock<INavigationService>();
    var viewModel = new OnboardingViewModel(mockNavigationService.Object);

    await viewModel.GoToLoginPageCommand.ExecuteAsync(null);

    // FALHA: comparacao por referencia de ShellNavigationState
    mockNavigationService.Verify(
        nav => nav.GoToAsync(RoutesPages.LoginPage),
        Times.Once);
}
```

**Mensagem de erro esperada:**
```
Expected invocation on the mock once, but was 0 times:
nav => nav.GoToAsync(RoutesPages.LoginPage)
```

O mock registrou a chamada, mas com uma instancia diferente de `ShellNavigationState`.

## Exemplo 2: Teste corrigido com It.Is

```csharp
[Fact]
public async Task GoToLoginPage_ShouldNavigateToLoginRoute()
{
    var mockNavigationService = new Mock<INavigationService>();
    var viewModel = new OnboardingViewModel(mockNavigationService.Object);

    await viewModel.GoToLoginPageCommand.ExecuteAsync(null);

    mockNavigationService.Verify(
        nav => nav.GoToAsync(
            It.Is<ShellNavigationState>(state =>
                state.Location.OriginalString == RoutesPages.LoginPage)),
        Times.Once);
}
```

## Exemplo 3: Segundo teste (HazardUserAccount)

```csharp
[Fact]
public async Task HazardUserAccount_ShouldNavigateToHazardRoute()
{
    var mockNavigationService = new Mock<INavigationService>();
    var viewModel = new OnboardingViewModel(mockNavigationService.Object);

    await viewModel.HazardUserAccountsCommand.ExecuteAsync(null);

    mockNavigationService.Verify(
        nav => nav.GoToAsync(
            It.Is<ShellNavigationState>(state =>
                state.Location.OriginalString == RoutesPages.HazardUserAccountPage)),
        Times.Once);
}
```

## Exemplo 4: Forcando erro — rota errada

```csharp
// Na ViewModel (temporariamente para validar teste):
public async Task HazardUserAccount()
{
    // Trocado propositalmente para validar que o teste detecta
    await NavigationService.GoToAsync("//ErrorPage");
}
```

**Mensagem de erro:**
```
Expected invocation on the mock once, but was 0 times:
nav => nav.GoToAsync(It.Is<ShellNavigationState>(state =>
    state.Location.OriginalString == "//HazardUserAccountPage"))
```

## Exemplo 5: Forcando erro — chamada duplicada

```csharp
// Na ViewModel (temporariamente para validar teste):
public async Task GoToLoginPage()
{
    await NavigationService.GoToAsync(RoutesPages.LoginPage);
    await NavigationService.GoToAsync(RoutesPages.LoginPage); // duplicada
}
```

**Mensagem de erro:**
```
Expected invocation on the mock once, but was 2 times
```

## Exemplo 6: Conversao implicita que causa o problema

```csharp
// O que voce escreve:
await NavigationService.GoToAsync(RoutesPages.LoginPage); // string

// O que o .NET faz internamente:
var shellState = new ShellNavigationState(RoutesPages.LoginPage);
await NavigationService.GoToAsync(shellState); // ShellNavigationState

// No Verify, outra conversao acontece:
// Instancia 1 (ViewModel) != Instancia 2 (Verify) por referencia
```

## Debugging com breakpoints (tecnica do instrutor)

O instrutor demonstra o uso de F10 (step over) e F11 (step into) para:

1. **F10 na criacao da ViewModel** — confirmar que o mock foi injetado
2. **F11 no ExecuteAsync** — entrar dentro do comando e ver a navegacao sendo chamada
3. **Expandir variaveis no debugger** — verificar que `Location.OriginalString` tem o valor esperado
4. **F10 no Verify** — confirmar que passa sem excecao (teste verde)

Essa pratica de debug passo-a-passo e recomendada para entender exatamente o que acontece em cada etapa do teste.