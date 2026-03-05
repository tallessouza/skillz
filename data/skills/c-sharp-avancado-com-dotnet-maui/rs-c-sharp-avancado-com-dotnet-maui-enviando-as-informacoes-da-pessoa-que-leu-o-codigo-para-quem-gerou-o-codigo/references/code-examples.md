# Code Examples: Envio de Mensagens no SignalR Hub

## Exemplo 1: Broadcast com Clients.All

```csharp
// No metodo do Hub — envia para TODAS as conexoes
public async Task JoinWithCodes(string code)
{
    // ... logica anterior ...
    
    // Envia para todos os clientes conectados
    await Clients.All.SendAsync("teste", "Wellison", 7);
    
    // No cliente: metodo "teste" recebe parametros ("Wellison", 7)
    // TODOS os clientes conectados ao Hub recebem essa mensagem
}
```

**Resultado no Postman (para CADA usuario conectado):**
```json
{"type":1,"target":"teste","arguments":["Wellison",7]}
```

## Exemplo 2: Resposta com Clients.Caller

```csharp
// No metodo do Hub — envia APENAS para quem chamou
public async Task JoinWithCodes(string code)
{
    // ... logica anterior ...
    
    // Envia apenas para a conexao que invocou JoinWithCodes
    await Clients.Caller.SendAsync("teste", "Wellison", 7);
    
    // Apenas o chamador recebe — funciona como um "return" contextualizado
}
```

**Resultado:** apenas a tab do usuario que enviou a mensagem recebe a resposta.

## Exemplo 3: Mensagem direcionada com Clients.Client(connectionId)

```csharp
// No metodo do Hub — envia para UMA conexao especifica
public async Task JoinWithCodes(string code)
{
    var userConnections = _connections.GetConnectionByCode(code);
    
    var useCase = new UseCaseJoinWithCode();
    var connectingUser = await useCase.Execute(/* usuario logado */);
    
    // Preenche informacoes da pessoa que leu o codigo
    userConnections.ConnectingUserId = connectingUser.Id;
    userConnections.ConnectingUserConnectionId = Context.ConnectionId;
    
    // Envia para a conexao que GEROU o codigo (nao o caller)
    await Clients.Client(userConnections.ConnectionId)
        .SendAsync("OnUserJoins", new ResponseConnectingUserJson
        {
            Name = connectingUser.Name,
            ProfileImageUrl = connectingUser.ProfileImageUrl
        });
}
```

**Resultado no Postman (apenas para quem gerou o codigo):**
```json
{"type":1,"target":"OnUserJoins","arguments":[{"name":"Edeline","profileImageUrl":""}]}
```

## Exemplo 4: Response DTO seguro

```csharp
// Projeto de comunicacao — DTO sem ID interno
public class ResponseConnectingUserJson
{
    public string Name { get; set; }
    public string ProfileImageUrl { get; set; }
    // Nao expoe Id do usuario — seguranca
}
```

**Por que nao usar o DTO existente:**
```csharp
// ConnectingUserDTO tem Id — NAO enviar para outros clientes
public class ConnectingUserDTO
{
    public Guid Id { get; set; }        // NAO expor
    public string Name { get; set; }
    public string ProfileImageUrl { get; set; }
}
```

## Exemplo 5: Envio para multiplas conexoes

```csharp
// Variacao: enviar para uma lista de connection IDs
var connectionIds = new List<string>
{
    connection1.ConnectionId,
    connection2.ConnectionId,
    connection3.ConnectionId
};

await Clients.Clients(connectionIds)
    .SendAsync("OnGroupNotification", notificationPayload);

// Evita duplicar chamadas Client() em loop
```

## Fluxo completo testado na aula

```
1. Ellison conecta ao Hub (Postman tab 1)
2. Edeline conecta ao Hub (Postman tab 2)
3. Ambos enviam mensagem de handshake
4. Ellison chama GenerateCodes → recebe codigo "414383"
5. Edeline chama JoinWithCodes("414383")
6. Hub busca conexao associada ao codigo → encontra Ellison
7. Hub preenche dados da Edeline no dicionario
8. Hub envia via Clients.Client(ellison.ConnectionId)
   → mensagem "OnUserJoins" com {Name: "Edeline", ProfileImageUrl: ""}
9. Ellison recebe a notificacao — Edeline NAO recebe nada
```