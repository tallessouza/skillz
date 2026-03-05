---
name: rs-csharp-maui-aceitando-conexao
description: "Applies SignalR hub connection approval pattern when implementing real-time user connection flows in C# .NET. Use when user asks to 'approve connection', 'confirm SignalR join', 'accept real-time connection', 'implement hub confirmation method', or 'persist connection after approval'. Enforces dictionary cleanup after approval, use case separation for persistence, and DI registration. Make sure to use this skill whenever building real-time connection approval flows with SignalR hubs. Not for HTTP REST endpoints, authentication, or non-real-time connection handling."
---

# Aceitando Conexão em Tempo Real (SignalR Hub)

> Ao aprovar uma conexão entre usuarios via SignalR, remova o codigo do dicionario, delegue persistencia a um use case dedicado, e notifique apenas a parte relevante.

## Rules

1. **Remova o codigo do dicionario ao aprovar** — use `Remove` que retorna o objeto associado, porque o codigo aprovado nao tem mais utilidade e libera memoria do dicionario em memoria
2. **Delegue persistencia a um use case** — nunca acesse o repositorio direto no Hub, porque o Hub e camada de transporte, nao de negocio
3. **Registre no DI antes de testar** — todo use case novo precisa ser adicionado no servico de injecao de dependencia, porque o construtor do Hub recebe via DI
4. **Notifique apenas o lado relevante** — ao confirmar conexao, envie mensagem apenas para quem precisa saber (ex: quem enviou o codigo recebe `OnConnectionConfirmed`), porque evita broadcast desnecessario
5. **Caminho feliz primeiro, validacoes depois** — implemente o fluxo principal antes de cobrir cenarios de erro, porque garante que a arquitetura base funciona antes de adicionar complexidade

## How to write

### Metodo de confirmacao no Hub

```csharp
public async Task ConfirmCodeJoin(string code)
{
    // 1. Remove do dicionario e obtem o DTO
    var userConnectionDTO = _pendingConnections.Remove(code);

    // 2. Delega persistencia ao use case
    await _approveConnectionUseCase.Execute(userConnectionDTO);

    // 3. Notifica o lado que precisa saber
    await Clients.Client(userConnectionDTO.ConnectedConnectionId)
        .SendAsync("OnConnectionConfirmed");
}
```

### Use case de aprovacao

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

### Registro no DI

```csharp
// Em Program.cs ou na configuracao de servicos
services.AddScoped<IApproveConnectionUseCase, ApproveConnectionUseCase>();
```

## Example

**Before (logica no Hub, sem separacao):**
```csharp
public async Task ConfirmCodeJoin(string code)
{
    var dto = _pendingConnections[code];
    // Acessa banco direto no Hub - ERRADO
    var conn = new UserConnection { UserId = dto.UserId, ConnectedUserId = dto.ConnectedUserId };
    _dbContext.UserConnections.Add(conn);
    await _dbContext.SaveChangesAsync();
    // Codigo permanece no dicionario - VAZAMENTO DE MEMORIA
}
```

**After (com this skill applied):**
```csharp
public async Task ConfirmCodeJoin(string code)
{
    var userConnectionDTO = _pendingConnections.Remove(code);
    await _approveConnectionUseCase.Execute(userConnectionDTO);
    await Clients.Client(userConnectionDTO.ConnectedConnectionId)
        .SendAsync("OnConnectionConfirmed");
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Codigo aprovado no Hub | Remove do dicionario, delega ao use case |
| Novo use case criado | Registre no DI imediatamente |
| Renomeou interface/classe | Verifique todos os consumidores (ex: GetDashboardUseCase) |
| Testando fluxo real-time | Use breakpoints no Hub + verifique tabela no banco |
| Caminho feliz funcionando | So entao implemente validacoes e tratamento de erro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `_pendingConnections[code]` sem remover | `_pendingConnections.Remove(code)` |
| `_dbContext.SaveChanges()` dentro do Hub | `_approveConnectionUseCase.Execute(dto)` |
| Broadcast para todos os clients | `Clients.Client(specificConnectionId).SendAsync(...)` |
| Esqueceu DI e testou direto | `services.AddScoped<IUseCase, UseCase>()` antes de testar |
| Validacoes antes do caminho feliz | Implemente happy path primeiro, valide depois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
