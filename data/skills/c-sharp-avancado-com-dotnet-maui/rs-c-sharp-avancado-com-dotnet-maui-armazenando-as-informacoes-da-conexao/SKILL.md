---
name: rs-csharp-avancado-armazenando-conexao
description: "Enforces in-memory connection storage patterns for SignalR hubs in .NET. Use when user asks to 'store connection data', 'manage SignalR connections', 'share state between hub connections', 'map connection IDs to users', or 'create a connection service'. Applies rules: singleton lifecycle for shared hub services, dictionary keyed by code/identifier, DTO class (not record) for mutable connection state, no database for short-lived flows. Make sure to use this skill whenever implementing real-time connection management in SignalR. Not for database schema design, REST API endpoints, or authentication flows."
---

# Armazenando Informacoes de Conexao em SignalR

> Para dados de conexao de curta duracao, use um servico singleton em memoria com dicionario, nunca banco de dados.

## Rules

1. **Use servico em memoria para fluxos rapidos** — nao use banco de dados para conexoes que duram poucos minutos, porque operacoes de I/O no banco sao desnecessarias para dados efemeros
2. **Registre o servico como Singleton** — `builder.Services.AddSingleton<CodeConnectionService>()`, porque o mesmo objeto precisa ser compartilhado entre todas as conexoes do Hub
3. **Use classe, nao record, para DTOs mutaveis** — quando propriedades serao preenchidas em momentos diferentes do fluxo, record e imutavel e nao serve
4. **Acesse ConnectionId via `Context.ConnectionId`** — cada conexao SignalR tem um ID unico, use-o para direcionar mensagens a usuarios especificos
5. **Contextos sao independentes, nao threads** — nunca afirme que cada conexao tem uma thread dedicada; o .NET garante contextos independentes, nao threads separadas
6. **Interface e opcional para servicos internos do Hub** — se o servico e especifico do Hub e nao sera reutilizado, registre a classe diretamente no DI

## How to write

### Servico de conexao com dicionario

```csharp
public class CodeConnectionService
{
    private readonly Dictionary<string, UserConnectionDto> _connections;

    public CodeConnectionService()
    {
        _connections = new Dictionary<string, UserConnectionDto>();
    }

    public void Start(CodeUserConnectionDto codeUser, string connectionId)
    {
        var userConnection = new UserConnectionDto
        {
            UserId = codeUser.UserId,
            Code = codeUser.Code,
            ConnectionId = connectionId
        };

        _connections.Add(codeUser.Code, userConnection);
    }
}
```

### DTO mutavel (classe, nao record)

```csharp
// Classe porque propriedades sao preenchidas em momentos diferentes
public class UserConnectionDto
{
    public string UserId { get; set; }
    public string Code { get; set; }
    public string ConnectionId { get; set; }
    // Preenchido depois, quando outra pessoa digita o codigo
    public string? RequestingUserId { get; set; }
    public string? RequestingConnectionId { get; set; }
}
```

### Registro Singleton e uso no Hub

```csharp
// Program.cs
builder.Services.AddSingleton<CodeConnectionService>();

// Hub
public class UserConnectionsHub : Hub
{
    private readonly CodeConnectionService _codeConnectionService;

    public UserConnectionsHub(CodeConnectionService codeConnectionService)
    {
        _codeConnectionService = codeConnectionService;
    }

    public async Task GenerateCode()
    {
        // ... gera codigo via use case ...
        _codeConnectionService.Start(codeUserDto, Context.ConnectionId);
    }
}
```

## Example

**Before (banco de dados desnecessario):**
```csharp
// Errado: usando banco para dados que duram 2 minutos
await _dbContext.Connections.AddAsync(new ConnectionEntity { Code = code, UserId = userId });
await _dbContext.SaveChangesAsync();
// Depois: buscar, atualizar, deletar... tudo com I/O no banco
```

**After (servico em memoria):**
```csharp
// Correto: singleton em memoria, sem I/O desnecessario
_codeConnectionService.Start(codeUserDto, Context.ConnectionId);
// Busca, atualizacao e remocao instantaneas em memoria
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados duram poucos minutos | Servico em memoria (singleton) |
| Dados precisam persistir apos restart | Banco de dados |
| Precisa enviar msg para usuario especifico | Use `Context.ConnectionId` para mapear |
| DTO tem campos preenchidos em etapas | Use classe, nao record |
| Servico precisa ser o mesmo entre conexoes | `AddSingleton` no DI |
| Servico e exclusivo do Hub | Registre classe direto, sem interface |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `AddScoped<ConnectionService>()` | `AddSingleton<ConnectionService>()` |
| `record UserConnectionDto(...)` para DTOs mutaveis | `class UserConnectionDto { get; set; }` |
| "Cada conexao tem sua thread" | "Cada conexao tem seu contexto independente" |
| Banco de dados para fluxo de 2 minutos | Dicionario em memoria |
| `AddTransient<ConnectionService>()` | `AddSingleton<ConnectionService>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
