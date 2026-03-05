# Code Examples: Testes de Unidade para Validators FluentValidation

## Validator sendo testado — UpdateUserValidator

```csharp
public class UpdateUserValidator : AbstractValidator<RequestUpdateUserJson>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("name empty");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("email empty")
            .EmailAddress()
            .When(x => x.Email.NotEmpty(), ApplyConditionTo.CurrentValidator)
            .WithMessage("email invalid");
    }
}
```

## Request sendo validada

```csharp
public class RequestUpdateUserJson
{
    public string Name { get; set; }
    public string Email { get; set; }
}
```

## Builder para testes

```csharp
public class RequestUpdateUserBuilder
{
    public static RequestUpdateUserJson Build()
    {
        return new Faker<RequestUpdateUserJson>()
            .RuleFor(x => x.Name, f => f.Person.FirstName)
            .RuleFor(x => x.Email, (f, x) => f.Internet.Email(x.Name))
            .Generate();
    }
}
```

## Metodo de extensao StringExtension

```csharp
public static class StringExtension
{
    public static bool NotEmpty(this string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }
}
```

## Classe completa de testes

```csharp
public class UpdateUserValidatorTests
{
    [Fact]
    public void Success()
    {
        // Arrange
        var validator = new UpdateUserValidator();
        var request = RequestUpdateUserBuilder.Build();

        // Act
        var result = validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Error_Name_Empty()
    {
        var validator = new UpdateUserValidator();
        var request = RequestUpdateUserBuilder.Build();
        request.Name = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage.Contains("name"));
    }

    [Fact]
    public void Error_Email_Empty()
    {
        var validator = new UpdateUserValidator();
        var request = RequestUpdateUserBuilder.Build();
        request.Email = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage.Contains("email"));
    }

    [Fact]
    public void Error_Email_Invalid()
    {
        var validator = new UpdateUserValidator();
        var request = RequestUpdateUserBuilder.Build();
        request.Email = "teste.com";

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage.Contains("email"));
    }
}
```

## Sintaxe alternativa When — comparacao

### Com encadeamento (When + CurrentValidator)
```csharp
RuleFor(x => x.Email)
    .NotEmpty().WithMessage("email empty")
    .EmailAddress()
    .When(x => x.Email.NotEmpty(), ApplyConditionTo.CurrentValidator)
    .WithMessage("email invalid");
```

### Sem encadeamento (regras separadas com condicional)
```csharp
RuleFor(x => x.Email).NotEmpty().WithMessage("email empty");
RuleFor(x => x.Email)
    .EmailAddress().WithMessage("email invalid")
    .When(x => !string.IsNullOrWhiteSpace(x.Email));
```

Ambas produzem o mesmo resultado. A forma encadeada e mais compacta. A forma separada e mais explicita.

## Execucao e debug dos testes

O instrutor demonstra o processo de debug passo a passo para cada teste:

1. **Success**: Cria validator → Build gera request valida (ex: "Tommy", "tommymiller@hotmail.com") → `Validate` retorna `IsValid = true`
2. **Error_Name_Empty**: Build gera request valida → Forca `Name = ""` → `IsValid = false` → Erro contem "name"
3. **Error_Email_Empty**: Build gera request valida → Forca `Email = ""` → `IsValid = false` → Erro contem "email"
4. **Error_Email_Invalid**: Build gera request valida → Forca `Email = "teste.com"` → `IsValid = false` → Erro contem "email"

Ao final, todos os 14 testes do projeto (incluindo os de outros validators) executam em paralelo e passam com sucesso.