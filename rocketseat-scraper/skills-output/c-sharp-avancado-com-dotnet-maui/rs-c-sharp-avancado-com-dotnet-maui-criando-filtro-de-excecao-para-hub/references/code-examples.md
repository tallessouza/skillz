# Code Examples: Filtro de Exceção para SignalR Hub

## Exemplo 1: Estrutura básica do filtro

```csharp
using Microsoft.AspNetCore.SignalR;

public class UserConnectionsExceptionHubFilter : IHubFilter
{
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
            return HubOperationResult<string>.Failure(
                ResourceMessage.UNKNOWN_ERROR,
                ErrorType.Unknown);
        }
    }
}
```

Nota: `ValueTask` requer `async` no método e `await` no `next()`.

## Exemplo 2: Filtro completo com notificação de usuários

```csharp
public class UserConnectionsExceptionHubFilter : IHubFilter
{
    private readonly ICodeConnectionService _codeConnectionService;

    public UserConnectionsExceptionHubFilter(
        ICodeConnectionService codeConnectionService)
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
            // Pegar o ID da conexão que gerou a exceção
            var connectionId = invocationContext.Hub.Context.ConnectionId;

            // Buscar código associado e notificar o outro usuário
            var code = _codeConnectionService
                .GetCodeByConnectionId(connectionId);

            if (!string.IsNullOrEmpty(code))
            {
                var connection = _codeConnectionService
                    .RemoveConnection(code);

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

## Exemplo 3: Configuração no Program.cs

### Per-Hub (recomendado)

```csharp
builder.Services.AddSignalR();

// Filtro específico para UserConnectionHub
builder.Services.AddHubOptions<UserConnectionHub>(options =>
{
    options.AddFilter<UserConnectionsExceptionHubFilter>();
});

// Se tiver outro Hub, outro filtro
builder.Services.AddHubOptions<ChatHub>(options =>
{
    options.AddFilter<ChatExceptionHubFilter>();
});
```

### Global (alternativa)

```csharp
builder.Services.AddSignalR(options =>
{
    options.AddFilter<UserConnectionsExceptionHubFilter>();
});
// Todos os Hubs usarão este filtro
```

## Exemplo 4: Usando InvokeMethodAsync como middleware (pré/pós processamento)

```csharp
public async ValueTask<object?> InvokeMethodAsync(
    HubInvocationContext invocationContext,
    Func<HubInvocationContext, ValueTask<object?>> next)
{
    // Código ANTES do método do Hub executar
    Console.WriteLine($"Método chamado: {invocationContext.HubMethodName}");

    var result = await next(invocationContext);

    // Código DEPOIS do método do Hub executar
    Console.WriteLine($"Resultado obtido: {result}");

    return result;
}
```

## Exemplo 5: Resultado retornado ao cliente

Quando exceção ocorre, o cliente recebe:

```json
{
    "isSuccess": false,
    "response": null,
    "errorMessage": "Erro desconhecido",
    "errorCode": 0
}
```

Em vez de uma exceção crua e incontrolável.

## Exemplo 6: Simulando exceção para teste

```csharp
// No método do Hub — temporário, apenas para teste
public async Task<HubOperationResult<string>> ConfirmCodeJoin(/*...*/)
{
    throw new Exception("Test exception");
    // Código normal abaixo nunca executa
    // ...
}
```

O filtro captura essa exceção, notifica o guest que estava esperando aprovação, e retorna erro controlado ao caller.