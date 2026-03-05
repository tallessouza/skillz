---
name: rs-csharp-maui-testes-update-validator
description: "Enforces unit testing patterns for FluentValidation validators in C#/.NET projects. Use when user asks to 'write tests for validator', 'test validation rules', 'unit test FluentValidation', 'cover validator scenarios', or 'test update endpoint validation'. Applies patterns: independent test methods, no instance reuse, Builder pattern for requests, When/CurrentValidator chaining. Make sure to use this skill whenever creating or reviewing validator unit tests in .NET projects. Not for integration tests, API endpoint tests, or use case tests."
---

# Testes de Unidade para Validators FluentValidation

> Cada teste de validacao deve ser independente, cobrindo um cenario especifico sem reaproveitamento de instancias entre testes.

## Rules

1. **Um teste por cenario de validacao** — sucesso, campo vazio, campo invalido sao testes separados, porque cada teste deve falhar por exatamente um motivo
2. **Nunca reutilize instancias entre testes** — crie validator e request novos em cada metodo, porque testes independentes podem executar em paralelo sem interferencia
3. **Use o padrao Builder para requests** — `RequestUpdateUserBuilder` gera dados validos, teste altera apenas o campo sob teste, porque isola a causa da falha
4. **Nomeie a classe de teste como ClasseOriginal + Tests** — `UpdateUserValidator` → `UpdateUserValidatorTests`, porque facilita navegacao e convencao do projeto
5. **Repeticao e normal** — nao crie helpers, construtores compartilhados ou loops para evitar repeticao em testes, porque independencia vale mais que DRY
6. **Cubra todos os cenarios do validator** — para cada `RuleFor` no validator, deve existir pelo menos um teste de falha correspondente

## How to write

### Estrutura basica de teste de validator

```csharp
[Fact]
public void Success()
{
    var validator = new UpdateUserValidator();
    var request = RequestUpdateUserBuilder.Build();

    var result = validator.Validate(request);

    result.IsValid.Should().BeTrue();
}
```

### Teste de campo vazio

```csharp
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
```

### Teste de email invalido

```csharp
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
```

## Example

**Before (reuso inadequado — anti-pattern):**
```csharp
public class UpdateUserValidatorTests
{
    private readonly UpdateUserValidator _validator = new();
    private readonly RequestUpdateUserJson _request = RequestUpdateUserBuilder.Build();

    [Fact]
    public void Success() => _validator.Validate(_request).IsValid.Should().BeTrue();

    [Fact]
    public void Error_Name_Empty()
    {
        _request.Name = string.Empty; // PROBLEMA: altera instancia compartilhada
        _validator.Validate(_request).IsValid.Should().BeFalse();
    }
}
```

**After (testes independentes):**
```csharp
public class UpdateUserValidatorTests
{
    [Fact]
    public void Success()
    {
        var validator = new UpdateUserValidator();
        var request = RequestUpdateUserBuilder.Build();
        var result = validator.Validate(request);
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Validator tem N regras | Crie N+1 testes (1 sucesso + 1 por regra de falha) |
| Request tem campo opcional | Teste com campo nulo E com campo vazio |
| Validator usa When/Unless | Teste o cenario em que a condicao ativa E desativa a regra |
| Bug encontrado em validacao | Corrija e adicione teste que reproduz o bug |
| Validator reutilizado de outro | Copie os testes, ajuste — nao reutilize testes |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `private readonly _validator = new()` no campo da classe | `var validator = new()` dentro de cada metodo |
| Loop `foreach` testando multiplos cenarios | Um `[Fact]` por cenario |
| Helper method que cria validator + request + valida | Codigo explicito em cada teste |
| `[Theory]` com dezenas de `[InlineData]` para validators simples | `[Fact]` individual — clareza > concisao |
| Ignorar teste de sucesso | Sempre comece pelo teste de sucesso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
