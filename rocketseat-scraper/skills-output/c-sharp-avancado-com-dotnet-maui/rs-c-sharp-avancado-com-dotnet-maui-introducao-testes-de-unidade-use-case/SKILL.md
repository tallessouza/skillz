---
name: rs-csharp-dotnet-maui-intro-testes-usecase
description: "Enforces mock-based unit testing patterns for use cases in C#/.NET projects using Moq library. Use when user asks to 'test a use case', 'create unit tests for business logic', 'mock a repository', 'write tests with Moq', or 'test service layer'. Applies rules: mock interfaces never classes, separate mocks by return type, test all conditional branches, isolate business logic from external dependencies. Make sure to use this skill whenever writing or reviewing use case unit tests in C#/.NET. Not for integration tests, API tests, or UI tests."
---

# Testes de Unidade para Use Cases com Mocks

> Teste a regra de negocio isoladamente — mock tudo que e externo ao use case, cubra todos os cenarios condicionais.

## Rules

1. **Mock apenas interfaces, nunca classes** — `new Mock<IRepository>()` nao `new Mock<Repository>()`, porque mocar classes exige modificadores de acesso especiais que poluem o codigo de producao por causa de teste
2. **Cubra todos os cenarios condicionais** — cada `if`, cada validacao, cada branch precisa de um teste dedicado, porque codigo nao testado e codigo que vai quebrar silenciosamente
3. **Isole a regra de negocio** — o teste nao deve depender de banco de dados, criptografia real, ou servicos externos, porque o objetivo e testar o comportamento do use case, nao das dependencias
4. **Separe mocks por tipo de retorno** — funcoes que nao retornam valor (void/Task) tem mock simples; funcoes que retornam valor precisam de `.Setup().ReturnsAsync()`, porque a sintaxe e diferente e a organizacao evita erros
5. **Reutilize builders entre testes** — crie builders no projeto CommonTestUtilities para requests e mocks, porque use cases diferentes compartilham as mesmas interfaces
6. **Respeite modificadores de acesso** — classes `internal` nao podem ser instanciadas fora do projeto, use mock da interface publica em vez de expor a classe, porque alterar visibilidade por causa de teste e design smell

## How to write

### Mock simples (funcao sem retorno)

```csharp
// Para interfaces cujas funcoes NAO devolvem valor (void/Task)
public static IUserWriteOnlyRepository Build()
{
    return new Mock<IUserWriteOnlyRepository>().Object;
}
```

### Mock inline (uma linha)

```csharp
// Quando o mock nao precisa de setup adicional
public static IUnitOfWork Build()
    => new Mock<IUnitOfWork>().Object;
```

### Builder organizado no CommonTestUtilities

```csharp
// CommonTestUtilities/Repositories/UserWriteOnlyRepositoryBuilder.cs
public class UserWriteOnlyRepositoryBuilder
{
    public static IUserWriteOnlyRepository Build()
        => new Mock<IUserWriteOnlyRepository>().Object;
}
```

### Instanciando o use case no teste

```csharp
var useCase = new RegisterUserUseCase(
    UserWriteOnlyRepositoryBuilder.Build(),
    UserReadOnlyRepositoryBuilder.Build(),
    UnitOfWorkBuilder.Build(),
    PasswordEncrypterBuilder.Build(),
    AccessTokenGeneratorBuilder.Build()
);
```

## Example

**Before (mock incorreto — instanciando classe direta):**
```csharp
// ERRADO: classe internal nao acessivel + acopla teste a implementacao
var encrypter = new BcryptNet();
var repo = new UserRepository(dbContext);
var useCase = new RegisterUserUseCase(repo, encrypter);
```

**After (mock correto via interface):**
```csharp
// CORRETO: mock da interface, isolado, sem dependencia externa
var useCase = new RegisterUserUseCase(
    UserWriteOnlyRepositoryBuilder.Build(),
    UserReadOnlyRepositoryBuilder.Build(),
    UnitOfWorkBuilder.Build(),
    PasswordEncrypterBuilder.Build(),
    AccessTokenGeneratorBuilder.Build()
);

// Teste de sucesso
var request = RegisterUserRequestBuilder.Build();
var act = async () => await useCase.Execute(request);
await act.Should().NotThrowAsync();

// Teste de falha (email duplicado)
await act.Should().ThrowAsync<BusinessException>()
    .WithMessage("Email ja esta registrado");
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Interface so tem funcoes void/Task | Mock simples: `new Mock<T>().Object` |
| Interface tem funcoes com retorno | Mock com `.Setup().Returns/ReturnsAsync()` |
| Classe e `internal` | Mock da interface publica, nunca exponha a classe |
| Builder sera usado por multiplos testes | Coloque em CommonTestUtilities |
| Use case tem N parametros no construtor | Crie N builders, um por interface |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `new Mock<ConcreteClass>()` | `new Mock<IInterface>()` |
| Passar `null` no construtor do use case | Criar mock builder para cada parametro |
| Mudar `internal` para `public` por causa de teste | Mocar a interface publica correspondente |
| Instanciar repositorio real no teste | `new Mock<IRepository>().Object` |
| Testar apenas o cenario de sucesso | Testar sucesso + cada branch condicional |
| Duplicar mocks em cada classe de teste | Centralizar builders em CommonTestUtilities |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
