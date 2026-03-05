---
name: rs-csharp-maui-testes-vm-perfil
description: "Applies unit testing patterns for .NET MAUI ViewModels with multiple commands, mocks, and builders. Use when user asks to 'test a ViewModel', 'write unit tests for MAUI', 'test commands in ViewModel', 'mock use cases', or 'create test builders'. Covers builder pattern for test data, Bogus for fake data, result type inheritance in mocks, and multi-command ViewModel test organization. Make sure to use this skill whenever testing .NET MAUI ViewModels or creating test infrastructure with builders. Not for integration tests, UI tests, or non-MAUI .NET testing."
---

# Testes de Unidade para ViewModels .NET MAUI

> Organize testes de ViewModel por comando, use builders para dados de teste, e aproveite heranca de tipos Result para simplificar mocks.

## Rules

1. **Um teste por cenario, por comando** — cada comando da ViewModel (Initialize, UpdateProfile, ChangePassword) tem seus proprios testes de sucesso e erro, porque isso isola falhas e facilita manutencao
2. **Use Builders para gerar dados de teste** — nunca crie objetos de dominio inline com valores hardcoded, use Bogus + Builder pattern, porque dados randomicos revelam bugs que dados fixos escondem
3. **Aproveite heranca de Result** — se `Result<T>` herda de `Result`, passe `Result<T>` onde `Result` e esperado, porque a classe filha converte na classe mae (o contrario nao e verdade)
4. **Passe null para dependencias nao testadas** — ao testar um comando especifico, passe null para dependencias de outros comandos, porque isso documenta o escopo do teste
5. **Armazene dados gerados em variavel quando precisar fazer assert** — nao gere dados inline se voce precisa comparar propriedades depois, porque voce perde a referencia para comparacao
6. **Verifique 3 coisas em todo teste de comando** — nenhuma excecao lancada, StatusPage correto, e navegacao/feedback esperado, porque isso cobre comportamento, estado e efeito colateral

## How to write

### Builder de dados com Bogus

```csharp
// Em CommonTestUtilities/Models/UserBuilder.cs
public class UserBuilder
{
    public static User Build()
    {
        return new Faker<User>()
            .RuleFor(u => u.Name, f => f.Person.FirstName)
            .RuleFor(u => u.Email, f => f.Person.Email)
            .Generate();
    }
}
```

### Builder de UseCase com Result generico

```csharp
// Receba Result<User> para aproveitar heranca
public class GetUserProfileUseCaseBuilder
{
    private readonly Mock<IGetUserProfileUseCase> _mock;

    public GetUserProfileUseCaseBuilder()
    {
        _mock = new Mock<IGetUserProfileUseCase>();
    }

    public GetUserProfileUseCaseBuilder Build(Result<User> result)
    {
        _mock.Setup(u => u.Execute()).ReturnsAsync(result);
        return this;
    }

    public IGetUserProfileUseCase Object => _mock.Object;
}
```

### CreateViewModel com Result herdado

```csharp
private (UserProfileViewModel vm, Mock<INavigationService> nav) CreateViewModel(
    Result<User> result)
{
    var navMock = new Mock<INavigationService>();
    var updateUseCase = new UpdateUserUseCaseBuilder().Build(result).Object;
    var getProfileUseCase = new GetUserProfileUseCaseBuilder().Build(result).Object;

    var vm = new UserProfileViewModel(
        navMock.Object,
        getProfileUseCase,
        updateUseCase,
        null,  // ChangeUserPhotoUseCase — nao testado aqui
        null); // MediaPicker — nao testado aqui

    return (vm, navMock);
}
```

## Example

**Teste simples — comando que apenas navega:**
```csharp
[Fact]
public async Task Success_ChangePassword()
{
    var user = UserBuilder.Build();
    var (viewModel, navigationService) = CreateViewModel(Result<User>.Success(user));

    var act = async () => await viewModel.ChangePasswordCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    navigationService.VerifyGoTo("UserChangePasswordPage", Times.Once());
}
```

**Teste com verificacao de propriedades preenchidas:**
```csharp
[Fact]
public async Task Initialize_Execute_WithValidResult()
{
    // Armazene em variavel — voce precisa comparar depois
    var user = UserBuilder.Build();
    var (viewModel, _) = CreateViewModel(Result<User>.Success(user));

    var act = async () => await viewModel.InitializeCommand.ExecuteAsync(null);

    await act.Should().NotThrowAsync();
    viewModel.StatusPage.Should().Be(StatusPage.Default);
    viewModel.Model.Should().NotBeNull();
    viewModel.Model.Name.Should().Be(user.Name);
    viewModel.Model.Email.Should().Be(user.Email);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Comando so navega (ChangePassword) | Verifique VerifyGoTo uma vez |
| Comando com sucesso mostra feedback | Verifique ShowSuccessFeedback com texto exato |
| Comando com erro | Passe Result.Failure, verifique GoToPageWithErrors |
| Initialize preenche propriedades | Armazene user em variavel, compare campo a campo |
| UseCase retorna Result vs Result<T> | Use Result<T> no builder, heranca converte automaticamente |
| Dependencia nao relevante pro teste | Passe null no construtor da ViewModel |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|-------------|
| `new User { Name = "John", Email = "john@test.com" }` | `UserBuilder.Build()` com Bogus |
| Criar Result separado para cada UseCase builder | Um `Result<User>` reaproveitado via heranca |
| `UserBuilder.Build()` inline quando precisa comparar | `var user = UserBuilder.Build()` em variavel |
| Passar todas as dependencias reais | `null` para dependencias fora do escopo do teste |
| Testar todos os comandos em um unico metodo | Um metodo de teste por cenario por comando |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
