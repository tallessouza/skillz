---
name: rs-csharp-maui-repo-conexao-pessoas
description: "Applies repository pattern for bidirectional user connections in C#/.NET with Entity Framework. Use when user asks to 'create a connection repository', 'implement friendship system', 'build user relations', 'many-to-many user links', or 'repository for connecting users'. Enforces ReadOnly/WriteOnly interface separation, correct Include for navigation properties, and bidirectional WHERE logic that excludes self from results. Make sure to use this skill whenever implementing social connection features in .NET projects. Not for SignalR hubs, real-time messaging, or authentication repositories."
---

# Repositório para Conexão entre Pessoas

> Ao implementar repositórios de conexão N:N entre usuários, separe interfaces ReadOnly e WriteOnly e garanta que a busca bidirecional nunca retorne o próprio usuário.

## Rules

1. **Separe ReadOnly e WriteOnly em interfaces distintas** — `IUserConnectionReadOnlyRepository` e `IUserConnectionWriteOnlyRepository`, porque cada consumidor declara exatamente o que precisa (princípio de segregação de interface)
2. **Nomeie pelo domínio, não por termos genéricos** — `UserConnection` não `PersonAssociation`, porque nomes claros eliminam confusão quando o projeto cresce
3. **Use AsNoTracking em consultas de leitura** — porque não vai alterar as entidades retornadas e isso economiza performance no Entity Framework
4. **Include todas as navigation properties necessárias** — `.Include(c => c.User).Include(c => c.ConnectedUser)`, porque sem isso o EF não faz o JOIN e as propriedades ficam null
5. **WHERE bidirecional com OR** — busque onde `UserId == meuId OR ConnectedUserId == meuId`, porque o usuário pode ter gerado o código ou ter usado o código de outro
6. **Nunca retorne o próprio usuário na lista** — no forEach, devolva `ConnectedUser` se `UserId` é o meu, ou `User` se não é, porque a lista deve conter apenas as outras pessoas
7. **Registre no DI imediatamente** — sempre que criar interface + implementação, registre no container de dependências antes de continuar, porque esquecer causa erro em runtime

## How to write

### Interface WriteOnly

```csharp
public interface IUserConnectionWriteOnlyRepository
{
    Task Add(UserConnection userConnection);
}
```

### Interface ReadOnly

```csharp
public interface IUserConnectionReadOnlyRepository
{
    Task<List<User>> GetConnectionsForUser(User user);
}
```

### Implementação do repositório

```csharp
public class UserConnectionRepository
    : IUserConnectionReadOnlyRepository, IUserConnectionWriteOnlyRepository
{
    private readonly PlanShareDbContext _dbContext;

    public async Task Add(UserConnection userConnection)
    {
        await _dbContext.UserConnections.AddAsync(userConnection);
    }

    public async Task<List<User>> GetConnectionsForUser(User user)
    {
        var connections = await _dbContext.UserConnections
            .AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.ConnectedUser)
            .Where(c => c.UserId == user.Id || c.ConnectedUserId == user.Id)
            .ToListAsync();

        var users = new List<User>();

        foreach (var connection in connections)
        {
            if (connection.UserId == user.Id)
                users.Add(connection.ConnectedUser);
            else
                users.Add(connection.User);
        }

        return users;
    }
}
```

### Registro no DI

```csharp
// Em DependencyInjectionExtension.AddRepositories()
services.AddScoped<IUserConnectionReadOnlyRepository, UserConnectionRepository>();
services.AddScoped<IUserConnectionWriteOnlyRepository, UserConnectionRepository>();
```

## Example

**Before (nomes confusos, lógica incompleta):**
```csharp
public class PersonAssociationRepository : IPersonAssociationReadOnlyRepository
{
    public async Task<List<User>> GetPersonAssociationsForUser(User user)
    {
        // TODO: implement
        throw new NotImplementedException();
    }
}
```

**After (com esta skill aplicada):**
```csharp
public class UserConnectionRepository
    : IUserConnectionReadOnlyRepository, IUserConnectionWriteOnlyRepository
{
    public async Task Add(UserConnection userConnection)
    {
        await _dbContext.UserConnections.AddAsync(userConnection);
    }

    public async Task<List<User>> GetConnectionsForUser(User user)
    {
        var connections = await _dbContext.UserConnections
            .AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.ConnectedUser)
            .Where(c => c.UserId == user.Id || c.ConnectedUserId == user.Id)
            .ToListAsync();

        var users = new List<User>();
        foreach (var connection in connections)
        {
            if (connection.UserId == user.Id)
                users.Add(connection.ConnectedUser);
            else
                users.Add(connection.User);
        }
        return users;
    }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Relação N:N entre usuários | Crie entidade intermediária com duas FK + navigation properties |
| Consulta de leitura sem edição | Use `AsNoTracking()` |
| Usuário pode estar em qualquer lado da relação | WHERE com OR nas duas colunas de FK |
| Lista de conexões para exibir no dashboard | Use `GetConnectionsForUser` que já exclui o próprio usuário |
| Criou nova interface de repositório | Registre no DI container imediatamente |
| Renomeou pasta no Visual Studio | Use Sync Namespaces (botão direito no projeto) para corrigir namespaces |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `PersonAssociation` | `UserConnection` (nome claro do domínio) |
| `GetPersonAssociationsForUser` | `GetConnectionsForUser` |
| Interface única Read+Write | Interfaces separadas `ReadOnly` e `WriteOnly` |
| `Where(c => c.UserId == user.Id)` sozinho | `Where(c => c.UserId == user.Id \|\| c.ConnectedUserId == user.Id)` |
| Retornar lista incluindo o próprio usuário | ForEach que seleciona apenas a outra pessoa da conexão |
| Esquecer `.Include()` nas navigation properties | Sempre incluir `.Include(c => c.User).Include(c => c.ConnectedUser)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
