# Code Examples: Cancelando Conexao de Pessoas

## CodeConnectionService — RemoveConnection

Metodo no servico Singleton que gerencia o dicionario de conexoes:

```csharp
public class CodeConnectionService
{
    private readonly ConcurrentDictionary<string, UsersConnectionsDTO> _connections = new();

    // ... outros metodos (CreateCode, TryGetValue, etc.)

    public UsersConnectionsDTO? RemoveConnection(string code)
    {
        _connections.TryRemove(code, out var userConnection);
        return userConnection;
    }
}
```

### Anatomia do TryRemove

```csharp
// TryRemove retorna bool (conseguiu ou nao)
// out var recebe o valor que foi removido (ou null se nao existia)
bool removed = _connections.TryRemove(code, out var userConnection);
// 'removed' nao e usado — nao importa pra logica
// 'userConnection' e retornado para o Hub decidir o que fazer
```

## Hub — Metodo Cancel completo

```csharp
public async Task Cancel(string code)
{
    // 1. Remove do dicionario e captura o valor removido
    var connection = _service.RemoveConnection(code);

    // 2. Verifica se existia conexao E se alguem estava aguardando
    if (connection is not null && connection.ConnectingUserId.HasValue)
    {
        // 3. Notifica APENAS a pessoa que estava aguardando
        await Clients.Client(connection.ConnectingUserConnectionId!)
            .SendAsync("OnCancelled");
    }
}
```

## UsersConnectionsDTO — Estrutura de referencia

```csharp
public class UsersConnectionsDTO
{
    // Pessoa que gerou o codigo
    public Guid CreatorUserId { get; set; }
    public string CreatorUserConnectionId { get; set; }

    // Pessoa que tentou se conectar (nullable — pode nao existir ainda)
    public Guid? ConnectingUserId { get; set; }
    public string? ConnectingUserConnectionId { get; set; }
}
```

## Cenario 1: Cancelar sem ninguem aguardando

```
Estado do dicionario antes:
{
    "771463": {
        CreatorUserId: "ellison-guid",
        CreatorUserConnectionId: "conn-1",
        ConnectingUserId: null,          // <-- ninguem tentou
        ConnectingUserConnectionId: null
    }
}

Apos Cancel("771463"):
- Dicionario: {} (vazio)
- connection != null → true
- connection.ConnectingUserId.HasValue → false
- Resultado: nenhuma notificacao enviada
```

## Cenario 2: Cancelar com alguem aguardando

```
Estado do dicionario antes:
{
    "681921": {
        CreatorUserId: "ellison-guid",
        CreatorUserConnectionId: "conn-1",
        ConnectingUserId: "edeline-guid",          // <-- preenchido
        ConnectingUserConnectionId: "conn-2"       // <-- preenchido
    }
}

Apos Cancel("681921"):
- Dicionario: {} (vazio)
- connection != null → true
- connection.ConnectingUserId.HasValue → true
- Resultado: Clients.Client("conn-2").SendAsync("OnCancelled")
- Edeline recebe a notificacao de cancelamento
```

## Comparacao: TryGetValue vs TryRemove

```csharp
// TryGetValue — consulta sem alterar
_connections.TryGetValue(code, out var connection);
// connection contem o valor, dicionario INALTERADO

// TryRemove — consulta E remove atomicamente
_connections.TryRemove(code, out var connection);
// connection contem o valor, dicionario SEM essa entrada
```