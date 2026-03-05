# Code Examples: Testes de Unidade para Validators de Senha

## Estrutura completa do validator sendo testado

```csharp
// ChangePasswordValidator.cs
public class ChangePasswordValidator : AbstractValidator<RequestChangePassword>
{
    public ChangePasswordValidator()
    {
        RuleFor(r => r.NewPassword).SetValidator(new PasswordValidator());
    }
}
```

Note que so `NewPassword` tem regra. `Password` (senha atual) e validado no use case.

## Request sendo validada

```csharp
// RequestChangePassword.cs
public class RequestChangePassword
{
    public string Password { get; set; }     // senha atual
    public string NewPassword { get; set; }  // nova senha
}
```

## Builder completo

```csharp
// RequestChangePasswordBuilder.cs
public class RequestChangePasswordBuilder
{
    public static RequestChangePassword Build(int passwordLength = 10)
    {
        return new Faker<RequestChangePassword>()
            .RuleFor(r => r.Password, f => f.Internet.Password())
            .RuleFor(r => r.NewPassword, f => f.Internet.Password(length: passwordLength));
    }
}
```

## Classe de teste completa

```csharp
// ChangePasswordValidatorTest.cs
public class ChangePasswordValidatorTest
{
    [Fact]
    public void Success()
    {
        var validator = new ChangePasswordValidator();
        var request = RequestChangePasswordBuilder.Build();

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void ErrorNewPasswordEmpty()
    {
        var validator = new ChangePasswordValidator();
        var request = RequestChangePasswordBuilder.Build();
        request.NewPassword = string.Empty;

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage.Equals("Password cannot be empty"));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public void ErrorNewPasswordInvalid(int passwordLength)
    {
        var validator = new ChangePasswordValidator();
        var request = RequestChangePasswordBuilder.Build(passwordLength);

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle()
            .And.Contain(e => e.ErrorMessage.Equals("Password is invalid"));
    }
}
```

## Use case para contexto (onde a senha atual e validada)

```csharp
// ChangePasswordUseCase.cs (simplificado)
public class ChangePasswordUseCase
{
    public async Task Execute(RequestChangePassword request, User user)
    {
        // Validacao da senha atual (NAO e no validator)
        var match = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!match)
            throw new UnauthorizedException("Password does not match");

        // Se passou, criptografa a nova senha e atualiza
        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _repository.Update(user);
    }
}
```

## Comparacao: Builder do Register vs Builder do ChangePassword

```csharp
// RequestRegisterUserBuilder.cs
public static RequestRegisterUser Build(int passwordLength = 10)
{
    return new Faker<RequestRegisterUser>()
        .RuleFor(r => r.Name, f => f.Person.FullName)
        .RuleFor(r => r.Email, f => f.Internet.Email())
        .RuleFor(r => r.Password, f => f.Internet.Password(length: passwordLength));
}

// RequestChangePasswordBuilder.cs
public static RequestChangePassword Build(int passwordLength = 10)
{
    return new Faker<RequestChangePassword>()
        .RuleFor(r => r.Password, f => f.Internet.Password())
        .RuleFor(r => r.NewPassword, f => f.Internet.Password(length: passwordLength));
}
```

Note que no ChangePassword, o `passwordLength` controla o `NewPassword` (o campo validado), enquanto `Password` recebe qualquer valor aleatorio.

## Organizacao de pastas do projeto de testes

```
Tests/
├── Validators/
│   ├── User/
│   │   ├── Register/
│   │   │   └── RegisterUserValidatorTest.cs
│   │   └── ChangePassword/
│   │       └── ChangePasswordValidatorTest.cs
│   └── ...
├── Builders/
│   ├── RequestRegisterUserBuilder.cs
│   └── RequestChangePasswordBuilder.cs
└── ...
```