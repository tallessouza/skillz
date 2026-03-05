# Code Examples: Configuracao Multi-Database e GUID v7

## Exemplo 1: appsettings.json com chaveamento

```json
{
  "DatabaseType": 0,
  "ConnectionStrings": {
    "MySQL": "Server=localhost;Database=planshare;User=root;Password=...",
    "SqlServer": "Server=localhost;Database=planshare;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

- `DatabaseType: 0` = MySQL
- `DatabaseType: 1` = SQL Server

## Exemplo 2: DependencyInjectionExtension completa

```csharp
public static class DependencyInjectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        AddDbContext(services, configuration);
    }

    private static void AddDbContext(IServiceCollection services, IConfiguration configuration)
    {
        var databaseType = configuration.GetValue<int>("DatabaseType");

        services.AddDbContext<PlanShareDbContext>(options =>
        {
            if (databaseType == 0) // MySQL
            {
                var connectionString = configuration.GetConnectionString("MySQL")!;
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
            else // SQL Server
            {
                var connectionString = configuration.GetConnectionString("SqlServer")!;
                options.UseSqlServer(connectionString);
            }
        });
    }
}
```

Essa classe fica dentro do projeto de **Infraestrutura**.

## Exemplo 3: EntityBase com evolucao

### Versao 1 — sem inicializador (perigosa)
```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; }
}
// Problema: ID fica 00000000-0000-0000-0000-000000000000
// ate o banco (talvez) preencher
```

### Versao 2 — com NewGuid (segura, sem ordenacao)
```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
}
// ID sempre preenchido, mas ORDER BY Id nao tem significado temporal
```

### Versao 3 — com CreateVersion7 (.NET 9+, recomendada)
```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
}
// ID preenchido + ordenavel por data de criacao
```

## Exemplo 4: Controller de registro

```csharp
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Register(
        [FromServices] IRegisterUserUseCase useCase,
        [FromBody] RegisterUserRequest request)
    {
        var response = await useCase.Execute(request);
        return Created(string.Empty, response);
    }
}
```

## Exemplo 5: Verificando NuGet packages necessarios

No Visual Studio: botao direito no projeto de Infraestrutura → Manage NuGet Packages → aba Installed:

| Package | Para |
|---------|------|
| `Microsoft.EntityFrameworkCore` | Core do EF |
| `Microsoft.EntityFrameworkCore.SqlServer` | Provider SQL Server |
| `Pomelo.EntityFrameworkCore.MySql` | Provider MySQL |

## Exemplo 6: Queries de verificacao

### SQL Server
```sql
SELECT * FROM planshare.dbo.users
```

### MySQL
```sql
SELECT * FROM users
```

## Exemplo 7: Comparacao visual de GUIDs

```
Guid.NewGuid():        a3f2b1c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c  (aleatorio)
Guid.NewGuid():        7e8f9a0b-1c2d-4e3f-5a6b-7c8d9e0f1a2b  (aleatorio, sem relacao)

Guid.CreateVersion7(): 019505a1-b2c3-7d4e-8f5a-6b7c8d9e0f1a  (timestamp-based)
Guid.CreateVersion7(): 019505a2-d3e4-7f5a-6b7c-8d9e0f1a2b3c  (criado depois = valor maior)
```

Repare que na v7, o prefixo do GUID reflete a ordem temporal — IDs criados depois tem prefixos maiores, permitindo ordenacao.