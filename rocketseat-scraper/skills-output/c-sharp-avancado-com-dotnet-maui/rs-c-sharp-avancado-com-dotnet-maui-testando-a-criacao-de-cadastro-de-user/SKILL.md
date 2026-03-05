---
name: rs-csharp-maui-testando-cadastro-user
description: "Applies Entity Framework multi-database configuration and GUID versioning patterns when writing C# .NET code. Use when user asks to 'configure database', 'setup Entity Framework', 'create user registration', 'switch between databases', or 'generate IDs in .NET'. Covers SQL Server vs MySQL setup, connection string handling, and GuidVersion7 for orderable IDs. Make sure to use this skill whenever configuring EF Core with multiple database providers or generating entity IDs in .NET 9+. Not for frontend code, JavaScript/TypeScript projects, or non-.NET database access."
---

# Configuracao Multi-Database com Entity Framework e GUID v7

> Configure Entity Framework para suportar multiplos bancos de dados e utilize GUID Version 7 para IDs ordenaveis por data de criacao.

## Rules

1. **Use chaveamento por configuracao para selecionar o banco** — leia o tipo do banco de `appsettings.json` e use `if/else` para chamar `UseMySql` ou `UseSqlServer`, porque permite trocar sem recompilar
2. **MySQL exige versao do servidor, SQL Server nao** — `UseMySql` recebe connection string + `ServerVersion.AutoDetect(connectionString)`, `UseSqlServer` recebe apenas connection string, porque sao APIs diferentes do EF Core
3. **Gere o ID no C#, nunca dependa do banco** — use `Guid.CreateVersion7()` (.NET 9+) na entidade base, porque nem todos os bancos geram GUID automaticamente no `Add`
4. **Prefira GUID v7 sobre `Guid.NewGuid()`** — Version 7 usa timestamp na criacao, permitindo `ORDER BY Id` com ordenacao temporal, porque GUIDs aleatorios nao carregam informacao de ordem
5. **Instale os NuGet packages corretos** — `Pomelo.EntityFrameworkCore.MySql` para MySQL, `Microsoft.EntityFrameworkCore.SqlServer` para SQL Server, porque cada provider tem seu pacote separado

## How to write

### Chaveamento de banco de dados

```csharp
public static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
{
    var databaseType = configuration.GetValue<int>("DatabaseType");

    services.AddDbContext<PlanShareDbContext>(options =>
    {
        if (databaseType == 0) // MySQL
        {
            var connectionString = configuration.GetConnectionString("MySQL");
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }
        else // SQL Server
        {
            var connectionString = configuration.GetConnectionString("SqlServer");
            options.UseSqlServer(connectionString);
        }
    });
}
```

### Entidade base com GUID v7

```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
}
```

## Example

**Before (depende do banco para gerar ID):**
```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; }
    // ID fica vazio ate o banco preencher no Add — perigoso
}
```

**After (ID gerado no C# com ordenacao temporal):**
```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    // ID ja vem preenchido, ordenavel por data de criacao
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto .NET 9+ | Use `Guid.CreateVersion7()` |
| Projeto .NET 8 ou anterior | Use `Guid.NewGuid()` (v7 nao disponivel) |
| Precisa ordenar por data de criacao sem campo extra | Use GUID v7 e `ORDER BY Id` |
| Suporte a multiplos bancos | Chaveie por config, nunca por `#if` compilacao |
| Nao sabe a versao do MySQL | Use `ServerVersion.AutoDetect()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `public Guid Id { get; set; }` (sem inicializador) | `public Guid Id { get; set; } = Guid.CreateVersion7();` |
| `options.UseMySql(connString, new MySqlServerVersion("8.0.41"))` | `options.UseMySql(connString, ServerVersion.AutoDetect(connString))` |
| `Guid.NewGuid()` em .NET 9+ quando precisa de ordenacao | `Guid.CreateVersion7()` |
| Hardcoded database provider sem config | Chaveamento via `appsettings.json` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
