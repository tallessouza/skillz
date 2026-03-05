# Code Examples: Validações em Hub de Conexão Real-Time

## 1. Enum de Error Codes

```csharp
// Projeto: Communication/Enums/UserConnectionErrorCodes.cs
public enum UserConnectionErrorCode
{
    InvalidCode,
    ConnectingToSelf,
    UserNotFound
    // Outros cenários adicionados conforme o fluxo evolui
}
```

## 2. HubOperationResult com ErrorCode

```csharp
// Projeto: Communication/HubOperationResult.cs
public class HubOperationResult<T>
{
    public bool Success { get; init; }
    public T? Response { get; init; }
    public UserConnectionErrorCode? ErrorCode { get; init; } // Nullable: só preenchido em erro
    public string? ErrorMessage { get; init; }

    public static HubOperationResult<T> Succeded(T response)
        => new() { Success = true, Response = response };

    public static HubOperationResult<T> Failure(
        UserConnectionErrorCode errorCode, 
        string message)
        => new() 
        { 
            Success = false, 
            ErrorCode = errorCode, 
            ErrorMessage = message 
        };
}
```

## 3. Resource Messages

```csharp
// Projeto: Exceptions/ResourceMessageException (arquivo .resx)
// pt-BR:
// PROVIDED_CODE_DOES_NOT_EXIST = "O código informado não existe"
// CANNOT_CONNECT_TO_SELF = "Não é possível realizar a conexão. O mesmo usuário/usuária não pode se conectar consigo mesmo"
// USER_NOT_FOUND = "Usuário/usuária não encontrado(a)"

// en:
// PROVIDED_CODE_DOES_NOT_EXIST = "Provided code does not exist"
// CANNOT_CONNECT_TO_SELF = "Cannot connect to self"
// USER_NOT_FOUND = "User not found"
```

## 4. Hub Method com validações completas

```csharp
// Hub: UserConnectionsHub.cs
public async Task<HubOperationResult<string>> JoinWithCodes(string code)
{
    // Validação 1: código existe?
    var userConnection = _connections.FindByCode(code);
    if (userConnection is null)
        return HubOperationResult<string>.Failure(
            UserConnectionErrorCode.InvalidCode,
            ResourceMessageException.PROVIDED_CODE_DOES_NOT_EXIST);

    // Passa para o use case que faz as demais validações
    var result = await _useCase.Execute(joinerUser, userConnection.UserId);
    return result;
}
```

## 5. Use Case com validações de negócio

```csharp
// UseCase: JoinWithCodesUseCase.cs
public async Task<HubOperationResult<ConnectionUsersDTO>> Execute(
    User joinerUser, 
    Guid codeOwnerUserId)
{
    // Validação 2: auto-conexão
    if (joinerUser.Id == codeOwnerUserId)
        return HubOperationResult<ConnectionUsersDTO>.Failure(
            UserConnectionErrorCode.ConnectingToSelf,
            ResourceMessageException.CANNOT_CONNECT_TO_SELF);

    // Validação 3: dono do código existe?
    var codeOwner = await _userReadOnlyRepository.GetById(codeOwnerUserId);
    if (codeOwner is null)
        return HubOperationResult<ConnectionUsersDTO>.Failure(
            UserConnectionErrorCode.UserNotFound,
            ResourceMessageException.USER_NOT_FOUND);

    // ... mais validações e fluxo de sucesso nas próximas aulas
}
```

## 6. DTOs atualizados

```csharp
// Projeto: Domain/DTOs/UserDTO.cs
public record UserDTO(Guid Id, string Name, string? ProfileImageUrl);

// Projeto: Domain/DTOs/ConnectionUsersDTO.cs
// Contém dados de AMBOS os usuários (quem gerou o código e quem está conectando)
public record ConnectionUsersDTO(UserDTO CodeOwner, UserDTO Joiner);
```

## 7. Como o app mobile consome os error codes

```csharp
// Exemplo conceitual no app (MAUI)
var result = await hubConnection.InvokeAsync<HubOperationResult<string>>("JoinWithCodes", code);

if (!result.Success)
{
    switch (result.ErrorCode)
    {
        case UserConnectionErrorCode.InvalidCode:
            // Limpa o campo, pede novo código — NÃO fecha a página
            ClearCodeInput();
            ShowMessage("Digite o código novamente");
            break;
        
        case UserConnectionErrorCode.ConnectingToSelf:
            // Informa o erro, mantém na página
            ShowMessage(result.ErrorMessage);
            break;
        
        default:
            // Erro desconhecido — fecha conexão, reinicia fluxo
            await DisconnectAndRestart();
            break;
    }
}
```