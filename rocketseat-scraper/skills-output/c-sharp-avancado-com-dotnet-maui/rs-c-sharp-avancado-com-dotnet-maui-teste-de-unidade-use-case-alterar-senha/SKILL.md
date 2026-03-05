---
name: rs-csharp-teste-unidade-alterar-senha
description: "Enforces C# unit testing patterns for use cases with encrypted passwords and internal class access. Use when user asks to 'write unit tests', 'test a use case', 'access internal classes in tests', 'test password change', or 'replace mock with real implementation'. Applies InternalsVisibleTo attribute, real implementation over mocks when no DI needed, tuple returns for test builders, and password match test scenarios. Make sure to use this skill whenever writing C# unit tests that involve encryption, internal classes, or multi-scenario use case coverage. Not for integration tests, API endpoint tests, or frontend testing."
---

# Testes de Unidade com Classes Internas e Implementacoes Reais

> Substitua mocks por implementacoes reais quando a classe nao depende de injecao de dependencia, e use InternalsVisibleTo para acessar classes internal nos testes.

## Rules

1. **Use implementacao real quando nao ha DI** — se a classe nao recebe dependencias no construtor (ex: BcryptNet), faca `new` direto ao inves de mock, porque mock adiciona complexidade desnecessaria e nao testa o comportamento real
2. **Nunca mude modificador de acesso para testes** — classes `internal` devem permanecer `internal`, porque alterar para `public` quebra encapsulamento e expoe implementacao que deveria ser protegida
3. **Use InternalsVisibleTo acima do namespace** — o atributo `[assembly: InternalsVisibleTo("ProjectName")]` deve ficar ACIMA do namespace, nunca acima da classe, senao nao funciona
4. **Retorne tuplas nomeadas nos builders** — quando o teste precisa tanto da entidade quanto de um valor auxiliar (ex: senha em texto), retorne `(User user, string password)` ao inves de criar estruturas complexas
5. **Cubra todos os cenarios do use case** — mapeie cada branch do codigo: sucesso, falha de validacao, e falha de regra de negocio (ex: senha nao confere)
6. **Assert alem do obvio** — no cenario de sucesso, verifique que o estado mudou (ex: hash da senha apos alteracao deve ser diferente do anterior), porque entidades sao passadas por referencia

## How to write

### InternalsVisibleTo (acima do namespace)

```csharp
// No projeto de infraestrutura, arquivo da classe internal
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("MeuProjeto.CommonTestUtilities")]

namespace MeuProjeto.Infrastructure.Security.Cryptography;

internal class BcryptNet : IPasswordEncrypter
{
    // implementacao permanece internal
}
```

### Builder com implementacao real (sem mock)

```csharp
public class PasswordEncrypterBuilder
{
    public static IPasswordEncrypter Build() => new BcryptNet();
}
```

### Builder retornando tupla nomeada

```csharp
public static (User user, string password) Build()
{
    var faker = new Faker();
    var password = faker.Internet.Password();
    var passwordEncrypter = PasswordEncrypterBuilder.Build();

    var user = new Faker<User>()
        .RuleFor(u => u.Name, f => f.Person.FullName)
        .RuleFor(u => u.Email, f => f.Internet.Email())
        .RuleFor(u => u.Password, _ => passwordEncrypter.Encrypt(password))
        .Generate();

    return (user, password);
}
```

### Tres cenarios de teste para ChangePassword

```csharp
// Sucesso: senha atual correta + nova senha valida
[Fact]
public async Task Success()
{
    var (user, password) = UserBuilder.Build();
    var request = new RequestChangePassword
    {
        Password = password, // senha real que gerou o hash
        NewPassword = "NovaSenha123!"
    };

    var currentPasswordHash = user.Password;
    await _useCase.Execute(request);

    user.Password.Should().NotBe(currentPasswordHash);
}

// Falha: nova senha vazia (validator rejeita)
[Fact]
public async Task Error_NewPassword_Empty()
{
    var (user, password) = UserBuilder.Build();
    var request = new RequestChangePassword
    {
        Password = password,
        NewPassword = string.Empty
    };

    var act = async () => await _useCase.Execute(request);
    await act.Should().ThrowAsync<ErrorOnValidationException>();
}

// Falha: senha atual nao confere
[Fact]
public async Task Error_Password_Different()
{
    var (user, _) = UserBuilder.Build(); // ignora password real
    var request = RequestChangePasswordBuilder.Build();
    // request.Password gerado pelo builder NAO confere com user.Password

    var act = async () => await _useCase.Execute(request);
    await act.Should().ThrowAsync<ErrorOnValidationException>();
}
```

## Example

**Before (mock desnecessario):**
```csharp
public class PasswordEncrypterBuilder
{
    private readonly Mock<IPasswordEncrypter> _mock = new();

    public PasswordEncrypterBuilder IsValid(string password)
    {
        _mock.Setup(x => x.IsValid(password, It.IsAny<string>())).Returns(true);
        return this;
    }

    public IPasswordEncrypter Build() => _mock.Object;
}
```

**After (implementacao real):**
```csharp
public class PasswordEncrypterBuilder
{
    public static IPasswordEncrypter Build() => new BcryptNet();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Classe sem dependencias no construtor | Use `new` real, nao mock |
| Classe marcada como `internal` | Use `InternalsVisibleTo`, nunca mude para `public` |
| Teste precisa de entidade + valor auxiliar | Retorne tupla nomeada `(Entity entity, string value)` |
| Use case com validacao + regra de negocio | Crie minimo 3 testes: sucesso, falha validacao, falha regra |
| Entidade passada por referencia | Assert que estado mudou apos execucao |
| Variavel de retorno nao necessaria | Use `_` para ignorar (ex: `var (user, _) = ...`) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `public class BcryptNet` (para testes) | `[assembly: InternalsVisibleTo("Tests")]` + `internal class BcryptNet` |
| `[assembly: ...]` acima da classe | `[assembly: ...]` acima do namespace |
| Mock de classe sem dependencias | `new BcryptNet()` direto |
| Retornar so a entidade quando teste precisa da senha | Retornar `(User user, string password)` |
| Testar so cenario de sucesso | Cobrir sucesso + falha validacao + falha regra de negocio |
| Assert apenas que nao lancou excecao | Assert que o estado da entidade mudou (ex: senha diferente) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
