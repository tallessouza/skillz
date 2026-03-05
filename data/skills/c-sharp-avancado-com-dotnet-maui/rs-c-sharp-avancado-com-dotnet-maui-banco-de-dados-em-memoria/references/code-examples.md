# Code Examples: Banco de Dados em Memória para Testes de Integração

## 1. Criando a classe CustomWebApplicationFactory

Arquivo criado na raiz do projeto de testes (`WebApiTests/CustomWebApplicationFactory.cs`):

```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("test");

        builder.ConfigureServices(services =>
        {
            var provider = services.AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            services.AddDbContext<PlanShareDbContext>(options =>
            {
                options.UseInMemoryDatabase("InMemoryDbForTesting");
                options.UseInternalServiceProvider(provider);
            });
        });
    }
}
```

### Passo a passo:

1. **Herança:** `CustomWebApplicationFactory : WebApplicationFactory<Program>` — herda do servidor padrão do .NET
2. **Override:** `ConfigureWebHost` — único método que precisa ser sobrescrito
3. **Ambiente:** `builder.UseEnvironment("test")` — força o ambiente de testes
4. **Provider:** `services.AddEntityFrameworkInMemoryDatabase().BuildServiceProvider()` — configura o provider InMemory
5. **DbContext:** `services.AddDbContext<PlanShareDbContext>` — registra o contexto com banco em memória
6. **UseInMemoryDatabase:** passa o nome `"InMemoryDbForTesting"` como identificador
7. **UseInternalServiceProvider:** conecta o provider criado anteriormente

## 2. Atualizando a classe de teste

Antes (usando `WebApplicationFactory<Program>` diretamente):

```csharp
public class RegisterUserTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTest(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }
}
```

Depois (usando o custom factory):

```csharp
public class RegisterUserTest : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTest(CustomWebApplicationFactory factory)
    {
        _httpClient = factory.CreateClient();
    }
}
```

A mudança é mínima: trocar `WebApplicationFactory<Program>` por `CustomWebApplicationFactory` em dois lugares (interface e construtor).

## 3. Arquivo appsettings.test.json

Criado no projeto da API (não no projeto de testes), copiando o `appsettings.development.json`:

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

Diferenças em relação ao `appsettings.development.json`:
- **ConnectionStrings removida** — não existe banco real para conectar
- **ExpirationInMinutes reduzida** — testes executam rápido, não precisa de token com vida longa
- **SigningKey diferente** — valores fictícios para o ambiente de teste (32 T's em vez de 32 W's)

## 4. Instalação do pacote NuGet

Via CLI:
```bash
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 9.0.10
```

Via Visual Studio:
1. Botão direito no projeto `WebApiTests`
2. "Manage NuGet Packages"
3. Aba "Browse"
4. Buscar "Microsoft.EntityFrameworkCore.InMemory"
5. Instalar a versão que corresponde ao .NET do projeto (9.x.x para .NET 9)

## 5. O que NÃO pode executar no ambiente de teste

No `DependencyInjectionExtension`, estas funções não devem executar:

```csharp
// NÃO executar em testes — tenta ler ConnectionString que não existe
services.AddDbContext<PlanShareDbContext>(options =>
{
    options.UseMySql(connectionString, serverVersion);
    // ou
    options.UseSqlServer(connectionString);
});

// NÃO executar em testes — InMemory não suporta migrations
MigrateDatabase(services);
```

O `CustomWebApplicationFactory` substitui o registro do DbContext, mas é necessário garantir que o código original não tente executar migrations no ambiente de teste. Na aula seguinte, o instrutor promete uma solução mais elegante para essa verificação (em vez de ler uma propriedade do appsettings).