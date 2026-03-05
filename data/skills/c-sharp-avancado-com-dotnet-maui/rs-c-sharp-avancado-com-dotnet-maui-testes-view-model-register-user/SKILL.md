---
name: rs-csharp-maui-testes-vm-register
description: "Applies unit testing patterns for .NET MAUI ViewModels when writing tests for registration, authentication, or form-submission ViewModels in C#. Use when user asks to 'test a ViewModel', 'mock a use case', 'write unit tests for MAUI', 'test navigation commands', or 'verify StatusPage changes'. Enforces mock builder pattern with Result parameter, StatusPage assertions, and NavigationService verification. Make sure to use this skill whenever creating ViewModel tests in .NET MAUI projects. Not for integration tests, UI tests, or backend API testing."
---

# Testes de Unidade para ViewModels (.NET MAUI)

> Cada teste de ViewModel deve verificar navegacao, status da pagina e interacao com use cases atraves de mock builders que recebem o Result esperado como parametro.

## Rules

1. **Crie um Builder para cada Use Case mockado** — o builder encapsula o setup do mock e recebe o `Result` como parametro, porque o teste precisa controlar se o cenario e de sucesso ou erro
2. **Use `It.IsAny<T>()` quando o model nao influencia o resultado** — se o use case recebe um model mas o teste nao depende de valores especificos, faca vista grossa com `It.IsAny<T>()`, porque desacopla o teste do input
3. **Sempre verifique o StatusPage apos execucao do comando** — apos sucesso ou erro, o StatusPage deve voltar a `StatusPage.Default`, porque esquecer de resetar causa bugs visuais (loading infinito)
4. **Separe testes por cenario de resultado** — um teste para sucesso, um para erro, um para navegacao simples, porque cada cenario tem asserts diferentes
5. **Use `Result.Success()` como placeholder quando o resultado nao importa** — em testes de navegacao simples (ex: GoToLogin), passe sucesso para evitar criar mensagens de erro desnecessarias
6. **Verifique NavigationService com a rota exata** — use `Verify` com a sintaxe de rota completa (ex: `../LoginPage`), porque rotas erradas causam falhas silenciosas

## How to write

### Use Case Mock Builder

```csharp
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

### CreateViewModel helper no teste

```csharp
private (HasherUserAccountViewModel viewModel, Mock<INavigationService> nav) CreateViewModel(Result result)
{
    var navigation = NavigationServiceBuilder.Build();
    var useCase = HasherUserUseCaseBuilder.Build(result);
    var viewModel = new HasherUserAccountViewModel(navigation.Object, useCase);
    return (viewModel, navigation);
}
```

### Teste de navegacao simples (sem use case)

```csharp
[Fact]
public async Task SuccessGoToLogin()
{
    var (viewModel, navigationMock) = CreateViewModel(Result.Success());

    var act = async () => await viewModel.GoToLoginCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    navigationMock.Verify(nav => nav.GoToAsync("../LoginPage"), Times.Once);
}
```

### Teste de comando com resultado de sucesso

```csharp
[Fact]
public async Task RegisterAccountExecutedWithSuccess()
{
    var (viewModel, navigationMock) = CreateViewModel(Result.Success());

    var act = async () => await viewModel.RegisterAccountCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    navigationMock.Verify(nav => nav.GoToDashboardPage(), Times.Once);
}
```

## Example

**Before (mock inline sem builder, sem verificar StatusPage):**
```csharp
[Fact]
public async Task TestRegister()
{
    var mock = new Mock<IHasherUserUseCase>();
    mock.Setup(x => x.Execute(new UserHasherAccount("John", "j@j.com", "123")))
        .ReturnsAsync(Result.Success());
    var vm = new HasherUserAccountViewModel(navMock.Object, mock.Object);

    await vm.RegisterAccountCommand.ExecuteAsync(null);

    navMock.Verify(n => n.GoToDashboardPage());
    // StatusPage nao verificado — bug potencial
}
```

**After (com builder, It.IsAny, StatusPage verificado):**
```csharp
[Fact]
public async Task RegisterAccountExecutedWithSuccess()
{
    var (viewModel, navigationMock) = CreateViewModel(Result.Success());

    var act = async () => await viewModel.RegisterAccountCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    navigationMock.Verify(nav => nav.GoToDashboardPage(), Times.Once);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case recebe model mas teste nao depende dos valores | `It.IsAny<T>()` |
| Teste nao usa o use case (ex: navegacao simples) | Passe `Result.Success()` como placeholder |
| ViewModel troca StatusPage durante execucao | Assert que voltou a `StatusPage.Default` no final |
| Funcao navega para pagina de erro com parametros | Teste separado com verificacao do dicionario de parametros |
| Builder de use case precisa devolver resultado | Receba `Result` como parametro do `Build()` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `mock.Setup(x => x.Execute(new Model(...)))` com instancia especifica | `mock.Setup(x => x.Execute(It.IsAny<Model>()))` |
| Teste sem verificar StatusPage | `viewModel.StatusPage.Should().Be(StatusPage.Default)` |
| Mock inline no teste | Builder estatico reutilizavel |
| `Times.AtLeastOnce` para navegacao | `Times.Once` — navegacao deve ocorrer exatamente uma vez |
| Um unico teste para sucesso e erro | Testes separados por cenario de resultado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
