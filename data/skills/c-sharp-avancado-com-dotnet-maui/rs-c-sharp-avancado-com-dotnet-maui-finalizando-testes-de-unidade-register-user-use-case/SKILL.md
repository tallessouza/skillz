---
name: rs-csharp-dotnet-maui-testes-erro-usecase
description: "Enforces proper exception testing patterns in C# unit tests using FluentAssertions. Use when user asks to 'test exceptions', 'test error scenarios', 'write unit tests for use cases', 'validate error handling', or 'test validation failures'. Applies patterns: store action in variable, use Should.ThrowAsync with typed exception, assert status code and error messages. Make sure to use this skill whenever writing C# xUnit tests that verify exception behavior. Not for integration tests, API tests, or non-exception test scenarios."
---

# Testes de Unidade para Cenarios de Erro em C#

> Ao testar cenarios de erro, configure o teste para ESPERAR a excecao — se ela acontecer, o teste passa; se nao acontecer, o teste falha.

## Rules

1. **Armazene a acao em uma variavel antes de executar** — `var act = async () => await useCase.Execute(request)`, porque o framework precisa da referencia da funcao para capturar a excecao
2. **Use Should.ThrowAsync com tipo especifico** — `await act.Should().ThrowAsync<ErrorOnValidationException>()`, porque validar apenas que "uma excecao aconteceu" e insuficiente — o tipo importa
3. **Valide status code E mensagens de erro** — nao basta verificar que lancou excecao, confirme que o conteudo esta correto, porque uma excecao com mensagem errada indica bug no validator
4. **Nao duplique testes do validator no use case** — se o validator ja testa nome vazio, email invalido, senha fraca individualmente, o use case so precisa testar que "validator reclamou → excecao lancada", porque evita testes redundantes
5. **Configure mocks para simular cada cenario** — use parametros opcionais nos builders para ativar comportamentos especificos como "email ja existe", porque cada teste deve controlar exatamente o estado do mundo

## How to write

### Estrutura de teste de excecao

```csharp
[Fact]
public async Task Error_Email_Ja_Registrado()
{
    var request = RequestRegisterUserJsonBuilder.Build();

    var useCase = CreateUseCase(email: request.Email);

    var act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<ErrorOnValidationException>();

    exception.And.Should().SatisfyAllConditions(
        ex => ex.GetStatusCode().Should().Be(HttpStatusCode.BadRequest),
        ex => ex.GetErrorMessages().Should().SatisfyAllConditions(
            errors => errors.Count.Should().Be(1),
            errors => errors.Should().Contain("E-mail ja registrado")
        )
    );
}
```

### Builder com parametro opcional para mock

```csharp
private UseCase CreateUseCase(string email = "")
{
    var readOnlyRepo = new ReadOnlyRepositoryBuilder(email).Build();
    var writeRepo = new WriteRepositoryBuilder().Build();
    // ... demais dependencias
    return new RegisterUserUseCase(readOnlyRepo, writeRepo, ...);
}
```

```csharp
// No builder do repositorio
public ReadOnlyRepositoryBuilder(string email = "")
{
    if (!string.IsNullOrEmpty(email))
    {
        _mock.Setup(r => r.ExistsActiveUserWithEmail(email))
             .ReturnsAsync(true);
    }
}
```

## Example

**Before (teste que falha por nao esperar excecao):**
```csharp
[Fact]
public async Task Error_Email_Exists()
{
    var request = RequestRegisterUserJsonBuilder.Build();
    var useCase = CreateUseCase(email: request.Email);

    // ERRO: excecao nao capturada → teste falha
    var result = await useCase.Execute(request);
    result.Should().BeNull();
}
```

**After (teste correto com captura de excecao):**
```csharp
[Fact]
public async Task Error_Email_Ja_Registrado()
{
    var request = RequestRegisterUserJsonBuilder.Build();
    var useCase = CreateUseCase(email: request.Email);

    var act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<ErrorOnValidationException>();

    exception.And.GetStatusCode().Should().Be(HttpStatusCode.BadRequest);
    exception.And.GetErrorMessages().Should().ContainSingle()
        .Which.Should().Be("E-mail ja registrado");
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validator ja testa campo X individualmente | No use case, teste apenas UM campo invalido para confirmar que validator → excecao funciona |
| Use case tem IF para regra de negocio (ex: email duplicado) | Teste especifico com mock retornando true para aquela condicao |
| Excecao customizada tem status code e lista de mensagens | Valide ambos: tipo, status code, quantidade de mensagens E conteudo |
| Multiplos cenarios de erro no mesmo use case | Um metodo [Fact] por cenario, nome descritivo: `Error_NomeVazio`, `Error_EmailJaRegistrado` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `await useCase.Execute(request)` direto no teste de erro | `var act = async () => await useCase.Execute(request)` |
| `act.Should().ThrowAsync<Exception>()` (tipo generico) | `act.Should().ThrowAsync<ErrorOnValidationException>()` (tipo especifico) |
| Testar todos os campos invalidos no use case test | Testar 1 campo invalido + cenarios de regra de negocio (validator ja cobre o resto) |
| Verificar apenas que excecao foi lancada | Verificar tipo + status code + mensagens de erro |
| Mock hardcoded sem parametro | Builder com parametro opcional para ativar comportamento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
