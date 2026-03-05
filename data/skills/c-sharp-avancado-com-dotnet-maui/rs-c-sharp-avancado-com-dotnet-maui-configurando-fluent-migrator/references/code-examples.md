# Code Examples: Configurando FluentMigrator

## Exemplo completo do DependencyInjectionExtension

```csharp
public static class DependencyInjectionExtension
{
    public static void AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Registros existentes (repositorios, DbContext, etc.)
        AddRepositories(services);
        AddDbContext(services, configuration);
        AddFluentMigrator(services, configuration);
    }

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
}
```

## Funcao MigrateDatabase (chamada no startup)

```csharp
public static void MigrateDatabase(IServiceProvider serviceProvider)
{
    var databaseType = serviceProvider.GetRequiredService<IConfiguration>().DatabaseType();
    var connectionString = serviceProvider.GetRequiredService<IConfiguration>().ConnectionString();

    // Cria database se nao existir
    EnsureDatabaseExists(databaseType, connectionString);

    // Resolve o runner registrado no DI
    var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
    runner.ListMigrations();
    runner.MigrateUp();
}
```

## A migration referenciada (versao 1)

```csharp
[Migration(1, "Criar tabela para salvar as informacoes do user")]
public class CreateUserTable : Migration
{
    public override void Up()
    {
        Create.Table("user")
            .WithColumn("Id").AsGuid().PrimaryKey()
            .WithColumn("Ativo").AsBoolean().NotNullable()
            .WithColumn("CreatedOn").AsDateTime().NotNullable()
            .WithColumn("Email").AsString().NotNullable()
            .WithColumn("Senha").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("user");
    }
}
```

## Variacao: adicionando mais bancos de dados

```csharp
// Se no futuro precisar suportar PostgreSQL:
var migrationRunnerBuilder = databaseType switch
{
    DatabaseType.MySQL => config.AddMySql5(),
    DatabaseType.SQLServer => config.AddSqlServer(),
    DatabaseType.PostgreSQL => config.AddPostgres(),
    _ => throw new ArgumentException($"Database type {databaseType} not supported")
};
```

## Variacao: usando typeof em vez de Assembly.Load

```csharp
// Alternativa ao Assembly.Load com string:
.ScanIn(typeof(CreateUserTable).Assembly)
    .ForAllAssemblies();

// Vantagem: compile-time safety (nao depende de string)
// Desvantagem: cria acoplamento com uma migration especifica
```

## Resultado no banco: tabela VersionInfo

```sql
-- MySQL
SELECT * FROM version_info;
-- | Version | AppliedOn           | Description                                          |
-- | 1       | 2024-01-15 10:30:00 | Criar tabela para salvar as informacoes do user      |

-- SQL Server
SELECT * FROM dbo.VersionInfo;
-- Mesmo resultado, schema dbo
```