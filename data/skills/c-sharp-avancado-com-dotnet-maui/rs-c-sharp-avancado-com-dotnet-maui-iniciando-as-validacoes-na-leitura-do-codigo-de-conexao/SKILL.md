---
name: rs-csharp-validacoes-hub-conexao
description: "Enforces validation patterns and error handling in SignalR Hub methods using HubOperationResult with typed error codes. Use when user asks to 'add validation to hub', 'handle errors in SignalR', 'validate real-time connections', 'return errors from hub methods', or 'implement error codes for mobile apps'. Applies rules: always return HubOperationResult with enum error codes instead of string comparisons, use resource files for error messages, validate all external inputs, guard against self-connection. Make sure to use this skill whenever implementing validation logic in SignalR hubs or real-time connection flows. Not for REST API validation, FluentValidation, or general C# error handling outside hubs."
---

# Validações em Hub de Conexão Real-Time

> Valide todos os inputs externos em métodos de Hub usando HubOperationResult com enum de error codes, nunca strings comparadas no cliente.

## Rules

1. **Retorne HubOperationResult tipado, nunca Task void** — `Task<HubOperationResult<string>>` não `Task`, porque o cliente precisa saber se deu erro ou sucesso com dados estruturados
2. **Use enum de error codes, nunca compare strings de erro no cliente** — `UserConnectionErrorCode.InvalidCode` não `if (error == "Invalid code")`, porque strings mudam, enums são contratos estáveis que evitam republicar o app
3. **Centralize mensagens em Resource files** — `ResourceMessageException.USER_NOT_FOUND` não `"Usuário não encontrado"` inline, porque permite tradução, reuso e organização
4. **Valide inputs externos antes de qualquer operação** — código vindo do cliente pode ser inválido, ID pode não existir, porque dados de fonte externa são não-confiáveis por definição
5. **Bloqueie auto-conexão explicitamente** — verifique `joinerUser.Id != codeOwner.Id`, porque dois dispositivos diferentes com a mesma conta podem tentar se conectar consigo
6. **Não exponha detalhes sensíveis em erros sobre pessoas** — `"Usuário não encontrado"` não `"Usuário com ID xyz não encontrado"`, porque informações gratuitas sobre existência de usuários são risco de segurança

## How to write

### HubOperationResult com Error Codes

```csharp
// Enum com todos os cenários de erro do fluxo
public enum UserConnectionErrorCode
{
    InvalidCode,
    ConnectingToSelf,
    UserNotFound
}

// Result pattern com error code nullable (null = sucesso)
public class HubOperationResult<T>
{
    public bool Success { get; init; }
    public T? Response { get; init; }
    public UserConnectionErrorCode? ErrorCode { get; init; }
    public string? ErrorMessage { get; init; }

    public static HubOperationResult<T> Succeded(T response)
        => new() { Success = true, Response = response };

    public static HubOperationResult<T> Failure(UserConnectionErrorCode errorCode, string message)
        => new() { Success = false, ErrorCode = errorCode, ErrorMessage = message };
}
```

### Validação em método de Hub

```csharp
public async Task<HubOperationResult<string>> JoinWithCodes(string code)
{
    var userConnection = _connections.FindByCode(code);
    if (userConnection is null)
        return HubOperationResult<string>.Failure(
            UserConnectionErrorCode.InvalidCode,
            ResourceMessageException.PROVIDED_CODE_DOES_NOT_EXIST);

    // Auto-conexão
    if (joinerUser.Id == userConnection.UserId)
        return HubOperationResult<string>.Failure(
            UserConnectionErrorCode.ConnectingToSelf,
            ResourceMessageException.CANNOT_CONNECT_TO_SELF);

    // Dono do código existe?
    var codeOwner = await _userRepository.GetById(userConnection.UserId);
    if (codeOwner is null)
        return HubOperationResult<string>.Failure(
            UserConnectionErrorCode.UserNotFound,
            ResourceMessageException.USER_NOT_FOUND);

    // ... continua fluxo de sucesso
}
```

## Example

**Before (sem validação, sem error codes):**
```csharp
public async Task JoinWithCodes(string code)
{
    var userConnection = _connections.FindByCode(code);
    var result = await _useCase.Execute(userConnection.UserId);
    await Clients.Group(code).SendAsync("UserJoined", result);
}
```

**After (com validações e error codes):**
```csharp
public async Task<HubOperationResult<ConnectionUsersDTO>> JoinWithCodes(string code)
{
    var userConnection = _connections.FindByCode(code);
    if (userConnection is null)
        return HubOperationResult<ConnectionUsersDTO>.Failure(
            UserConnectionErrorCode.InvalidCode,
            ResourceMessageException.PROVIDED_CODE_DOES_NOT_EXIST);

    if (joinerUser.Id == userConnection.UserId)
        return HubOperationResult<ConnectionUsersDTO>.Failure(
            UserConnectionErrorCode.ConnectingToSelf,
            ResourceMessageException.CANNOT_CONNECT_TO_SELF);

    var codeOwner = await _userRepository.GetById(userConnection.UserId);
    if (codeOwner is null)
        return HubOperationResult<ConnectionUsersDTO>.Failure(
            UserConnectionErrorCode.UserNotFound,
            ResourceMessageException.USER_NOT_FOUND);

    var result = await _useCase.Execute(joinerUser, codeOwner);
    return HubOperationResult<ConnectionUsersDTO>.Succeded(result);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cliente envia código/ID | Valide existência antes de usar |
| Dois usuários interagem | Valide que não são a mesma pessoa |
| Erro precisa ser tratado no app mobile | Use enum error code, não string |
| Mensagem de erro sobre pessoa | Mantenha genérica, não exponha IDs |
| Método de Hub retorna resultado | Use HubOperationResult, nunca Task puro |
| Error code só existe em caso de erro | Propriedade nullable com `?` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `Task` como retorno de Hub com validação | `Task<HubOperationResult<T>>` |
| `if (error == "Invalid code")` no app | `if (errorCode == ErrorCode.InvalidCode)` |
| `throw new Exception("Código inválido")` no Hub | `return Failure(ErrorCode.InvalidCode, msg)` |
| `"Usuário com ID " + id + " não encontrado"` | `"Usuário não encontrado"` |
| Mensagem de erro hardcoded inline | `ResourceMessageException.CHAVE` |
| Usar dados externos sem validar null | `if (entity is null) return Failure(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
