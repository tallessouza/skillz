# Code Examples: Refatoracao Pos-Implementacao em C#

## Exemplo 1: Classe ConnectionByCode completa

A classe final que substituiu multiplos DTOs:

```csharp
public class ConnectionByCode
{
    public required string Code { get; init; }

    /// <summary>Informacoes da pessoa que gerou o codigo</summary>
    public required UserDto Generator { get; init; }

    /// <summary>Connection ID da pessoa que gerou o codigo</summary>
    public required string GeneratorConnectionId { get; init; }

    /// <summary>Informacoes da pessoa que esta utilizando o codigo</summary>
    public UserDto? Joiner { get; set; }

    /// <summary>Connection ID da pessoa que esta utilizando o codigo</summary>
    public string? JoinerConnectionId { get; set; }
}
```

## Exemplo 2: Use case retornando tuple

Antes (com DTO wrapper):
```csharp
public interface IGenerateCodeUserConnectionUseCase
{
    Task<CodeUserConnectionDto> Execute(Guid userId);
}

// Implementacao
return new CodeUserConnectionDto(loggedUser.Id, code);
```

Depois (com tuple):
```csharp
public interface IGenerateCodeUserConnectionUseCase
{
    Task<(string Code, UserDto Generator)> Execute(Guid userId);
}

// Implementacao
return (code, new UserDto(loggedUser.Id, loggedUser.Name, string.Empty));
```

## Exemplo 3: Consumo da tuple com deconstruction no Hub

```csharp
// Recebendo os dois valores via deconstruction
var (code, generator) = await _generateCodeUseCase.Execute(userId);

// Usando diretamente
_usersConnection.Start(code, generator, Context.ConnectionId);
```

## Exemplo 4: Inicializacao do ConnectionByCode no hub

```csharp
public void Start(string code, UserDto generator, string connectionId)
{
    _connection = new ConnectionByCode
    {
        Code = code,
        Generator = generator,
        GeneratorConnectionId = connectionId
        // Joiner e JoinerConnectionId ficam null por enquanto
    };
}
```

## Exemplo 5: Preenchendo propriedades nullable durante o fluxo

```csharp
// Quando alguem usa o codigo para se conectar
_connection.Joiner = response; // UserDto da pessoa que entrou
_connection.JoinerConnectionId = Context.ConnectionId;
```

## Exemplo 6: Verificacao de null antes de usar propriedades nullable

```csharp
// Verificar se alguem ja usou o codigo
if (_connection.Joiner is not null)
{
    // Seguro usar — ja verificou
    var joinerId = _connection.Joiner.Id;
}

// Quando voce tem certeza logica (ja validou antes)
var id = _connection.Joiner!.Id; // ! suprime o aviso
```

## Exemplo 7: Use case simplificado recebendo UserDto direto

Antes:
```csharp
Task<HubOperationResult<ConnectionUsers>> Execute(string code, Guid generatorId, Guid joinerId);
```

Depois:
```csharp
Task<HubOperationResult<UserDto>> Execute(string code, UserDto generator, Guid joinerId);
```

## Exemplo 8: Verificacao no cancelamento

```csharp
// Verificar se existe alguem aguardando aprovacao antes de notificar
if (!string.IsNullOrEmpty(_connection.JoinerConnectionId))
    await Clients.Client(_connection.JoinerConnectionId)
        .SendAsync("ConnectionCancelled");
```

## Exemplo 9: Verificacao no confirm com null-forgiving

```csharp
// Nesse ponto do fluxo, Joiner e JoinerConnectionId existem com certeza
await Clients.Client(_connection.JoinerConnectionId!)
    .SendAsync("ConnectionConfirmed");
```