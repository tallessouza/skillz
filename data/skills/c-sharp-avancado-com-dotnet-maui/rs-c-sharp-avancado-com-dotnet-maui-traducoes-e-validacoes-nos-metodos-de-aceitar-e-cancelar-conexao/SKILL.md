---
name: rs-csharp-maui-hub-validations
description: "Enforces SignalR Hub method validation patterns in C# .NET projects. Use when user asks to 'add hub validation', 'validate SignalR method', 'secure hub endpoint', 'add use case validation', or 'cancel/confirm connection'. Applies patterns: HubOperationResult returns, use case extraction for authorization, dictionary lookup guards, owner-only permission checks. Make sure to use this skill whenever implementing SignalR Hub methods with business logic validation. Not for REST API controller validation, middleware, or authentication setup."
---

# Validações em Métodos de Hub SignalR

> Todo método de Hub que executa lógica de negócio deve validar inputs, verificar permissões via Use Case, e retornar HubOperationResult tipado.

## Rules

1. **Retorne HubOperationResult tipado** — `HubOperationResult<string>` não `Task`, porque o cliente precisa distinguir sucesso de falha com código de erro
2. **Valide existência antes de operar** — verifique se o código/recurso existe no dicionário antes de qualquer lógica, porque operações em dados inexistentes causam erros inesperados
3. **Extraia validações de permissão para Use Cases** — mesmo que simples, porque permite acesso ao ILoggedUser e facilita migração futura (memória → banco de dados)
4. **Verifique propriedade do recurso** — compare `loggedUser.Id` com o ID do criador do recurso, porque qualquer pessoa conectada ao Hub poderia invocar o método
5. **Reutilize mensagens do Resource file** — use chaves existentes como `USER_WITHOUT_PERMISSION` ao invés de criar novas, porque mantém consistência nas traduções
6. **Registre Use Cases no DI container** — adicione no `DependencyInjectionExtension` imediatamente após criar o Use Case, porque senão falha silenciosamente em runtime

## How to write

### Método de Hub com validação completa

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

    if (userConnection.ConnectingUserId.HasValue)
        await Clients.User(userConnection.ConnectingUserId.Value.ToString())
            .SendAsync("OnCodeCancelled", code);

    return HubOperationResult<string>.Success(code);
}
```

### Use Case com verificação de propriedade

```csharp
public class CancelConnectionUseCase : ICancelConnectionUseCase
{
    private readonly ILoggedUser _loggedUser;

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

### Use Case de aceitar conexão (validações múltiplas)

```csharp
public async Task<HubOperationResult<string>> Execute(UserConnectionDto dto)
{
    var codeOwner = await _loggedUser.User();

    // 1. Verificar propriedade
    if (codeOwner.Id != dto.CodeOwnerId)
        return HubOperationResult<string>.Failure(
            "NOT_AUTHORIZED", ResourceErrorMessages.USER_WITHOUT_PERMISSION);

    // 2. Verificar se alguém se conectou
    var joinerUser = dto.ConnectingUserId.HasValue
        ? await _userRepository.GetById(dto.ConnectingUserId.Value)
        : null;

    if (joinerUser is null)
        return HubOperationResult<string>.Failure(
            "NO_USER_CONNECTED", ResourceErrorMessages.NO_USER_CONNECTED_WITH_CODE);

    // 3. Não conectar consigo mesmo
    if (codeOwner.Id == joinerUser.Id)
        return HubOperationResult<string>.Failure(
            "SELF_CONNECTION", ResourceErrorMessages.CANNOT_CONNECT_WITH_YOURSELF);

    // 4. Verificar conexão existente
    var alreadyConnected = await _connectionRepository.Exists(codeOwner.Id, joinerUser.Id);
    if (alreadyConnected)
        return HubOperationResult<string>.Failure(
            "ALREADY_CONNECTED",
            string.Format(ResourceErrorMessages.ALREADY_CONNECTED, joinerUser.Name));

    // 5. Criar conexão
    var connection = new Connection(codeOwner.Id, joinerUser.Id);
    await _connectionRepository.Create(connection);
    await _unitOfWork.Commit();

    return HubOperationResult<string>.Success(string.Empty);
}
```

## Example

**Before (sem validações):**
```csharp
public async Task CancelCode(string code)
{
    var connection = _connections.RemoveConnection(code);
    if (connection?.ConnectingUserId != null)
        await Clients.User(connection.ConnectingUserId.Value.ToString())
            .SendAsync("OnCodeCancelled", code);
}
```

**After (com validações via Use Case):**
```csharp
public async Task<HubOperationResult<string>> CancelCode(string code)
{
    var connection = _connections.RemoveConnection(code);
    if (connection is null)
        return HubOperationResult<string>.Failure("CODE_NOT_FOUND",
            ResourceErrorMessages.CODE_NOT_FOUND);

    var result = await _cancelUseCase.Execute(connection);
    if (!result.IsSuccess)
        return HubOperationResult<string>.Failure(result.ErrorCode, result.Message);

    if (connection.ConnectingUserId.HasValue)
        await Clients.User(connection.ConnectingUserId.Value.ToString())
            .SendAsync("OnCodeCancelled", code);

    return HubOperationResult<string>.Success(code);
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Método do Hub acessa recurso por código/chave | Validar existência primeiro, retornar falha se nulo |
| Método altera/remove recurso de outro usuário | Extrair para Use Case, verificar ownership via ILoggedUser |
| Método tem lógica que futuramente usará banco de dados | Criar Use Case mesmo que simples agora |
| Guid nullable (HasValue) precisa virar entidade | Usar if ternário: `id.HasValue ? await repo.GetById(id.Value) : null` |
| Mesma validação existe em outro método do Hub | Reutilizar Use Case ou criar Use Case compartilhado |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `public async Task CancelCode(...)` (sem retorno tipado) | `public async Task<HubOperationResult<string>> CancelCode(...)` |
| Verificação de permissão inline no Hub | Use Case com ILoggedUser injetado |
| `throw new Exception("not found")` no Hub | `return HubOperationResult.Failure(code, message)` |
| Mensagem de erro hardcoded em português | `ResourceErrorMessages.CHAVE_DO_RESOURCE` |
| Criar Use Case sem registrar no DI | Adicionar `services.AddScoped<IUseCase, UseCase>()` imediatamente |
| `if (dto.ConnectingUserId != null)` para Guid? | `if (dto.ConnectingUserId.HasValue)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
