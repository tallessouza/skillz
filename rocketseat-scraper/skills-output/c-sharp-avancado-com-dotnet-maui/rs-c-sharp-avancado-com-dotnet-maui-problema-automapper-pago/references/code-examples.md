# Code Examples: Controle de Versoes NuGet e Isolamento

## 1. Sintaxe de versionamento no .csproj

### Versao flutuante (padrao, sem controle)

```xml
<PackageReference Include="AutoMapper" Version="14.0.0" />
```

O NuGet pode sugerir atualizacao para qualquer versao mais nova, incluindo 15.0.1 (paga).

### Versao exata (colchetes)

```xml
<PackageReference Include="AutoMapper" Version="[14.0.0]" />
```

Fixa exatamente na 14.0.0. Nenhuma atualizacao sera sugerida, nem patches de seguranca.

### Intervalo com limite inferior inclusivo e superior exclusivo

```xml
<PackageReference Include="AutoMapper" Version="[14.0.0, 15.0.0)" />
```

- `[14.0.0` — colchete = inclui 14.0.0 (fechado)
- `15.0.0)` — parentese = exclui 15.0.0 (aberto)
- Aceita: 14.0.0, 14.0.1, 14.1.0, 14.2.3...
- Rejeita: 15.0.0, 15.0.1, 16.0.0...

### Outros exemplos de intervalos

```xml
<!-- Qualquer versao >= 8.0.0 e < 9.0.0 -->
<PackageReference Include="Newtonsoft.Json" Version="[8.0.0, 9.0.0)" />

<!-- Versao exata 6.0.0 -->
<PackageReference Include="MediatR" Version="[6.0.0]" />

<!-- Qualquer versao >= 3.1.0 (sem limite superior) -->
<PackageReference Include="Serilog" Version="[3.1.0,)" />
```

## 2. Padrao de repositorio isolando Entity Framework

### Interface na camada de dominio/application

```csharp
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<List<User>> GetAllAsync();
    Task<bool> ExistsByEmailAsync(string email);
    Task AddAsync(User user);
}
```

### Implementacao na camada de infraestrutura

```csharp
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetByIdAsync(Guid id)
        => await _dbContext.Users.FindAsync(id);

    public async Task<List<User>> GetAllAsync()
        => await _dbContext.Users.ToListAsync();

    public async Task<bool> ExistsByEmailAsync(string email)
        => await _dbContext.Users.AnyAsync(u => u.Email == email);

    public async Task AddAsync(User user)
        => await _dbContext.Users.AddAsync(user);
}
```

### Use case consumindo repositorio (nao sabe qual ORM esta por tras)

```csharp
public class RegisterUserUseCase
{
    private readonly IUserRepository _userRepository;

    public RegisterUserUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Execute(RegisterUserRequest request)
    {
        var exists = await _userRepository.ExistsByEmailAsync(request.Email);
        if (exists)
            throw new ConflictException("Email already in use");

        var user = new User(request.Name, request.Email, request.Password);
        await _userRepository.AddAsync(user);
    }
}
```

## 3. Cenario de troca: Entity Framework para outro ORM

Se precisar trocar Entity Framework por Dapper, apenas a implementacao muda:

```csharp
// Nova implementacao com Dapper — mesma interface
public class UserRepositoryDapper : IUserRepository
{
    private readonly IDbConnection _connection;

    public UserRepositoryDapper(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<User?> GetByIdAsync(Guid id)
        => await _connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM Users WHERE Id = @Id", new { Id = id });

    public async Task<List<User>> GetAllAsync()
        => (await _connection.QueryAsync<User>("SELECT * FROM Users")).ToList();

    public async Task<bool> ExistsByEmailAsync(string email)
        => await _connection.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM Users WHERE Email = @Email", new { Email = email });

    public async Task AddAsync(User user)
        => await _connection.ExecuteAsync(
            "INSERT INTO Users (Id, Name, Email, Password) VALUES (@Id, @Name, @Email, @Password)",
            user);
}
```

O `RegisterUserUseCase` nao muda em nada. Apenas o registro de DI:

```csharp
// Antes
services.AddScoped<IUserRepository, UserRepository>();

// Depois
services.AddScoped<IUserRepository, UserRepositoryDapper>();
```

## 4. Configuracao do AutoMapper com licenca (versao paga)

```csharp
// Versao 15.0.1+ requer chave de licenca
services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
    cfg.LicenseKey = "sua-chave-aqui";
}, typeof(MappingProfile).Assembly);
```