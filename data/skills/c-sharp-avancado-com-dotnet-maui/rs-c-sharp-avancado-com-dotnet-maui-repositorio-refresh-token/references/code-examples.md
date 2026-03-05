# Code Examples: Repositório para Refresh Token

## Estrutura completa do repositório

### Entidade RefreshToken (Domain)

```csharp
// Domain/Entities/RefreshToken.cs
public class RefreshToken : EntBase
{
    public string Token { get; set; }
    public string AccessTokenId { get; set; }
    public long UserId { get; set; }
    public User User { get; set; } // Navigation property
}
```

### Entidade base com propriedade renomeada

```csharp
// Domain/Entities/EntBase.cs
public class EntBase
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; } // Renomeado de CreatedOn
}
```

### Interface Read-Only

```csharp
// Domain/Repositories/RefreshTokens/IRefreshTokenReadOnlyRepository.cs
public interface IRefreshTokenReadOnlyRepository
{
    Task<RefreshToken?> Get(string token);
}
```

### Interface Write-Only

```csharp
// Domain/Repositories/RefreshTokens/IRefreshTokenWriteOnlyRepository.cs
public interface IRefreshTokenWriteOnlyRepository
{
    Task Add(RefreshToken refreshToken);
}
```

### DbContext com DBSet

```csharp
// Infrastructure/DataAccess/PlanShareDBContext.cs
public class PlanShareDBContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    // Nome da propriedade = nome da tabela
}
```

### Repositório completo

```csharp
// Infrastructure/DataAccess/Repositories/RefreshTokenRepository.cs
public class RefreshTokenRepository : IRefreshTokenReadOnlyRepository, IRefreshTokenWriteOnlyRepository
{
    private readonly PlanShareDBContext _context;

    public RefreshTokenRepository(PlanShareDBContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> Get(string token)
    {
        return await _context.RefreshTokens
            .AsNoTracking()
            .Include(refreshToken => refreshToken.User)
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token.Equals(token));
    }

    public async Task Add(RefreshToken refreshToken)
    {
        await _context.RefreshTokens
            .Where(rt => rt.UserId == refreshToken.UserId)
            .ExecuteDeleteAsync();

        await _context.RefreshTokens.AddAsync(refreshToken);
    }
}
```

### Registro no DI Container

```csharp
// Infrastructure/DependencyInjectionExtension.cs
public static class DependencyInjectionExtension
{
    private static void AddRepositories(IServiceCollection services)
    {
        // ... outros repositórios ...
        services.AddScoped<IRefreshTokenReadOnlyRepository, RefreshTokenRepository>();
        services.AddScoped<IRefreshTokenWriteOnlyRepository, RefreshTokenRepository>();
    }
}
```

## Migration para renomear coluna

```csharp
// Infrastructure/Migrations/Versions/Version3.cs
// Renomear coluna CreatedOn para CreatedAt na tabela users
Rename.Column("CreatedOn").OnTable("users").To("CreatedAt");
```

## Comparação: SELECT+DELETE vs ExecuteDeleteAsync

### Abordagem ineficiente (2 queries)

```csharp
// Query 1: SELECT * FROM RefreshTokens WHERE UserId = @userId LIMIT 1
var token = await _context.RefreshTokens
    .FirstOrDefaultAsync(rt => rt.UserId == refreshToken.UserId);

if (token is not null)
{
    // Query 2: DELETE FROM RefreshTokens WHERE Id = @id
    _context.RefreshTokens.Remove(token);
}
```

### Abordagem otimizada (1 query)

```csharp
// Query única: DELETE FROM RefreshTokens WHERE UserId = @userId
await _context.RefreshTokens
    .Where(rt => rt.UserId == refreshToken.UserId)
    .ExecuteDeleteAsync();
```

## Variação: múltiplos dispositivos

```csharp
// Se o projeto suporta múltiplos dispositivos
public class RefreshToken : EntBase
{
    public string Token { get; set; }
    public string AccessTokenId { get; set; }
    public long UserId { get; set; }
    public User User { get; set; }
    // Propriedades adicionais para dispositivo
    public string DeviceName { get; set; }
    public string OperatingSystem { get; set; }
    public string BrowserVersion { get; set; }
}

// Nesse caso, deletar por UserId + DeviceId
public async Task Add(RefreshToken refreshToken)
{
    await _context.RefreshTokens
        .Where(rt => rt.UserId == refreshToken.UserId
                   && rt.DeviceName == refreshToken.DeviceName)
        .ExecuteDeleteAsync();

    await _context.RefreshTokens.AddAsync(refreshToken);
}
```

## ExecuteUpdateAsync (padrão similar)

```csharp
// Mesmo conceito: atualizar sem trazer pra memória
await _context.RefreshTokens
    .Where(rt => rt.UserId == userId)
    .ExecuteUpdateAsync(setters => setters
        .SetProperty(rt => rt.Token, newTokenValue)
        .SetProperty(rt => rt.AccessTokenId, newAccessTokenId)
        .SetProperty(rt => rt.CreatedAt, DateTime.UtcNow));
```