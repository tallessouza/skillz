---
name: rs-csharp-avancado-testes-integracao-senha
description: "Enforces test isolation patterns for integration tests that mutate shared database state in .NET/xUnit. Use when user asks to 'write integration tests', 'test an endpoint that changes data', 'fix flaky tests', or 'tests fail when run together but pass individually'. Applies rules: separate mutating success tests from error tests into distinct classes, shared database per class awareness, parallel class execution understanding. Make sure to use this skill whenever writing .NET integration tests that modify database state. Not for unit tests, read-only endpoint tests, or frontend testing."
---

# Testes de Integracao com Mutacao de Estado

> Separe testes de integracao que mutam estado em classes distintas por tipo de cenario (sucesso vs erro), porque classes compartilham o mesmo banco de dados e executam funcoes em ordem indefinida.

## Rules

1. **Uma classe por tipo de cenario** — classe de sucesso separada da classe de erro, porque funcoes dentro da mesma classe compartilham o mesmo banco de dados e mutacoes de uma afetam a outra
2. **Nunca confie na ordem de execucao** — o .NET define a ordem das funcoes dentro da classe, voce nao controla isso
3. **Identifique mutacoes perigosas** — se o teste altera senha, deleta registro ou modifica estado, ele DEVE ficar isolado de testes que dependem do estado original
4. **Token valido obrigatorio** — endpoints autenticados precisam de token valido no teste; crie classe separada para testar tokens invalidos/vazios
5. **Teste token invalido com request valida** — envie request valida + token invalido para garantir que a API rejeita corretamente (401), nao por erro de validacao
6. **Use parametros nomeados quando ambiguo** — `token: user.GetAccessToken()` deixa claro o que cada argumento representa

## How to write

### Estrutura de classes separadas

```csharp
// Classe 1: apenas sucesso (muta o banco)
public class ChangeUserPasswordSuccessTest : CustomClassFixture
{
    private const string BaseUrl = "/users/change-password";
    private readonly UserIdentityManager _user;

    [Fact]
    public async Task Success()
    {
        var request = new RequestChangePasswordBuilder()
            .Build();
        request.Password = _user.GetPassword();

        var response = await DoPut(BaseUrl, request, token: _user.GetAccessToken());

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}

// Classe 2: apenas erro (depende do estado original)
public class ChangeUserPasswordErrorTest : CustomClassFixture
{
    private const string BaseUrl = "/users/change-password";
    private readonly UserIdentityManager _user;

    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Password_Empty(string culture)
    {
        var request = new RequestChangePasswordJson
        {
            Password = _user.GetPassword(),
            NewPassword = string.Empty
        };

        var response = await DoPut(BaseUrl, request,
            token: _user.GetAccessToken(), culture: culture);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        // ... assert error messages
    }
}

// Classe 3: token invalido (request valida, token invalido)
public class ChangeUserPasswordInvalidTokenTest : CustomClassFixture
{
    [Fact]
    public async Task Error_Invalid_Token() { /* ... */ }

    [Fact]
    public async Task Error_Empty_Token() { /* ... */ }
}
```

### Assert para endpoint sem retorno (204)

```csharp
response.StatusCode.Should().Be(HttpStatusCode.NoContent);
```

### Assert para erros de validacao

```csharp
var responseBody = await response.Content.ReadAsStreamAsync();
var jsonDocument = await JsonDocument.ParseAsync(responseBody);

var errors = jsonDocument.RootElement
    .GetProperty("errors")
    .EnumerateArray()
    .Select(e => e.GetString())
    .ToList();

errors.Should().SatisfyRespectively(
    e => e.Should().NotBeNullOrEmpty().And.Be(expectedMessage)
);
```

## Example

**Before (testes na mesma classe — flaky):**
```csharp
public class ChangeUserPasswordTest : CustomClassFixture
{
    [Fact]
    public async Task Success()
    {
        // Troca a senha no banco — MUTA o estado
        var request = new RequestChangePasswordBuilder().Build();
        request.Password = _user.GetPassword();
        var response = await DoPut(BaseUrl, request, token: _user.GetAccessToken());
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Password_Empty(string culture)
    {
        // _user.GetPassword() retorna a senha ORIGINAL
        // Se Success() executou primeiro, a senha ja mudou no banco!
        var request = new RequestChangePasswordJson
        {
            Password = _user.GetPassword(), // BUG: senha desatualizada
            NewPassword = string.Empty
        };
        // ... pode falhar com 2 erros ao inves de 1
    }
}
```

**After (classes separadas — deterministico):**
```csharp
public class ChangeUserPasswordSuccessTest : CustomClassFixture
{
    [Fact]
    public async Task Success() { /* muta o banco sem afetar outros testes */ }
}

public class ChangeUserPasswordErrorTest : CustomClassFixture
{
    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Password_Empty(string culture) { /* banco intacto */ }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Teste altera estado no banco (PUT/POST/DELETE) | Classe separada para sucesso |
| Teste depende do estado original do banco | Classe separada para erro |
| Testes passam individualmente mas falham juntos | Verificar se compartilham classe com mutacao |
| Endpoint autenticado | Classe adicional para token invalido/vazio |
| Request com Builder mas precisa alterar tudo | Instancie na mao com `new RequestJson { }` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Sucesso e erro de mutacao na mesma classe | Classes separadas por cenario |
| Confiar na ordem de execucao dos testes | Cada teste deve ser independente do estado |
| Testar token invalido com request invalida | Request valida + token invalido (isola a causa) |
| Usar Builder quando precisa alterar todas propriedades | `new RequestJson { Prop1 = x, Prop2 = y }` |
| Ignorar testes flaky como "aleatorios" | Investigar compartilhamento de estado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
