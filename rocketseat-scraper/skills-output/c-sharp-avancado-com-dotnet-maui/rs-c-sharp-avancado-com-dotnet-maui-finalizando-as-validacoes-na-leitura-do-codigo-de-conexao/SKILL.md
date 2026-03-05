---
name: rs-csharp-dotnet-maui-connection-validations
description: "Enforces duplicate connection validation and String.Format usage patterns in C# real-time connection systems. Use when user asks to 'validate connections', 'prevent duplicates in database', 'format error messages in C#', 'implement SignalR hub logic', or 'write repository query with OR conditions'. Applies bidirectional query checks, nullable value handling with .Value, and String.Format parameterized messages. Make sure to use this skill whenever writing connection/relationship validation logic in C# or formatting dynamic error messages. Not for frontend validation, authentication, or non-relational data patterns."
---

# Validacoes de Conexao e String.Format em C#

> Ao validar conexoes entre entidades no banco de dados, sempre verifique nas duas direcoes (A→B e B→A) e use parenteses explicitos em condicoes compostas com AND/OR.

## Rules

1. **Sempre valide conexao bidirecional** — verifique `(UserA == Col1 AND UserB == Col2) OR (UserA == Col2 AND UserB == Col1)`, porque a ordem de quem gerou vs quem usou o codigo nao importa para determinar se ja existe conexao
2. **Use parenteses explicitos em condicoes OR com AND** — `(condA && condB) || (condC && condD)`, porque C# tem precedencia de operadores que pode gerar bugs sutis sem parenteses — este e um dos bugs mais comuns em projetos reais
3. **Use `.Value` para acessar nullable confirmado** — quando voce verificou que `IsSuccess == false`, o `ErrorCode` (nullable) vai existir, entao acesse com `.Value` em vez de cast, porque comunica intencao
4. **Use `!` (null-forgiving) apenas quando tem certeza logica** — quando o fluxo garante que o valor nao e nulo (ex: apos verificar sucesso), use `!` para suprimir o warning verde
5. **Mantenha interface sincronizada com implementacao** — ao alterar assinatura de metodo, atualize a interface imediatamente, porque o projeto nao compila e o erro e silencioso ate o build
6. **Use `String.Format` para mensagens dinamicas em resources** — porque permite internacionalizacao e reutilizacao do template com parametros indexados `{0}`, `{1}`

## How to write

### Validacao bidirecional no repositorio

```csharp
public async Task<bool> AreUsersConnected(User user1, User user2)
{
    return await _dbContext.UserConnections
        .AsNoTracking()
        .AnyAsync(c =>
            (c.UserId == user1.Id && c.ConnectedUserId == user2.Id) ||
            (c.UserId == user2.Id && c.ConnectedUserId == user1.Id));
}
```

### String.Format com resource messages

```csharp
// No arquivo de resource: "Voce e {0} ja possuem uma conexao"
var message = String.Format(
    ResourceMessageException.CONNECTION_ALREADY_EXISTS,
    codeOwner.Name);
```

### Tratamento de nullable em Result Pattern

```csharp
if (!result.IsSuccess)
{
    return HubOperationResult<string>.Failure(
        result.ErrorMessage,
        result.ErrorCode!.Value);  // .Value extrai o tipo sem '?'
}
```

## Example

**Before (bug sutil com OR/AND sem parenteses):**
```csharp
// BUG: sem parenteses, a precedencia de && sobre || causa resultado errado
.AnyAsync(c =>
    c.UserId == user1.Id && c.ConnectedUserId == user2.Id ||
    c.UserId == user2.Id && c.ConnectedUserId == user1.Id);
```

**After (parenteses explicitos):**
```csharp
.AnyAsync(c =>
    (c.UserId == user1.Id && c.ConnectedUserId == user2.Id) ||
    (c.UserId == user2.Id && c.ConnectedUserId == user1.Id));
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Relacao bidirecional (amizade, conexao) | Sempre verifique A→B e B→A |
| Condicao com AND + OR misturados | Parenteses explicitos sempre |
| Propriedade nullable apos verificacao de fluxo | Use `.Value` + `!` quando tem certeza logica |
| Mensagem de erro com nome dinamico | `String.Format` com resource file |
| Alterou assinatura de metodo | Atualize a interface antes de continuar |
| Result Pattern retorna sucesso/falha | Verifique `IsSuccess` antes de acessar Response ou ErrorCode |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `c.UserId == user1.Id && c.ConnectedUserId == user2.Id` (apenas uma direcao) | Adicione `\|\| (c.UserId == user2.Id && c.ConnectedUserId == user1.Id)` |
| OR/AND sem parenteses em query LINQ | `(cond1 && cond2) \|\| (cond3 && cond4)` com parenteses |
| `(string)result.ErrorCode` para nullable | `result.ErrorCode!.Value` |
| Mensagem hardcoded com concatenacao: `"Voce e " + name + " ja..."` | `String.Format(resource, name)` |
| Ignorar warning verde de nullable | `!` quando o fluxo garante nao-nulo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
