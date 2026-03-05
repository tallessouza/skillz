# Code Examples: Testes de Erro em Integração para APIs .NET

## Exemplo completo do teste

```csharp
public class RegisterUserTest : IClassFixture<CustomWebApplicationFactory>
{
    private const string BASE_URL = "/users";
    private readonly HttpClient _client;

    public RegisterUserTest(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Success()
    {
        var request = RequestRegisterUserBuilder.Build();

        var response = await DoPost(BASE_URL, request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        await using var body = await response.Content.ReadAsStreamAsync();
        var document = await JsonDocument.ParseAsync(body);

        document.RootElement.GetProperty("name")
            .GetString().Should().NotBeNullOrWhiteSpace()
            .And.Be(request.Name);

        document.RootElement.GetProperty("tokens")
            .GetProperty("accessToken")
            .GetString().Should().NotBeNullOrWhiteSpace();
    }

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

    private async Task<HttpResponseMessage> DoPost(string url, object request)
    {
        return await _client.PostAsJsonAsync(url, request);
    }
}
```

## Estrutura do ResponseErrorJSON

```csharp
public class ResponseErrorJSON
{
    public List<string> Errors { get; set; }
    public bool TokenIsExpired { get; set; }
}
```

## Fluxo de execução com breakpoints

```
1. RequestRegisterUserBuilder.Build() → gera request com dados aleatórios
2. request.Name = string.Empty → força nome vazio
3. DoPost(BASE_URL, request) → envia POST para /users
4. Use case lança exceção de validação → "Name cannot be empty"
5. Exception filter captura → transforma em ResponseErrorJSON
6. Status code = 400 (BadRequest)
7. Body = { "errors": ["The name cannot be empty"], "tokenIsExpired": false }
8. Parse como JsonDocument → acessa "errors" como array
9. Valida Count() == 1 e conteúdo == NAME_EMPTY
```

## Método de extensão NotEmpty

```csharp
public static class StringExtensions
{
    public static bool NotEmpty(this string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }
}
```

## Comparação: acesso a erros no teste de unidade vs integração

### Teste de unidade (use case)
```csharp
// errors é List<string> — acesso direto
var errors = result.Errors;
errors.Count.Should().Be(1);  // Count é propriedade
errors.Should().Contain(ResourceMessageException.NAME_EMPTY);  // comparação direta de string
```

### Teste de integração
```csharp
// errors é JsonElement.ArrayEnumerator — precisa de GetString()
var errors = document.RootElement.GetProperty("errors").EnumerateArray();
errors.Count().Should().Be(1);  // Count() é método
errors.Should().Contain(error =>
    error.GetString().NotEmpty()
    && error.GetString()!.Equals(ResourceMessageException.NAME_EMPTY));
```

### Diferenças-chave

| Aspecto | Teste de Unidade | Teste de Integração |
|---------|-----------------|---------------------|
| Tipo da lista | `List<string>` | `JsonElement.ArrayEnumerator` |
| Count | `.Count` (propriedade) | `.Count()` (método) |
| Acesso ao valor | Direto (já é string) | `.GetString()` (converte JsonElement) |
| Null-safety | Não necessário | Obrigatório (`.NotEmpty()`) |
| Comparação | `.Should().Contain(msg)` | `.Should().Contain(e => e.GetString()...Equals(msg))` |

## Extração de constante BASE_URL

```csharp
// ANTES: string repetida em cada teste
var response = await DoPost("/users", request);

// DEPOIS: constante compartilhada
private const string BASE_URL = "/users";
var response = await DoPost(BASE_URL, request);
```

Benefício: se o endpoint mudar (ex: `/api/v2/users`), altera-se apenas a constante.