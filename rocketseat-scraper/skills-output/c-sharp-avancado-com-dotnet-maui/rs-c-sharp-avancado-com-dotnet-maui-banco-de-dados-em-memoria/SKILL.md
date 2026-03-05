---
name: rs-csharp-dotnet-maui-banco-memoria
description: "Applies in-memory database configuration for .NET integration tests using Entity Framework Core InMemory provider. Use when user asks to 'write integration tests', 'configure test database', 'setup in-memory database', 'avoid real database in tests', or 'create custom WebApplicationFactory'. Ensures test isolation with separate environment, custom server factory, and InMemory DbContext. Make sure to use this skill whenever setting up .NET integration test infrastructure. Not for production database configuration, unit tests without database, or EF Core migrations."
---

# Banco de Dados em Memória para Testes de Integração .NET

> Testes de integração devem usar banco de dados em memória para evitar poluir dados reais e garantir isolamento completo.

## Rules

1. **Nunca use banco real em testes de integração** — use `Microsoft.EntityFrameworkCore.InMemory`, porque dados de teste poluem a base real e criam dependência externa
2. **Crie um ambiente separado para testes** — use `builder.UseEnvironment("test")` no custom factory, porque evita ler connection strings e chaves de serviços pagos do ambiente de desenvolvimento
3. **Tenha um appsettings por ambiente** — crie `appsettings.test.json` sem connection string, porque o serviço de injeção de dependência procura pelo arquivo do ambiente ativo
4. **Herde de WebApplicationFactory** — nunca implemente servidor do zero, sobrescreva apenas `ConfigureWebHost`, porque o .NET já fornece toda a infraestrutura
5. **Versão do pacote NuGet deve acompanhar o .NET** — se usa .NET 9, instale a última versão que começa com 9, porque versões incompatíveis causam erros silenciosos
6. **Desabilite migrations no ambiente de teste** — banco em memória não suporta migrations, porque ele é efêmero e recriado a cada execução

## How to write

### CustomWebApplicationFactory

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("test");

        builder.ConfigureServices(services =>
        {
            var provider = services.AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            services.AddDbContext<MyDbContext>(options =>
            {
                options.UseInMemoryDatabase("InMemoryDbForTesting");
                options.UseInternalServiceProvider(provider);
            });
        });
    }
}
```

### Classe de teste usando o custom factory

```csharp
public class MyFeatureTest : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public MyFeatureTest(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Should_Execute_Without_Real_Database()
    {
        // O client usa banco em memória automaticamente
        var response = await _client.PostAsync("/api/resource", content);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

### appsettings.test.json

```json
{
  "Settings": {
    "Jwt": {
      "ExpirationInMinutes": 15,
      "SigningKey": "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    }
  }
}
```

## Example

**Before (teste poluindo banco real):**
```csharp
// Classe de teste usa WebApplicationFactory<Program> direto
public class UserTest : IClassFixture<WebApplicationFactory<Program>>
{
    // Lê connection string do appsettings.development.json
    // Dados de teste vão para o banco real
    // Pode consumir serviços pagos por acidente
}
```

**After (com banco em memória isolado):**
```csharp
public class UserTest : IClassFixture<CustomWebApplicationFactory>
{
    // Usa ambiente "test" com appsettings.test.json
    // Banco em memória, descartado ao final dos testes
    // Zero risco de poluir dados ou consumir serviços pagos
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto de testes de integração | Criar `CustomWebApplicationFactory` + `appsettings.test.json` antes de qualquer teste |
| DbContext registrado com MySQL/SQL Server no DI | Sobrescrever no custom factory com InMemory, não alterar o registro original |
| Precisa de migrations no teste | Não use — banco em memória não suporta; se precisa de schema real, use SQLite in-memory |
| Múltiplas classes de teste | Todas referenciam o mesmo `CustomWebApplicationFactory` via `IClassFixture` |
| Chaves/secrets no appsettings.test.json | Use valores fictícios seguros, nunca copie secrets de produção |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `IClassFixture<WebApplicationFactory<Program>>` em testes de integração | `IClassFixture<CustomWebApplicationFactory>` |
| Connection string no appsettings.test.json | Remova a seção ConnectionStrings inteira |
| `services.AddDbContext` com `UseMySql`/`UseSqlServer` no custom factory | `services.AddDbContext` com `UseInMemoryDatabase` |
| Migrations executando em ambiente de teste | Verificar ambiente antes de chamar `MigrateDatabase()` |
| Pacote EF Core InMemory versão diferente do .NET | Mesma major version: .NET 9 → pacote 9.x.x |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
