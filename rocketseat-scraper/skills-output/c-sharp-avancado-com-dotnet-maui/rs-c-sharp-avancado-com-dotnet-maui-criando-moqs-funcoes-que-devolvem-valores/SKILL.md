---
name: rs-csharp-maui-mocks-return-values
description: "Enforces correct mock setup patterns for functions that return values in C# unit tests using Moq. Use when user asks to 'create a mock', 'setup test doubles', 'write unit tests', 'configure mock returns', or 'test a use case'. Applies rules: understand default return values by type, use Setup+ReturnsAsync for specific parameter matching, separate mock configuration from build in Builder pattern. Make sure to use this skill whenever writing C# unit tests with Moq or configuring mock repositories. Not for integration tests, real database testing, or non-Moq frameworks."
---

# Mocks para Funções que Devolvem Valores

> Ao configurar mocks em C#, entenda que funções sem retorno nao precisam de setup, mas funções com retorno exigem configuracao explicita quando o valor default do tipo nao atende o cenario de teste.

## Rules

1. **Funções void nao precisam de setup** — o mock simplesmente "executa" e o use case continua, porque nao ha valor de retorno para influenciar o fluxo
2. **Funções com retorno devolvem o default do tipo** — `bool` retorna `false`, `int` retorna `0`, objetos retornam `null`, porque o mock inicializa com `default(T)`
3. **Use `Setup` (sem 's') para configurar retornos** — `_mockRepository.Setup(r => r.Method())`, porque `Setups` (com 's') e outra coisa no Moq
4. **Seja especifico nos parametros** — configure o mock para retornar valor apenas quando receber exatamente o parametro esperado, porque isso simula o comportamento real do repositorio
5. **Use `ReturnsAsync` para Tasks** — se a funcao retorna `Task<T>`, use `.ReturnsAsync(value)`, porque `.Returns()` e para retornos sincronos
6. **Separe configuracao do build no Builder** — crie metodos publicos para cada configuracao de mock e mantenha `Build()` apenas para devolver o `Object`, porque diferentes testes precisam de configuracoes diferentes

## How to write

### Builder com mock configuravel

```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mockRepository;

    public UserReadOnlyRepositoryBuilder()
    {
        _mockRepository = new Mock<IUserReadOnlyRepository>();
    }

    // Metodo de configuracao — chamado apenas quando o teste precisa
    public void ExistActiveUserWithEmail(string email)
    {
        _mockRepository.Setup(repository =>
            repository.ExistActiveUserWithEmail(email))
            .ReturnsAsync(true);
    }

    // Build devolve a implementacao fake
    public IUserReadOnlyRepository Build() => _mockRepository.Object;
}
```

### Reaproveitando codigo sem reaproveitar instancias

```csharp
public class RegisterUserUseCaseTest
{
    // Reusa CODIGO, nao instancias — sempre retorna new
    private RegisterUserUseCase CreateUseCase(string? emailAlreadyExists = null)
    {
        var userReadOnlyRepository = new UserReadOnlyRepositoryBuilder();

        if (!string.IsNullOrEmpty(emailAlreadyExists))
        {
            userReadOnlyRepository.ExistActiveUserWithEmail(emailAlreadyExists);
        }

        return new RegisterUserUseCase(
            null, // unitOfWork
            null, // writeOnlyRepository
            userReadOnlyRepository.Build(),
            null, // other dependency
            null  // other dependency
        );
    }

    [Fact]
    public async Task Success()
    {
        // Nao configura mock — default bool (false) simula "nenhum usuario existe"
        var useCase = CreateUseCase();
        // Act & Assert...
    }
}
```

## Example

**Before (configuracao rigida no Builder):**
```csharp
public class UserReadOnlyRepositoryBuilder
{
    public static IUserReadOnlyRepository Build()
    {
        var mock = new Mock<IUserReadOnlyRepository>();
        // Sempre configura — mesmo quando o teste nao precisa
        mock.Setup(r => r.ExistActiveUserWithEmail("fixed@email.com"))
            .ReturnsAsync(true);
        return mock.Object;
    }
}
```

**After (configuracao flexivel por cenario):**
```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mockRepository;

    public UserReadOnlyRepositoryBuilder()
    {
        _mockRepository = new Mock<IUserReadOnlyRepository>();
    }

    public void ExistActiveUserWithEmail(string email)
    {
        _mockRepository.Setup(r => r.ExistActiveUserWithEmail(email))
            .ReturnsAsync(true);
    }

    public IUserReadOnlyRepository Build() => _mockRepository.Object;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao void no mock | Nao configure nada — mock executa silenciosamente |
| Funcao retorna bool e voce quer false | Nao configure — false e o default |
| Funcao retorna objeto e voce espera null | Nao configure — null e o default |
| Funcao retorna valor especifico para parametro X | Use `Setup` com parametro exato + `ReturnsAsync` |
| Varios testes com configuracoes diferentes | Use Builder com metodos de configuracao + parametro opcional em `CreateUseCase` |
| Builder so devolve mock sem configuracao | Use metodo `Build()` estatico (pattern simples) |
| Builder precisa configurar comportamento | Use construtor + metodos + `Build()` de instancia |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `mock.Setups(...)` (com 's') | `mock.Setup(...)` (sem 's') |
| `.Returns(true)` para funcao async | `.ReturnsAsync(true)` |
| Hardcodar email fixo no Builder | Receber email como parametro |
| Reaproveitar instancia de UseCase entre testes | Criar nova instancia em cada teste via factory method |
| Configurar mock para retornar default | Nao configurar — mock ja retorna default |
| Builder estatico quando precisa de configuracao variavel | Builder com construtor e metodos de instancia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
