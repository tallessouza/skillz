# Code Examples: Testes de Unidade para Validators

## Estrutura completa do arquivo de teste

```csharp
public class RegisterUserValidatorTest
{
    [Fact]
    public void Success()
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Error_Name_Empty()
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();
        request.Name = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage == "Name is required.");
    }

    [Fact]
    public void Error_Email_Empty()
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();
        request.Email = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage == "Email is required.");
    }

    [Fact]
    public void Error_Email_Invalid()
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();
        request.Email = "teste.com"; // sem @ — invalido

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage == "Email is invalid.");
    }

    [Fact]
    public void Error_Password_Empty()
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();
        request.Password = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage == "Password is required.");
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public void Error_Password_Invalid(int passwordLength)
    {
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build(passwordLength: passwordLength);

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage == "Password must be at least 6 characters.");
    }
}
```

## Builder com parametro opcional

```csharp
public class RequestRegisterUserBuilder
{
    public static RequestRegisterUser Build(int passwordLength = 10)
    {
        return new RequestRegisterUser
        {
            Name = "Valid Name",
            Email = "valid@email.com",
            Password = new string('a', passwordLength)
        };
    }
}
```

## Validator sendo testado

```csharp
public class RegisterUserValidator : AbstractValidator<RequestRegisterUser>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email is invalid.");

        RuleFor(x => x.Password)
            .SetValidator(new PasswordValidator());
    }
}
```

## PasswordValidator compartilhado

```csharp
public class PasswordValidator : AbstractValidator<string>
{
    public PasswordValidator()
    {
        RuleFor(password => password)
            .NotEmpty().WithMessage("Password is required.");

        RuleFor(password => password)
            .Must(password => password.Length >= 6)
            .WithMessage("Password must be at least 6 characters.")
            .When(password => !string.IsNullOrEmpty(password));
    }
}
```

## Reutilizacao do PasswordValidator em outro validator

```csharp
public class ChangePasswordValidator : AbstractValidator<RequestChangePassword>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.NewPassword)
            .SetValidator(new PasswordValidator());
    }
}
```

## Visual Studio Test Explorer

- Testes com `[Theory]` + `[InlineData]` aparecem como testes separados no Test Explorer
- Icones: azul = nao executado, verde = passou, vermelho = falhou
- Executar todos: clique no botao "Run All" no Test Explorer
- A ordem de execucao entre testes e aleatoria — nunca confie na ordem