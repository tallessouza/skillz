# Code Examples: Testes de Unidade no Backend .NET

## Estrutura completa da Solution

```
PlanShare.sln
├── src/
│   ├── Backend/
│   │   ├── PlanShare.Api/
│   │   ├── PlanShare.Application/
│   │   └── PlanShare.Communication/
│   │       └── Requests/
│   │           └── RequestRegisterUserJson.cs
│   ├── Mobile/
│   └── Shared/
└── tests/
    └── Backend/
        ├── CommonTestUtilities/
        │   ├── CommonTestUtilities.csproj
        │   └── Requests/
        │       └── RequestRegisterUserBuilder.cs
        └── Validators.Tests/
            └── Validators.Tests.csproj
```

## RequestRegisterUserBuilder completo

```csharp
using Bogus;
using PlanShare.Communication.Requests;

namespace CommonTestUtilities.Requests;

public class RequestRegisterUserBuilder
{
    public static RequestRegisterUserJson Build()
    {
        return new Faker<RequestRegisterUserJson>()
            .RuleFor(user => user.Name, f => f.Person.FirstName)
            .RuleFor(user => user.Email, (f, user) => f.Internet.Email(user.Name))
            .RuleFor(user => user.Password, f => f.Internet.Password());
    }
}
```

## Criacao dos projetos via Visual Studio

### CommonTestUtilities (Class Library)
1. Botao direito na pasta Backend (dentro de tests) → Add → New Project
2. Selecionar **Class Library**
3. Nome: `CommonTestUtilities`
4. Location: apontar para `tests/Backend/`
5. .NET version: 9
6. Instalar NuGet packages: **Moq** e **Bogus**
7. Adicionar project reference: **Communication** (para acessar os tipos de request)

### Validators.Tests (xUnit)
1. Botao direito na pasta Backend (dentro de tests) → Add → New Project
2. Selecionar **xUnit Test Project**
3. Nome: `Validators.Tests`
4. Location: apontar para `tests/Backend/`
5. .NET version: 9
6. Deletar a classe default gerada
7. Instalar NuGet package: **Shouldly**
8. Adicionar project reference: **CommonTestUtilities**

## NuGet packages e versoes

```bash
# No projeto CommonTestUtilities
NuGet\Install-Package Moq -Version 4.20.72
NuGet\Install-Package Bogus -Version 35.6.4

# No projeto Validators.Tests
NuGet\Install-Package Shouldly -Version 4.3.0
```

## Variacoes do Faker para outros builders

### Builder para login
```csharp
public class RequestLoginBuilder
{
    public static RequestLoginJson Build()
    {
        return new Faker<RequestLoginJson>()
            .RuleFor(user => user.Email, f => f.Internet.Email())
            .RuleFor(user => user.Password, f => f.Internet.Password());
    }
}
```

### Builder para update de perfil
```csharp
public class RequestUpdateProfileBuilder
{
    public static RequestUpdateProfileJson Build()
    {
        return new Faker<RequestUpdateProfileJson>()
            .RuleFor(user => user.Name, f => f.Person.FullName)
            .RuleFor(user => user.Email, (f, user) => f.Internet.Email(user.Name));
    }
}
```

### Password com requisitos especificos
```csharp
// Password com no minimo 10 caracteres
.RuleFor(user => user.Password, f => f.Internet.Password(length: 10))

// Parametros disponiveis em Password():
// length (int = 10) - tamanho minimo
// memorable (bool = false) - facil de lembrar
// regexPattern (string) - seguir padrao regex
// prefix (string) - prefixo fixo
```

## Uso do builder nos testes (preview)

```csharp
[Fact]
public void Success()
{
    // Arrange
    var request = RequestRegisterUserBuilder.Build();

    var validator = new RegisterUserValidator();

    // Act
    var result = validator.Validate(request);

    // Assert (com Shouldly)
    result.IsValid.ShouldBeTrue();
}
```