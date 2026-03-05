---
name: rs-csharp-teste-validator-senha
description: "Enforces unit testing patterns for FluentValidation password validators in C#/.NET projects. Use when user asks to 'test a validator', 'write unit tests for password validation', 'test change password', 'cover validator scenarios', or 'create validator tests in C#'. Applies patterns: test success/empty/invalid-length scenarios, copy-and-adapt from similar validators with careful property renaming, use builders for request objects, name test methods by expected outcome. Make sure to use this skill whenever creating or reviewing unit tests for FluentValidation validators. Not for testing use cases, business logic with BCrypt, or integration tests."
---

# Testes de Unidade para Validators de Senha (C#/.NET)

> Todo validator precisa de testes para os tres cenarios basicos: sucesso, campo vazio e valor invalido — mesmo que reutilize regras de outro validator.

## Rules

1. **Sempre teste os tres cenarios basicos** — sucesso, campo vazio, tamanho invalido — porque validators que delegam para sub-validators precisam de camadas de protecao contra alteracoes acidentais
2. **Use Builders para requests** — `RequestChangePasswordBuilder` com parametros opcionais como `passwordLength`, porque isola a criacao de dados fake do teste em si
3. **Nomeie metodos pelo resultado esperado** — `Success`, `ErrorNewPasswordEmpty`, `ErrorNewPasswordInvalid` — porque o nome deve deixar claro O QUE falhou e POR QUE
4. **Ao copiar testes de validators similares, confira propriedade por propriedade** — `password` vs `newPassword` sao propriedades diferentes, ctrl-c ctrl-v sem revisao causa falsos positivos
5. **Valide apenas o que o validator valida** — se `password` (senha atual) e validado no use case via BCrypt, NAO teste no validator — porque a responsabilidade e do use case

## How to write

### Builder de Request

```csharp
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

### Teste de sucesso

```csharp
[Fact]
public void Success()
{
    var validator = new ChangePasswordValidator();
    var request = RequestChangePasswordBuilder.Build();

    var result = validator.Validate(request);

    result.IsValid.Should().BeTrue();
}
```

### Teste de campo vazio

```csharp
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
```

### Teste de tamanho invalido (Theory com InlineData)

```csharp
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
```

## Example

**Before (copiei do RegisterValidator sem revisar):**
```csharp
[Fact]
public void ErrorPasswordEmpty()  // nome nao indica qual password
{
    var validator = new ChangePasswordValidator();
    var request = RequestChangePasswordBuilder.Build();
    request.Password = string.Empty;  // ERRADO: testando password ao inves de NewPassword

    var result = validator.Validate(request);
    result.IsValid.Should().BeFalse();  // vai passar por motivo errado ou falhar
}
```

**After (com propriedade e nome corretos):**
```csharp
[Fact]
public void ErrorNewPasswordEmpty()  // nome explicita que e a nova senha
{
    var validator = new ChangePasswordValidator();
    var request = RequestChangePasswordBuilder.Build();
    request.NewPassword = string.Empty;  // CORRETO: testando a propriedade que o validator valida

    var result = validator.Validate(request);
    result.IsValid.Should().BeFalse();
    result.Errors.Should().ContainSingle()
        .And.Contain(e => e.ErrorMessage.Equals("Password cannot be empty"));
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validator delega para sub-validator (ex: PasswordValidator) | Teste os mesmos cenarios — camada de protecao contra mudancas |
| Request tem campo que nao e validado no validator | NAO teste no validator, teste no use case |
| Copiando testes de outro validator similar | Revise CADA propriedade e CADA nome de metodo linha a linha |
| Builder precisa de parametro variavel | Adicione parametro com default no Build() |
| Nome do metodo de teste | Padrao: `Success`, `Error{Campo}{Motivo}` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `ErrorPasswordEmpty` (para NewPassword) | `ErrorNewPasswordEmpty` |
| `request.Password = ""` quando validator testa NewPassword | `request.NewPassword = string.Empty` |
| `passwordLengthForNewPassword` (nome enorme) | `passwordLength` |
| Teste sem assert na mensagem de erro | `.Contain(e => e.ErrorMessage.Equals("..."))` |
| Testar senha atual no validator | Testar senha atual no use case (BCrypt match) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
