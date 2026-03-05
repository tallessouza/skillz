# Code Examples: Condicional de Environment

## 1. CustomWebApplicationFactory (contexto da aula anterior)

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test"); // Define o ambiente como "Test"

        builder.ConfigureServices(services =>
        {
            // Remove o DbContext registrado pela API
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<PlanShareDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            // Adiciona banco em memoria
            services.AddDbContext<PlanShareDbContext>(options =>
            {
                options.UseInMemoryDatabase("InMemoryDbForTesting");
            });
        });
    }
}
```

## 2. Extension method de environment

```csharp
using Microsoft.AspNetCore.Hosting;

namespace PlanShare.Infrastructure.Extensions;

public static class WebHostEnvironmentExtensions
{
    public static bool IsTest(this IWebHostEnvironment environment)
    {
        return environment.IsEnvironment("Test");
    }
}
```

## 3. DependencyInjectionExtension com guard

```csharp
public static class DependencyInjectionExtension
{
    public static void AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        if (environment.IsTest().IsFalse())
        {
            AddDbContext(services, configuration);
            AddFluentMigrator(services, configuration);
        }

        // Outros registros que funcionam em qualquer ambiente
        AddRepositories(services);
    }
}
```

## 4. Program.cs com condicionais de environment

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(
    builder.Configuration,
    builder.Environment); // Passa o environment

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsTest().IsFalse())
{
    MigrateDatabase(app);
}

app.Run();
```

## 5. Chamada no Program.cs (antes — com flag)

```csharp
// ERRADO — reinventando a roda
if (configuration.IsNotTestEnvironment())
{
    MigrateDatabase(app);
}

// Onde IsNotTestEnvironment lia de appsettings:
public static bool IsNotTestEnvironment(this IConfiguration configuration)
{
    return configuration.GetValue<bool>("InMemoryTest") == false;
}
```

## 6. .csproj da class library com FrameworkReference

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
  </ItemGroup>

  <!-- Outras referencias -->

</Project>
```

## 7. Classe de teste com tipo correto

```csharp
// ERRADO — tipo antigo
public class UserControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    public UserControllerTests(WebApplicationFactory<Program> factory) { }
}

// CORRETO — tipo customizado
public class UserControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    public UserControllerTests(CustomWebApplicationFactory factory) { }
}
```

## 8. Fluxo de execucao durante o teste

```
1. Test runner instancia CustomWebApplicationFactory
2. ConfigureWebHost executa:
   - UseEnvironment("Test")
   - Configura banco em memoria
3. Program.cs executa:
   - AddInfrastructure recebe environment (Name = "Test")
   - environment.IsTest() retorna true
   - true.IsFalse() retorna false
   - NAO registra DbContext com connection string
   - NAO registra FluentMigrator
4. Pipeline executa:
   - IsDevelopment() = false → Swagger NAO adicionado
   - IsTest().IsFalse() = false → Migrations NAO executadas
5. Teste executa request POST
6. Controller usa DbContext em memoria
7. Dados NAO poluem banco real
```