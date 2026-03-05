---
name: rs-csharp-maui-base-class-http-tests
description: "Enforces base class pattern for HTTP request encapsulation in .NET integration tests. Use when user asks to 'write integration tests', 'create test class', 'refactor test HTTP calls', 'reduce test code duplication', or 'setup authenticated test requests'. Applies abstract base class with DoPost/DoGet/DoPut/DoDelete methods, optional culture/token parameters, and IClassFixture inheritance. Make sure to use this skill whenever writing or refactoring C# xUnit integration tests that make HTTP calls. Not for unit tests, mock-based tests, or non-.NET test frameworks."
---

# Base Class para Requisicoes HTTP em Testes de Integracao

> Extrair chamadas HTTP repetidas para uma classe base abstrata que encapsula autenticacao, cultura e metodos HTTP, eliminando duplicacao nos testes de integracao.

## Rules

1. **Criar classe base abstrata** — `CustomClassFixture` implementa `IClassFixture<T>` e contem toda logica HTTP, porque classes de teste nao devem instancia-la diretamente
2. **Metodos HTTP como protected** — `DoPost`, `DoGet`, `DoPut`, `DoDelete` sao protected para acesso apenas via heranca, porque somente classes filhas de teste devem usa-los
3. **Token opcional no GET e POST, obrigatorio no PUT** — GET e POST podem nao exigir autenticacao (ex: registro, codigo de acesso), PUT sempre exige, porque nao ha cenario de atualizacao sem identificacao
4. **Culture como parametro opcional com default "en"** — permite sobrescrever idioma para cenarios de erro sem forcar passagem em cenarios de sucesso, porque mensagens de erro dependem do idioma
5. **Heranca com repasse via `base()`** — construtor da classe de teste repassa `CustomWebApplicationFactory` para a base com `: base(factory)`, porque a classe base precisa do factory para criar o HttpClient
6. **Nao duplicar HttpClient** — remover `private readonly HttpClient` da classe de teste ao herdar da base, porque o client ja vive na classe base

## How to write

### Classe base abstrata

```csharp
public abstract class CustomClassFixture : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _httpClient;

    protected CustomClassFixture(CustomWebApplicationFactory factory)
    {
        _httpClient = factory.CreateClient();
    }

    protected async Task<HttpResponseMessage> DoPost(
        string baseUrl, object request, string culture = "en", string token = "")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.PostAsJsonAsync(baseUrl, request);
    }

    protected async Task<HttpResponseMessage> DoGet(
        string baseUrl, string culture = "en", string token = "")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.GetAsync(baseUrl);
    }

    protected async Task<HttpResponseMessage> DoPut(
        string baseUrl, object request, string token, string culture = "en")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.PutAsJsonAsync(baseUrl, request);
    }

    protected async Task<HttpResponseMessage> DoDelete(
        string baseUrl, string token, string culture = "en")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.DeleteAsync(baseUrl);
    }

    private void ChangeRequestCulture(string culture)
    {
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
        _httpClient.DefaultRequestHeaders.AcceptLanguage
            .Add(new System.Net.Http.Headers.StringWithQualityHeaderValue(culture));
    }

    private void AuthorizeRequest(string token)
    {
        if (!string.IsNullOrWhiteSpace(token))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }
    }
}
```

### Classe de teste herdando da base

```csharp
public class RegisterUserTest : CustomClassFixture
{
    public RegisterUserTest(CustomWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Success()
    {
        var request = new { Name = "Test", Email = "test@email.com", Password = "Senha123!" };
        var response = await DoPost("users", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Theory]
    [ClassData(typeof(CultureInlineData))]
    public async Task Error_Empty_Name(string culture, string expectedMessage)
    {
        var request = new { Name = "", Email = "test@email.com", Password = "Senha123!" };
        var response = await DoPost("users", request, culture: culture);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
```

## Example

**Before (codigo duplicado em cada teste):**
```csharp
public class RegisterUserTest : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTest(CustomWebApplicationFactory factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Success()
    {
        var response = await _httpClient.PostAsJsonAsync("users", request);
        // assert...
    }

    [Theory]
    public async Task Error_Empty_Name(string culture, string expectedMessage)
    {
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
        _httpClient.DefaultRequestHeaders.AcceptLanguage
            .Add(new StringWithQualityHeaderValue(culture));
        var response = await _httpClient.PostAsJsonAsync("users", request);
        // assert...
    }
}
```

**After (heranca da base, sem duplicacao):**
```csharp
public class RegisterUserTest : CustomClassFixture
{
    public RegisterUserTest(CustomWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Success()
    {
        var response = await DoPost("users", request);
    }

    [Theory]
    public async Task Error_Empty_Name(string culture, string expectedMessage)
    {
        var response = await DoPost("users", request, culture: culture);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste sem autenticacao (registro, login) | Use `DoPost`/`DoGet` sem passar token |
| Teste com autenticacao (update profile, delete) | Passe token como parametro obrigatorio |
| Teste de cenario de erro com idioma | Passe `culture` para sobrescrever o default "en" |
| GET que nao aceita body (C# HttpClient limita) | Use `DoGet` que so recebe URL, sem object request |
| DELETE que nao aceita body | Use `DoDelete` que so recebe URL e token |
| PUT que sempre exige auth | Token e obrigatorio no `DoPut`, sem valor default |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `private readonly HttpClient` em cada classe de teste | Herde de `CustomClassFixture` |
| Repetir `AcceptLanguage.Clear()` + `Add()` em cada teste | Use parametro `culture` do `DoPost`/`DoGet` |
| Repetir `Authorization = new AuthenticationHeaderValue(...)` | Use parametro `token` dos metodos base |
| `string.Empty` como default de parametro | `""` (string vazia literal), porque C# nao aceita `string.Empty` como default |
| Permitir instanciar a classe base diretamente | Marque como `abstract` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
