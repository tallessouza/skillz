---
name: rs-csharp-dotnet-maui-fluent-migrator
description: "Applies FluentMigrator configuration patterns when setting up database migrations in .NET/C# projects. Use when user asks to 'configure FluentMigrator', 'setup migrations', 'add database migrations to DI', or 'configure migration runner in C#'. Covers DI registration, multi-database support (MySQL/SQL Server), assembly scanning, and connection string wiring. Make sure to use this skill whenever configuring FluentMigrator in any .NET project. Not for Entity Framework migrations, raw SQL scripts, or non-.NET migration tools."
---

# Configurando FluentMigrator no .NET

> Registre o FluentMigrator no container de DI com banco de dados condicional, connection string e assembly scanning numa unica funcao organizada.

## Rules

1. **Isole a configuracao em funcao privada** — crie `AddFluentMigrator(IServiceCollection, IConfiguration)` separada, porque mantem o codigo de DI organizado e testavel
2. **Use if ternario para selecionar banco** — adicione apenas o banco necessario (MySQL OU SQL Server), nunca ambos, porque adicionar todos nao faz sentido e gera dependencias desnecessarias
3. **Carregue o assembly por nome do projeto** — use `Assembly.Load("NomeDoProjeto.Infraestrutura")` para apontar onde estao as migrations, porque o FluentMigrator escaneia por classes com atributo `[Migration]`
4. **Chame `.ForAllAssemblies()` ao final do ScanIn** — porque isso instrui o runner a listar e configurar todas as versoes encontradas no assembly
5. **Configure o runner separadamente do registro** — use `.AddFluentMigratorCore()` seguido de `.ConfigureRunner()`, porque sao etapas distintas (registro vs configuracao)

## How to write

### Funcao de configuracao no DI

```csharp
private static void AddFluentMigrator(
    IServiceCollection services,
    IConfiguration configuration)
{
    var connectionString = configuration.ConnectionString();
    var databaseType = configuration.DatabaseType();

    services.AddFluentMigratorCore()
        .ConfigureRunner(config =>
        {
            var migrationRunnerBuilder = databaseType == DatabaseType.MySQL
                ? config.AddMySql5()
                : config.AddSqlServer();

            var infraAssembly = Assembly.Load("PlanShare.Infraestrutura");

            migrationRunnerBuilder
                .WithGlobalConnectionString(connectionString)
                .ScanIn(infraAssembly)
                .ForAllAssemblies();
        });
}
```

### Chamada na funcao principal de DI

```csharp
public static void AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
{
    // ... outros registros (repositorios, DbContext, etc.)
    AddFluentMigrator(services, configuration);
}
```

### Execucao das migrations no startup

```csharp
public static void MigrateDatabase(IServiceProvider serviceProvider)
{
    var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
    runner.ListMigrations();
    runner.MigrateUp();
}
```

## Example

**Before (sem configuracao — erro em runtime):**
```csharp
// Tenta resolver IMigrationRunner sem registro no DI
var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
// System.InvalidOperationException: No service for type 'IMigrationRunner'
```

**After (com skill aplicada):**
```csharp
// DI configurado corretamente
services.AddFluentMigratorCore()
    .ConfigureRunner(config =>
    {
        config.AddMySql5()
            .WithGlobalConnectionString(connectionString)
            .ScanIn(Assembly.Load("MeuProjeto.Infraestrutura"))
            .ForAllAssemblies();
    });

// Runner resolve normalmente
var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
runner.MigrateUp(); // Cria tabelas + tabela VersionInfo automaticamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto suporta multiplos bancos | Use if ternario para adicionar apenas o banco ativo |
| Precisa do nome exato do assembly | Botao direito no projeto → Rename → Ctrl+C → Esc (truque do instrutor) |
| Migration executou com sucesso | Verifique a tabela `VersionInfo` criada automaticamente pelo FluentMigrator |
| Quer testar se configuracao funciona | Coloque breakpoint no `AddFluentMigrator` e no `MigrateDatabase` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `config.AddMySql5(); config.AddSqlServer();` (ambos) | Adicione apenas o banco ativo via condicional |
| Hardcode da connection string no ConfigureRunner | Use `configuration.ConnectionString()` centralizado |
| Passar tipo generico para ScanIn | Use `Assembly.Load("NomeExato.DoProjeto")` |
| Esquecer de chamar `AddFluentMigrator()` na funcao principal | Sempre chame a funcao no `AddInfrastructure` |
| Fechar `AddFluentMigratorCore()` com `;` antes do `.ConfigureRunner()` | Encadeie: `.AddFluentMigratorCore().ConfigureRunner(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
