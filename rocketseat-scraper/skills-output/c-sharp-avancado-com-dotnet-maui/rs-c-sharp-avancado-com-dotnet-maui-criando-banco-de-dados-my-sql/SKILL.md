---
name: rs-csharp-maui-criando-banco-mysql
description: "Applies MySQL database auto-creation pattern in C#/.NET APIs using MySqlConnection and EnsureCreated logic. Use when user asks to 'create MySQL database', 'setup database initialization', 'auto-create schema on startup', 'migrate MySQL', or 'connect C# to MySQL'. Ensures proper connection string manipulation, IF NOT EXISTS usage, and resource disposal with using statements. Make sure to use this skill whenever writing C# database initialization code targeting MySQL. Not for SQL Server, PostgreSQL, Entity Framework migrations, or query optimization."
---

# Auto-Criacao de Database MySQL em C#/.NET

> Ao inicializar uma API .NET, garantir que o database MySQL existe antes de executar migrations, usando manipulacao de connection string e CREATE DATABASE IF NOT EXISTS.

## Rules

1. **Use MySqlConnectionStringBuilder para manipular a connection string** — `new MySqlConnectionStringBuilder(connectionString)`, porque cada provider tem seu proprio builder (SqlConnectionStringBuilder para SQL Server, MySqlConnectionStringBuilder para MySQL)
2. **Extraia e remova o database name antes de conectar** — remova a propriedade `Database` do builder antes de abrir conexao, porque se o database nao existir, a conexao falha com excecao
3. **Use CREATE DATABASE IF NOT EXISTS** — exclusivo do MySQL, SQL Server e PostgreSQL nao suportam essa sintaxe e dao erro de sintaxe
4. **Sempre use using na conexao** — `using var dbConnection = new MySqlConnection(...)`, porque garante desconexao e liberacao de memoria automatica ao sair do escopo
5. **Separe funcoes por provider** — uma funcao para MySQL, outra para SQL Server, porque connection builders, propriedades e queries diferem entre providers

## How to write

### Funcao de garantia de database MySQL

```csharp
private static void EnsureDatabaseCreatedForMySql(string connectionString)
{
    var connectionStringBuilder = new MySqlConnectionStringBuilder(connectionString);

    var databaseName = connectionStringBuilder.Database;

    // Remove database da connection string para conectar sem especificar schema
    connectionStringBuilder.Remove("Database");

    using var dbConnection = new MySqlConnection(connectionStringBuilder.ConnectionString);

    // MySQL suporta IF NOT EXISTS — outros providers nao
    dbConnection.Execute($"CREATE DATABASE IF NOT EXISTS `{databaseName}`");
}
```

### Controle por tipo de banco de dados

```csharp
public static void Migrate(string connectionString, DatabaseType databaseType)
{
    if (databaseType is DatabaseType.MySql)
        EnsureDatabaseCreatedForMySql(connectionString);
    else
        EnsureDatabaseCreatedForSqlServer(connectionString);
}
```

## Example

**Before (tentando conectar direto com database que nao existe):**
```csharp
// ERRO: se o database "planshare" nao existir, lanca excecao
using var connection = new MySqlConnection(connectionString);
connection.Open(); // Exception!
```

**After (com esta skill aplicada):**
```csharp
var builder = new MySqlConnectionStringBuilder(connectionString);
var dbName = builder.Database;
builder.Remove("Database");

using var connection = new MySqlConnection(builder.ConnectionString);
connection.Execute($"CREATE DATABASE IF NOT EXISTS `{dbName}`");
// Agora pode reconectar com a connection string original para migrations
```

## Heuristics

| Situacao | Acao |
|----------|------|
| MySQL como provider | Use `CREATE DATABASE IF NOT EXISTS` direto, sem query de verificacao previa |
| SQL Server como provider | Precisa query em sys.databases antes do CREATE — nao tem IF NOT EXISTS |
| PostgreSQL como provider | Tambem nao suporta IF NOT EXISTS no CREATE DATABASE |
| Multiplos providers no projeto | Crie funcao separada por provider, controle com if/switch |
| Connection string vem do appsettings | Extraia o database type de configuracao separada (ex: `DatabaseType` no JSON) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Conectar com database name antes de criar | Remova database do builder, conecte, crie, depois reconecte |
| Usar IF NOT EXISTS no SQL Server | Use query em sys.databases para verificar existencia |
| Abrir conexao sem using | Sempre `using var connection = ...` |
| Hardcodar nome do database | Extraia de `connectionStringBuilder.Database` |
| Misturar SqlConnection com MySQL provider | Use `MySqlConnection` + `MySqlConnectionStringBuilder` para MySQL |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
