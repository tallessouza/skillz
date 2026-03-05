---
name: rs-csharp-dotnet-maui-unit-test-usecase
description: "Applies unit testing patterns for C# Use Cases with mocks, builders, and FluentAssertions. Use when user asks to 'write unit tests', 'test a use case', 'mock repository', 'test void methods', or 'create test builders' in C#/.NET projects. Covers mock builder decisions (static vs instance), reference type assertions, ShouldNotThrowAsync for void returns, and builder reuse. Make sure to use this skill whenever writing or reviewing C# unit tests for use cases. Not for integration tests, API tests, or frontend testing."
---

# Testes de Unidade para UseCases C#

> Cada UseCase precisa de builders para todos os parametros do construtor, e cada teste valida um unico cenario de negocio.

## Rules

1. **Analise o construtor do UseCase primeiro** — identifique todos os parametros e verifique se ja existem builders/mocks para cada um, porque um mock faltando quebra todos os testes
2. **Decida o tipo de builder pela interface** — se a interface so tem metodos void, use `Build()` estatico simples; se tem metodos que retornam valor, o mock precisa de setup com `ReturnsAsync`, porque o teste precisa controlar o retorno
3. **Metodos void nao precisam de setup no mock** — `void Update(User user)` nao precisa de configuracao porque nao devolve nada e nao afeta o fluxo do teste
4. **Use `ShouldNotThrowAsync` para UseCase que retorna Task** — porque voce nao pode fazer assert no retorno de um void, entao valide que nao lancou excecao
5. **Explore referencia de objetos para assertions** — objetos passados como parametro vao por referencia em C#, entao apos executar o UseCase, verifique se as propriedades do objeto original foram alteradas corretamente
6. **Um teste = um cenario de negocio** — sucesso, erro de validacao, e-mail duplicado sao testes separados, porque cada cenario testa um branch diferente do codigo

## How to write

### Builder para repositorio com retorno (GetById)

```csharp
public class UserUpdateOnlyRepositoryBuilder
{
    public static IUserUpdateOnlyRepository Build(User user)
    {
        var mock = new Mock<IUserUpdateOnlyRepository>();

        mock.Setup(r => r.GetById(user.Id)).ReturnsAsync(user);

        return mock.Object;
    }
}
```

### Teste de sucesso para UseCase void

```csharp
[Fact]
public async Task Success()
{
    var user = UserBuilder.Build();
    var request = RequestUpdateUserBuilder.Build();

    var useCase = CreateUseCase(user);

    Func<Task> act = async () => await useCase.Execute(request);

    await act.Should().NotThrowAsync();

    // Assert por referencia: o UseCase alterou o objeto original
    user.Name.Should().Be(request.Name);
    user.Email.Should().Be(request.Email);
}
```

### Teste de e-mail duplicado

```csharp
[Fact]
public async Task Error_Email_Already_Exists()
{
    var user = UserBuilder.Build();
    var request = RequestUpdateUserBuilder.Build();

    var useCase = CreateUseCase(user, emailAlreadyExist: request.Email);

    Func<Task> act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<OnValidationException>();
    exception.Where(e => e.Errors.Contains("Email already exists"));
}
```

### Teste de erro de validacao

```csharp
[Fact]
public async Task Error_Name_Empty()
{
    var user = UserBuilder.Build();
    var request = RequestUpdateUserBuilder.Build();
    request.Name = string.Empty;

    var useCase = CreateUseCase(user);

    Func<Task> act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<OnValidationException>();
    exception.Where(e => e.Errors.Contains("Name cannot be empty"));
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Interface so tem metodos void | Builder estatico simples, sem setup de retorno |
| Interface tem metodos com retorno | Setup com `ReturnsAsync` no mock |
| UseCase retorna Task (void) | Use `ShouldNotThrowAsync` + assertions por referencia |
| UseCase retorna Task<T> | Use `act.Should().NotThrowAsync()` e verifique o resultado |
| Entidade ja validada em camadas anteriores (token, auth) | Nao precisa testar cenario de entidade nula no UseCase |
| Mesmo builder ja existe para interface similar | Reutilize o padrao, mude apenas tipos e metodos |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Criar mock para metodo void com setup | Deixe sem setup — void nao precisa |
| Testar multiplos cenarios no mesmo teste | Um `[Fact]` por cenario |
| Ignorar assertions por referencia em UseCase void | Verifique se propriedades do objeto mudaram |
| Chamar `await useCase.Execute()` direto no assert | Guarde em `Func<Task> act` e use `Should().NotThrowAsync()` |
| Duplicar builder quando ja existe para interface similar | Copie o padrao existente e ajuste tipos |
| Testar entidade nula quando camadas anteriores ja validam | Confie nas validacoes de autenticacao/middleware |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
