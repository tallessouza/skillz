---
name: rs-csharp-dotnet-maui-teste-sucesso-usecase
description: "Enforces unit test patterns for use case success scenarios in C#/.NET projects using Moq and Shouldly. Use when user asks to 'write unit tests', 'test a use case', 'create mocks', 'setup test dependencies', or 'assert results'. Applies patterns: builder pattern for mocks, It.IsAny for irrelevant parameters, Returns vs ReturnsAsync based on sync/async, Shouldly assertions for result validation. Make sure to use this skill whenever creating unit tests for use cases or service layers in .NET. Not for integration tests, API tests, or database tests."
---

# Testes de Sucesso para UseCase

> Organize mocks com builder pattern, configure apenas o necessario para o cenario, e valide resultados com assertions especificos.

## Rules

1. **Use builder pattern para mocks** — crie classes `{InterfaceName}Builder` em `CommonTestUtilities`, porque permite reutilizar mocks entre diferentes testes
2. **Use `It.IsAny<T>()` quando o valor do parametro nao importa** — `encrypter.Setup(e => e.Encrypt(It.IsAny<string>()))`, porque em mocks nao precisamos ser especificos sobre valores irrelevantes ao cenario
3. **Use `Returns` para funcoes sincronas e `ReturnsAsync` para funcoes assincronas** — verifique se o retorno e `Task<T>` ou `T` direto, porque usar o errado causa erro de compilacao
4. **Configure mocks no construtor do builder quando o comportamento e fixo** — setup de `Encrypt` sempre retorna mesma string, porque simplifica o uso do builder
5. **Faca assertions incrementais** — primeiro `result.ShouldNotBeNull()`, depois propriedades especificas, porque garante mensagens de erro claras quando o teste falha
6. **Metodos estaticos `Build()` quando nao ha configuracao variavel** — `UnitOfWorkBuilder.Build()` direto sem instancia, porque nao ha estado para configurar

## How to write

### Builder para mock com comportamento fixo

```csharp
public class PasswordEncrypterBuilder
{
    private readonly IPasswordEncrypter _passwordEncrypter;

    public PasswordEncrypterBuilder()
    {
        var mock = new Mock<IPasswordEncrypter>();
        mock.Setup(e => e.Encrypt(It.IsAny<string>()))
            .Returns("PasswordEncrypted");
        _passwordEncrypter = mock.Object;
    }

    public IPasswordEncrypter Build() => _passwordEncrypter;
}
```

### Builder para mock assincrono com It.IsAny

```csharp
public class TokenServiceBuilder
{
    public static ITokenService Build()
    {
        var mock = new Mock<ITokenService>();
        mock.Setup(ts => ts.GenerateTokens(It.IsAny<User>()))
            .ReturnsAsync(new TokensDTO
            {
                AccessToken = "MockAccessToken",
                RefreshToken = "MockRefreshToken"
            });
        return mock.Object;
    }
}
```

### Teste de sucesso para UseCase

```csharp
[Fact]
public async Task Success()
{
    var request = RequestRegisterUserBuilder.Build();
    var useCase = CreateUseCase();

    var result = await useCase.Execute(request);

    result.ShouldNotBeNull();
    result.Name.Should().Be(request.Name);
}

private RegisterUserUseCase CreateUseCase()
{
    var unitOfWork = UnitOfWorkBuilder.Build();
    var userWriteOnlyRepository = UserWriteOnlyRepositoryBuilder.Build();
    var readOnlyRepository = new UserReadOnlyRepositoryBuilder();
    var passwordEncrypter = new PasswordEncrypterBuilder().Build();
    var tokenService = TokenServiceBuilder.Build();

    return new RegisterUserUseCase(
        unitOfWork,
        userWriteOnlyRepository,
        readOnlyRepository.Build(),
        passwordEncrypter,
        tokenService
    );
}
```

## Example

**Before (mocks inline, sem organizacao):**

```csharp
[Fact]
public async Task Success()
{
    var mock1 = new Mock<IUnitOfWork>();
    var mock2 = new Mock<IUserWriteOnlyRepository>();
    var mock3 = new Mock<IPasswordEncrypter>();
    mock3.Setup(x => x.Encrypt("senha123")).Returns("encrypted");
    var mock4 = new Mock<ITokenService>();
    mock4.Setup(x => x.GenerateTokens(It.IsAny<User>()))
        .ReturnsAsync(new TokensDTO { AccessToken = "t", RefreshToken = "r" });

    var useCase = new RegisterUserUseCase(
        mock1.Object, mock2.Object, null, mock3.Object, mock4.Object);

    var result = await useCase.Execute(new RequestRegisterUserJson { Name = "Test" });
    Assert.NotNull(result);
}
```

**After (builders reutilizaveis, assertions com Shouldly):**

```csharp
[Fact]
public async Task Success()
{
    var request = RequestRegisterUserBuilder.Build();
    var useCase = CreateUseCase();

    var result = await useCase.Execute(request);

    result.ShouldNotBeNull();
    result.Name.Should().Be(request.Name);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mock nunca muda comportamento entre testes | Metodo estatico `Build()` sem instancia |
| Mock precisa de configuracao condicional | Instancie o builder, configure, depois `.Build()` |
| Funcao retorna `Task<T>` | Use `.ReturnsAsync(value)` |
| Funcao retorna `T` direto | Use `.Returns(value)` |
| Parametro do mock nao importa pro teste | Use `It.IsAny<T>()` |
| Parametro do mock importa (ex: email exists) | Passe o valor exato no `.Setup()` |
| Primeiro assertion do teste | Sempre `ShouldNotBeNull()` antes de acessar propriedades |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Mocks inline no metodo de teste | Builders em `CommonTestUtilities` |
| `Assert.NotNull(result)` sem Shouldly | `result.ShouldNotBeNull()` |
| Valor hardcoded no setup quando nao importa | `It.IsAny<string>()` |
| `ReturnsAsync` em funcao sincrona | `Returns` para funcoes que retornam `T` direto |
| Null nos parametros do construtor do UseCase | Mock builder para cada dependencia |
| Request criada manualmente no teste | `RequestBuilder.Build()` usando Bogus |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
