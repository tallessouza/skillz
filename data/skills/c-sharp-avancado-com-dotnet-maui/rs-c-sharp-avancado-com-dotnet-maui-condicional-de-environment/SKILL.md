---
name: rs-csharp-avancado-condicional-environment
description: "Enforces environment-based conditional execution in ASP.NET Core APIs when configuring services and middleware for integration tests. Use when user asks to 'setup integration tests', 'configure test environment', 'skip migrations in tests', 'use in-memory database', or 'check environment in ASP.NET'. Applies IWebHostEnvironment checks instead of appsettings flags, extracts environment checks to extension methods. Make sure to use this skill whenever configuring ASP.NET Core dependency injection that should behave differently in test vs production. Not for unit test setup, mocking, or test assertion patterns."
---

# Condicional de Environment no ASP.NET Core

> Use IWebHostEnvironment para tomar decisoes baseadas no ambiente de execucao — nunca flags manuais em appsettings.json.

## Rules

1. **Use IWebHostEnvironment, nunca flags em appsettings** — `environment.IsTest()` nao `config["InMemoryTest"]`, porque o framework ja fornece esse mecanismo e flags manuais reinventam a roda
2. **Extraia checks de environment para extension methods** — crie `IsTest()` como extensao de `IWebHostEnvironment`, porque se o nome do ambiente mudar, troca em um lugar so
3. **Nao execute migrations em ambiente de teste** — o banco em memoria cria tabelas automaticamente a partir dos DbSets do DbContext, migrations causam erro
4. **Nao registre DbContext com connection string em testes** — o CustomWebApplicationFactory ja configura o banco em memoria, registrar novamente causa conflito
5. **Adicione FrameworkReference para usar ASP.NET Core em class libraries** — `<FrameworkReference Include="Microsoft.AspNetCore.App" />` no .csproj da biblioteca, porque IWebHostEnvironment nao esta disponivel por padrao em class libraries
6. **Use `IsFalse` pattern para clareza** — `if(environment.IsTest().IsFalse())` em vez de `if(environment.IsTest() == false)`, porque comunica intencao melhor

## How to write

### Extension method de environment

```csharp
// Em Infrastructure/Extensions/WebHostEnvironmentExtensions.cs
public static class WebHostEnvironmentExtensions
{
    public static bool IsTest(this IWebHostEnvironment environment)
    {
        return environment.IsEnvironment("Test");
    }
}
```

### Condicional no registro de servicos

```csharp
public static void AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration,
    IWebHostEnvironment environment)
{
    if (environment.IsTest().IsFalse())
    {
        services.AddDbContext(configuration);
        services.AddFluentMigrator(configuration);
    }
}
```

### Condicional no pipeline (Program.cs)

```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsTest().IsFalse())
{
    MigrateDatabase(app);
}
```

### FrameworkReference no .csproj da class library

```xml
<ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
</ItemGroup>
```

## Example

**Before (flag manual em appsettings — reinventando a roda):**
```csharp
// appsettings.Test.json
{ "InMemoryTest": true }

// ConfigurationExtensions.cs
public static bool IsNotTestEnvironment(this IConfiguration configuration)
{
    return configuration.GetValue<bool>("InMemoryTest") == false;
}
```

**After (usando IWebHostEnvironment — correto):**
```csharp
// WebHostEnvironmentExtensions.cs
public static bool IsTest(this IWebHostEnvironment environment)
{
    return environment.IsEnvironment("Test");
}

// DependencyInjectionExtension.cs
if (environment.IsTest().IsFalse())
{
    services.AddDbContext(configuration);
    services.AddFluentMigrator(configuration);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico depende de connection string | Guard com `IsTest().IsFalse()` |
| Middleware so para dev (Swagger) | Use `IsDevelopment()` built-in |
| Banco em memoria nos testes | Nao registre DbContext na API, deixe o CustomWebApplicationFactory fazer |
| Migrations | Nunca execute em ambiente de teste com banco em memoria |
| String do environment no IsEnvironment() | Deve ser identica a do UseEnvironment() no test server |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `config.GetValue<bool>("InMemoryTest")` | `environment.IsTest()` |
| Check de environment inline repetido | Extension method `IsTest()` |
| Executar migrations com banco em memoria | Deixar o provider criar tabelas via DbSets |
| Registrar DbContext duas vezes (API + test factory) | Guard condicional no registro da API |
| Usar IWebHostEnvironment sem FrameworkReference em class library | Adicionar `<FrameworkReference Include="Microsoft.AspNetCore.App" />` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
