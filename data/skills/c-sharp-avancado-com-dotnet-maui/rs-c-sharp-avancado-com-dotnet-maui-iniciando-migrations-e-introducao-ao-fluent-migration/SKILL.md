---
name: rs-csharp-avancado-fluent-migration-intro
description: "Applies FluentMigrator setup and migration patterns when configuring database migrations in .NET/C# projects. Use when user asks to 'setup migrations', 'configure FluentMigrator', 'create database migration', 'manage database schema', or 'replace EF migrations'. Enforces FluentMigrator over Entity Framework migrations for cleaner, more readable migration code. Make sure to use this skill whenever setting up database migrations in C#/.NET projects. Not for Entity Framework query/ORM usage, frontend code, or non-.NET projects."
---

# FluentMigrator — Setup e Introdução

> Utilize FluentMigrator ao invés das migrations do Entity Framework para código mais limpo, legível e revisável.

## Rules

1. **Instale dois pacotes** — `FluentMigrator` e `FluentMigrator.Runner`, ambos no projeto de Infrastructure, porque o Runner contém a interface `IMigrationRunner` necessária para execução
2. **Use `IMigrationRunner` ao invés de DbContext** — resolva `IMigrationRunner` via DI, não `DbContext.Database.Migrate()`, porque FluentMigrator tem seu próprio sistema de versionamento
3. **Execute migrations no startup da API** — chame `runner.ListMigrations()` seguido de `runner.MigrateUp()` no `Program.cs`, porque garante que o banco está atualizado antes de receber requests
4. **Crie a classe DatabaseMigration como static** — coloque em `Infrastructure/Migrations/DatabaseMigration.cs` como classe estática com método estático, porque elimina necessidade de instanciação
5. **Nunca use migrations do Entity Framework** — geram código feio, confuso, com arquivos extras (`.Designer.cs`, `ModelSnapshot`), porque dificulta code review e ninguém revisa com cuidado

## How to write

### Instalação dos pacotes (Package Manager Console)

```
Install-Package FluentMigrator -Version 6.2.0
Install-Package FluentMigrator.Runner -Version 6.2.0
```

Selecione o projeto `Infrastructure` no console antes de instalar.

### DatabaseMigration class

```csharp
namespace PlanShare.Infrastructure.Migrations;

public static class DatabaseMigration
{
    public static void Migrate(IServiceProvider serviceProvider)
    {
        var scope = serviceProvider.CreateScope();
        var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

        runner.ListMigrations();
        runner.MigrateUp();
    }
}
```

### Program.cs — chamada no startup

```csharp
// Antes de app.Run()
if (app.Environment.IsEnvironment("UnitTestEnvironment") == false)
{
    var scope = app.Services.CreateScope();
    DatabaseMigration.Migrate(scope.ServiceProvider);
}

app.Run();
```

## Example

**Before (Entity Framework migrations — evitar):**
```csharp
// Gera 2 arquivos por migration (.cs + .Designer.cs) + ModelSnapshot
// Código verboso e difícil de revisar
migrationBuilder.CreateTable(
    name: "Users",
    columns: table => new
    {
        Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
        Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
        // ... 80+ linhas de código confuso
    });
```

**After (FluentMigrator — fluent syntax):**
```csharp
// Um arquivo por migration, sintaxe encadeada legível
Create.Table("Users")
    .WithColumn("Id").AsGuid().PrimaryKey()
    .WithColumn("Name").AsString().NotNullable()
    .WithColumn("Email").AsString().NotNullable();
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo projeto .NET com banco relacional | Configure FluentMigrator desde o início |
| Projeto existente com EF migrations | Avalie migração gradual para FluentMigrator |
| Múltiplos ambientes (prod, staging) | FluentMigrator versiona automaticamente por ambiente |
| Code review de migration | FluentMigrator facilita leitura — revise com atenção |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `context.Database.Migrate()` com EF | `runner.MigrateUp()` com FluentMigrator |
| Instalar só `FluentMigrator` sem o Runner | Instalar ambos: `FluentMigrator` + `FluentMigrator.Runner` |
| Colocar migration logic como método de instância | Usar classe e método `static` |
| Executar migrations em ambiente de teste de integração | Checar ambiente antes com `if` |
| Fazer commit de arquivos `.Designer.cs` e `ModelSnapshot` | Usar FluentMigrator que gera 1 arquivo limpo por migration |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
