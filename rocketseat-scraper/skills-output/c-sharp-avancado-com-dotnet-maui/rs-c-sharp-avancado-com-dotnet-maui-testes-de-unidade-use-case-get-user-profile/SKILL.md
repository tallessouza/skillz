---
name: rs-csharp-maui-test-usecase-profile
description: "Applies unit testing patterns for simple use cases in C#/.NET projects. Use when user asks to 'test a use case', 'write unit test for service', 'test simple method', 'mock interface for testing', or 'create test for profile/get endpoint'. Enforces single-scenario testing when business logic has no failure paths, proper mock builder patterns, and transitive dependency awareness. Make sure to use this skill whenever writing unit tests for use cases that delegate validation upstream. Not for integration tests, API endpoint tests, or testing validation/exception scenarios."
---

# Testes de Unidade para UseCases Simples

> Quando um use case nao possui caminhos de falha proprios, teste apenas o cenario de sucesso — validacoes anteriores ja cobrem o resto.

## Rules

1. **Identifique a quantidade real de cenarios** — se o use case so transforma dados sem validacao propria, existe apenas o cenario de sucesso, porque validacoes (token, existencia do usuario) aconteceram antes
2. **Crie Builders para mocks de interfaces** — nunca instancie mocks inline no teste; crie uma classe Builder separada que recebe a entidade como parametro e devolve o mock configurado
3. **Passe a entidade esperada para o Builder** — o teste controla qual entidade o mock devolve, permitindo asserts precisos comparando input vs output
4. **Mantenha estrutura de pastas espelhada** — a pasta de testes replica a estrutura do projeto principal (UseCase/User/Profile/ → Tests/UseCase/User/Profile/)
5. **Crie Builders para entidades com Bogus** — use Bogus/AutoFaker para gerar dados fake, ignorando campos que a entidade base ja inicializa automaticamente
6. **Aproveite referencias transitivas** — se Tests referencia Application e Application referencia Domain, Tests ja acessa Domain sem dependencia direta

## How to write

### Builder para mock de interface

```csharp
public class LoggedUserBuilder
{
    public static ILoggedUser Build(User user)
    {
        var mock = new Mock<ILoggedUser>();

        mock.Setup(loggedUser => loggedUser.Get())
            .ReturnsAsync(user);

        return mock.Object;
    }
}
```

### Builder para entidade com Bogus

```csharp
public class UserBuilder
{
    public static User Build()
    {
        return new Faker<User>()
            .RuleFor(u => u.Name, f => f.Person.FullName)
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Password, f => f.Internet.Password())
            .Generate();
    }
}
```

### Teste de use case com cenario unico

```csharp
public class GetUserProfileUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var user = UserBuilder.Build();
        var useCase = CreateUseCase(user);

        var response = await useCase.Execute();

        response.Should().NotBeNull();
        response.Name.Should().Be(user.Name);
        response.Email.Should().Be(user.Email);
    }

    private GetUserProfileUseCase CreateUseCase(User user)
    {
        var loggedUser = LoggedUserBuilder.Build(user);
        return new GetUserProfileUseCase(loggedUser);
    }
}
```

## Example

**Before (mock inline, sem controle da entidade):**
```csharp
[Fact]
public async Task TestGetProfile()
{
    var mock = new Mock<ILoggedUser>();
    // mock.Get() retorna null — sem setup
    var useCase = new GetUserProfileUseCase(mock.Object);
    var result = await useCase.Execute();
    Assert.NotNull(result); // FALHA — retornou null
}
```

**After (Builder com entidade controlada):**
```csharp
[Fact]
public async Task Success()
{
    var user = UserBuilder.Build();
    var useCase = CreateUseCase(user);

    var response = await useCase.Execute();

    response.Should().NotBeNull();
    response.Name.Should().Be(user.Name);
    response.Email.Should().Be(user.Email);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case so mapeia/transforma dados | Teste apenas cenario de sucesso |
| Use case tem validacoes proprias (if/throw) | Teste sucesso + cada cenario de falha |
| Mock precisa devolver entidade especifica | Builder recebe entidade como parametro |
| Entidade tem classe base com campos auto-init | Ignore esses campos no Builder, foque nos campos proprios |
| Senha nao e relevante para o teste atual | Use password fake plaintext, ajuste quando testar integracao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Mock inline sem setup (retorna null) | Builder com `.Setup().ReturnsAsync(entity)` |
| `new User { Name = "test" }` hardcoded | `UserBuilder.Build()` com Bogus |
| Testar validacao de token no use case | Teste de integracao separado para token |
| Adicionar referencia direta a Domain em Tests | Aproveitar referencia transitiva via Application |
| Verificar `if (user == null)` no use case | Confiar nas validacoes upstream (token, middleware) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
