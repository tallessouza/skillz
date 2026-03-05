---
name: rs-csharp-maui-testes-vm-error
description: "Applies unit testing patterns for .NET MAUI ViewModels with navigation and query attributes. Use when user asks to 'test a ViewModel', 'write unit tests for MAUI', 'test navigation commands', 'mock INavigationService', or 'test IQueryAttributable'. Covers command testing, mock verification with call counts, ObservableCollection property assertions, and ShouldSatisfy patterns. Make sure to use this skill whenever writing tests for MAUI ViewModels that use navigation or receive query parameters. Not for UI testing, integration testing, or non-MAUI ViewModel testing."
---

# Testes de Unidade para ViewModel com Navegacao e Query Attributes

> Teste comandos de navegacao verificando chamadas no mock, e teste IQueryAttributable validando que propriedades observaveis sao preenchidas corretamente.

## Rules

1. **Crie factory method privado para instanciar a ViewModel** — `CreateViewModel()` retorna a ViewModel e os mocks, porque centraliza a construcao e evita duplicacao entre testes
2. **Verifique contagem de chamadas no mock** — use `Verify` com `Times.Once()` para garantir que `ClosePage` foi chamado exatamente uma vez, porque chamar mais de uma vez pode fechar paginas indesejadas
3. **Use ShouldSatisfy para multiplas condicoes na mesma colecao** — agrupa asserts de count, contains e ordem em um unico bloco legivel, porque falha na primeira condicao nao satisfeita
4. **Mantenha o padrao AAA (Arrange-Act-Assert)** — nao misture asserts antes do act a menos que seja essencial, porque melhora legibilidade e manutencao
5. **Teste propriedades geradas por source generators** — `[ObservableProperty]` gera propriedade publica que deve ser testada diretamente, porque valida tanto a logica quanto a geracao de codigo

## How to write

### Factory method para ViewModel

```csharp
private (ErrorsViewModel viewModel, Mock<INavigationService> navigationService) CreateViewModel()
{
    var navigationService = new NavigationServiceBuilder().Build();
    var viewModel = new ErrorsViewModel(navigationService.Object);
    return (viewModel, navigationService);
}
```

### Teste de comando de navegacao com verificacao de mock

```csharp
[Fact]
public async Task Success_Close()
{
    var (viewModel, navigationService) = CreateViewModel();

    Func<Task> act = async () => await viewModel.CloseCommand.ExecuteAsync(null);

    await act.ShouldNotThrowAsync();

    navigationService.Verify(
        navigationService => navigationService.ClosePage(),
        Times.Once()
    );
}
```

### Teste de ApplyQueryAttributes com ObservableCollection

```csharp
[Fact]
public void Success_ApplyQueryAttributes()
{
    var (viewModel, _) = CreateViewModel();

    viewModel.ApplyQueryAttributes(new Dictionary<string, object>
    {
        { "errors", new List<string> { "Error 1", "Error 2" } }
    });

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
```

## Example

**Before (teste incompleto sem verificacao de mock):**
```csharp
[Fact]
public async Task Close_Works()
{
    var vm = new ErrorsViewModel(Mock.Of<INavigationService>());
    await vm.CloseCommand.ExecuteAsync(null);
    // Nenhuma verificacao se ClosePage foi chamado
}
```

**After (com verificacao completa):**
```csharp
[Fact]
public async Task Success_Close()
{
    var (viewModel, navigationService) = CreateViewModel();

    Func<Task> act = async () => await viewModel.CloseCommand.ExecuteAsync(null);

    await act.ShouldNotThrowAsync();

    navigationService.Verify(
        nav => nav.ClosePage(),
        Times.Once()
    );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Comando nao recebe parametro | Passe `null` para `ExecuteAsync` |
| Comando chama navegacao | Verifique `Times.Once()` no mock |
| ViewModel implementa IQueryAttributable | Teste passando `Dictionary<string, object>` |
| Propriedade e `[ObservableProperty]` | Teste a propriedade publica gerada (PascalCase) |
| Multiplas condicoes na mesma colecao | Use `ShouldSatisfy` para agrupar |
| Assert antes do Act nao e essencial | Remova para manter AAA limpo |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `Mock.Of<T>()` descartado sem verify | `new Mock<T>()` guardado para verificacao |
| `GoToAsync("..")` para fechar pagina | `ClosePage()` encapsulado no service |
| Assert de nulidade antes do Act sem necessidade | Apenas asserts apos o Act |
| `Verify` sem `Times` especifico | `Verify(..., Times.Once())` explicito |
| Instanciar ViewModel direto em cada teste | Factory method `CreateViewModel()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
