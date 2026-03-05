---
name: rs-csharp-maui-testes-viewmodel-login-senha
description: "Enforces unit testing patterns for .NET MAUI ViewModels with command-based architecture. Use when user asks to 'test a ViewModel', 'write unit tests for commands', 'test navigation logic', 'mock use cases in C#', or 'verify page navigation'. Applies patterns: UseCase builder with Result control, Verify navigation calls, assert StatusPage resets, test success and error branches of commands. Make sure to use this skill whenever writing tests for MVVM ViewModels in .NET MAUI or Xamarin. Not for integration tests, UI tests, or API endpoint testing."
---

# Testes de Unidade para ViewModels (.NET MAUI)

> Para cada Command numa ViewModel, identifique os branches (sucesso/erro) e teste cada um verificando navegacao, feedback e StatusPage.

## Rules

1. **Um Command = N cenarios** — conte os branches dentro do command handler (`if success` / `else error`), cada branch e um teste, porque garante cobertura completa dos fluxos
2. **Controle o resultado via Builder** — crie um `UseCaseBuilder.Build(result)` que configura o mock para retornar o resultado desejado, porque o teste deve controlar se o use case retorna sucesso ou falha
3. **Sempre verifique StatusPage ao final** — apos executar o command, assert que `StatusPage == default`, porque o command deve resetar o status independente do resultado
4. **Sempre verifique que nao lancou excecao** — use `FluentAssertions` ou equivalente para garantir que a execucao do command nao lanca excecao, porque excecoes nao tratadas crasham o app
5. **Use Verify para navegacao** — confirme que `GoToDashboardPage`, `GoToAsync`, ou `ClosePage` foi chamado exatamente uma vez (`Times.Once`), porque navegacao duplicada causa bugs de UI
6. **Strings comparam por valor, colecoes por It.Is** — ao verificar chamadas com parametros string, passe o valor direto; para dicionarios/listas, use `It.Is<T>` com lambda, porque referencia vs valor muda o comportamento do mock

## How to write

### UseCase Builder

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

### Cenario de sucesso (navegacao)

```csharp
[Fact]
public async Task Success_ShouldNavigateToDashboard()
{
    var viewModel = CreateViewModel(Result.Success());

    var act = () => viewModel.DoLoginCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    _navigationService.Verify(n => n.GoToDashboardPage(), Times.Once);
}
```

### Cenario de erro (navegacao com parametros)

```csharp
[Fact]
public async Task Error_ShouldNavigateToErrorPage()
{
    var viewModel = CreateViewModel(Result.Failure("Error1"));

    var act = () => viewModel.DoLoginCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    Verify.NavigatedToErrorPage(_navigationService, new List<string> { "Error1" });
}
```

### Cenario de sucesso com feedback (string simples)

```csharp
[Fact]
public async Task Success_ShouldCloseAndShowFeedback()
{
    var viewModel = CreateViewModel(Result.Success());

    var act = () => viewModel.ChangePasswordCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    _navigationService.Verify(n => n.ClosePage(), Times.Once);
    _feedbackService.Verify(f => f.ShowSuccessFeedback("Senha alterada com sucesso"), Times.Once);
}
```

## Example

**Before (teste incompleto):**
```csharp
[Fact]
public async Task Login_Works()
{
    var vm = new DoLoginViewModel(mockUseCase.Object, mockNav.Object);
    await vm.DoLoginCommand.ExecuteAsync(null);
    // sem verificacao de StatusPage
    // sem verificacao de excecao
    // sem Verify de navegacao
}
```

**After (com esta skill aplicada):**
```csharp
[Fact]
public async Task Success_ShouldNavigateToDashboard()
{
    var viewModel = CreateViewModel(Result.Success());

    var act = () => viewModel.DoLoginCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    _navigationService.Verify(n => n.GoToDashboardPage(), Times.Once);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Command com if/else sucesso/erro | Crie 2 testes minimo |
| Navegacao com parametros (dicionario) | Use `It.Is<T>` com lambda para verificar |
| Feedback com string simples | Passe a string diretamente no Verify |
| Multiplos commands na ViewModel | Teste cada command independentemente |
| UseCase retorna Result | Crie Builder que aceita Result como parametro |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Mock inline repetido em cada teste | `UseCaseBuilder.Build(result)` reutilizavel |
| Teste sem verificar StatusPage | `viewModel.StatusPage.Should().Be(StatusPage.Default)` |
| Teste sem verificar excecao | `act.Should().NotThrowAsync()` |
| `Times.AtLeastOnce` para navegacao | `Times.Once` — navegacao deve ser exata |
| Comparar lista por referencia no Verify | `It.Is<List<string>>(l => l.Contains("Error1"))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
