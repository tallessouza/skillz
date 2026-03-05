# Code Examples: Testes de Integracao para Get User Profile

## Estrutura de pastas

```
WebAPI.Tests/
└── Users/
    └── Profile/
        ├── GetUserProfileTest.cs
        └── GetUserProfileInvalidTokenTest.cs
```

## CustomWebApplicationFactory — StartDatabase relevante

```csharp
public UserIdentityManager User { get; set; } = default!;

private async Task StartDatabase(IServiceProvider serviceProvider)
{
    var dbContext = serviceProvider.GetRequiredService<AppDbContext>();
    var tokenGenerator = serviceProvider.GetRequiredService<IAccessTokenGenerator>();

    // Gera usuario fake
    var user = UserBuilder.Build();

    // Salva no banco em memoria
    await dbContext.Users.AddAsync(user);
    await dbContext.SaveChangesAsync();

    // Gera token valido
    var tokens = tokenGenerator.Generate(user);

    // Armazena para uso nos testes
    User = new UserIdentityManager(user, tokens, password);
}
```

## UserIdentityManager — metodos disponiveis

```csharp
public class UserIdentityManager
{
    private readonly User _user;
    private readonly TokensDto _tokens;
    private readonly string _password;

    public string GetEmail() => _user.Email;
    public string GetName() => _user.Name;
    public string GetPassword() => _password;
    public string GetAccessToken() => _tokens.AccessToken;
}
```

## Teste de sucesso completo

```csharp
public class GetUserProfileTest : CustomClassFixture
{
    private readonly UserIdentityManager _user;

    public GetUserProfileTest(CustomWebApplicationFactory factory)
        : base(factory, "/users")
    {
        _user = factory.User;
    }

    [Fact]
    public async Task Success()
    {
        // Act — faz GET com token valido
        var response = await DoGet(baseUrl, token: _user.GetAccessToken());

        // Assert — status code
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // Assert — corpo da resposta
        await using var responseBody = await response.Content.ReadAsStreamAsync();
        var responseData = await JsonDocument.ParseAsync(responseBody);

        responseData.RootElement.GetProperty("name").GetString()
            .Should().Be(_user.GetName());
        responseData.RootElement.GetProperty("email").GetString()
            .Should().Be(_user.GetEmail());
    }
}
```

## Teste de token invalido completo

```csharp
public class GetUserProfileInvalidTokenTest : CustomClassFixture
{
    public GetUserProfileInvalidTokenTest(CustomWebApplicationFactory factory)
        : base(factory, "/users") { }

    [Fact]
    public async Task Error_Invalid_Token()
    {
        var response = await DoGet(baseUrl, token: "invalid-token");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Error_Empty_Token()
    {
        var response = await DoGet(baseUrl, token: string.Empty);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

## O que o DoGet faz internamente (CustomClassFixture)

```csharp
// Metodo herdado de CustomClassFixture
protected async Task<HttpResponseMessage> DoGet(
    string url,
    string? token = null,
    string? culture = null)
{
    var request = new HttpRequestMessage(HttpMethod.Get, url);

    if (!string.IsNullOrEmpty(token))
        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

    if (!string.IsNullOrEmpty(culture))
        request.Headers.AcceptLanguage.Add(
            new StringWithQualityHeaderValue(culture));

    return await _client.SendAsync(request);
}
```

## Controller sendo testado

```csharp
[HttpGet]
[AuthenticatedUser]  // <-- Este atributo e o que os testes de token validam
public async Task<IActionResult> GetProfile()
{
    var response = await _getUserProfileUseCase.Execute();
    return Ok(response);
}
```

## Fluxo do AuthenticatedUserFilter quando token e invalido

```csharp
public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
{
    var token = context.HttpContext.Request.Headers["Authorization"].ToString();

    // Se token vazio ou invalido, lanca UnauthorizedException
    // que resulta em UnauthorizedObjectResult com mensagem de erro
}
```

## Padrao para adicionar em novos endpoints autenticados

Sempre que criar um novo endpoint com `[AuthenticatedUser]`, crie dois arquivos de teste:

```csharp
// 1. {Endpoint}Test.cs — cenario de sucesso
[Fact]
public async Task Success()
{
    var response = await DoGet(baseUrl, token: _user.GetAccessToken());
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    // + asserts no corpo
}

// 2. {Endpoint}InvalidTokenTest.cs — cenarios de erro
[Fact]
public async Task Error_Invalid_Token()
{
    var response = await DoGet(baseUrl, token: "invalid-token");
    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}

[Fact]
public async Task Error_Empty_Token()
{
    var response = await DoGet(baseUrl, token: string.Empty);
    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}
```