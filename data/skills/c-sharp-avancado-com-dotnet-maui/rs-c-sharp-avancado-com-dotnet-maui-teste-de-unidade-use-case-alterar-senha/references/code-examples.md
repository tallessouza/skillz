# Code Examples: Testes de Unidade com Classes Internas e Implementacoes Reais

## 1. BcryptNet — classe internal com InternalsVisibleTo

```csharp
// Arquivo: PlanShare.Infrastructure/Security/Cryptography/BcryptNet.cs
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("CommonTestUtilities")]

namespace PlanShare.Infrastructure.Security.Cryptography;

internal class BcryptNet : IPasswordEncrypter
{
    public string Encrypt(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool IsValid(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
```

**Ponto critico**: O `[assembly: InternalsVisibleTo(...)]` fica ACIMA do `namespace`. Se colocar acima da classe, nao funciona. Libera todo o namespace para o projeto especificado.

## 2. PasswordEncrypterBuilder — antes e depois

### Antes (com mock):
```csharp
public class PasswordEncrypterBuilder
{
    private readonly Mock<IPasswordEncrypter> _mock = new();

    public PasswordEncrypterBuilder IsValid(string password)
    {
        _mock.Setup(x => x.IsValid(password, It.IsAny<string>())).Returns(true);
        return this;
    }

    public IPasswordEncrypter Build()
    {
        return _mock.Object;
    }
}
```

### Depois (implementacao real):
```csharp
public class PasswordEncrypterBuilder
{
    public static IPasswordEncrypter Build() => new BcryptNet();
}
```

Note que a funcao agora e `static` — nao precisa instanciar o builder, pois nao ha configuracao de mock.

## 3. UserBuilder — retornando tupla nomeada

### Antes:
```csharp
public static User Build()
{
    var user = new Faker<User>()
        .RuleFor(u => u.Password, f => f.Internet.Password())
        .Generate();

    return user;
}
```

### Depois:
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

**Por que extrair `password` para variavel?** Porque precisamos do valor em texto para enviar no request, e o valor criptografado vai para a entidade. Se usassemos `f.Internet.Password()` direto no `RuleFor`, perderiamos o valor original.

## 4. Desestruturacao de tupla nos testes

```csharp
// Quando precisa dos dois valores
var (user, password) = UserBuilder.Build();

// Quando so precisa da entidade
var (user, _) = UserBuilder.Build();
```

## 5. Teste completo — cenario de sucesso

```csharp
[Fact]
public async Task Success()
{
    var (user, password) = UserBuilder.Build();

    var request = new RequestChangePassword
    {
        Password = password,           // senha real em texto
        NewPassword = "NovaSenhaSegura123!"
    };

    // Salva hash atual ANTES de executar
    var currentPasswordHash = user.Password;

    await _useCase.Execute(request);

    // Assert 1: nao lancou excecao (implicito)
    // Assert 2: senha foi realmente alterada
    user.Password.Should().NotBe(currentPasswordHash);
}
```

## 6. Teste completo — nova senha vazia (falha de validacao)

```csharp
[Fact]
public async Task Error_NewPassword_Empty()
{
    var (user, password) = UserBuilder.Build();

    var request = new RequestChangePassword
    {
        Password = password,
        NewPassword = string.Empty   // forca falha no validator
    };

    var act = async () => await _useCase.Execute(request);

    await act.Should().ThrowAsync<ErrorOnValidationException>();
}
```

## 7. Teste completo — senha atual incorreta (falha de match)

```csharp
[Fact]
public async Task Error_Password_Different()
{
    var (user, _) = UserBuilder.Build();  // ignora senha real

    // Builder gera senha aleatoria que NAO confere com user.Password
    var request = RequestChangePasswordBuilder.Build();

    var act = async () => await _useCase.Execute(request);

    await act.Should().ThrowAsync<ErrorOnValidationException>();
}
```

## 8. Correcao nos outros testes que usam UserBuilder

Todos os testes que usavam `var user = UserBuilder.Build()` precisam ser atualizados:

```csharp
// Antes
var user = UserBuilder.Build();

// Depois (quando nao precisa da senha)
var (user, _) = UserBuilder.Build();
```

## 9. Referencia do projeto de teste

Para que `CommonTestUtilities` acesse classes de `Infrastructure`, adicione a referencia de projeto:

```
CommonTestUtilities → Dependencies → Project References → Infrastructure ✓
```

Sem essa referencia, mesmo com `InternalsVisibleTo`, o `using` nao resolve.