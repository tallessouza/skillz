# Code Examples: Testes de Integracao para Alterar Senha

## Estrutura do projeto

```
WebAPI.Tests/
└── Users/
    └── ChangePassword/
        ├── ChangeUserPasswordSuccessTest.cs
        ├── ChangeUserPasswordErrorTest.cs
        └── ChangeUserPasswordInvalidTokenTest.cs
```

## Teste de sucesso completo

```csharp
public class ChangeUserPasswordSuccessTest : CustomClassFixture
{
    private const string BaseUrl = "/users/change-password";
    private readonly UserIdentityManager _user;

    public ChangeUserPasswordSuccessTest(CustomWebApplicationFactory factory)
        : base(factory)
    {
        _user = factory.GetUser();
    }

    [Fact]
    public async Task Success()
    {
        // Cria request com Builder (gera nova senha aleatoria valida)
        var request = new RequestChangePasswordBuilder().Build();

        // Substitui o password pela senha real do usuario no banco
        request.Password = _user.GetPassword();

        // PUT com token valido
        var response = await DoPut(
            BaseUrl,
            request,
            token: _user.GetAccessToken());

        // Endpoint retorna 204 No Content em caso de sucesso
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
```

## Teste de erro com cultura/idioma

```csharp
public class ChangeUserPasswordErrorTest : CustomClassFixture
{
    private const string BaseUrl = "/users/change-password";
    private readonly UserIdentityManager _user;

    public ChangeUserPasswordErrorTest(CustomWebApplicationFactory factory)
        : base(factory)
    {
        _user = factory.GetUser();
    }

    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Password_Empty(string culture)
    {
        // Instancia na mao porque precisa controlar ambas propriedades
        var request = new RequestChangePasswordJson
        {
            Password = _user.GetPassword(),
            NewPassword = string.Empty  // senha vazia = erro de validacao
        };

        var response = await DoPut(
            BaseUrl,
            request,
            token: _user.GetAccessToken(),
            culture: culture);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var responseBody = await response.Content.ReadAsStreamAsync();
        var jsonDocument = await JsonDocument.ParseAsync(responseBody);

        var errors = jsonDocument.RootElement
            .GetProperty("errors")
            .EnumerateArray()
            .Select(e => e.GetString())
            .ToList();

        // Mensagem esperada baseada na cultura (en-US ou pt-BR)
        var expectedMessage = ResourceErrorMessages
            .ResourceManager
            .GetString("PASSWORD_EMPTY", new CultureInfo(culture));

        errors.Should().SatisfyRespectively(
            e => e.Should().NotBeNullOrEmpty().And.Be(expectedMessage)
        );
    }
}
```

## Teste de token invalido

```csharp
public class ChangeUserPasswordInvalidTokenTest : CustomClassFixture
{
    private const string BaseUrl = "/users/change-password";

    public ChangeUserPasswordInvalidTokenTest(CustomWebApplicationFactory factory)
        : base(factory) { }

    [Fact]
    public async Task Error_Invalid_Token()
    {
        // Request VALIDA — queremos garantir que o erro e do token, nao da request
        var request = new RequestChangePasswordBuilder().Build();

        var response = await DoPut(
            BaseUrl,
            request,
            token: "invalid-token-here");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Error_Empty_Token()
    {
        var request = new RequestChangePasswordBuilder().Build();

        var response = await DoPut(
            BaseUrl,
            request,
            token: string.Empty);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

## Rota do endpoint sob teste

```csharp
// No controller — a rota e composta por:
// /users (nome do controller) + /change-password (rota especifica do PUT)
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(
        [FromBody] RequestChangePasswordJson request)
    {
        // ... executa use case
        return NoContent(); // 204
    }
}
```

## Diagrama de execucao paralela (o problema)

```
Classe A (banco A)          Classe B (banco B)
┌──────────────────┐       ┌──────────────────┐
│ Test1() ─────────│──┐    │ Test1() ─────────│──┐
│ Test2() ─────────│──┤    │ Test2() ─────────│──┤
│ Test3() ─────────│──┘    │ Test3() ─────────│──┘
└──────────────────┘       └──────────────────┘
     sequencial                 sequencial
         ↕                          ↕
    em paralelo entre classes

Dentro da mesma classe: mesmo banco, ordem indefinida
Entre classes: bancos diferentes, execucao paralela
```

## Builder vs instancia manual — quando usar cada

```csharp
// USE BUILDER: quando so precisa alterar 1 propriedade
var request = new RequestChangePasswordBuilder().Build();
request.Password = _user.GetPassword();
// NewPassword ja foi gerada automaticamente pelo Builder

// USE INSTANCIA MANUAL: quando precisa controlar tudo
var request = new RequestChangePasswordJson
{
    Password = _user.GetPassword(),
    NewPassword = string.Empty  // valor especifico pro teste
};
```