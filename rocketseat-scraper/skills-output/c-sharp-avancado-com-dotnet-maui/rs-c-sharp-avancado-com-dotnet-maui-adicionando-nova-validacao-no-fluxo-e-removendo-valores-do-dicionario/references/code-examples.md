# Code Examples: Gerenciamento de Dicionarios e Validacao em SignalR Hubs

## Exemplo 1: Transformando Get em Remove no Service

### Antes
```csharp
// CodeConnectionService.cs (nome antigo)
public string? GetCodeByConnectionId(string connectionId)
{
    _connectionIdToCode.TryGetValue(connectionId, out var code);
    return code;
}
```

### Depois
```csharp
// UserConnectionsService.cs (nome novo, espelha o hub)
public string? RemoveCodeByConnectionId(string connectionId)
{
    _connectionIdToCode.TryRemove(connectionId, out var code);
    return code;
}
```

**Nota:** `ConcurrentDictionary.TryRemove` remove a entrada atomicamente e retorna o valor via `out`. Funciona como TryGetValue + Remove em uma unica operacao thread-safe.

## Exemplo 2: Validacao de conexao existente no JoinWithCode

```csharp
// UserConnectionsHub.cs
public async Task<Result> JoinWithCode(string code)
{
    var usersConnection = _service.GetConnectionByCode(code);

    if (usersConnection is null)
    {
        return Result.Fail(new InvalidCodeError("Codigo invalido ou expirado."));
    }

    // NOVA VALIDACAO: impedir que pessoa C sobrescreva pessoa B
    if (usersConnection.ConnectingUserId.HasValue)
    {
        return Result.Fail(new InvalidCodeError(
            "Este codigo ja esta vinculado a outra conexao. Solicite um novo."));
    }

    // ... continua com o fluxo normal (use case, etc.)
}
```

## Exemplo 3: Limpeza no ConfirmCodeJoin

```csharp
public async Task ConfirmCodeJoin(string code)
{
    var usersConnection = _service.RemoveConnectionByCode(code);

    // ... logica de confirmacao ...

    // Limpa o segundo dicionario tambem
    _ = _service.RemoveCodeByConnectionId(Context.ConnectionId);

    return;
}
```

## Exemplo 4: Limpeza no CancelCodeJoin

```csharp
public async Task CancelCodeJoin(string code)
{
    var usersConnection = _service.RemoveConnectionByCode(code);

    // ... logica de cancelamento ...

    // Mesma limpeza do confirm
    _ = _service.RemoveCodeByConnectionId(Context.ConnectionId);

    return;
}
```

## Exemplo 5: Descarte de valor com underscore

```csharp
// Quando voce precisa da remocao mas nao do valor retornado
_ = _service.RemoveCodeByConnectionId(Context.ConnectionId);

// Equivalente a (ambos sao validos):
_service.RemoveCodeByConnectionId(Context.ConnectionId);
```

O `_` (discard) deixa explicita a intencao: "sei que retorna algo, mas nao preciso desse valor aqui."

## Exemplo 6: Renomeacao do service

```
ANTES:
  CodeConnectionService.cs → nome generico, nao indica qual hub atende

DEPOIS:
  UserConnectionsService.cs → espelha UserConnectionsHub.cs

Convencao:
  {NomeDoHub}Hub.cs    → Hub SignalR
  {NomeDoHub}Service.cs → Service que atende esse hub
```