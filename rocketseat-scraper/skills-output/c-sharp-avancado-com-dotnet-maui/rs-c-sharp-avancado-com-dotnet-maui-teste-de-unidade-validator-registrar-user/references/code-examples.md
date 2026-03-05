# Code Examples: Testes de Unidade para Validators

## Classe validator sendo testada

```csharp
// PlanShare.Application/Validators/RegisterUserValidator.cs
public class RegisterUserValidator : AbstractValidator<RequestRegisterUserJson>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(ResourceErrorMessages.NAME_EMPTY);

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage(ResourceErrorMessages.EMAIL_EMPTY);

        RuleFor(x => x.Password)
            // regras de senha...
            ;

        When(x => !string.IsNullOrEmpty(x.Email), () =>
        {
            RuleFor(x => x.Email)
                .EmailAddress()
                .WithMessage(ResourceErrorMessages.EMAIL_INVALID);
        });
    }
}
```

## Builder de request (Common Test Utilities)

```csharp
// CommonTestUtilities/Builders/RequestRegisterUserBuilder.cs
public static class RequestRegisterUserBuilder
{
    public static RequestRegisterUserJson Build()
    {
        // Usa Bogus para gerar dados aleatorios
        // Cada chamada retorna valores diferentes (Mercedes, Jessica, etc.)
        return new Faker<RequestRegisterUserJson>()
            .RuleFor(x => x.Name, f => f.Person.FirstName)
            .RuleFor(x => x.Email, f => f.Internet.Email())
            .RuleFor(x => x.Password, f => f.Internet.Password())
            .Generate();
    }
}
```

## Teste de sucesso completo

```csharp
[Fact]
public void Success()
{
    // Arrange
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();

    // Act
    var result = validator.Validate(request);

    // Assert
    result.IsValid.ShouldBeTrue();
}
```

## Teste de erro com verificacao de mensagem

```csharp
[Fact]
public void Error_Name_Empty()
{
    // Arrange
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();
    request.Name = string.Empty; // forca campo invalido

    // Act
    var result = validator.Validate(request);

    // Assert
    result.IsValid.ShouldBeFalse();
    result.Errors.ShouldSatisfyAllConditions(
        errors => errors.Count.ShouldBe(1),
        errors => errors.ShouldContain(
            e => e.ErrorMessage == ResourceErrorMessages.NAME_EMPTY)
    );
}
```

## Padrao para demais regras (template)

```csharp
[Fact]
public void Error_Email_Empty()
{
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();
    request.Email = string.Empty;

    var result = validator.Validate(request);

    result.IsValid.ShouldBeFalse();
    result.Errors.ShouldSatisfyAllConditions(
        errors => errors.Count.ShouldBe(1),
        errors => errors.ShouldContain(
            e => e.ErrorMessage == ResourceErrorMessages.EMAIL_EMPTY)
    );
}

[Fact]
public void Error_Email_Invalid()
{
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();
    request.Email = "ellison.com"; // email sem @

    var result = validator.Validate(request);

    result.IsValid.ShouldBeFalse();
    result.Errors.ShouldSatisfyAllConditions(
        errors => errors.Count.ShouldBe(1),
        errors => errors.ShouldContain(
            e => e.ErrorMessage == ResourceErrorMessages.EMAIL_INVALID)
    );
}
```

## Estrutura de pastas do projeto de teste

```
Validators.Test/
└── User/
    └── Register/
        └── RegisterUserValidatorTests.cs
```

## Referencia do projeto (csproj)

O projeto de testes precisa referenciar o projeto que contem o validator:

```xml
<!-- Validators.Test.csproj -->
<ItemGroup>
    <ProjectReference Include="..\PlanShare.Application\PlanShare.Application.csproj" />
    <ProjectReference Include="..\CommonTestUtilities\CommonTestUtilities.csproj" />
</ItemGroup>
```

## Shouldly — assertions usadas

```csharp
// Verificar booleano
result.IsValid.ShouldBeTrue();
result.IsValid.ShouldBeFalse();

// Verificar colecao com multiplas condicoes
result.Errors.ShouldSatisfyAllConditions(
    errors => errors.Count.ShouldBe(1),
    errors => errors.ShouldContain(e => e.ErrorMessage == "expected message")
);
```