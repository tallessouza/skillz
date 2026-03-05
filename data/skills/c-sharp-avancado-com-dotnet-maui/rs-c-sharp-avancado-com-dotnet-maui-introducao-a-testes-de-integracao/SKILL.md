---
name: rs-csharp-dotnet-maui-testes-integracao
description: "Enforces .NET integration test setup patterns using WebApplicationFactory and HttpClient. Use when user asks to 'create integration tests', 'test my API endpoint', 'setup WebApplicationFactory', 'test controller', or 'add API tests' in .NET/ASP.NET Core projects. Applies rules: use IClassFixture with WebApplicationFactory, expose Program as public partial class, use CreateClient for HttpClient, validate HTTP status codes. Make sure to use this skill whenever setting up integration tests in ASP.NET Core. Not for unit tests, mocking, or frontend testing."
---

# Testes de Integracao com WebApplicationFactory

> Testes de integracao executam a API de verdade — requisicoes HTTP reais, injecao de dependencia real, fluxo completo do controller ao repositorio.

## Rules

1. **Use IClassFixture<WebApplicationFactory<Program>>** — esta interface sinaliza ao .NET que a classe contem testes de integracao e provisiona o servidor automaticamente
2. **Exponha Program como public partial class** — sem isso, o projeto de teste nao consegue referenciar o entry point da API, porque Program nao tem classe publica por padrao
3. **Use CreateClient() para obter HttpClient** — o client ja vem configurado com a URL base do servidor de teste, basta concatenar o path do endpoint
4. **Armazene HttpClient como campo readonly** — em testes de integracao, reutilizar a instancia no construtor e aceitavel (excecao a regra de nao reutilizar instancias)
5. **Use PostAsJsonAsync para enviar objetos** — serializa automaticamente para JSON, evitando conversao manual
6. **Nunca use banco de producao em testes** — testes de integracao poluem a base de dados real; use banco em memoria (InMemory) para dados temporarios
7. **Mocks apenas para servicos externos** — servicos que cobram, fazem upload para nuvem ou se comunicam com terceiros devem ser mockados; o restante do fluxo deve ser real

## How to write

### Configurar Program.cs da API

```csharp
// No final do arquivo Program.cs da API
// Necessario para que o projeto de teste consiga referenciar
public partial class Program { }
```

### Classe de teste de integracao

```csharp
public class RegisterUserTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTests(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Sucesso()
    {
        var request = new RegisterUserRequest
        {
            Name = "Rafael",
            Email = "rafael@email.com",
            Password = "senha123"
        };

        var response = await _httpClient.PostAsJsonAsync("/users", request);

        response.StatusCode.ShouldBe(HttpStatusCode.Created);
    }
}
```

## Example

**Before (tentando testar API sem WebApplicationFactory):**
```csharp
// Errado: instanciando controller diretamente, sem servidor real
var controller = new UsersController(useCase);
var result = await controller.Register(request);
// Isso e teste de unidade, nao de integracao
```

**After (teste de integracao correto):**
```csharp
public class RegisterUserTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTests(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Sucesso()
    {
        var request = RequestRegisterUserJsonBuilder.Build();

        var response = await _httpClient.PostAsJsonAsync("/users", request);

        response.StatusCode.ShouldBe(HttpStatusCode.Created);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando endpoint da API | Use IClassFixture + WebApplicationFactory |
| Servico externo (Azure, AWS, pagamento) | Mock o servico para nao poluir/cobrar |
| Banco de dados | Use InMemory database (nao o banco real) |
| Precisa depurar o teste | Coloque breakpoint no controller E no teste |
| Validando resposta HTTP | Verifique StatusCode (Created, OK, BadRequest) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instanciar controller direto no teste de integracao | Use WebApplicationFactory + HttpClient |
| Usar banco de producao/desenvolvimento nos testes | Use banco InMemory |
| Criar HttpClient manualmente com URL hardcoded | Use factory.CreateClient() |
| Esquecer `public partial class Program` | Adicione no final do Program.cs |
| Fazer upload real para nuvem em teste | Mock o servico de storage |
| Nao colocar atributo [Fact] no metodo | Sempre marque com [Fact] |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
