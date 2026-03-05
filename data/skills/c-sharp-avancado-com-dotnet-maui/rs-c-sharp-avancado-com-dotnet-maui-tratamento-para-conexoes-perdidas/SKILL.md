---
name: rs-csharp-dotnet-maui-conexoes-perdidas
description: "Applies disconnection handling patterns when building SignalR hubs or real-time connection systems in C#/.NET. Use when user asks to 'handle disconnections', 'manage lost connections', 'implement OnDisconnectedAsync', 'track connection state', or 'build a SignalR hub'. Enforces dual-dictionary pattern for reverse-lookup by connection ID, proper null-checking chains, and culture-aware messaging. Make sure to use this skill whenever implementing real-time connection lifecycle management in .NET. Not for client-side reconnection logic, retry policies, or frontend WebSocket handling."
---

# Tratamento de Conexoes Perdidas em SignalR Hubs

> Ao tratar desconexoes em hubs SignalR, use dicionarios reversos para recuperar contexto a partir do connection ID, porque OnDisconnectedAsync so fornece o ID da conexao.

## Rules

1. **Use dicionario reverso para lookup por connection ID** — `codesByConnectionId[connectionId] = code`, porque `OnDisconnectedAsync` so recebe o connection ID, nao o codigo ou contexto do usuario
2. **Verifique todos os cenarios de desconexao antes de agir** — conectou sem fazer nada, gerou codigo sem par, gerou codigo com par esperando, porque cada cenario exige tratamento diferente
3. **Nunca envie mensagens localizadas do servidor** — envie apenas o tipo do evento (`OnUserDisconnected`), porque o servidor nao conhece a cultura/idioma do destinatario
4. **Aproveite o short-circuit do AND para null-safety** — `if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())`, porque C# avalia da esquerda para direita e para no primeiro falso
5. **Remova dados do dicionario ao desconectar** — `RemoveConnection(code)` libera memoria, porque conexoes perdidas nao devem ocupar espaco permanente
6. **Preencha o dicionario reverso no momento da criacao do codigo** — na funcao `Start`, nao depois, porque e o unico ponto garantido antes de qualquer desconexao

## How to write

### Dicionario reverso (dual-dictionary pattern)

```csharp
// Dicionario principal: codigo -> informacoes da conexao
private readonly ConcurrentDictionary<string, UserConnectionsDTO> _connectionsByCode;

// Dicionario reverso: connection ID -> codigo
private readonly ConcurrentDictionary<string, string> _codesByConnectionId;

public Hub()
{
    _connectionsByCode = new ConcurrentDictionary<string, UserConnectionsDTO>();
    _codesByConnectionId = new ConcurrentDictionary<string, string>();
}
```

### Preenchimento no Start (geracao do codigo)

```csharp
public async Task Start()
{
    var code = GenerateCode();
    var connectionId = Context.ConnectionId;

    _connectionsByCode.TryAdd(code, new UserConnectionsDTO { /* ... */ });
    _codesByConnectionId.TryAdd(connectionId, code);

    // ... resto do fluxo
}
```

### OnDisconnectedAsync com verificacao em cadeia

```csharp
public override async Task OnDisconnectedAsync(Exception? exception)
{
    var code = _codeConnectionService.GetCodeByConnectionId(Context.ConnectionId);

    if (code.IsNotEmpty())
    {
        var connection = _codeConnectionService.RemoveConnection(code);

        if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())
        {
            await Clients.Client(connection.ConnectingUserConnectionId)
                .SendAsync("OnUserDisconnected");
        }
    }

    await base.OnDisconnectedAsync(exception);
}
```

## Example

**Before (sem tratamento de desconexao):**
```csharp
public class ChatHub : Hub
{
    private readonly ConcurrentDictionary<string, UserConnectionsDTO> _connections = new();

    // Sem OnDisconnectedAsync — conexoes perdidas ficam orfas no dicionario
    // Sem forma de saber qual codigo pertencia a qual connection ID
}
```

**After (com dual-dictionary e tratamento):**
```csharp
public class ChatHub : Hub
{
    private readonly ConcurrentDictionary<string, UserConnectionsDTO> _connectionsByCode = new();
    private readonly ConcurrentDictionary<string, string> _codesByConnectionId = new();

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var code = GetCodeByConnectionId(Context.ConnectionId);

        if (code.IsNotEmpty())
        {
            var connection = RemoveConnection(code);

            if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())
            {
                await Clients.Client(connection.ConnectingUserConnectionId)
                    .SendAsync("OnUserDisconnected");
            }
        }

        await base.OnDisconnectedAsync(exception);
    }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| OnDisconnectedAsync precisa de contexto alem do connection ID | Criar dicionario reverso no momento do registro |
| Desconexao pode ser proposital (fluxo normal) ou acidental | Verificar null em cada etapa antes de notificar |
| Precisa notificar outro usuario sobre desconexao | Enviar apenas tipo de evento, sem mensagem textual |
| Multiplos dicionarios compartilham estado | Usar ConcurrentDictionary para thread-safety |
| Override de metodo do Hub | Chamar `await base.OnDisconnectedAsync(exception)` no final |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `OnDisconnectedAsync` sem verificar se ha contexto associado | Verificar `code.IsNotEmpty()` antes de qualquer acao |
| Enviar mensagem localizada do servidor (`"Fulano desconectou"`) | Enviar tipo de evento (`"OnUserDisconnected"`) e deixar o app formatar |
| Um unico dicionario com busca linear por valor | Dois dicionarios: um por codigo, outro por connection ID |
| Assumir que connection nunca e null no disconnect | Sempre verificar null — o fluxo normal tambem dispara disconnect |
| Acessar `connection.Property` sem verificar `connection is not null` primeiro | Usar short-circuit: `connection is not null && connection.Property.IsNotEmpty()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
