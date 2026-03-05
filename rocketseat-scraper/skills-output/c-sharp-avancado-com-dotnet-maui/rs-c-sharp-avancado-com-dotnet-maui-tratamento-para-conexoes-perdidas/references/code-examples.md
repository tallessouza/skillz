# Code Examples: Tratamento de Conexoes Perdidas

## Exemplo 1: Estrutura completa do Hub com dual-dictionary

```csharp
public class UserConnectionsHub : Hub
{
    private readonly CodeConnectionService _codeConnectionService;

    // Dicionario principal: codigo -> informacoes da conexao
    private readonly ConcurrentDictionary<string, UserConnectionsDTO> _connectionsByCode;

    // Dicionario reverso: connection ID -> codigo (para OnDisconnectedAsync)
    private readonly ConcurrentDictionary<string, string> _codesByConnectionId;

    public UserConnectionsHub(CodeConnectionService codeConnectionService)
    {
        _codeConnectionService = codeConnectionService;
        _connectionsByCode = new ConcurrentDictionary<string, UserConnectionsDTO>();
        _codesByConnectionId = new ConcurrentDictionary<string, string>();
    }

    public async Task Start()
    {
        var code = GenerateCode();
        var connectionId = Context.ConnectionId;

        // Registra no dicionario principal
        _connectionsByCode.TryAdd(code, new UserConnectionsDTO
        {
            CreatorConnectionId = connectionId,
            // ... outras propriedades
        });

        // Registra no dicionario reverso para lookup em OnDisconnectedAsync
        _codesByConnectionId.TryAdd(connectionId, code);

        // ... envia codigo para o cliente
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // 1. Tenta recuperar o codigo associado a este connection ID
        var code = _codeConnectionService.GetCodeByConnectionId(Context.ConnectionId);

        if (code.IsNotEmpty())
        {
            // 2. Remove as informacoes do dicionario principal
            var connection = _codeConnectionService.RemoveConnection(code);

            // 3. Verifica se havia alguem esperando aprovacao
            if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())
            {
                // 4. Notifica apenas com tipo de evento (sem mensagem textual)
                await Clients.Client(connection.ConnectingUserConnectionId)
                    .SendAsync("OnUserDisconnected");
            }
        }

        await base.OnDisconnectedAsync(exception);
    }
}
```

## Exemplo 2: CodeConnectionService com metodo de lookup reverso

```csharp
public class CodeConnectionService
{
    private readonly ConcurrentDictionary<string, UserConnectionsDTO> _connectionsByCode;
    private readonly ConcurrentDictionary<string, string> _codesByConnectionId;

    public CodeConnectionService()
    {
        _connectionsByCode = new ConcurrentDictionary<string, UserConnectionsDTO>();
        _codesByConnectionId = new ConcurrentDictionary<string, string>();
    }

    // Busca codigo pelo connection ID (para OnDisconnectedAsync)
    public string? GetCodeByConnectionId(string connectionId)
    {
        _codesByConnectionId.TryGetValue(connectionId, out var code);
        return code;
    }

    // Remove e retorna as informacoes associadas ao codigo
    public UserConnectionsDTO? RemoveConnection(string code)
    {
        _connectionsByCode.TryRemove(code, out var connection);
        return connection;
    }
}
```

## Exemplo 3: Metodo de extensao IsNotEmpty

```csharp
public static class StringExtensions
{
    public static bool IsNotEmpty(this string? value)
    {
        return !string.IsNullOrEmpty(value);
    }
}
```

## Exemplo 4: Fluxo de teste demonstrado na aula

```
1. Conectar usuario "Ellison" -> Hub
2. Ellison chama Start() -> gera codigo 869030
3. Dicionario reverso registra: connectionId_ellison -> "869030"
4. Ellison desconecta (proposital, para teste)
5. OnDisconnectedAsync executa:
   - Busca codigo para connectionId_ellison -> encontra "869030"
   - Remove conexao "869030" do dicionario principal
   - Verifica ConnectingUserConnectionId -> null (ninguem leu o codigo)
   - Nao notifica ninguem -> fim

Segundo teste:
1. Ellison conecta -> gera codigo 561618
2. Edline conecta -> envia codigo 561618 (quer se juntar)
3. Ellison recebe notificacao: "Edline esta esperando aprovacao"
4. Ellison desconecta (antes de aprovar/rejeitar)
5. OnDisconnectedAsync executa:
   - Busca codigo para connectionId_ellison -> encontra "561618"
   - Remove conexao "561618" -> retorna DTO com ConnectingUserConnectionId preenchido
   - connection is not null? SIM
   - ConnectingUserConnectionId.IsNotEmpty()? SIM (e o ID da Edline)
   - Envia "OnUserDisconnected" para Edline
6. Edline recebe evento "OnUserDisconnected" e sabe que precisa reiniciar o fluxo
```

## Exemplo 5: Pattern de verificacao em cadeia (null-safe)

```csharp
// CORRETO: verificacao da esquerda para direita com short-circuit
if (connection is not null && connection.ConnectingUserConnectionId.IsNotEmpty())
{
    await Clients.Client(connection.ConnectingUserConnectionId)
        .SendAsync("OnUserDisconnected");
}

// INCORRETO: acessar propriedade sem verificar null primeiro
// Isso lanca NullReferenceException se connection for null
if (connection.ConnectingUserConnectionId.IsNotEmpty())  // BOOM!
{
    // ...
}

// INCORRETO: ordem invertida — C# avalia da esquerda para direita
if (connection.ConnectingUserConnectionId.IsNotEmpty() && connection is not null)
{
    // A primeira condicao ja causa NullReferenceException
}
```