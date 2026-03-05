---
name: rs-csharp-dotnet-maui-testes-integracao-perfil-login
description: "Enforces integration test patterns for login and profile update endpoints in C#/.NET Web APIs. Use when user asks to 'write integration tests', 'test login endpoint', 'test profile update', 'test authenticated endpoints', or 'add API tests'. Applies patterns: separate success/error test methods, invalid token test classes for authenticated routes, proper HTTP verb matching, JSON response validation with JsonDocument. Make sure to use this skill whenever creating integration tests for .NET API controllers. Not for unit tests, frontend tests, or database migration tasks."
---

# Testes de Integracao para Login e Update de Perfil

> Cada endpoint da API precisa de testes de sucesso, erro, e (se autenticado) token invalido — sempre espelhando o verbo HTTP e status code reais do controller.

## Rules

1. **Espelhe o verbo HTTP do controller** — se o controller usa `[HttpPost]`, o teste usa `DoPost`; se usa `[HttpPut]`, usa `DoPut`, porque divergencia entre teste e controller esconde bugs reais
2. **Separe testes de token invalido em classe propria** — endpoints autenticados precisam de uma classe dedicada testando token invalido e token vazio, porque essa validacao e transversal e reutilizavel
3. **Classes de infraestrutura devem ser Internal** — exceto a classe de DependencyInjectionExtension que precisa ser Public para a API registrar servicos, porque expor classes internas viola encapsulamento
4. **Use InternalsVisibleTo para projetos de teste** — `[assembly: InternalsVisibleTo("WebAPI.Tests")]` no namespace do projeto de infraestrutura, porque permite acesso sem quebrar encapsulamento
5. **UseInMemoryDatabase aceita qualquer nome** — o parametro e apenas o databaseName, nao precisa ser um valor especifico, porque versoes antigas exigiam nome fixo mas isso nao se aplica mais
6. **Valide propriedades do JSON com JsonDocument** — parse a resposta como string, converta para JsonDocument e verifique cada propriedade individualmente, porque garante que a estrutura da resposta esta correta

## How to write

### Teste de login com sucesso
```csharp
[Fact]
public async Task Success()
{
    var request = new RequestLoginJson
    {
        Email = _user.Email,
        Password = _user.Password
    };

    var response = await DoPost(baseUrl: "login", request: request);

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var body = await response.Content.ReadAsStringAsync();
    var document = JsonDocument.Parse(body);
    var root = document.RootElement;

    root.GetProperty("id").GetGuid().Should().NotBeEmpty();
    root.GetProperty("name").GetString().Should().Be(_user.Name);
    root.GetProperty("accessToken").GetString().Should().NotBeNullOrEmpty();
}
```

### Teste de login com erro
```csharp
[Fact]
public async Task Error_Invalid_Credentials()
{
    var request = new RequestLoginJsonBuilder().Build();

    var response = await DoPost(baseUrl: "login", request: request);

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    // Valide a mensagem de erro com cultura
}
```

### Teste de update com sucesso (endpoint autenticado)
```csharp
[Fact]
public async Task Success()
{
    var request = new RequestUpdateUserJsonBuilder().Build();
    var token = _userIdentityManager.GetAccessToken();

    var response = await DoPut(baseUrl: "users", request: request, token: token);

    response.StatusCode.Should().Be(HttpStatusCode.NoContent);
}
```

### Classe de token invalido (para qualquer endpoint autenticado)
```csharp
public class UpdateUserInvalidTokenTest : CustomClassFixture
{
    [Fact]
    public async Task Error_Invalid_Token()
    {
        var request = new RequestUpdateUserJsonBuilder().Build();
        var response = await DoPut("users", request, token: "invalid-token");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Error_Empty_Token()
    {
        var request = new RequestUpdateUserJsonBuilder().Build();
        var response = await DoPut("users", request, token: string.Empty);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

## Example

**Before (modificador de acesso incorreto):**
```csharp
// PlanShareDBContext.cs
public class PlanShareDBContext : DbContext { }
```

**After (com Internal + InternalsVisibleTo):**
```csharp
using System.Runtime.CompilerServices;
[assembly: InternalsVisibleTo("WebAPI.Tests")]

namespace Infrastructure;

internal class PlanShareDBContext : DbContext { }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint retorna corpo (200 OK) | Parse JSON, valide cada propriedade |
| Endpoint retorna NoContent (204) | Valide apenas o StatusCode |
| Endpoint requer autenticacao | Crie classe separada para token invalido/vazio |
| Resposta identica a outro endpoint | Reutilize a validacao (ctrl-c ctrl-v e valido aqui) |
| Fluxo ainda nao implementado completamente | Nao escreva teste ainda, espere o fluxo estar completo |
| Executando testes | Execute TODOS de uma vez pelo Test Explorer para garantir que rodam em paralelo sem erros |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `public class PlanShareDBContext` (infraestrutura) | `internal class PlanShareDBContext` + InternalsVisibleTo |
| Token invalido testado dentro do teste de sucesso | Classe separada `{Endpoint}InvalidTokenTest` |
| `UseInMemoryDatabase("PlanShareDbContext")` como obrigatorio | `UseInMemoryDatabase("QualquerNome")` — e apenas o nome do DB |
| Teste de PUT para endpoint que e POST | Verifique o verbo no controller antes de escrever o teste |
| Testar fluxo parcialmente implementado | Teste apenas fluxos completos no aplicativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
