# Code Examples: Auto-Criacao de Database MySQL em C#/.NET

## Exemplo completo da classe DatabaseMigration

```csharp
public class DatabaseMigration
{
    public static void Migrate(string connectionString, DatabaseType databaseType)
    {
        if (databaseType is DatabaseType.MySql)
            EnsureDatabaseCreatedForMySql(connectionString);
        else
            EnsureDatabaseCreatedForSqlServer(connectionString);

        // Migrations serao adicionadas nas proximas aulas
    }

    private static void EnsureDatabaseCreatedForMySql(string connectionString)
    {
        var connectionStringBuilder = new MySqlConnectionStringBuilder(connectionString);

        var databaseName = connectionStringBuilder.Database;

        connectionStringBuilder.Remove("Database");

        using var dbConnection = new MySqlConnection(connectionStringBuilder.ConnectionString);

        dbConnection.Execute($"CREATE DATABASE IF NOT EXISTS `{databaseName}`");
    }

    private static void EnsureDatabaseCreatedForSqlServer(string connectionString)
    {
        var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

        var databaseName = connectionStringBuilder.InitialCatalog;

        connectionStringBuilder.Remove("Initial Catalog");

        using var dbConnection = new SqlConnection(connectionStringBuilder.ConnectionString);

        var parameters = new DynamicParameters();
        parameters.Add("name", databaseName);

        var records = dbConnection.Query(
            "SELECT * FROM sys.databases WHERE name = @name",
            parameters);

        if (!records.Any())
            dbConnection.Execute($"CREATE DATABASE {databaseName}");
    }
}
```

## Comparacao lado a lado: MySQL vs SQL Server

### MySQL (mais simples)
```csharp
// Builder
var builder = new MySqlConnectionStringBuilder(connectionString);

// Propriedade do database
var dbName = builder.Database;

// Remocao
builder.Remove("Database");

// Conexao
using var conn = new MySqlConnection(builder.ConnectionString);

// Criacao (uma linha, sem verificacao previa)
conn.Execute($"CREATE DATABASE IF NOT EXISTS `{dbName}`");
```

### SQL Server (requer verificacao)
```csharp
// Builder
var builder = new SqlConnectionStringBuilder(connectionString);

// Propriedade do database
var dbName = builder.InitialCatalog;

// Remocao
builder.Remove("Initial Catalog");

// Conexao
using var conn = new SqlConnection(builder.ConnectionString);

// Verificacao + Criacao (duas queries)
var parameters = new DynamicParameters();
parameters.Add("name", dbName);
var records = conn.Query(
    "SELECT * FROM sys.databases WHERE name = @name", parameters);
if (!records.Any())
    conn.Execute($"CREATE DATABASE {dbName}");
```

## Configuracao do appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "MySqlConnection": "Server=localhost;Database=planshare;User=root;Password=@password123"
  },
  "DatabaseType": 0
}
```

Valores de DatabaseType:
- `0` = MySQL
- `1` = SQL Server

## Uso no Program.cs (chamada)

```csharp
var connectionString = configuration.GetConnectionString("MySqlConnection");
var databaseType = configuration.GetDatabaseType();

DatabaseMigration.Migrate(connectionString, databaseType);
```

## Pattern de uso do `is` vs `==` em C# moderno

```csharp
// Ambos funcionam — o instrutor prefere 'is' por clareza
if (databaseType is DatabaseType.MySql)
    // ...

// Equivalente:
if (databaseType == DatabaseType.MySql)
    // ...
```