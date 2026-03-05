---
name: rs-csharp-avancado-repositorio-refresh-token
description: "Applies Entity Framework repository patterns for Refresh Token management in .NET projects. Use when user asks to 'create a repository', 'implement refresh token', 'optimize EF queries', 'delete without select', or 'register DI services'. Enforces ExecuteDeleteAsync over select-then-delete, proper NoTracking usage, Include for navigation properties, and DBSet configuration. Make sure to use this skill whenever implementing repository patterns with Entity Framework. Not for JWT generation, authentication middleware, or token validation logic."
---

# Repositório para Refresh Token com Entity Framework

> Ao implementar repositórios com Entity Framework, elimine operações desnecessárias: nunca faça SELECT para depois DELETE quando ExecuteDeleteAsync resolve em uma única query.

## Rules

1. **Use ExecuteDeleteAsync em vez de select-then-delete** — `Where(...).ExecuteDeleteAsync()` executa um DELETE direto no banco, porque trazer entidade pra memória só pra deletar desperdiça memória e tempo do servidor
2. **Aplique AsNoTracking em repositórios read-only** — porque o EF não precisa trackear entidades que não serão editadas, economizando memória
3. **Faça Include explícito para navigation properties** — `.Include(rt => rt.User)` força o JOIN, porque o EF é "preguiçoso" e não traz relacionamentos automaticamente
4. **Configure DBSet com nome da tabela** — `public DbSet<RefreshToken> RefreshTokens { get; set; }` onde o nome da propriedade DEVE ser o nome da tabela no banco
5. **Separe interfaces Read-Only e Write-Only** — porque isso permite controle granular de acesso e segue Interface Segregation Principle
6. **Registre repositório e interfaces no DI container** — `AddScoped<IReadOnly, Repo>()` e `AddScoped<IWriteOnly, Repo>()` na função addRepositories

## How to write

### DBSet no DbContext

```csharp
// Nome da propriedade = nome da tabela no banco
public DbSet<RefreshToken> RefreshTokens { get; set; }
```

### Interfaces segregadas

```csharp
public interface IRefreshTokenReadOnlyRepository
{
    Task<RefreshToken?> Get(string token);
}

public interface IRefreshTokenWriteOnlyRepository
{
    Task Add(RefreshToken refreshToken);
}
```

### Read com NoTracking e Include

```csharp
public async Task<RefreshToken?> Get(string token)
{
    return await _context.RefreshTokens
        .AsNoTracking()
        .Include(refreshToken => refreshToken.User)
        .FirstOrDefaultAsync(refreshToken => refreshToken.Token.Equals(token));
}
```

### Write com ExecuteDeleteAsync

```csharp
public async Task Add(RefreshToken refreshToken)
{
    // Deleta todos os refresh tokens anteriores da pessoa em UMA query
    await _context.RefreshTokens
        .Where(rt => rt.UserId == refreshToken.UserId)
        .ExecuteDeleteAsync();

    await _context.RefreshTokens.AddAsync(refreshToken);
}
```

## Example

**Before (select-then-delete — desperdiça memória e tempo):**
```csharp
public async Task Add(RefreshToken refreshToken)
{
    var token = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.UserId == refreshToken.UserId);

    if (token is not null)
    {
        _context.RefreshTokens.Remove(token);
    }

    await _context.RefreshTokens.AddAsync(refreshToken);
}
```

**After (ExecuteDeleteAsync — uma única query DELETE):**
```csharp
public async Task Add(RefreshToken refreshToken)
{
    await _context.RefreshTokens
        .Where(rt => rt.UserId == refreshToken.UserId)
        .ExecuteDeleteAsync();

    await _context.RefreshTokens.AddAsync(refreshToken);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa deletar entidade(s) que não precisa ler | `Where(...).ExecuteDeleteAsync()` |
| Precisa ler entidade sem editar | `AsNoTracking()` |
| Precisa de dados de tabela relacionada | `.Include(e => e.NavigationProperty)` |
| Um token por pessoa (regra de negócio) | Delete anteriores antes de adicionar novo |
| Múltiplos tokens por dispositivo | Adicione propriedades de dispositivo na entidade, delete por UserId + DeviceId |
| FirstOrDefault sem resultado | Retorna null, sem exceção |
| ExecuteDeleteAsync sem match | Nenhuma exceção, nada acontece |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `var x = await query.FirstOrDefaultAsync(); Remove(x);` | `await query.Where(...).ExecuteDeleteAsync();` |
| `DbSet<RefreshToken> Tokens` (nome errado) | `DbSet<RefreshToken> RefreshTokens` (= nome da tabela) |
| Interface única com Read + Write | Interfaces separadas ReadOnly e WriteOnly |
| `FirstOrDefault` sem `Async` | `FirstOrDefaultAsync` com `await` |
| Esquecer `.Include()` em entidade com navigation property | `.Include(rt => rt.User)` explícito |
| Esquecer de registrar no DI | `AddScoped<IReadOnly, Repo>()` + `AddScoped<IWriteOnly, Repo>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
