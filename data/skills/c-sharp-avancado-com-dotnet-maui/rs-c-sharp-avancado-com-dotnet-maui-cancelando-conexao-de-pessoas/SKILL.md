---
name: rs-csharp-cancelando-conexao
description: "Applies cancel/disconnect operation patterns in SignalR Hubs and real-time connection services with C#/.NET. Use when user asks to 'implement cancel', 'remove connection', 'disconnect user', 'cancel operation in hub', or 'notify on cancellation'. Enforces dictionary cleanup, conditional client notification, and two-scenario handling (idle vs active connection). Make sure to use this skill whenever implementing cancel/disconnect flows in SignalR or real-time systems. Not for HTTP REST endpoints, database operations, or frontend UI cancellation logic."
---

# Cancelando Conexao em Tempo Real

> Ao implementar cancelamento em sistemas real-time, remova o estado do dicionario e notifique condicionalmente apenas as partes afetadas.

## Rules

1. **Remova do dicionario E devolva o valor removido** — use `TryRemove` com out var para obter o objeto antes de descartar, porque voce precisa do estado para decidir quem notificar
2. **Trate dois cenarios de cancelamento** — cancelar sem ninguem aguardando vs cancelar com alguem aguardando aprovacao, porque a notificacao so faz sentido quando existe outra parte
3. **Verifique nulidade em cascata** — primeiro `connection != null`, depois `connection.ConnectingUserId.HasValue`, porque cada nivel representa um estado diferente do fluxo
4. **Notifique apenas a parte afetada** — envie mensagem somente para o ConnectionId da pessoa que estava aguardando, porque a pessoa que cancelou ja sabe que cancelou
5. **Nao envie argumentos desnecessarios** — `OnCancelled` sem parametros e suficiente, porque o cliente ja tem contexto do que estava acontecendo
6. **Use `!` (null-forgiving) apos verificacao de null** — `connection.ConnectingUserConnectionId!` dentro do if que ja verificou `HasValue`, porque o compilador nao infere a verificacao anterior

## How to write

### Servico — RemoveConnection

```csharp
public UsersConnectionsDTO? RemoveConnection(string code)
{
    _connections.TryRemove(code, out var userConnection);
    return userConnection;
}
```

### Hub — Cancel com notificacao condicional

```csharp
public async Task Cancel(string code)
{
    var connection = _service.RemoveConnection(code);

    if (connection is not null && connection.ConnectingUserId.HasValue)
    {
        await Clients.Client(connection.ConnectingUserConnectionId!)
            .SendAsync("OnCancelled");
    }
}
```

## Example

**Before (tratamento ingênuo sem cenarios):**
```csharp
public async Task Cancel(string code)
{
    _service.RemoveConnection(code);
    // Notifica todo mundo ou ninguem — errado
    await Clients.All.SendAsync("OnCancelled", code);
}
```

**After (com tratamento dos dois cenarios):**
```csharp
public async Task Cancel(string code)
{
    var connection = _service.RemoveConnection(code);

    if (connection is not null && connection.ConnectingUserId.HasValue)
    {
        await Clients.Client(connection.ConnectingUserConnectionId!)
            .SendAsync("OnCancelled");
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ninguem leu o codigo ainda | Remova do dicionario, nao notifique ninguem |
| Alguem esta aguardando aprovacao | Remova do dicionario E notifique somente essa pessoa |
| Propriedade nullable (Guid?) precisa de check | Use `.HasValue` antes de acessar |
| Compilador reclama de null apos seu if | Use `!` (null-forgiving operator) |
| Duvida se precisa enviar argumentos na notificacao | Nao envie — o cliente ja sabe o contexto |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-------------------|
| `Clients.All.SendAsync("OnCancelled")` | `Clients.Client(specificConnectionId).SendAsync("OnCancelled")` |
| `_connections.Remove(code)` sem capturar valor | `_connections.TryRemove(code, out var conn)` |
| Verificar apenas `connection != null` | Verificar `connection != null && connection.ConnectingUserId.HasValue` |
| Passar `code` ou `userId` como argumento do OnCancelled | Chamar `OnCancelled` sem argumentos |
| Ignorar o retorno do `TryRemove` | Usar o valor retornado para decidir notificacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
