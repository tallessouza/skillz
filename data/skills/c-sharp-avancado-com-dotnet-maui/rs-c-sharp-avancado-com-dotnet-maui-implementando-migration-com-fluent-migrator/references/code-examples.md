# Code Examples: Migrations com FluentMigrator

## Estrutura de pastas

```
Infrastructure/
└── Migrations/
    ├── DatabaseMigration.cs      # Runner que executa migrations
    ├── DatabaseVersions.cs       # Constantes de versao
    └── Versions/
        └── Version00001.cs       # Primeira migration
```

## DatabaseVersions completo

```csharp
namespace Infrastructure.Migrations;

internal sealed class DatabaseVersions
{
    internal const long TABLE_REGISTER_USER = 1;
    // Futuras versoes:
    // internal const long TABLE_ADD_EXPENSE = 2;
    // internal const long TABLE_ADD_CATEGORY = 3;
}
```

## Version00001 completo

```csharp
using FluentMigrator;

namespace Infrastructure.Migrations.Versions;

[Migration(DatabaseVersions.TABLE_REGISTER_USER, "Create table to save the user's information")]
public class Version00001 : ForwardOnly
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable()
            .WithColumn("name").AsString(255).NotNullable()
            .WithColumn("email").AsString(255).NotNullable()
            .WithColumn("password").AsString(2000).NotNullable()
            .WithColumn("active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("created_on").AsDateTime().NotNullable();
    }
}
```

## Entidade de dominio correspondente

```csharp
// Domain/Entities/EntityBase.cs
public abstract class EntityBase
{
    public Guid Id { get; set; }
    public bool Active { get; set; } = true;
    public DateTime CreatedOn { get; set; }
}

// Domain/Entities/User.cs
public class User : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

## DatabaseMigration (runner)

```csharp
// O runner que executa as migrations
public static void MigrateDatabase(IServiceProvider serviceProvider)
{
    var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
    runner.ListMigrations();  // Lista migrations encontradas
    runner.MigrateUp();       // Executa Up() de cada migration pendente
}
```

## Comparacao: Migration vs ForwardOnly

```csharp
// NAO RECOMENDADO — Down nunca e usado
public class Version00001 : Migration
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable();
    }

    public override void Down()
    {
        // Quase nunca executado na pratica
        Delete.Table("users");
    }
}

// RECOMENDADO — somente Up
[Migration(DatabaseVersions.TABLE_REGISTER_USER, "Create users table")]
public class Version00001 : ForwardOnly
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable();
    }
}
```

## Tipos de coluna comuns no FluentMigrator

```csharp
// Guid (para IDs)
.WithColumn("id").AsGuid().PrimaryKey().NotNullable()

// String com limite
.WithColumn("name").AsString(255).NotNullable()

// String longa (para hashes de senha)
.WithColumn("password").AsString(2000).NotNullable()

// Boolean com valor default
.WithColumn("active").AsBoolean().NotNullable().WithDefaultValue(true)

// DateTime
.WithColumn("created_on").AsDateTime().NotNullable()
```

## Padrao de nomenclatura de classes

```
Version00001.cs  →  [Migration(1, "...")]
Version00002.cs  →  [Migration(2, "...")]
Version00003.cs  →  [Migration(3, "...")]
```

O nome da classe NAO define a versao — o atributo `[Migration(version)]` define. O nome e apenas convencao organizacional.