---
name: rs-csharp-maui-unit-test-validator
description: "Enforces unit testing patterns for FluentValidation validators in C#/.NET projects. Use when user asks to 'write tests', 'test validator', 'unit test', 'create test cases', or 'test validation rules'. Applies AAA pattern, Theory/InlineData for parameterized tests, independent test instances, and one-test-per-rule coverage. Make sure to use this skill whenever writing or reviewing validator unit tests in .NET. Not for integration tests, API tests, or non-validator test scenarios."
---

# Testes de Unidade para Validators (.NET)

> Cada regra de validacao exige seu proprio teste independente, seguindo o padrao AAA, sem compartilhar estado entre testes.

## Rules

1. **Um teste por regra de validacao** — cada `RuleFor` do validator precisa de pelo menos um teste dedicado, porque regras nao testadas quebram silenciosamente em refatoracoes
2. **Padrao AAA rigido** — Arrange (instanciar validator + request), Act (chamar `Validate`), Assert (verificar resultado), porque torna o teste legivel e previsivel
3. **Instancie o validator dentro de cada teste** — `new Validator()` em cada metodo, nunca como variavel de classe, porque testes executam em ordem aleatoria e estado compartilhado causa falhas intermitentes
4. **Use Theory + InlineData para variacoes** — quando uma regra depende de valores diferentes (ex: tamanho de senha 1-5), use `[Theory]` com `[InlineData]` ao inves de duplicar metodos, porque elimina repeticao sem usar loops
5. **Nunca use if/for/switch em testes** — logica condicional em testes esconde bugs nos proprios testes, porque o teste deve ser linear e determinístico
6. **Assertions explicitas com FluentAssertions/Shouldly** — `result.IsValid.Should().BeFalse()` em vez de `Assert.False`, porque a leitura do teste vira documentacao

## How to write

### Teste de sucesso (baseline)

```csharp
[Fact]
public void Success()
{
    var validator = new RegisterUserValidator();
    var request = RequestRegisterUserBuilder.Build();

    var result = validator.Validate(request);

    result.IsValid.Should().BeTrue();
    result.Errors.Should().BeEmpty();
}
```

### Teste de campo obrigatorio vazio

```csharp
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
```

### Teste parametrizado com Theory

```csharp
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
```

### Builder com parametros opcionais

```csharp
public static RequestRegisterUser Build(int passwordLength = 10)
{
    return new RequestRegisterUser
    {
        Name = "Valid Name",
        Email = "valid@email.com",
        Password = new string('a', passwordLength)
    };
}
```

## Example

**Before (anti-pattern — loop dentro do teste):**

```csharp
[Fact]
public void Error_Password_Too_Short()
{
    var validator = new RegisterUserValidator();
    for (int i = 1; i < 6; i++)
    {
        var request = RequestRegisterUserBuilder.Build(passwordLength: i);
        var result = validator.Validate(request);
        result.IsValid.Should().BeFalse(); // qual iteracao falhou?
    }
}
```

**After (Theory + InlineData):**

```csharp
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
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Regra com valor fixo (campo obrigatorio) | `[Fact]` com um teste |
| Regra com range de valores (min length, max) | `[Theory]` + `[InlineData]` para cada valor |
| Validator compartilhado (ex: PasswordValidator) | Teste no validator que o consome, nao no shared |
| Builder precisa de variacao | Adicione parametro opcional com default seguro |
| Multiplos erros possiveis | `ContainSingle()` garante que so a regra esperada dispara |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Variavel de classe `private Validator _validator` | `new Validator()` dentro de cada teste |
| `for`/`while` dentro de teste | `[Theory]` + `[InlineData]` |
| `if` para decidir assertion | Teste separado para cada cenario |
| Confiar na ordem de execucao | Testes 100% independentes |
| Duplicar 5 metodos identicos variando 1 valor | `[Theory]` parametrizado |
| `Assert.True`/`Assert.False` generico | FluentAssertions: `.Should().BeTrue()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
