---
name: rs-csharp-maui-hub-join-codes
description: "Applies SignalR Hub connection patterns when implementing real-time user pairing in C#/.NET. Use when user asks to 'connect users via code', 'implement SignalR hub methods', 'pair users in real-time', or 'build connection flow with hubs'. Covers TryGetValue with out var, reference vs copy semantics for class/record, and use case separation from hubs. Make sure to use this skill whenever building real-time connection features with SignalR in .NET. Not for REST API endpoints, database queries, or frontend SignalR client code."
---

# Hub de Conexao com Codigos em SignalR

> Metodos de Hub devem delegar logica de negocio a Use Cases, manipular apenas fluxo de conexao e preencher DTOs por referencia.

## Rules

1. **Separe logica de negocio do Hub** — Use Cases acessam banco de dados, Hub apenas orquestra conexoes, porque Hub nao deve ter acoplamento com persistencia
2. **Use TryGetValue com out var** — `dictionary.TryGetValue(key, out var value)` em uma linha, porque evita declaracao extra e e idiomatico em C#
3. **Retorne nullable quando busca pode falhar** — `UserConnectionsDto?` com `?`, porque avisa o chamador que o valor pode ser nulo sem lancar excecao
4. **Preencha DTOs por referencia quando sao classes** — alteracoes no objeto retornado refletem no dicionario original, porque classes retornam referencia, nao copia
5. **Nomeie propriedades pelo estado atual** — `ConnectingUserId` (conectando) nao `ConnectedUserId` (conectado), porque a conexao ainda nao foi aprovada
6. **Registre Use Cases no DI** — configure no `DependencyInjectionExtension`, porque sem registro o Hub recebe erro de resolucao de dependencia

## How to write

### Metodo Hub que recebe codigo

```csharp
public async Task JoinWithCodes(string code)
{
    // 1. Buscar informacoes associadas ao codigo
    var userConnections = _codeConnectionService.GetConnectionByCode(code);

    // 2. Chamar use case para obter dados de quem informou o codigo
    var response = await _joinWithCodeUseCase.Execute(userConnections.UserId);

    // 3. Preencher IDs da pessoa que esta conectando (referencia ao dicionario)
    userConnections.ConnectingUserId = response.Id;
    userConnections.ConnectingUserConnectionId = Context.ConnectionId;
}
```

### TryGetValue com out var

```csharp
public UserConnectionsDto? GetConnectionByCode(string code)
{
    _connections.TryGetValue(code, out var userConnection);
    return userConnection; // null se chave nao existe
}
```

### Use Case simples (expandivel depois)

```csharp
public class JoinWithCodeUseCase : IJoinWithCodeUseCase
{
    public async Task<ConnectingUserDto> Execute(Guid userId)
    {
        var loggedUser = await _userRepository.GetById(userId);

        return new ConnectingUserDto
        {
            Id = loggedUser.Id,
            Name = loggedUser.Name,
            ProfileUrl = string.Empty // preencher depois
        };
    }
}
```

## Example

**Before (logica no Hub, sem Use Case):**
```csharp
public async Task JoinWithCodes(string code)
{
    var userConnections = _codeConnectionService.GetConnectionByCode(code);
    // Acessa banco direto no Hub — ERRADO
    var user = await _dbContext.Users.FindAsync(userConnections.UserId);
    userConnections.ConnectedUserId = user.Id; // nome errado — ja conectado?
}
```

**After (com Use Case e nomes corretos):**
```csharp
public async Task JoinWithCodes(string code)
{
    var userConnections = _codeConnectionService.GetConnectionByCode(code);
    var response = await _joinWithCodeUseCase.Execute(userConnections.UserId);

    userConnections.ConnectingUserId = response.Id;
    userConnections.ConnectingUserConnectionId = Context.ConnectionId;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Hub precisa acessar banco | Crie Use Case, injete no Hub |
| Busca em dicionario pode falhar | Use `TryGetValue`, retorne nullable |
| DTO precisa ser alterado apos retorno | Use classe (referencia), nao record (copia) |
| Propriedade descreve estado futuro incerto | Nomeie pelo estado atual (Connecting, nao Connected) |
| Use Case parece simples demais | Mantenha — validacoes futuras virao (ex: checar duplicatas) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `_dbContext` direto no Hub | `_useCase.Execute(...)` |
| `dict[key]` sem checar existencia | `dict.TryGetValue(key, out var val)` |
| `ConnectedUserId` antes de aprovacao | `ConnectingUserId` |
| Record para DTO que sera mutado por referencia | Classe para manter referencia no dicionario |
| Declarar variavel + passar separado no out | `out var value` inline |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
