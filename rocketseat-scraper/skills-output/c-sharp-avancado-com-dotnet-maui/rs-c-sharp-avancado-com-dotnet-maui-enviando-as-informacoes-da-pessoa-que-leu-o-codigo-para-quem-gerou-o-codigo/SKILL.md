---
name: rs-csharp-maui-signalr-send-messages
description: "Enforces correct SignalR message sending patterns when building real-time features with ASP.NET Core Hubs. Use when user asks to 'send message to client', 'notify specific user', 'broadcast to all connections', 'implement SignalR hub method', or 'send real-time notification'. Applies rules: choose Clients.Client(connectionId) for targeted messages, Clients.All for broadcast, Clients.Caller for response-to-caller, never expose internal user IDs in responses. Make sure to use this skill whenever implementing Hub methods that need to communicate back to clients. Not for HTTP REST endpoints, database queries, or frontend SignalR client setup."
---

# Envio de Mensagens no SignalR Hub

> Escolha o metodo correto de envio (All, Caller, Client) baseado em QUEM precisa receber a mensagem, e nunca exponha IDs internos nas respostas.

## Rules

1. **Use `Clients.All` para broadcast** — envia para todas as conexoes ativas no Hub naquele momento, porque apenas quem esta conectado recebe (nao ha mensagens retroativas)
2. **Use `Clients.Caller` para responder ao chamador** — equivale a um return contextualizado, porque envia apenas para a conexao que invocou o metodo do Hub
3. **Use `Clients.Client(connectionId)` para mensagem direcionada** — envia para uma conexao especifica pelo ID, porque permite notificar um usuario que NAO foi o chamador
4. **Use `Clients.Clients(listaDeIds)` para multiplos destinos** — passa uma lista de connection IDs ao inves de duplicar chamadas, porque evita repeticao de codigo
5. **Nunca exponha IDs internos do banco** — crie um response DTO sem o ID da pessoa, porque expor IDs de outros usuarios e um risco de seguranca
6. **Sempre faca `await` no `SendAsync`** — e uma Task, esquece o await e a mensagem pode nao ser enviada

## How to write

### Broadcast para todos

```csharp
// Envia para TODAS as conexoes ativas no Hub
await Clients.All.SendAsync("NomeDoMetodo", argumento1, argumento2);
```

### Resposta ao chamador

```csharp
// Envia apenas para quem chamou o metodo do Hub
await Clients.Caller.SendAsync("NomeDoMetodo", responseDto);
```

### Mensagem para conexao especifica

```csharp
// Envia para UMA conexao especifica pelo connection ID
await Clients.Client(userConnection.ConnectionId)
    .SendAsync("OnUserJoins", new ResponseConnectingUserJson
    {
        Name = connectingUser.Name,
        ProfileImageUrl = connectingUser.ProfileImageUrl
    });
```

### Mensagem para multiplas conexoes

```csharp
// Envia para varias conexoes de uma vez
var connectionIds = new List<string> { connId1, connId2, connId3 };
await Clients.Clients(connectionIds).SendAsync("NomeDoMetodo", payload);
```

### Response DTO seguro (sem ID interno)

```csharp
// DTO que expoe apenas dados necessarios, sem ID do banco
public class ResponseConnectingUserJson
{
    public string Name { get; set; }
    public string ProfileImageUrl { get; set; }
    // NAO incluir UserId aqui
}
```

## Example

**Before (expondo ID e usando metodo errado):**

```csharp
public async Task JoinWithCodes(string code)
{
    // ... logica de busca ...
    
    // ERRADO: broadcast para todos quando so um precisa receber
    await Clients.All.SendAsync("OnUserJoins", new
    {
        Id = connectingUser.Id,  // expondo ID interno
        Name = connectingUser.Name
    });
}
```

**After (com esta skill aplicada):**

```csharp
public async Task JoinWithCodes(string code)
{
    // ... logica de busca ...
    
    // CORRETO: envia apenas para a conexao que gerou o codigo
    await Clients.Client(userConnections.ConnectionId)
        .SendAsync("OnUserJoins", new ResponseConnectingUserJson
        {
            Name = connectingUser.Name,
            ProfileImageUrl = connectingUser.ProfileImageUrl
        });
}
```

## Heuristics

| Situacao | Use |
|----------|-----|
| Notificar todos os usuarios conectados (chat global, alertas) | `Clients.All` |
| Devolver resultado para quem chamou o metodo | `Clients.Caller` |
| Notificar um usuario especifico que NAO chamou o metodo | `Clients.Client(connectionId)` |
| Notificar um grupo de usuarios especificos | `Clients.Clients(listaIds)` |
| Dados de resposta incluem info de outro usuario | Criar DTO sem ID interno |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `Clients.All` quando so 1 precisa receber | `Clients.Client(connectionId)` |
| Expor `UserId` no response para outros usuarios | Criar DTO apenas com Name e ProfileImageUrl |
| Esquecer `await` no `SendAsync` | Sempre `await Clients.X.SendAsync(...)` |
| Duplicar `Clients.Client()` em loop | Usar `Clients.Clients(listaDeIds)` |
| Retornar dados via `SendAsync` sem nome de metodo | Primeiro parametro e sempre o nome do metodo target |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
