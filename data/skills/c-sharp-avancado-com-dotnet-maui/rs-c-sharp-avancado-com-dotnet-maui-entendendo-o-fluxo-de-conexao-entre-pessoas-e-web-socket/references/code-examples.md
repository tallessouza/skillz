# Code Examples: Fluxo de Conexao WebSocket

## Contexto

Esta aula e teorica — nao contem codigo implementado. Os exemplos abaixo sao derivados do fluxo explicado pelo instrutor, aplicados ao contexto .NET MAUI + API C#.

## Exemplo: Fluxo completo de convite com WebSocket

### Lado do Cliente (MAUI) — Gerar codigo

```csharp
// Passo 1: Gerar codigo de convite (HTTP normal)
var response = await httpClient.PostAsync("/api/invite/generate", null);
var inviteCode = await response.Content.ReadFromJsonAsync<InviteCode>();

// Exibir codigo na tela
InviteCodeLabel.Text = inviteCode.Code; // ex: "1234"
```

### Lado do Cliente (MAUI) — Conectar WebSocket

```csharp
// Passo 2: Abrir conexao WebSocket (persistente)
var webSocket = new ClientWebSocket();
await webSocket.ConnectAsync(new Uri("wss://api.example.com/ws"), CancellationToken.None);

// A partir daqui, a conexao esta aberta e bidirecional
// Escutar mensagens em background
_ = Task.Run(async () =>
{
    var buffer = new byte[1024];
    while (webSocket.State == WebSocketState.Open)
    {
        var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);
        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
        ProcessIncomingMessage(message);
    }
});
```

### Lado do Cliente (MAUI) — Enviar codigo digitado

```csharp
// Passo 3: Lucius digita o codigo e envia via WebSocket
var message = JsonSerializer.Serialize(new
{
    type = "submit_invite_code",
    code = "1234",
    token = authToken
});

var bytes = Encoding.UTF8.GetBytes(message);
await webSocket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
// Nao ha "resposta" — escutamos mensagens incoming separadamente
```

### Lado da API (C#) — Processar mensagem e notificar

```csharp
// API recebe mensagem do Lucius, valida codigo, notifica Bruce
public async Task HandleMessage(WebSocket socket, string message)
{
    var parsed = JsonSerializer.Deserialize<InviteMessage>(message);

    if (parsed.Type == "submit_invite_code")
    {
        var invite = await FindInviteByCode(parsed.Code);
        if (invite == null) return;

        // Encontrar a conexao WebSocket do Bruce (quem gerou o codigo)
        var ownerSocket = GetActiveConnection(invite.OwnerId);

        // API ENVIA mensagem para o Bruce — bidirecional!
        var notification = JsonSerializer.Serialize(new
        {
            type = "connection_request",
            fromUser = parsed.UserId,
            fromUserName = "Lucius Fox"
        });

        await ownerSocket.SendAsync(
            Encoding.UTF8.GetBytes(notification),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None
        );
    }
}
```

### Lado do Cliente (MAUI) — Bruce aceita ou rejeita

```csharp
// Bruce recebe a notificacao e responde
void ProcessIncomingMessage(string message)
{
    var parsed = JsonSerializer.Deserialize<WSMessage>(message);

    if (parsed.Type == "connection_request")
    {
        // Exibir popup: "Lucius Fox quer se conectar. Aceitar?"
        MainThread.BeginInvokeOnMainThread(async () =>
        {
            bool accepted = await DisplayAlert(
                "Solicitacao de conexao",
                $"{parsed.FromUserName} quer se conectar com voce.",
                "Aceitar", "Rejeitar"
            );

            // Enviar resposta via WebSocket
            var response = JsonSerializer.Serialize(new
            {
                type = "connection_response",
                accepted = accepted,
                targetUserId = parsed.FromUser
            });

            await webSocket.SendAsync(
                Encoding.UTF8.GetBytes(response),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
        });
    }
}
```

### Encerrar conexao (somente o cliente pode)

```csharp
// Somente o cliente tem poder de fechar a conexao
await webSocket.CloseAsync(
    WebSocketCloseStatus.NormalClosure,
    "User disconnected",
    CancellationToken.None
);

// A API NAO consegue fazer isso — ela so detecta que a conexao foi fechada
```

## Comparacao visual: HTTP vs WebSocket

```
HTTP:
  Cliente ──request──> API
  Cliente <──response── API
  [conexao encerrada]

WebSocket:
  Cliente ──handshake──> API (via HTTP)
  [upgrade para WS]
  Cliente ──mensagem──> API
  Cliente ──mensagem──> API
  API ──mensagem──> Cliente    ← API inicia comunicacao!
  Cliente ──mensagem──> API
  ... (conexao permanece aberta) ...
  Cliente ──close──> API       ← so o cliente fecha
```