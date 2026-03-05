---
name: rs-csharp-dotnet-maui-teste-erro-integracao
description: "Applies integration test patterns for error scenarios in C#/.NET APIs when writing test code. Use when user asks to 'write integration test', 'test API error', 'test validation error', 'test bad request', or 'test error response'. Enforces JSON response parsing with null-safety, short-circuit evaluation for assertions, and strategic test coverage distribution across unit and integration tests. Make sure to use this skill whenever creating integration tests that validate API error responses in .NET projects. Not for unit test validators, happy-path tests, or frontend testing."
---

# Testes de Integração para Cenários de Erro em APIs .NET

> Teste de integração para erros valida o comportamento real da API com dados inválidos, sem duplicar cobertura já feita em testes de unidade.

## Rules

1. **Não duplique cobertura entre tipos de teste** — cubra todos os cenários de erro, mas distribua entre testes de validator, use case e integração, porque repetir cenários em cada tipo é desperdício sem ganho de confiança
2. **Escolha um cenário representativo para integração** — um teste de erro no fluxo completo (request → API → response) é suficiente para validar que o pipeline de erro funciona, porque os detalhes já estão cobertos nos testes de unidade
3. **Extraia URLs para constantes** — `private const string BASE_URL = "/users"` em vez de repetir strings, porque alterações futuras propagam automaticamente
4. **Valide null-safety antes de acessar valores JSON** — use `getString().NotEmpty()` com short-circuit `&&` antes de `.Equals()`, porque elementos JSON podem ser nulos e lançar exceção
5. **Use `ShouldSatisfyAllConditions`** — agrupe múltiplas asserções numa única verificação, porque falhas isoladas são mais fáceis de diagnosticar
6. **Espere o status code correto antes de parsear o body** — `Assert` no `StatusCode == BadRequest (400)` primeiro, porque parsear body de resposta inesperada produz erros confusos

## How to write

### Teste de erro com request inválida

```csharp
[Fact]
public async Task Error_Name_Empty()
{
    var request = RequestRegisterUserBuilder.Build();
    request.Name = string.Empty;

    var response = await DoPost(BASE_URL, request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    await using var body = await response.Content.ReadAsStreamAsync();
    var document = await JsonDocument.ParseAsync(body);

    var errors = document.RootElement
        .GetProperty("errors")
        .EnumerateArray();

    errors.Should().SatisfyAllConditions(
        () => errors.Count().Should().Be(1),
        () => errors.Should().Contain(error =>
            error.GetString().NotEmpty()
            && error.GetString()!.Equals(ResourceMessageException.NAME_EMPTY))
    );
}
```

### Constante de URL base

```csharp
private const string BASE_URL = "/users";
```

### Null-safety com short-circuit no C#

```csharp
// C# é "preguiçoso": se NotEmpty() retorna false, não executa Equals()
error.GetString().NotEmpty() && error.GetString()!.Equals(expectedMessage)
```

## Example

**Before (inseguro e repetitivo):**
```csharp
[Fact]
public async Task Error_Name_Empty()
{
    var request = RequestRegisterUserBuilder.Build();
    request.Name = string.Empty;

    var response = await DoPost("/users", request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    await using var body = await response.Content.ReadAsStreamAsync();
    var document = await JsonDocument.ParseAsync(body);

    var errors = document.RootElement.GetProperty("errors").EnumerateArray();
    // Perigoso: GetString() pode retornar null
    errors.Should().Contain(e => e.GetString()!.Equals(ResourceMessageException.NAME_EMPTY));
}
```

**After (com null-safety e constante):**
```csharp
private const string BASE_URL = "/users";

[Fact]
public async Task Error_Name_Empty()
{
    var request = RequestRegisterUserBuilder.Build();
    request.Name = string.Empty;

    var response = await DoPost(BASE_URL, request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    await using var body = await response.Content.ReadAsStreamAsync();
    var document = await JsonDocument.ParseAsync(body);

    var errors = document.RootElement
        .GetProperty("errors")
        .EnumerateArray();

    errors.Should().SatisfyAllConditions(
        () => errors.Count().Should().Be(1),
        () => errors.Should().Contain(error =>
            error.GetString().NotEmpty()
            && error.GetString()!.Equals(ResourceMessageException.NAME_EMPTY))
    );
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cenário de erro já coberto em teste de unidade | Não repita no teste de integração |
| Cenário de erro envolve pipeline completo (middleware, filtros) | Teste na integração |
| URL usada em mais de um teste | Extraia para constante |
| Valor JSON pode ser null | Use `NotEmpty() &&` antes de acessar |
| Lista de erros no response | Valide `Count()` E conteúdo |
| Response tem `ResponseErrorJSON` | Parse como `JsonDocument`, acesse `errors` como array |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `e.GetString()!.Equals(msg)` sem null check | `e.GetString().NotEmpty() && e.GetString()!.Equals(msg)` |
| `"/users"` repetido em cada teste | `private const string BASE_URL = "/users"` |
| Todos os cenários de erro no teste de integração | Um cenário representativo na integração, resto nos testes de unidade |
| `error.GetString().Should().Be(msg)` | `error.GetString().NotEmpty() && error.GetString()!.Equals(msg)` dentro de `Should().Contain()` |
| Ignorar validação de `Count()` na lista de erros | Sempre validar tamanho da lista antes do conteúdo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
