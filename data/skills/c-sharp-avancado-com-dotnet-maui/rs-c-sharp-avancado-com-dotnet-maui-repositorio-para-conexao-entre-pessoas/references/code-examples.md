# Code Examples: Repositório para Conexão entre Pessoas

## Entidade UserConnection (referência)

```csharp
public class UserConnection
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }  // Pessoa que gerou o código

    public Guid ConnectedUserId { get; set; }
    public User ConnectedUser { get; set; }  // Pessoa que usou o código
}
```

## Interface ReadOnly completa

```csharp
namespace Domain.Repositories.Connection
{
    public interface IUserConnectionReadOnlyRepository
    {
        Task<List<User>> GetConnectionsForUser(User user);
    }
}
```

## Interface WriteOnly completa

```csharp
namespace Domain.Repositories.Connection
{
    public interface IUserConnectionWriteOnlyRepository
    {
        Task Add(UserConnection userConnection);
    }
}
```

## Repositório completo

```csharp
namespace Infrastructure.DataAccess.Repositories
{
    public class UserConnectionRepository
        : IUserConnectionReadOnlyRepository, IUserConnectionWriteOnlyRepository
    {
        private readonly PlanShareDbContext _dbContext;

        public UserConnectionRepository(PlanShareDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Add(UserConnection userConnection)
        {
            await _dbContext.UserConnections.AddAsync(userConnection);
        }

        public async Task<List<User>> GetConnectionsForUser(User user)
        {
            // 1. Busca todas as conexões onde o usuário está em qualquer lado
            var connections = await _dbContext.UserConnections
                .AsNoTracking()
                .Include(c => c.User)           // JOIN com User (quem gerou código)
                .Include(c => c.ConnectedUser)   // JOIN com ConnectedUser (quem usou código)
                .Where(c => c.UserId == user.Id || c.ConnectedUserId == user.Id)
                .ToListAsync();

            // 2. Extrai apenas a "outra pessoa" de cada conexão
            var users = new List<User>();

            foreach (var connection in connections)
            {
                if (connection.UserId == user.Id)
                {
                    // Eu gerei o código → retorno quem se conectou comigo
                    users.Add(connection.ConnectedUser);
                }
                else
                {
                    // Eu usei o código de alguém → retorno quem gerou
                    users.Add(connection.User);
                }
            }

            return users;
        }
    }
}
```

## Registro no container de DI

```csharp
public static class DependencyInjectionExtension
{
    public static void AddRepositories(this IServiceCollection services)
    {
        // ... outros repositórios ...

        services.AddScoped<IUserConnectionReadOnlyRepository, UserConnectionRepository>();
        services.AddScoped<IUserConnectionWriteOnlyRepository, UserConnectionRepository>();
    }
}
```

## Estrutura de pastas resultante

```
Infrastructure/
└── DataAccess/
    └── Repositories/
        └── UserConnectionRepository.cs

Domain/
└── Repositories/
    └── Connection/                              # Pasta renomeada de "Association"
        ├── IUserConnectionReadOnlyRepository.cs  # Interface de leitura
        └── IUserConnectionWriteOnlyRepository.cs # Interface de escrita (nova)
```

## Sync Namespaces no Visual Studio

Quando renomear pastas no projeto:
1. Botão direito no **projeto** (não na pasta)
2. Selecionar **Sync Namespaces**
3. Revisar as mudanças propostas
4. Clicar em **Apply**

Isso corrige automaticamente todos os `namespace` declarations e `using` statements que referenciavam o nome antigo da pasta.