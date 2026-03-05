---
name: rs-csharp-dotnet-maui-integration-tests-profile
description: "Applies integration test patterns for authenticated API endpoints in C#/.NET projects. Use when user asks to 'write integration tests', 'test API endpoint', 'test authenticated route', 'test user profile endpoint', or 'add integration tests for controller'. Covers success and error scenarios including invalid/empty tokens with CustomClassFixture pattern. Make sure to use this skill whenever creating integration tests for authenticated .NET endpoints. Not for unit tests, frontend tests, or non-authenticated endpoints."
---

# Testes de Integracao para Endpoints Autenticados (.NET)

> Teste de integracao para endpoints autenticados deve cobrir o cenario de sucesso E os cenarios de token invalido/vazio, garantindo que o atributo de autenticacao esta presente.

## Rules

1. **Sempre herde de CustomClassFixture** — configure a base URL do endpoint no construtor, porque isso padroniza o setup e reutiliza a infraestrutura de banco em memoria
2. **Extraia o UserIdentityManager via Factory** — armazene em propriedade `private readonly` para acessar token, email e nome nos asserts, porque o banco em memoria ja foi populado no StartDatabase
3. **Teste sucesso E erros em classes separadas** — `GetUserProfileTest` para sucesso, `GetUserProfileInvalidTokenTest` para tokens invalidos, porque separa responsabilidades e facilita manutencao
4. **Valide o corpo da resposta no cenario de sucesso** — leia como string, parse para JsonDocument e faca asserts nos campos retornados, porque garantir apenas status code nao verifica se os dados estao corretos
5. **Sempre teste token invalido E token vazio** — sao dois cenarios distintos que validam que o atributo `AuthenticatedUser` esta presente no endpoint, porque esquecer o atributo e um erro silencioso que so testes de integracao capturam
6. **Status code unauthorized e suficiente nos cenarios de erro** — validar a mensagem de erro e opcional, porque o importante e garantir que a API rejeita a requisicao

## How to write

### Teste de sucesso

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
        var response = await DoGet(baseUrl, token: _user.GetAccessToken());

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await using var responseBody = await response.Content.ReadAsStreamAsync();
        var responseData = await JsonDocument.ParseAsync(responseBody);

        responseData.RootElement.GetProperty("name").GetString()
            .Should().Be(_user.GetName());
        responseData.RootElement.GetProperty("email").GetString()
            .Should().Be(_user.GetEmail());
    }
}
```

### Testes de token invalido/vazio

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

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint com `[AuthenticatedUser]` | Crie classe separada de testes com token invalido/vazio |
| Endpoint GET sem body | Passe apenas token no DoGet, sem request body |
| Resposta com dados do usuario | Assert nos campos do JsonDocument contra UserIdentityManager |
| Endpoint sem mensagem de erro localizada | Nao precisa passar cultura no DoGet |
| Novo endpoint autenticado | Copie o padrao de invalid token test — garante que o atributo nao foi esquecido |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Testar apenas sucesso em endpoint autenticado | Sempre adicionar testes de token invalido/vazio |
| Hardcodar email/nome nos asserts | Usar `_user.GetEmail()`, `_user.GetName()` do UserIdentityManager |
| Misturar testes de sucesso e erro na mesma classe | Separar em classes distintas |
| Criar usuario manualmente no teste | Reutilizar o usuario do StartDatabase via Factory.User |
| Ignorar validacao do corpo da resposta | Parsear JsonDocument e verificar campos retornados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
