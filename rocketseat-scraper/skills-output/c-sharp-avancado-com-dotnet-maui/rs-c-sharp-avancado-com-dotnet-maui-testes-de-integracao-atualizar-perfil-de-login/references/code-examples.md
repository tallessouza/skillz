# Code Examples: Testes de Integracao para Login e Update de Perfil

## Estrutura completa do LoginTests

```csharp
public class LoginTests : CustomClassFixture
{
    private const string BaseUrl = "login";
    private readonly User _user;
    private readonly UserIdentityManager _userIdentityManager;

    public LoginTests(CustomWebApplicationFactory factory) : base(factory)
    {
        _user = factory.GetUser();
        _userIdentityManager = factory.GetUserIdentityManager();
    }

    [Fact]
    public async Task Success()
    {
        var request = new RequestLoginJson
        {
            Email = _user.Email,
            Password = _user.Password
        };

        var response = await DoPost(baseUrl: BaseUrl, request: request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadAsStringAsync();
        var document = JsonDocument.Parse(body);
        var root = document.RootElement;

        root.GetProperty("id").GetGuid().Should().NotBeEmpty();
        root.GetProperty("name").GetString().Should().Be(_user.Name);
        root.GetProperty("accessToken").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Error_Invalid_Credentials()
    {
        var request = new RequestLoginJsonBuilder().Build();

        var response = await DoPost(baseUrl: BaseUrl, request: request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        await using var responseBody = await response.Content.ReadAsStreamAsync();
        var document = await JsonDocument.ParseAsync(responseBody);
        var errors = document.RootElement.GetProperty("errors").EnumerateArray();

        errors.Should().HaveCount(1);

        var expectedMessage = ResourceErrorMessages
            .ResourceManager
            .GetString("EMAIL_OR_PASSWORD_INVALID", new CultureInfo("en"));

        errors.First().GetString().Should().Be(expectedMessage);
    }
}
```

## Estrutura completa do UpdateUserTest

```csharp
public class UpdateUserTest : CustomClassFixture
{
    private const string BaseUrl = "users";
    private readonly UserIdentityManager _userIdentityManager;

    public UpdateUserTest(CustomWebApplicationFactory factory) : base(factory)
    {
        _userIdentityManager = factory.GetUserIdentityManager();
    }

    [Fact]
    public async Task Success()
    {
        var request = new RequestUpdateUserJsonBuilder().Build();
        var token = _userIdentityManager.GetAccessToken();

        var response = await DoPut(baseUrl: BaseUrl, request: request, token: token);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Error_Empty_Name()
    {
        var request = new RequestUpdateUserJsonBuilder()
            .WithName(string.Empty)
            .Build();

        var token = _userIdentityManager.GetAccessToken();
        var response = await DoPut(baseUrl: BaseUrl, request: request, token: token);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        await using var responseBody = await response.Content.ReadAsStreamAsync();
        var document = await JsonDocument.ParseAsync(responseBody);
        var errors = document.RootElement.GetProperty("errors").EnumerateArray();

        errors.Should().HaveCount(1);

        var expectedMessage = ResourceErrorMessages
            .ResourceManager
            .GetString("NAME_CANNOT_BE_EMPTY", new CultureInfo("en"));

        errors.First().GetString().Should().Be(expectedMessage);
    }
}
```

## Classe de token invalido

```csharp
public class UpdateUserInvalidTokenTest : CustomClassFixture
{
    private const string BaseUrl = "users";

    public UpdateUserInvalidTokenTest(CustomWebApplicationFactory factory) 
        : base(factory) { }

    [Fact]
    public async Task Error_Invalid_Token()
    {
        var request = new RequestUpdateUserJsonBuilder().Build();

        var response = await DoPut(
            baseUrl: BaseUrl, 
            request: request, 
            token: "invalid-token");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Error_Empty_Token()
    {
        var request = new RequestUpdateUserJsonBuilder().Build();

        var response = await DoPut(
            baseUrl: BaseUrl, 
            request: request, 
            token: string.Empty);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

## Correcao do modificador de acesso no DbContext

```csharp
// Antes (ERRADO):
namespace Infrastructure;

public class PlanShareDBContext : DbContext
{
    public DbSet<User> Users { get; set; }
    // ...
}

// Depois (CORRETO):
using System.Runtime.CompilerServices;
[assembly: InternalsVisibleTo("WebAPI.Tests")]

namespace Infrastructure;

internal class PlanShareDBContext : DbContext
{
    public DbSet<User> Users { get; set; }
    // ...
}
```

## CustomWebApplicationFactory — UseInMemoryDatabase

```csharp
// O parametro e apenas o nome do database — qualquer string funciona
services.AddDbContext<PlanShareDBContext>(options =>
    options.UseInMemoryDatabase("TestDatabase")); // qualquer nome aqui

// NAO precisa ser "PlanShareDbContext" como nome — isso era restricao de versoes antigas
```

## Organizacao de pastas dos testes

```
WebAPI.Tests/
├── Login/
│   └── LoginTests.cs              // Sucesso + Erro (credenciais invalidas)
├── User/
│   ├── Register/
│   │   └── RegisterUserTests.cs
│   └── Update/
│       ├── UpdateUserTest.cs              // Sucesso + Erro (nome vazio)
│       └── UpdateUserInvalidTokenTest.cs  // Token invalido + Token vazio
```