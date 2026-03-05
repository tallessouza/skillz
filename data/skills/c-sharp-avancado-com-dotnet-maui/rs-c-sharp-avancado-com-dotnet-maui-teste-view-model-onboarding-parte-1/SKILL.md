---
name: rs-csharp-dotnet-maui-teste-vm-onboarding-1
description: "Enforces unit testing patterns for .NET MAUI ViewModels using xUnit, Moq, and Shouldly. Use when user asks to 'test a ViewModel', 'write unit tests for MAUI', 'mock NavigationService', 'test relay commands', or 'verify mock calls'. Applies patterns: test commands not methods, return Mock not object from builders, use tuple returns for test setup, verify mock calls with Times. Make sure to use this skill whenever writing ViewModel tests in .NET MAUI projects. Not for testing services, APIs, use cases, or non-MVVM code."
---

# Testes de Unidade para ViewModels (.NET MAUI)

> Teste comandos (ICommand), nao funcoes diretamente — porque a View executa comandos, nao metodos.

## Rules

1. **Teste o Command, nao o metodo** — `viewModel.LoginComEmailEPasswordCommand.ExecuteAsync(null)` nao `viewModel.LoginComEmailEPassword()`, porque a View executa comandos via RelayCommand e o teste deve simular o mesmo caminho
2. **Builder devolve o Mock, nao o objeto** — retorne `Mock<INavigationService>` nao `INavigationService`, porque o Mock permite fazer Verify (assert de chamadas)
3. **CreateViewModel retorna tupla** — `(ViewModel viewModel, Mock<IService> service)`, porque voce precisa do mock para asserts apos executar o comando
4. **Use Verify com Times para asserts de chamada** — `mock.Verify(s => s.GoToAsync(...), Times.Once)`, porque valida que o servico foi chamado o numero correto de vezes
5. **Funcao async usa ExecuteAsync** — comandos de `AsyncTask` usam `ExecuteAsync`, comandos void usam `Execute`, porque o tipo do comando determina o metodo
6. **Parametro null para commands sem argumentos** — `ExecuteAsync(null)` quando a funcao original nao recebe parametros

## How to write

### Builder de Mock (em CommonTestUtilities)

```csharp
public class NavigationServiceBuilder
{
    public static Mock<INavigationService> Build()
        => new Mock<INavigationService>();
}
```

### CreateViewModel com retorno de tupla

```csharp
private (OnboardingViewModel viewModel, Mock<INavigationService> navigationService) CreateViewModel()
{
    var navigationService = NavigationServiceBuilder.Build();
    var viewModel = new OnboardingViewModel(navigationService.Object);
    return (viewModel, navigationService);
}
```

### Teste completo de comando

```csharp
[Fact]
public async Task Sucesso_LoginComEmailEPassword()
{
    var (viewModel, navigationService) = CreateViewModel();

    var act = async () => await viewModel.LoginComEmailEPasswordCommand.ExecuteAsync(null);

    await act.ShouldNotThrowAsync();

    navigationService.Verify(
        service => service.GoToAsync(Routes.Pages.LoginPage),
        Times.Once
    );
}
```

## Example

**Before (erro comum — testar metodo diretamente):**
```csharp
[Fact]
public async Task Test()
{
    var nav = new Mock<INavigationService>();
    var vm = new OnboardingViewModel(nav.Object);

    await vm.LoginComEmailEPassword(); // ERRADO: testa metodo, nao comando

    // Sem assert de mock
}
```

**After (com esta skill aplicada):**
```csharp
[Fact]
public async Task Sucesso_LoginComEmailEPassword()
{
    var (viewModel, navigationService) = CreateViewModel();

    var act = async () => await viewModel.LoginComEmailEPasswordCommand.ExecuteAsync(null);

    await act.ShouldNotThrowAsync();

    navigationService.Verify(
        service => service.GoToAsync(Routes.Pages.LoginPage),
        Times.Once
    );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao tem `[RelayCommand]` | Teste via `NomeDaFuncaoCommand`, nao a funcao |
| Funcao e `async Task` | Use `ExecuteAsync` no comando |
| Funcao e `void` | Use `Execute` no comando |
| Funcao nao recebe parametros | Passe `null` no `ExecuteAsync(null)` |
| Precisa verificar se servico foi chamado | Retorne `Mock<T>` no builder, use `Verify` |
| Servico recebe tipo complexo (ex: ShellNavigationState) | Cuidado: string nao casa com tipo complexo — precisa workaround |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `await vm.MinhaFuncao()` | `await vm.MinhaFuncaoCommand.ExecuteAsync(null)` |
| Builder retorna `IService` | Builder retorna `Mock<IService>` |
| `CreateViewModel()` retorna so a VM | Retorna tupla `(VM, Mock)` |
| Assert sem verificar chamadas do mock | `mock.Verify(s => s.Metodo(), Times.Once)` |
| `var nav = NavigationServiceBuilder.Build().Object` | `var nav = NavigationServiceBuilder.Build()` (use `.Object` so ao instanciar a VM) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
