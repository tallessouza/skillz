# Code Examples: Validações em Métodos de Hub SignalR

## Interface do Use Case de Cancelar

```csharp
public interface ICancelConnectionUseCase
{
    Task<HubOperationResult<string>> Execute(UserConnectionDto dto);
}
```

## Implementação do Use Case de Cancelar

```csharp
public class CancelConnectionUseCase : ICancelConnectionUseCase
{
    private readonly ILoggedUser _loggedUser;

    public CancelConnectionUseCase(ILoggedUser loggedUser)
    {
        _loggedUser = loggedUser;
    }

    public async Task<HubOperationResult<string>> Execute(UserConnectionDto dto)
    {
        var user = await _loggedUser.User();

        if (user.Id != dto.CodeOwnerId)
            return HubOperationResult<string>.Failure(
                "NOT_AUTHORIZED",
                ResourceErrorMessages.USER_WITHOUT_PERMISSION);

        return HubOperationResult<string>.Success(string.Empty);
    }
}
```

## Método CancelCode completo no Hub

```csharp
public async Task<HubOperationResult<string>> CancelCode(string code)
{
    var userConnection = _connections.RemoveConnection(code);

    if (userConnection is null)
        return HubOperationResult<string>.Failure(
            "CODE_NOT_FOUND",
            ResourceErrorMessages.CODE_NOT_FOUND);

    var result = await _cancelUseCase.Execute(userConnection);

    if (!result.IsSuccess)
        return HubOperationResult<string>.Failure(
            result.ErrorCode, result.Message);

    // Avisa o usuário que estava esperando aprovação
    if (userConnection.ConnectingUserId.HasValue)
    {
        await Clients.User(userConnection.ConnectingUserId.Value.ToString())
            .SendAsync("OnCodeCancelled", code);
    }

    return HubOperationResult<string>.Success(code);
}
```

## Interface do Use Case de Aceitar Conexão

```csharp
public interface IAcceptConnectionUseCase
{
    Task<HubOperationResult<string>> Execute(UserConnectionDto dto);
}
```

## Implementação completa do Use Case de Aceitar

```csharp
public class AcceptConnectionUseCase : IAcceptConnectionUseCase
{
    private readonly ILoggedUser _loggedUser;
    private readonly IUserReadOnlyRepository _userRepository;
    private readonly IConnectionRepository _connectionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AcceptConnectionUseCase(
        ILoggedUser loggedUser,
        IUserReadOnlyRepository userRepository,
        IConnectionRepository connectionRepository,
        IUnitOfWork unitOfWork)
    {
        _loggedUser = loggedUser;
        _userRepository = userRepository;
        _connectionRepository = connectionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<HubOperationResult<string>> Execute(UserConnectionDto dto)
    {
        // Aqui o loggedUser é o CODE OWNER (quem gerou o código)
        var codeOwner = await _loggedUser.User();

        // Validação 1: Verificar propriedade do código
        if (codeOwner.Id != dto.CodeOwnerId)
            return HubOperationResult<string>.Failure(
                "NOT_AUTHORIZED",
                ResourceErrorMessages.USER_WITHOUT_PERMISSION);

        // Validação 2: Verificar se alguém se conectou com o código
        var joinerUser = dto.ConnectingUserId.HasValue
            ? await _userRepository.GetById(dto.ConnectingUserId.Value)
            : null;

        if (joinerUser is null)
            return HubOperationResult<string>.Failure(
                "NO_USER_CONNECTED",
                ResourceErrorMessages.NO_USER_CONNECTED_WITH_CODE);

        // Validação 3: Não pode conectar consigo mesmo
        if (codeOwner.Id == joinerUser.Id)
            return HubOperationResult<string>.Failure(
                "SELF_CONNECTION",
                ResourceErrorMessages.CANNOT_CONNECT_WITH_YOURSELF);

        // Validação 4: Verificar se já estão conectados
        var alreadyConnected = await _connectionRepository
            .Exists(codeOwner.Id, joinerUser.Id);

        if (alreadyConnected)
            return HubOperationResult<string>.Failure(
                "ALREADY_CONNECTED",
                string.Format(ResourceErrorMessages.ALREADY_CONNECTED, joinerUser.Name));

        // Criar a conexão no banco
        var connection = new Connection(codeOwner.Id, joinerUser.Id);
        await _connectionRepository.Create(connection);
        await _unitOfWork.Commit();

        return HubOperationResult<string>.Success(string.Empty);
    }
}
```

## Método ConfirmCode completo no Hub

```csharp
public async Task<HubOperationResult<string>> ConfirmCode(string code)
{
    var userConnection = _connections.GetConnection(code);

    if (userConnection is null)
        return HubOperationResult<string>.Failure(
            "CODE_NOT_FOUND",
            ResourceErrorMessages.CODE_NOT_FOUND);

    var result = await _acceptUseCase.Execute(userConnection);

    if (!result.IsSuccess)
        return HubOperationResult<string>.Failure(
            result.ErrorCode, result.Message);

    // Avisa quem se conectou que a conexão foi aprovada
    if (userConnection.ConnectingUserId.HasValue)
    {
        await Clients.User(userConnection.ConnectingUserId.Value.ToString())
            .SendAsync("OnConnectionConfirmed", code);
    }

    return HubOperationResult<string>.Success(code);
}
```

## Registro no DI Container

```csharp
// Em DependencyInjectionExtension.cs
public static class DependencyInjectionExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // ... outros registros ...
        services.AddScoped<ICancelConnectionUseCase, CancelConnectionUseCase>();
        services.AddScoped<IAcceptConnectionUseCase, AcceptConnectionUseCase>();

        return services;
    }
}
```

## Resource file entries utilizadas

```xml
<!-- ResourceErrorMessages.resx (en - default) -->
<data name="CODE_NOT_FOUND" xml:space="preserve">
    <value>The informed code does not exist.</value>
</data>
<data name="USER_WITHOUT_PERMISSION" xml:space="preserve">
    <value>You do not have permission to access this resource.</value>
</data>
<data name="NO_USER_CONNECTED_WITH_CODE" xml:space="preserve">
    <value>No user connected with this code.</value>
</data>
<data name="CANNOT_CONNECT_WITH_YOURSELF" xml:space="preserve">
    <value>You cannot connect with yourself.</value>
</data>
<data name="ALREADY_CONNECTED" xml:space="preserve">
    <value>You are already connected with {0}.</value>
</data>

<!-- ResourceErrorMessages.pt-BR.resx -->
<data name="CODE_NOT_FOUND" xml:space="preserve">
    <value>O código informado não existe.</value>
</data>
<data name="USER_WITHOUT_PERMISSION" xml:space="preserve">
    <value>Você não tem permissão para acessar esse recurso.</value>
</data>
<data name="NO_USER_CONNECTED_WITH_CODE" xml:space="preserve">
    <value>Nenhum usuário ou usuária se conectou com este código.</value>
</data>
<data name="CANNOT_CONNECT_WITH_YOURSELF" xml:space="preserve">
    <value>Você não pode se conectar com você mesmo(a).</value>
</data>
<data name="ALREADY_CONNECTED" xml:space="preserve">
    <value>Você já está conectado(a) com {0}.</value>
</data>
```

## Configuração do header Accept-Language no Postman

```
// Header name (com hífen, NÃO junto):
Accept-Language: pt-BR

// ERRADO (sem hífen):
AcceptLanguage: pt-BR  // NÃO funciona
```

**Nota**: Uma vez que a conexão WebSocket é estabelecida, o header não pode ser alterado. É necessário desconectar e reconectar para trocar o idioma.