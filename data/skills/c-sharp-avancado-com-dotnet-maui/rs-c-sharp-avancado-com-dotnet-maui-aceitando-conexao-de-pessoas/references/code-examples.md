# Code Examples: Aceitando Conexão de Pessoas

## Estrutura de pastas do Use Case

```
Application/
└── UseCases/
    └── User/
        └── Connection/
            └── ApproveCodes/
                ├── IApproveConnectionUseCase.cs
                └── ApproveConnectionUseCase.cs
```

## Interface do Use Case

```csharp
public interface IApproveConnectionUseCase
{
    Task Execute(UserConnectionDTO dto);
}
```

## Implementacao completa do Use Case

```csharp
public class ApproveConnectionUseCase : IApproveConnectionUseCase
{
    private readonly IUserConnectionWriteOnlyRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public ApproveConnectionUseCase(
        IUserConnectionWriteOnlyRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task Execute(UserConnectionDTO dto)
    {
        var connection = new UserConnection
        {
            UserId = dto.UserId,
            ConnectedUserId = dto.ConnectedUserId
        };

        _repository.Add(connection);
        await _unitOfWork.Commit();
    }
}
```

## Metodo no Hub (UserConnectionsHub)

```csharp
public async Task ConfirmCodeJoin(string code)
{
    // Remove retorna o DTO e libera o dicionario
    var userConnectionDTO = _pendingConnections.Remove(code);

    // Delega ao use case a persistencia
    await _approveConnectionUseCase.Execute(userConnectionDTO);

    // Notifica a pessoa que enviou o codigo
    await Clients.Client(userConnectionDTO.ConnectedConnectionId)
        .SendAsync("OnConnectionConfirmed");
}
```

## Registro no DI (Dependency Injection)

```csharp
// Adicionar junto com os outros use cases
services.AddScoped<IApproveConnectionUseCase, ApproveConnectionUseCase>();
```

## Correcao de compilacao apos renomeacao

```csharp
// ANTES (nome antigo que quebra compilacao):
public class GetDashboardUseCase
{
    public async Task Execute(Guid userId)
    {
        var connections = await _repository.GetPersonAssociation(userId); // NOME ANTIGO
    }
}

// DEPOIS (nome novo alinhado com refactoring):
public class GetDashboardUseCase
{
    public async Task Execute(Guid userId)
    {
        var connections = await _repository.GetConnectionsForUser(userId); // NOME NOVO
    }
}
```

## Fluxo de teste no Postman

### 1. Conectar ao Hub (WebSocket handshake)
Enviar mensagem de handshake para cada usuario (Ellison e Edeline).

### 2. Gerar codigo (Ellison)
Enviar mensagem solicitando geracao de codigo → resposta: `468941`

### 3. Enviar codigo (Edeline)
```json
{
    "type": 1,
    "target": "ReadCodeJoin",
    "arguments": ["468941"]
}
```

### 4. Confirmar conexao (Ellison)
```json
{
    "type": 1,
    "target": "ConfirmCodeJoin",
    "arguments": ["468941"]
}
```

### 5. Verificar no banco
```sql
SELECT * FROM UserConnections;
-- Resultado esperado:
-- UserId: [ID do Ellison], ConnectedUserId: [ID da Edeline], Active: true
```

## Estrutura do UserConnectionDTO

```csharp
public class UserConnectionDTO
{
    public Guid UserId { get; set; }           // Quem gerou o codigo
    public string ConnectionId { get; set; }    // SignalR connection de quem gerou
    public Guid ConnectedUserId { get; set; }   // Quem leu o codigo
    public string ConnectedConnectionId { get; set; } // SignalR connection de quem leu
}
```