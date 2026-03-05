# Code Examples: Base Class para Requisicoes HTTP em Testes de Integracao

## Exemplo 1: Classe base completa

```csharp
using System.Net.Http.Headers;
using System.Net.Http.Json;

public abstract class CustomClassFixture : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _httpClient;

    protected CustomClassFixture(CustomWebApplicationFactory factory)
    {
        _httpClient = factory.CreateClient();
    }

    // POST — aceita body, token opcional, culture opcional
    protected async Task<HttpResponseMessage> DoPost(
        string baseUrl,
        object request,
        string culture = "en",
        string token = "")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.PostAsJsonAsync(baseUrl, request);
    }

    // GET — sem body (HttpClient nao permite), token opcional
    protected async Task<HttpResponseMessage> DoGet(
        string baseUrl,
        string culture = "en",
        string token = "")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.GetAsync(baseUrl);
    }

    // PUT — aceita body, token OBRIGATORIO (sem default)
    protected async Task<HttpResponseMessage> DoPut(
        string baseUrl,
        object request,
        string token,
        string culture = "en")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.PutAsJsonAsync(baseUrl, request);
    }

    // DELETE — sem body, token OBRIGATORIO
    protected async Task<HttpResponseMessage> DoDelete(
        string baseUrl,
        string token,
        string culture = "en")
    {
        ChangeRequestCulture(culture);
        AuthorizeRequest(token);
        return await _httpClient.DeleteAsync(baseUrl);
    }

    private void ChangeRequestCulture(string culture)
    {
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
        _httpClient.DefaultRequestHeaders.AcceptLanguage
            .Add(new StringWithQualityHeaderValue(culture));
    }

    private void AuthorizeRequest(string token)
    {
        if (!string.IsNullOrWhiteSpace(token))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }
    }
}
```

## Exemplo 2: Teste de sucesso (sem token, sem culture)

```csharp
public class RegisterUserTest : CustomClassFixture
{
    public RegisterUserTest(CustomWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Success()
    {
        var request = new RegisterUserRequest
        {
            Name = "Test User",
            Email = "test@email.com",
            Password = "Password123!"
        };

        var response = await DoPost("users", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

## Exemplo 3: Teste de erro com culture (idioma para mensagens)

```csharp
[Theory]
[ClassData(typeof(CultureInlineData))]
public async Task Error_Empty_Name(string culture, string expectedMessage)
{
    var request = new RegisterUserRequest
    {
        Name = "",
        Email = "test@email.com",
        Password = "Password123!"
    };

    // culture sobrescreve o default "en"
    var response = await DoPost("users", request, culture: culture);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    var body = await response.Content.ReadAsStringAsync();
    body.Should().Contain(expectedMessage);
}
```

## Exemplo 4: Teste com autenticacao (PUT)

```csharp
public class UpdateProfileTest : CustomClassFixture
{
    public UpdateProfileTest(CustomWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Success()
    {
        var token = "eyJhbGciOiJIUzI1NiIs..."; // token obtido via login
        var request = new UpdateProfileRequest { Name = "New Name" };

        // token e obrigatorio no DoPut — nao tem default
        var response = await DoPut("users/profile", request, token);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Theory]
    [ClassData(typeof(CultureInlineData))]
    public async Task Error_Empty_Name(string culture, string expectedMessage)
    {
        var token = "eyJhbGciOiJIUzI1NiIs...";
        var request = new UpdateProfileRequest { Name = "" };

        var response = await DoPut("users/profile", request, token, culture: culture);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
```

## Exemplo 5: GET publico sem token (ex: solicitar codigo de acesso)

```csharp
[Fact]
public async Task Request_Access_Code()
{
    // GET publico — nao precisa de token
    var response = await DoGet("users/access-code?email=test@email.com");

    response.StatusCode.Should().Be(HttpStatusCode.OK);
}
```

## Exemplo 6: DELETE com autenticacao

```csharp
[Fact]
public async Task Delete_Account()
{
    var token = "eyJhbGciOiJIUzI1NiIs...";

    // DELETE nao aceita body no C# HttpClient
    var response = await DoDelete("users/account", token);

    response.StatusCode.Should().Be(HttpStatusCode.NoContent);
}
```

## Exemplo 7: Sintaxe do construtor com repasse para base

```csharp
// ERRADO — vai dar erro de compilacao
public class MyTest : CustomClassFixture
{
    public MyTest(CustomWebApplicationFactory factory) { } // falta base()
}

// CORRETO — repassa factory para o construtor da base
public class MyTest : CustomClassFixture
{
    public MyTest(CustomWebApplicationFactory factory) : base(factory) { }
}
```

## Exemplo 8: Por que string.Empty nao funciona como default

```csharp
// ERRO DE COMPILACAO — string.Empty nao e constante
protected async Task<HttpResponseMessage> DoPost(
    string baseUrl, object request, string token = string.Empty) // ❌

// CORRETO — string literal vazia e constante
protected async Task<HttpResponseMessage> DoPost(
    string baseUrl, object request, string token = "") // ✓
```