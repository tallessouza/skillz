# Code Examples: Validacoes de Conexao e String.Format

## 1. Interface atualizada (sincronizacao de assinatura)

```csharp
// IJoinWithCodesUseCase.cs
public interface IJoinWithCodesUseCase
{
    Task<HubOperationResult<ConnectionUsers>> Execute(string code, Guid joinerId);
}
```

## 2. Interface do repositorio de leitura

```csharp
// IUserConnectionReadOnlyRepository.cs
public interface IUserConnectionReadOnlyRepository
{
    Task<bool> AreUsersConnected(User user1, User user2);
}
```

## 3. Implementacao do repositorio — validacao bidirecional completa

```csharp
// UserConnectionRepository.cs
public async Task<bool> AreUsersConnected(User user1, User user2)
{
    return await _dbContext.UserConnections
        .AsNoTracking()
        .AnyAsync(c =>
            (c.UserId == user1.Id && c.ConnectedUserId == user2.Id) ||
            (c.UserId == user2.Id && c.ConnectedUserId == user1.Id));
}
```

### Por que AsNoTracking?
Apenas fazendo uma consulta de existencia (Any), nao precisamos que o EF Core rastreie as entidades. Melhora performance.

### Por que AnyAsync e nao FirstOrDefault?
Queremos apenas saber se EXISTE, nao precisamos da entidade em si. `AnyAsync` retorna bool diretamente.

## 4. Validacao no Use Case

```csharp
// JoinWithCodesUseCase.cs — trecho da validacao
var areUsersConnected = await _userConnectionReadOnlyRepository
    .AreUsersConnected(codeOwner, joinerUser);

if (areUsersConnected)
{
    var message = String.Format(
        ResourceMessageException.CONNECTION_ALREADY_EXISTS,
        codeOwner.Name);

    return HubOperationResult<ConnectionUsers>.Failure(
        message,
        UserConnectionErrorCode.ConnectionAlreadyExists);
}
```

## 5. Retorno de sucesso com DTOs

```csharp
// Criacao dos DTOs para retorno
var generator = new UserDTO(codeOwner.Id, codeOwner.Name, string.Empty);
var connector = new UserDTO(joinerUser.Id, joinerUser.Name, string.Empty);

return HubOperationResult<ConnectionUsers>.Success(
    new ConnectionUsers(generator, connector));
```

## 6. Hub — tratamento do Result Pattern

```csharp
// No Hub SignalR
var result = await _joinWithCodesUseCase.Execute(code, joinerId);

if (!result.IsSuccess)
{
    return HubOperationResult<string>.Failure(
        result.ErrorMessage,
        result.ErrorCode!.Value);  // nullable confirmado pelo fluxo
}

// Enviar notificacao ao generator
await Clients.Client(generatorConnectionId).SendAsync(
    "ConnectionRequest",
    result.Response!.Connector.Name);  // ! porque IsSuccess == true

// Retornar nome do generator ao connector
return HubOperationResult<string>.Success(
    result.Response!.Generator.Name);
```

## 7. String.Format — variacoes e exemplos

```csharp
// Resource file:
// CONNECTION_ALREADY_EXISTS = "Voce e {0} ja possuem uma conexao"
// WELCOME_MESSAGE = "{0}, bem-vindo! Voce tem {1} notificacoes"

// Uso basico — um parametro
String.Format(ResourceMessageException.CONNECTION_ALREADY_EXISTS, "Ellison");
// Resultado: "Voce e Ellison ja possuem uma conexao"

// Dois parametros
String.Format(ResourceMessageException.WELCOME_MESSAGE, "Maria", 5);
// Resultado: "Maria, bem-vindo! Voce tem 5 notificacoes"

// Parametro repetido no template: "{0} disse que {0} vai sair"
String.Format("{0} disse que {0} vai sair", "Carlos");
// Resultado: "Carlos disse que Carlos vai sair"

// Ordem invertida no template: "{1} convidou {0}"
String.Format("{1} convidou {0}", "Ana", "Pedro");
// Resultado: "Pedro convidou Ana"
```

## 8. Nullable handling — comparacao de abordagens

```csharp
// ErrorCode e do tipo UserConnectionErrorCode? (nullable)

// ERRADO — compilador reclama
return Failure(result.ErrorMessage, result.ErrorCode);
// Erro: nao pode converter 'UserConnectionErrorCode?' para 'UserConnectionErrorCode'

// CORRETO — .Value extrai o tipo nao-nullable
return Failure(result.ErrorMessage, result.ErrorCode!.Value);

// O ! suprime o warning verde
// O .Value converte de UserConnectionErrorCode? para UserConnectionErrorCode
```