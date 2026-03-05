# Code Examples: Connection Strings Multi-Database

## Estrutura completa do appsettings.Development.json

```json
{
  "ConnectionStrings": {
    // MySql = 0
    // SqlServer = 1
    "DatabaseType": "0",
    "ConnectionMySql": "Server=localhost;Database=PlanShare;User=root;Pwd=@password123",
    "ConnectionSqlServer": "Data Source=ELLISON;Initial Catalog=PlanShare;User ID=SA;Password=@password123;TrustServerCertificate=true"
  }
}
```

**Nota:** `TrustServerCertificate=true` e necessario para SQL Server — informa que pode confiar na conexao mesmo sem certificado SSL configurado.

## Enum DatabaseType completo

```csharp
// Localizacao: Domain/Enums/DatabaseType.cs
namespace PlanShare.Domain.Enums;

public enum DatabaseType
{
    MySql = 0,
    SqlServer = 1
}
```

## ConfigurationExtension completo

```csharp
// Localizacao: Infrastructure/Extensions/ConfigurationExtension.cs
using PlanShare.Domain.Enums;

namespace PlanShare.Infrastructure.Extensions;

public static class ConfigurationExtension
{
    public static string GetConnectionString(this IConfiguration configuration)
    {
        var databaseType = configuration.GetDatabaseType();

        if (databaseType == DatabaseType.MySql)
            return configuration.GetConnectionString("ConnectionMySql")!;

        return configuration.GetConnectionString("ConnectionSqlServer")!;
    }

    public static DatabaseType GetDatabaseType(this IConfiguration configuration)
    {
        var databaseType = configuration.GetConnectionString("DatabaseType");
        return Enum.Parse<DatabaseType>(databaseType!);
    }
}
```

## Teste rapido no Program.cs (debug only)

```csharp
// Adicionar using
using PlanShare.Infrastructure.Extensions;

// Codigo temporario para verificar funcionamento
var type = builder.Configuration.GetDatabaseType();
// Colocar breakpoint aqui e verificar valor com F5 + F11

// REMOVER apos verificacao — nao deixar no codigo final
```

### Passo a passo do debug:

1. Colocar breakpoint na linha `var type = ...`
2. F5 para executar
3. F11 para entrar na funcao `GetDatabaseType()`
4. F10 para avancar passo a passo
5. Observar: `databaseType` retorna `"0"` (string)
6. Apos `Enum.Parse`, `type` mostra `MySql`
7. Trocar para `"1"` no JSON, repetir → mostra `SqlServer`
8. Apagar codigo de teste + Ctrl+R, Ctrl+G para limpar usings

## Variacao: Como adaptar para PostgreSQL

Se precisar adicionar suporte a PostgreSQL, o padrao se estende naturalmente:

```csharp
public enum DatabaseType
{
    MySql = 0,
    SqlServer = 1,
    PostgreSql = 2
}
```

```json
{
  "ConnectionStrings": {
    "DatabaseType": "2",
    "ConnectionMySql": "...",
    "ConnectionSqlServer": "...",
    "ConnectionPostgreSql": "Host=localhost;Database=PlanShare;Username=postgres;Password=@password123"
  }
}
```

```csharp
public static string GetConnectionString(this IConfiguration configuration)
{
    var databaseType = configuration.GetDatabaseType();

    return databaseType switch
    {
        DatabaseType.MySql => configuration.GetConnectionString("ConnectionMySql")!,
        DatabaseType.SqlServer => configuration.GetConnectionString("ConnectionSqlServer")!,
        DatabaseType.PostgreSql => configuration.GetConnectionString("ConnectionPostgreSql")!,
        _ => throw new ArgumentOutOfRangeException(nameof(databaseType))
    };
}
```