# Code Examples: Tratando Mensagens do Hub

## Registro completo no construtor do ViewModel

```csharp
public class UserConnectionJoinerViewModel : BaseViewModel
{
    private readonly HubConnection _connection;

    public string GeneratedBy { get; set; }

    public UserConnectionJoinerViewModel(HubConnection connection)
    {
        _connection = connection;

        // Registra todos os handlers para mensagens do Hub
        _connection.On("onCancelled", OnCancelled);
        _connection.On("onConnectionConfirmed", OnConnectionConfirmed);
        _connection.On("onUserDisconnected", OnUserDisconnected);
        _connection.On("onConnectionErrorOccurrence", OnConnectionErrorOccurrence);
    }
}
```

## Os quatro handlers completos

### Handler: Conexao cancelada

```csharp
private async Task OnCancelled()
{
    // 1. Parar a conexao SignalR
    await _connection.StopAsync();

    // 2. Fechar a pagina atual
    await NavigationService.ClosePage();

    // 3. Feedback de falha com nome da pessoa
    await NavigationService.ShowFeedback(
        FeedbackType.Failure,
        string.Format(ResourceText.CONNECTION_CANCELLED, GeneratedBy)
    );
    // Resultado: "Fulano cancelou a conexão. Quem sabe na próxima?"
}
```

### Handler: Conexao aprovada

```csharp
private async Task OnConnectionConfirmed()
{
    await _connection.StopAsync();

    await NavigationService.ClosePage();

    // Unico handler que usa feedback de SUCESSO
    await NavigationService.ShowFeedback(
        FeedbackType.Success,
        string.Format(ResourceText.CONNECTION_APPROVED, GeneratedBy)
    );
    // Resultado: "Fulano aprovou sua conexão. Agora vocês estão conectados."
}
```

### Handler: Usuario desconectou (perda de conexao)

```csharp
private async Task OnUserDisconnected()
{
    await _connection.StopAsync();

    await NavigationService.ClosePage();

    await NavigationService.ShowFeedback(
        FeedbackType.Failure,
        string.Format(ResourceText.USER_DISCONNECTED, GeneratedBy)
    );
    // Resultado: "Fulano perdeu a conexão."
}
```

### Handler: Erro desconhecido

```csharp
private async Task OnConnectionErrorOccurrence()
{
    await _connection.StopAsync();

    await NavigationService.ClosePage();

    await NavigationService.ShowFeedback(
        FeedbackType.Failure,
        string.Format(ResourceText.CONNECTION_ERROR_OCCURRENCE, GeneratedBy)
    );
    // Resultado: "Ocorreu um erro inesperado ao conectar com Fulano."
}
```

## Lado do servidor: de onde vem cada mensagem

### Hub — funcao Cancel (dispara onCancelled)

```csharp
public async Task Cancel()
{
    // Verifica se existe alguem conectado esperando resposta
    if (_waitingConnection != null)
    {
        await Clients.Client(_waitingConnection.ConnectionId)
            .SendAsync("onCancelled"); // <-- essa string deve ser identica ao On do cliente
    }
}
```

### Hub — funcao Confirm (dispara onConnectionConfirmed)

```csharp
// Apos aprovacao, notifica o Joiner
await Clients.Client(joinerConnectionId)
    .SendAsync("onConnectionConfirmed");
```

### Hub — OnDisconnectedAsync (dispara onUserDisconnected)

```csharp
public override async Task OnDisconnectedAsync(Exception exception)
{
    // Se a pessoa que gerou o codigo desconectou
    await Clients.Client(joinerConnectionId)
        .SendAsync("onUserDisconnected");
}
```

### Exception Hub Filter (dispara onConnectionErrorOccurrence)

```csharp
public class UserConnectionsExceptionHubFilter : IHubFilter
{
    public async ValueTask<object> InvokeMethodAsync(
        HubInvocationContext context,
        Func<HubInvocationContext, ValueTask<object>> next)
    {
        try
        {
            return await next(context);
        }
        catch (Exception)
        {
            // Notifica o Joiner sobre o erro
            await context.Hub.Clients.Client(joinerConnectionId)
                .SendAsync("onConnectionErrorOccurrence");

            // Retorna falha para quem chamou a funcao
            return new { Success = false };
        }
    }
}
```

## Resource file (.resx) — mensagens

```xml
<!-- Ingles (neutro) -->
<data name="CONNECTION_CANCELLED">
    <value>{0} cancelled the connection. Maybe next time?</value>
</data>
<data name="CONNECTION_APPROVED">
    <value>{0} approved your connection. You are now connected.</value>
</data>
<data name="USER_DISCONNECTED">
    <value>{0} lost the connection.</value>
</data>
<data name="CONNECTION_ERROR_OCCURRENCE">
    <value>An unexpected error occurred while connecting with {0}.</value>
</data>

<!-- Portugues -->
<data name="CONNECTION_CANCELLED">
    <value>{0} cancelou a conexão. Quem sabe na próxima?</value>
</data>
<data name="CONNECTION_APPROVED">
    <value>{0} aprovou sua conexão. Agora vocês estão conectados.</value>
</data>
<data name="USER_DISCONNECTED">
    <value>{0} perdeu a conexão.</value>
</data>
<data name="CONNECTION_ERROR_OCCURRENCE">
    <value>Ocorreu um erro inesperado ao conectar com {0}.</value>
</data>
```

## Padrao visual: todos os handlers seguem a mesma estrutura

```
OnXxx()
  ├── await _connection.StopAsync()      // sempre primeiro
  ├── await NavigationService.ClosePage() // sempre segundo
  └── await NavigationService.ShowFeedback(tipo, mensagem)  // sempre terceiro
```

A unica variacao entre handlers e o `FeedbackType` (Success vs Failure) e a mensagem do resource.