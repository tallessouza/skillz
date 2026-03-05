---
name: rs-csharp-maui-hub-exception-filter
description: "Applies SignalR Hub exception filter pattern using IHubFilter when writing real-time connection code in C#/.NET. Use when user asks to 'handle hub exceptions', 'create signalr filter', 'treat hub errors', 'add error handling to hub', or 'implement hub middleware'. Covers IHubFilter interface, global vs per-hub configuration, InvokeMethodAsync override, and notifying connected users on failure. Make sure to use this skill whenever implementing SignalR Hubs with error handling. Not for REST API exception filters, general try-catch, or non-SignalR middleware."
---

# Filtro de Exceção para SignalR Hub

> Implemente IHubFilter como middleware do Hub para capturar exceções inesperadas e notificar todos os usuários afetados.

## Rules

1. **Use IHubFilter, não try-catch nos métodos do Hub** — `IHubFilter` centraliza o tratamento num único ponto, porque exceções podem vir de qualquer método (generate, confirm, cancel) e de fontes inesperadas como timeout de banco de dados
2. **Prefira filtro per-hub, não global** — configure com `AddHubOptions<T>` em vez de `AddSignalR(options => ...)`, porque cada Hub tem lógica de erro específica (conexões, notificações de usuários diferentes)
3. **Trate exceções como desconhecidas no catch genérico** — se o código não lança exceções explícitas e mesmo assim uma ocorre, é desconhecida por definição; retorne mensagem genérica ao usuário
4. **Notifique TODOS os usuários afetados** — quando uma exceção ocorre num método que envolve múltiplos usuários (ex: confirmar conexão), avise também quem está esperando resposta, porque senão ficam "no vácuo"
5. **IHubFilter é middleware, não filtro** — apesar do nome, `InvokeMethodAsync` executa antes E depois do método do Hub, como um middleware/pipeline

## How to write

### Classe do filtro

```csharp
public class UserConnectionsExceptionHubFilter : IHubFilter
{
    private readonly ICodeConnectionService _codeConnectionService;

    public UserConnectionsExceptionHubFilter(ICodeConnectionService codeConnectionService)
    {
        _codeConnectionService = codeConnectionService;
    }

    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next)
    {
        try
        {
            return await next(invocationContext);
        }
        catch
        {
            var connectionId = invocationContext.Hub.Context.ConnectionId;

            // Notificar o outro usuário que estava esperando
            var code = _codeConnectionService.GetCodeByConnectionId(connectionId);
            if (!string.IsNullOrEmpty(code))
            {
                var connection = _codeConnectionService.RemoveConnection(code);
                if (connection is not null)
                {
                    await invocationContext.Hub.Clients
                        .Client(connection.GuestConnectionId)
                        .SendAsync("ConnectionErrorOccurrence");
                }
            }

            return HubOperationResult<string>.Failure(
                ResourceMessage.UNKNOWN_ERROR,
                ErrorType.Unknown);
        }
    }
}
```

### Configuração per-hub (Program.cs)

```csharp
// Per-hub — filtro executa APENAS neste Hub
builder.Services.AddSignalR();
builder.Services.AddHubOptions<UserConnectionHub>(options =>
{
    options.AddFilter<UserConnectionsExceptionHubFilter>();
});
```

### Configuração global (alternativa)

```csharp
// Global — filtro executa em TODOS os Hubs
builder.Services.AddSignalR(options =>
{
    options.AddFilter<UserConnectionsExceptionHubFilter>();
});
```

## Example

**Before (sem filtro — exceção estoura sem controle):**
```csharp
// Hub method — exceção de timeout do banco propaga sem tratamento
public async Task<HubOperationResult<string>> GenerateCode()
{
    var code = await _service.GenerateCode(Context.ConnectionId);
    // Se _service lançar exceção → cliente recebe erro cru
    return HubOperationResult<string>.Success(code);
}
```

**After (com filtro — exceção capturada e usuários notificados):**
```csharp
// O método do Hub permanece limpo — sem try-catch
public async Task<HubOperationResult<string>> GenerateCode()
{
    var code = await _service.GenerateCode(Context.ConnectionId);
    return HubOperationResult<string>.Success(code);
}
// O filtro captura qualquer exceção, retorna erro controlado
// E notifica outros usuários afetados
```

## Heuristics

| Situação | Faça |
|----------|------|
| Hub com múltiplos métodos que podem falhar | Um filtro per-hub que trata tudo centralizadamente |
| Múltiplos Hubs no projeto | Um filtro separado para cada Hub com `AddHubOptions<T>` |
| Exceção afeta apenas quem chamou | Retorne `Failure()` no catch |
| Exceção afeta outro usuário esperando | Notifique via `Clients.Client(id).SendAsync()` antes do return |
| Quer executar código antes do método do Hub | Use `InvokeMethodAsync` — é middleware, não só catch |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Try-catch em cada método do Hub | Um IHubFilter centralizado |
| Filtro global quando lógica é específica do Hub | `AddHubOptions<T>` per-hub |
| Deixar exceção propagar sem tratar | Catch genérico retornando erro controlado |
| Retornar erro só pra quem chamou quando há outros esperando | Notificar todos os usuários afetados |
| Catch com tipo específico de exceção quando não se sabe a origem | Catch genérico — se não lançou, é desconhecida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
