# Code Examples: Criando Database no SQL Server com Dapper

## Exemplo completo da classe DatabaseMigration

### Estrutura final com EnsureDatabaseCreated

```csharp
using Dapper;
using Microsoft.Data.SqlClient;

public class DatabaseMigration
{
    // Ponto de entrada publico — garante database e executa migrations
    public static void Migrate(string connectionString)
    {
        EnsureDatabaseCreatedForSqlServer(connectionString);
        MigrateDatabase(connectionString);
    }

    // Verifica e cria o database no SQL Server usando Dapper
    private static void EnsureDatabaseCreatedForSqlServer(string connectionString)
    {
        // 1. Criar builder para manipular a connection string
        var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

        // 2. Extrair o nome do database (Initial Catalog no SQL Server)
        var databaseName = connectionStringBuilder.InitialCatalog;

        // 3. Remover o Initial Catalog para conectar sem apontar para um database
        connectionStringBuilder.Remove("Initial Catalog");

        // 4. Abrir conexao sem database especificado (usando 'using' para auto-cleanup)
        using var dbConnection = new SqlConnection(connectionStringBuilder.ConnectionString);

        // 5. Criar parametros para a query (evita SQL Injection)
        var parameters = new DynamicParameters();
        parameters.Add("name", databaseName);

        // 6. Verificar na tabela de sistema se o database existe
        var records = dbConnection.Query("SELECT * FROM sys.databases WHERE name = @name", parameters);

        // 7. Se nao existe, criar o database
        if (records.Any() == false)
        {
            // Nota: string interpolation aqui porque DynamicParameters
            // adicionaria aspas simples e CREATE DATABASE nao aceita
            dbConnection.Execute($"CREATE DATABASE {databaseName}");
        }
    }

    // Fluent Migrator executa as migrations (codigo da aula anterior)
    private static void MigrateDatabase(string connectionString)
    {
        // ... codigo do Fluent Migrator
    }
}
```

## Program.cs — Chamando a migration

```csharp
var builder = WebApplication.CreateBuilder(args);

// Recuperar a connection string do appsettings.json
var connectionString = builder.Configuration.GetConnectionString("ConnectionString");

// Chamar Migrate (que internamente garante o database e executa migrations)
DatabaseMigration.Migrate(connectionString);

var app = builder.Build();
// ... resto do pipeline
```

## appsettings.json — Connection strings

```json
{
  "ConnectionStrings": {
    "ConnectionString": "Server=localhost;Initial Catalog=PlanShare;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

## Instalacao do Dapper via NuGet

```
NuGet\Install-Package Dapper -Version 2.1.66
```

Ou via .NET CLI:
```bash
dotnet add package Dapper --version 2.1.66
```

## Versao compacta (sem DynamicParameters explicito)

O instrutor mostrou que tambem e possivel usar a sintaxe inline:

```csharp
// Versao compacta — parametro anonimo inline
var records = dbConnection.Query(
    "SELECT * FROM sys.databases WHERE name = @name",
    new { name = databaseName }
);
```

Esta versao e equivalente a usar `DynamicParameters`, mas mais concisa. O Dapper aceita objetos anonimos como parametros.

## Passo a passo do debug (F5/F10/F11)

O instrutor demonstrou o fluxo com breakpoints:

1. **F5** — Inicia a aplicacao
2. **Breakpoint em Migrate** — Connection string SQL Server e capturada
3. **F11 em EnsureDatabaseCreated** — Entra na funcao
4. **connectionStringBuilder.InitialCatalog** — Mostra "PlanShare"
5. **Apos Remove("Initial Catalog")** — Connection string sem Initial Catalog
6. **records = dbConnection.Query(...)** — Retorna 0 registros
7. **records.Any() == false** — True (nao existe database)
8. **dbConnection.Execute(CREATE DATABASE)** — Executa sem erro
9. **Refresh no SQL Server Management Studio** — Database "PlanShare" aparece criado