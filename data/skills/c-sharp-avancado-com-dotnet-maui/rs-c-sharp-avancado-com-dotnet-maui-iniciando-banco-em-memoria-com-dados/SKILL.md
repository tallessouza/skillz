---
name: rs-csharp-avancado-banco-memoria-dados
description: "Applies in-memory database seeding patterns for integration tests in .NET/C# projects. Use when user asks to 'seed test database', 'initialize in-memory db', 'setup integration test data', 'pre-populate test database', or 'configure WebApplicationFactory with data'. Covers CustomWebApplicationFactory configuration, DI scope creation, entity seeding, and token generation for authenticated endpoints. Make sure to use this skill whenever setting up integration test infrastructure in .NET. Not for unit tests, production database seeding, or EF Core migrations."
---

# Inicializando Banco de Dados em Memória com Dados para Testes de Integração

> Ao configurar testes de integração, garanta que o banco em memória já contenha dados pré-registrados antes da execução dos testes.

## Rules

1. **Cada classe de teste tem seu próprio banco** — classes diferentes usam servidores e bancos independentes, porque isolamento previne interferência entre suítes de teste
2. **Funções dentro da mesma classe compartilham o banco** — a ordem de execução dos testes não é controlável, então o banco deve estar consistente desde o início
3. **Sempre chame EnsureDeleted antes de popular** — `dbContext.Database.EnsureDeleted()` garante que o banco inicia vazio, porque resíduos de execuções anteriores causam falhas intermitentes
4. **Use métodos síncronos no WebApplicationFactory** — `Add` e `SaveChanges` em vez de `AddAsync` e `SaveChangesAsync`, porque o contexto do factory não suporta async
5. **Encapsule identidade do usuário de teste em uma classe dedicada** — exponha apenas métodos públicos (`GetPassword`, `GetEmail`, `GetAccessToken`), porque testes não devem acessar diretamente a entidade ou o DTO
6. **Gere tokens reais via DI** — resolva `IAccessTokenGenerator` do service provider para gerar tokens válidos, porque tokens mockados podem divergir da implementação real

## How to write

### Criar escopo e resolver DbContext

```csharp
// No ConfigureWebHost do CustomWebApplicationFactory
using var scope = services.BuildServiceProvider().CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<PlanShareDbContext>();
dbContext.Database.EnsureDeleted();
```

### Função StartDatabase separada

```csharp
private void StartDatabase(PlanShareDbContext dbContext, IAccessTokenGenerator accessTokenGenerator)
{
    var (user, password) = UserBuilder.Build();

    dbContext.Users.Add(user);
    dbContext.SaveChanges();

    var tokensDto = new TokensDto
    {
        AccessToken = accessTokenGenerator.Generate(user).Token,
        RefreshToken = string.Empty
    };

    User = new UserIdentityManager(user, password, tokensDto);
}
```

### UserIdentityManager com encapsulamento

```csharp
public class UserIdentityManager
{
    private readonly User _user;
    private readonly string _password;
    private readonly TokensDto _tokens;

    public UserIdentityManager(User user, string password, TokensDto tokens)
    {
        _user = user;
        _password = password;
        _tokens = tokens;
    }

    public string GetPassword() => _password;
    public string GetEmail() => _user.Email;
    public string GetAccessToken() => _tokens.AccessToken;
}
```

## Example

**Before (banco vazio, testes falham em endpoints autenticados):**
```csharp
// CustomWebApplicationFactory apenas configura o DbContext em memória
// Nenhum dado pré-existente → GetProfile retorna 404 ou 401
```

**After (banco populado com usuário e token válido):**
```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public UserIdentityManager User { get; private set; } = default!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // ... configuração do DbContext em memória ...
            services.AddDbContext<PlanShareDbContext>(options => ...);

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PlanShareDbContext>();
            var accessTokenGenerator = scope.ServiceProvider.GetRequiredService<IAccessTokenGenerator>();

            dbContext.Database.EnsureDeleted();
            StartDatabase(dbContext, accessTokenGenerator);
        });
    }

    private void StartDatabase(PlanShareDbContext dbContext, IAccessTokenGenerator accessTokenGenerator)
    {
        var (user, password) = UserBuilder.Build();
        dbContext.Users.Add(user);
        dbContext.SaveChanges();

        var tokensDto = new TokensDto
        {
            AccessToken = accessTokenGenerator.Generate(user).Token,
            RefreshToken = string.Empty
        };

        User = new UserIdentityManager(user, password, tokensDto);
    }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint exige `[AuthenticatedUser]` | Gere token real via `IAccessTokenGenerator` e exponha via `UserIdentityManager` |
| Teste precisa de email/senha | Use `GetEmail()` / `GetPassword()` do manager, nunca acesse a entidade diretamente |
| Múltiplas classes de teste | Cada uma terá seu próprio banco — não assuma dados compartilhados entre classes |
| Ordem de execução importa | Não importa — testes dentro de uma classe não têm ordem garantida |
| Precisa de dados relacionais complexos | Crie builders específicos e chame-os no `StartDatabase` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `await dbContext.SaveChangesAsync()` no factory | `dbContext.SaveChanges()` (contexto síncrono) |
| `public User User { get; }` expondo entidade | `UserIdentityManager` com métodos `Get*()` |
| Token hardcoded como string | Token gerado via `IAccessTokenGenerator` do DI |
| Dados de teste criados em um teste e usados em outro | Dados pré-populados no `StartDatabase` |
| `new PlanShareDbContext()` manual | `scope.ServiceProvider.GetRequiredService<PlanShareDbContext>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
