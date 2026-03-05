---
name: rs-csharp-maui-validacao-dicionario
description: "Enforces dictionary cleanup and concurrent connection validation patterns in C# SignalR hubs. Use when user asks to 'manage SignalR connections', 'handle real-time dictionaries', 'validate concurrent users', 'prevent connection overwrite', or 'clean up hub state'. Applies rules: remove dictionary entries when flow completes, validate before overwriting existing connections, rename services to match hub names. Make sure to use this skill whenever working with in-memory dictionaries for connection tracking in SignalR. Not for database persistence, authentication, or frontend real-time UI code."
---

# Gerenciamento de Dicionarios e Validacao em SignalR Hubs

> Sempre remova pares de valores do dicionario quando o fluxo encerrar e valide conexoes existentes antes de permitir novas.

## Rules

1. **Remova do dicionario ao encerrar o fluxo** — use `TryRemove` em vez de `TryGetValue` quando todo cenario de uso implica remocao (desconexao, excecao, confirmacao, cancelamento), porque manter valores orfaos consome memoria indefinidamente
2. **Substitua GET por REMOVE quando todo cenario exige remocao** — se toda chamada a `GetCodeByConnectionId` resulta em remocao posterior, transforme em `RemoveCodeByConnectionId` direto, porque elimina um passo e evita esquecimentos
3. **Valide conexao existente antes de sobrescrever** — verifique `HasValue` no campo de usuario conectado antes de permitir novo usuario no mesmo codigo, porque sem isso um usuario C sobrescreve o usuario B que chegou primeiro
4. **Nomeie services espelhando o hub** — `UserConnectionsHub` → `UserConnectionsService`, porque facilita identificacao imediata de qual service atende qual hub
5. **Remova de TODOS os dicionarios** — se o hub usa multiplos dicionarios (connectionId→code, code→connection), remova de ambos em cada ponto de saida, porque um orfao em qualquer dicionario e um vazamento

## How to write

### TryRemove ao inves de TryGetValue

```csharp
// Quando todo cenario de uso implica remocao, use TryRemove direto
public string? RemoveCodeByConnectionId(string connectionId)
{
    _connectionIdToCode.TryRemove(connectionId, out var code);
    return code;
}
```

### Validacao de conexao existente

```csharp
// Antes de associar novo usuario, verifique se ja existe alguem conectado
if (usersConnection.ConnectingUserId.HasValue)
{
    return Result.Fail(new InvalidCodeError("Este codigo ja esta vinculado a outra conexao. Solicite um novo."));
}
```

### Limpeza em todos os pontos de saida

```csharp
// No Confirm e no Cancel, remova antes do return
public async Task ConfirmCodeJoin(...)
{
    // ... logica de confirmacao ...

    _service.RemoveConnectionByCode(code);
    _ = _service.RemoveCodeByConnectionId(Context.ConnectionId);

    return;
}
```

## Example

**Before (vazamento de memoria e sobrescrita):**
```csharp
public string? GetCodeByConnectionId(string connectionId)
{
    _dict.TryGetValue(connectionId, out var code);
    return code;
}

// No hub - sem validacao, pessoa C sobrescreve pessoa B
var connection = _service.GetConnectionByCode(code);
// ... processa direto sem verificar ConnectingUserId
```

**After (com limpeza e validacao):**
```csharp
public string? RemoveCodeByConnectionId(string connectionId)
{
    _dict.TryRemove(connectionId, out var code);
    return code;
}

// No hub - valida antes de prosseguir
var connection = _service.GetConnectionByCode(code);
if (connection.ConnectingUserId.HasValue)
{
    return Result.Fail("Este codigo ja esta vinculado a outra conexao.");
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Todo uso de Get resulta em remocao posterior | Substitua por Remove direto |
| Hub usa multiplos dicionarios | Remova de todos nos mesmos pontos |
| Fluxo permite entrada concorrente | Adicione validacao de `HasValue` |
| Service nao indica qual Hub atende | Renomeie para espelhar o Hub |
| Desconexao ou excecao ocorre | Remova de todos os dicionarios para liberar memoria |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `TryGetValue` + remocao separada depois | `TryRemove` direto quando sempre vai remover |
| Confirmar/cancelar sem limpar dicionarios | Sempre remover antes do `return` |
| Permitir novo usuario sem checar existente | Verificar `ConnectingUserId.HasValue` |
| `CodeConnectionService` (nome generico) | `UserConnectionsService` (espelha o hub) |
| Remover de um dicionario e esquecer o outro | Remover de todos os dicionarios no mesmo ponto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
