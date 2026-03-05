---
name: rs-csharp-maui-criando-db-sql-server
description: "Applies the pattern of ensuring SQL Server database existence before running Fluent Migrator migrations using Dapper. Use when user asks to 'setup Fluent Migrator', 'create database before migrations', 'ensure database exists', 'configure SQL Server with Dapper', or 'fix Fluent Migrator not creating database'. Make sure to use this skill whenever setting up Fluent Migrator migrations in .NET projects targeting SQL Server. Not for Entity Framework migrations, MySQL setup, or general Dapper CRUD operations."
---

# Criando Database no SQL Server com Dapper + Fluent Migrator

> Antes de executar migrations do Fluent Migrator, garantir que o database existe usando Dapper para verificar e criar automaticamente.

## Rules

1. **Nunca execute Fluent Migrator sem garantir que o database existe** — o Fluent Migrator nao cria databases automaticamente (diferente do Entity Framework), entao a execucao vai falhar se o database nao existir
2. **Remova o Initial Catalog da connection string antes de conectar** — porque se o database nao existe ainda, a conexao com ele especificado vai falhar
3. **Use SqlConnectionStringBuilder para manipular a connection string** — nunca manipule strings de conexao manualmente com Replace ou Split, porque o builder entende a estrutura e evita erros
4. **Use DynamicParameters para queries de verificacao** — porque string interpolation direta causa warnings de SQL Injection
5. **Use string interpolation apenas no CREATE DATABASE** — porque parametros do Dapper adicionam aspas simples e o CREATE DATABASE nao aceita aspas no nome
6. **Envolva a SqlConnection em using** — para liberar a conexao e memoria assim que terminar

## How to write

### Estrutura da classe DatabaseMigration

```csharp
public static void Migrate(string connectionString)
{
    EnsureDatabaseCreatedForSqlServer(connectionString);
    MigrateDatabase(connectionString);
}

private static void EnsureDatabaseCreatedForSqlServer(string connectionString)
{
    var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);
    var databaseName = connectionStringBuilder.InitialCatalog;
    connectionStringBuilder.Remove("Initial Catalog");

    using var dbConnection = new SqlConnection(connectionStringBuilder.ConnectionString);

    var parameters = new DynamicParameters();
    parameters.Add("name", databaseName);

    var records = dbConnection.Query("SELECT * FROM sys.databases WHERE name = @name", parameters);

    if (records.Any() == false)
    {
        dbConnection.Execute($"CREATE DATABASE {databaseName}");
    }
}

private static void MigrateDatabase(string connectionString)
{
    // Fluent Migrator execution code here
}
```

### No Program.cs

```csharp
var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
DatabaseMigration.Migrate(connectionString);
```

## Example

**Before (Fluent Migrator falha sem database):**
```csharp
// Program.cs - chama migrations diretamente
DatabaseMigration.MigrateDatabase(connectionString);
// ERRO: database "PlanShare" nao existe
```

**After (com verificacao via Dapper):**
```csharp
// Program.cs - chama Migrate que garante o database
DatabaseMigration.Migrate(connectionString);
// Dapper verifica sys.databases, cria se necessario, depois executa migrations
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa Fluent Migrator com SQL Server | Adicione EnsureDatabaseCreated antes das migrations |
| Banco e MySQL | O padrao muda (CREATE DATABASE IF NOT EXISTS funciona em MySQL) |
| Projeto usa Entity Framework | Nao precisa — EF cria o database automaticamente |
| Query de verificacao no banco | Use DynamicParameters para evitar SQL Injection |
| CREATE DATABASE com nome dinamico | Use string interpolation (parametros adicionam aspas simples indesejadas) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Executar Fluent Migrator sem verificar database | Chamar EnsureDatabaseCreated antes |
| Conectar com Initial Catalog para verificar existencia | Remover Initial Catalog via SqlConnectionStringBuilder |
| `connectionString.Replace("Initial Catalog=PlanShare;", "")` | `connectionStringBuilder.Remove("Initial Catalog")` |
| `$"SELECT * FROM sys.databases WHERE name = {name}"` | `DynamicParameters` com `@name` |
| Criar database manualmente no SQL Server | Automatizar com Dapper na inicializacao da API |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
