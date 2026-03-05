# Code Examples: Return Pattern para SignalR Hubs

## Classe HubOperationResult completa

A classe fica no projeto de comunicação (shared), dentro da pasta `response`:

```csharp
// Communication/Response/HubOperationResult.cs
public class HubOperationResult<TResponse>
{
    public bool IsSuccess { get; init; }
    public TResponse? Response { get; init; }
    public string ErrorMessage { get; init; } = string.Empty;

    public static HubOperationResult<TResponse> Success(TResponse response)
    {
        return new HubOperationResult<TResponse>
        {
            IsSuccess = true,
            Response = response
        };
    }

    public static HubOperationResult<TResponse> Failure(string errorMessage)
    {
        return new HubOperationResult<TResponse>
        {
            IsSuccess = false,
            ErrorMessage = errorMessage
        };
    }
}
```

### Detalhes das propriedades

| Propriedade | Tipo | Nullable | Accessor | Quando preenchida |
|-------------|------|----------|----------|-------------------|
| `IsSuccess` | `bool` | Não | `get; init;` | Sempre — true ou false |
| `Response` | `TResponse?` | Sim | `get; init;` | Apenas em sucesso |
| `ErrorMessage` | `string` | Não | `get; init;` | Em erro = mensagem; em sucesso = string.Empty |

## Método GenerateCode com Return Pattern

```csharp
// Antes — sem Return Pattern
public async Task<string> GenerateCode()
{
    var code = GenerateSixDigitCode();
    _codeDictionary.Add(code, Context.ConnectionId);
    return code;
}

// Depois — com Return Pattern
public async Task<HubOperationResult<string>> GenerateCode()
{
    var code = GenerateSixDigitCode();
    _codeDictionary.Add(code, Context.ConnectionId);
    return HubOperationResult<string>.Success(code);
}
```

## Resposta JSON no Postman

Quando o cliente (Postman via WebSocket) chama `GenerateCode`, a resposta é:

```json
{
    "isSuccess": true,
    "response": "306710",
    "errorMessage": ""
}
```

Em caso de erro (exemplo futuro):

```json
{
    "isSuccess": false,
    "response": null,
    "errorMessage": "Código não encontrado."
}
```

## Padrão de validação com IF (spoiler da próxima aula)

```csharp
public async Task<HubOperationResult<ConnectionResponse>> ReadCode(string code)
{
    // Validação: código existe no dicionário?
    if (!_codeDictionary.ContainsKey(code))
        return HubOperationResult<ConnectionResponse>.Failure("Código não encontrado.");

    // Mais validações viriam aqui...

    // Fluxo de sucesso
    var connection = await _connectionService.Connect(code);
    return HubOperationResult<ConnectionResponse>.Success(connection);
}
```

## Variações para diferentes tipos de resposta

```csharp
// Retornando string
public async Task<HubOperationResult<string>> GenerateCode()
    => HubOperationResult<string>.Success(code);

// Retornando objeto complexo
public async Task<HubOperationResult<ConnectionDetails>> ConnectUsers(string code)
    => HubOperationResult<ConnectionDetails>.Success(details);

// Retornando lista
public async Task<HubOperationResult<List<UserConnection>>> GetActiveConnections()
    => HubOperationResult<List<UserConnection>>.Success(connections);

// Retornando bool
public async Task<HubOperationResult<bool>> DisconnectUser(string connectionId)
    => HubOperationResult<bool>.Success(true);
```

## Fluxo completo de teste via Postman

1. Abrir conexão WebSocket no Postman
2. Enviar mensagem de handshake (protocolo SignalR)
3. Receber confirmação do handshake
4. Enviar mensagem no formato `GenerateCode`
5. Receber `HubOperationResult<string>` com `isSuccess: true` e o código de 6 dígitos