---
name: rs-csharp-dotnet-maui-connection-strings
description: "Applies multi-database connection string configuration patterns in .NET/C# projects. Use when user asks to 'configure database connection', 'add connection string', 'switch between databases', 'support multiple databases', or 'configure MySQL and SQL Server'. Enforces proper appsettings.json structure, enum-based database type selection, and IConfiguration extension methods. Make sure to use this skill whenever setting up database connectivity in .NET projects. Not for Entity Framework migrations, query optimization, or ORM mapping configuration."
---

# Connection Strings Multi-Database em .NET

> Configure connection strings no appsettings.json com suporte a multiplos bancos de dados usando enums e extension methods no IConfiguration.

## Rules

1. **Connection strings ficam em `appsettings.Development.json`** — dentro do objeto `ConnectionStrings` (plural, exato), porque o metodo `GetConnectionString()` do .NET depende desse nome exato
2. **Cada banco tem sua propria connection string** — `ConnectionMySql` e `ConnectionSqlServer` como chaves separadas, porque o formato difere entre bancos
3. **Use enum para identificar o tipo de banco** — `DatabaseType { MySql = 0, SqlServer = 1 }`, porque permite troca facil via configuracao sem alterar codigo
4. **Crie extension methods no IConfiguration** — `GetDatabaseType()` e `GetConnectionString()` customizado, porque centraliza a logica de selecao de banco
5. **Nunca hardcode connection strings no codigo** — sempre leia do `IConfiguration`, porque facilita troca entre ambientes

## How to write

### appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "DatabaseType": "0",
    "ConnectionMySql": "Server=localhost;Database=PlanShare;User=root;Pwd=@password123",
    "ConnectionSqlServer": "Data Source=SERVER_NAME;Initial Catalog=PlanShare;User ID=SA;Password=@password123;TrustServerCertificate=true"
  }
}
```

### Enum DatabaseType

```csharp
// Domain/Enums/DatabaseType.cs
namespace PlanShare.Domain.Enums;

public enum DatabaseType
{
    MySql = 0,
    SqlServer = 1
}
```

### Extension method para IConfiguration

```csharp
// Infrastructure/Extensions/ConfigurationExtension.cs
public static DatabaseType GetDatabaseType(this IConfiguration configuration)
{
    var databaseType = configuration.GetConnectionString("DatabaseType");
    return Enum.Parse<DatabaseType>(databaseType!);
}

public static string GetConnectionString(this IConfiguration configuration)
{
    var databaseType = configuration.GetDatabaseType();

    if (databaseType == DatabaseType.MySql)
        return configuration.GetConnectionString("ConnectionMySql")!;

    return configuration.GetConnectionString("ConnectionSqlServer")!;
}
```

## Example

**Before (connection string unica, sem flexibilidade):**
```csharp
var connectionString = configuration.GetConnectionString("Connection");
// Troca de banco exige alterar codigo e config
```

**After (multi-database com enum):**
```csharp
var dbType = configuration.GetDatabaseType();    // MySql ou SqlServer
var connectionString = configuration.GetConnectionString(); // Retorna a correta
// Troca de banco = mudar "0" para "1" no appsettings.json
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa trocar de banco rapidamente | Altere apenas `DatabaseType` no appsettings.json |
| `GetConnectionString()` retorna null | Verifique se o objeto se chama exatamente `ConnectionStrings` (plural) |
| SQL Server: precisa do server name | Copie do campo "Server Name" do SQL Server Management Studio |
| MySQL: servidor local | Use `Server=localhost` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Server=localhost` para SQL Server | `Data Source=NOME_DO_SERVER` (copie do SSMS) |
| `Database=X` para SQL Server | `Initial Catalog=X` |
| `User=root` para SQL Server | `User ID=SA` |
| `ConnectionString` (singular) como nome do objeto JSON | `ConnectionStrings` (plural) — obrigatorio pelo .NET |
| Connection string hardcoded no codigo | `configuration.GetConnectionString()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
