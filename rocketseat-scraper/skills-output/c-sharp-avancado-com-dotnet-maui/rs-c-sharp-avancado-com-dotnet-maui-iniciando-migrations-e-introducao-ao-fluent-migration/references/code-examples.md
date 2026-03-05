# Code Examples: FluentMigrator — Setup e Introdução

## 1. Instalação via Package Manager Console

Abra o console em: Tools > NuGet Package Manager > Package Manager Console

Selecione o projeto `Infrastructure` no dropdown do console.

```
Install-Package FluentMigrator -Version 6.2.0
Install-Package FluentMigrator.Runner -Version 6.2.0
```

## 2. DatabaseMigration — Classe completa

Localização: `PlanShare.Infrastructure/Migrations/DatabaseMigration.cs`

```csharp
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;

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

Notas:
- Classe `static` — chamada direta sem instanciação
- `runner.ListMigrations()` — prepara o FluentMigrator para listar todas as migrations disponíveis
- `runner.MigrateUp()` — executa todas as migrations pendentes (síncrono, não há versão async)
- Namespace usa file-scoped (ponto e vírgula, sem chaves)

## 3. Program.cs — Integração no startup

```csharp
// ... configurações anteriores do app ...

// Antes de app.Run()
if (app.Environment.IsEnvironment("UnitTestEnvironment") == false)
{
    var scope = app.Services.CreateScope();
    DatabaseMigration.Migrate(scope.ServiceProvider);
}

app.Run();
```

Notas:
- O `if` evita executar migrations em ambiente de teste de integração
- O scope é necessário para resolver serviços do container de DI
- Deve ser chamado ANTES de `app.Run()`

## 4. Comparação: EF vs FluentMigrator

### Entity Framework (o que NÃO usar)

```csharp
// InitialMigration.cs — arquivo 1 de 2 (+ Designer.cs)
public partial class InitialMigration : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                // ... mais colunas
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
            });

        // Mais tabelas, constraints, índices...
        // 80+ linhas facilmente
    }
}

// InitialMigration.Designer.cs — arquivo 2 de 2
// + DbContextModelSnapshot.cs — modificado a cada migration
```

Problemas: 2 arquivos por migration, código verboso, difícil de revisar em PR.

### FluentMigrator (o que usar)

```csharp
// Uma classe, um arquivo, sintaxe fluida
Create.Table("Users")
    .WithColumn("Id").AsGuid().PrimaryKey()
    .WithColumn("Name").AsString().NotNullable()
    .WithColumn("Email").AsString().NotNullable()
    .WithColumn("Password").AsString().NotNullable();
```

Vantagens: 1 arquivo por migration, legível, fácil de revisar.

## 5. Padrão anterior com Entity Framework (para referência)

O que era feito no projeto CashFlow com EF:

```csharp
// Program.cs com EF migrations
public static async Task MigrateDatabase(IServiceProvider serviceProvider)
{
    var scope = serviceProvider.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<CashFlowDbContext>();
    await dbContext.Database.MigrateAsync();
}
```

O equivalente com FluentMigrator substitui `DbContext` por `IMigrationRunner` e `MigrateAsync()` por `MigrateUp()`.