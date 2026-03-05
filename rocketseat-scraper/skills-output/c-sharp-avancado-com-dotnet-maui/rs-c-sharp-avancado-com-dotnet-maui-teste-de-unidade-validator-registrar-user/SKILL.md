---
name: rs-csharp-maui-teste-unidade-validator
description: "Enforces unit testing patterns for FluentValidation validators in .NET/C# projects. Use when user asks to 'test a validator', 'write unit tests for validation', 'test FluentValidation rules', 'create validator tests', or 'test business rules validation'. Applies AAA pattern (Arrange/Act/Assert), Shouldly assertions, success and error test cases with message verification. Make sure to use this skill whenever creating tests for any FluentValidation validator class. Not for integration tests, API endpoint tests, or non-validation unit tests."
---

# Testes de Unidade para Validators (.NET FluentValidation)

> Cada validator DEVE ter testes de sucesso (dados validos → isValid true) E testes de erro para cada regra (dado invalido → isValid false + mensagem correta).

## Rules

1. **Siga o padrao AAA** — Arrange (instanciar validator + request), Act (chamar validate), Assert (verificar resultado), porque garante consistencia e legibilidade em todos os testes
2. **Teste SEMPRE o validator mesmo usando biblioteca externa** — FluentValidation pode ter bugs em atualizacoes de versao, e alguem pode alterar regras sem querer, porque testes cobrem ambos cenarios
3. **Verifique mensagens de erro, nao apenas isValid** — confirmar que `result.Errors` contem a mensagem esperada, porque isValid false com mensagem errada indica bug na regra
4. **Um teste por regra de validacao** — cada regra (nome vazio, email invalido, senha fraca) tem seu proprio metodo de teste, porque facilita identificar qual regra quebrou
5. **Nomeie testes pelo resultado esperado** — `Error_Name_Empty`, `Error_Email_Invalid`, `Success`, porque o nome comunica o cenario sem ler o corpo
6. **Use builders para gerar requests** — criar request com dados validos via builder, depois forcar o campo invalido, porque evita duplicacao e mantém dados aleatorios

## How to write

### Estrutura da classe de teste

```csharp
public class RegisterUserValidatorTests
{
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

    [Fact]
    public void Error_Name_Empty()
    {
        // Arrange
        var validator = new RegisterUserValidator();
        var request = RequestRegisterUserBuilder.Build();
        request.Name = string.Empty;

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
}
```

### Verificacao de erros com Shouldly

```csharp
// Verificar quantidade + mensagem especifica
result.Errors.ShouldSatisfyAllConditions(
    errors => errors.Count.ShouldBe(1),
    errors => errors.ShouldContain(
        e => e.ErrorMessage == ResourceErrorMessages.EMAIL_INVALID)
);
```

## Example

**Before (teste incompleto):**
```csharp
[Fact]
public void TestValidation()
{
    var validator = new RegisterUserValidator();
    var request = new RequestRegisterUserJson { Name = "" };
    var result = validator.Validate(request);
    Assert.False(result.IsValid); // nao verifica mensagem
}
```

**After (com esta skill aplicada):**
```csharp
[Fact]
public void Error_Name_Empty()
{
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();
    request.Name = string.Empty;

    var result = validator.Validate(request);

    result.IsValid.ShouldBeFalse();
    result.Errors.ShouldSatisfyAllConditions(
        errors => errors.Count.ShouldBe(1),
        errors => errors.ShouldContain(
            e => e.ErrorMessage == ResourceErrorMessages.NAME_EMPTY)
    );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validator com N regras | Crie N testes de erro + 1 teste de sucesso |
| Request com muitos campos | Use builder com dados aleatorios, force apenas o campo sob teste |
| Regra com multiplas condicoes (ex: email vazio E email invalido) | Teste cada condicao separadamente |
| Mensagem de erro vem de resource file | Compare com a constante do resource, nao string hardcoded |
| Precisa debugar teste | Breakpoint + Ctrl+R,T no Visual Studio |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `Assert.False(result.IsValid)` sem checar mensagem | `result.IsValid.ShouldBeFalse()` + `ShouldSatisfyAllConditions` |
| `new RequestJson { Name = "test" }` com dados fixos | `Builder.Build()` com dados aleatorios via Bogus |
| Um unico teste pra todas as regras | Um teste por regra com nome descritivo |
| `if (result.IsValid)` dentro do teste | Shouldly assertions (`ShouldBeTrue`/`ShouldBeFalse`) |
| String literal da mensagem de erro | Constante do resource (`ResourceErrorMessages.NAME_EMPTY`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
