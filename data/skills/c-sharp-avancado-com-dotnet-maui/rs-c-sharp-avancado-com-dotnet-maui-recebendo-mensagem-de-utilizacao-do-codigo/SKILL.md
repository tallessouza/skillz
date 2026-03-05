---
name: rs-csharp-maui-recebendo-msg-hub
description: "Enforces correct SignalR message reception patterns in .NET MAUI ViewModels. Use when user asks to 'receive SignalR messages', 'listen to hub events', 'handle real-time notifications', 'configure connection.On', or 'capture hub messages in MAUI'. Applies rules: configure On() before StartAsync, match parameter type exactly to hub SendAsync, pass method as delegate without parentheses, separate response DTOs from observable properties. Make sure to use this skill whenever implementing SignalR client-side message handlers in .NET MAUI. Not for server-side Hub implementation, REST API calls, or non-SignalR communication."
---

# Recebendo Mensagens do Hub via SignalR

> Configure o `connection.On()` antes do `StartAsync`, com a assinatura exata do tipo que o Hub envia, e separe responsabilidades entre DTOs de resposta e propriedades observaveis.

## Rules

1. **Configure On() antes do StartAsync** — registre todos os handlers de mensagem antes de iniciar a conexao, porque mensagens enviadas pelo Hub antes da configuracao serao perdidas
2. **Assinatura do parametro deve ser identica ao tipo do Hub** — se o Hub envia `ResponseConnectingUserJson`, o handler deve receber exatamente esse tipo, porque o SignalR faz desserializacao baseada no tipo
3. **Nome da mensagem deve ser identico ao do Hub** — o primeiro parametro do `On()` deve ser a mesma string usada no `SendAsync` do Hub, porque qualquer diferenca silenciosamente ignora a mensagem
4. **Passe o metodo como delegate, sem parenteses** — `onUserJoins` nao `onUserJoins()`, porque com parenteses voce executa a funcao ao inves de passa-la como callback
5. **Separe Response DTO de propriedade observavel** — mesmo que as propriedades sejam identicas, crie classes distintas, porque o Response transporta dados da API e a entidade observavel pertence a camada de apresentacao
6. **Nome da funcao handler e livre** — o que importa e a assinatura (tipo do parametro), nao o nome do metodo

## How to write

### Registrar handler no construtor

```csharp
// No construtor da ViewModel, DEPOIS de criar o client, ANTES do StartAsync
_connection.On<ResponseConnectingUserJson>(
    "OnUserJoineds",  // exatamente a string do Hub.SendAsync
    onUserJoins       // delegate sem parenteses
);
```

### Handler que processa a mensagem

```csharp
private void onUserJoins(ResponseConnectingUserJson response)
{
    JoinerUser = new JoinerUser
    {
        Name = response.Name
    };

    StatusPage = ConnectionByCodeStatusPage.JoinerConnectedPendingApproval;
}
```

### Handler sem parametros (quando Hub nao envia dados)

```csharp
_connection.On("OnSomeEvent", () =>
{
    // processar evento sem payload
});
```

## Example

**Before (erros comuns):**
```csharp
// ERRO 1: On() depois do StartAsync
await _connection.StartAsync();
_connection.On<ResponseConnectingUserJson>("OnUserJoineds", onUserJoins);

// ERRO 2: Executando a funcao ao inves de passar delegate
_connection.On<ResponseConnectingUserJson>("OnUserJoineds", onUserJoins());

// ERRO 3: Reutilizando o Response como propriedade observavel
[ObservableProperty]
private ResponseConnectingUserJson joinerUser; // mistura responsabilidades
```

**After (com esta skill aplicada):**
```csharp
public UserConnectionGeneratorViewModel()
{
    _connection = CreateClient();

    // Configura ANTES do StartAsync
    _connection.On<ResponseConnectingUserJson>(
        "OnUserJoineds",
        onUserJoins  // delegate, sem parenteses
    );
}

private async Task Initialize()
{
    await _connection.StartAsync();
}

private void onUserJoins(ResponseConnectingUserJson response)
{
    // Entidade separada do Response
    JoinerUser = new JoinerUser { Name = response.Name };
    StatusPage = ConnectionByCodeStatusPage.JoinerConnectedPendingApproval;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Hub envia objeto tipado | Use `On<TipoExato>` com generic |
| Hub envia evento sem dados | Use `On("nome", () => { })` |
| Multiplas mensagens do Hub | Registre todos os `On()` no construtor antes do Start |
| Propriedades do Response iguais a entidade | Crie classes separadas mesmo assim |
| Precisa atualizar UI apos mensagem | Atualize propriedades observaveis dentro do handler |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `On()` depois de `StartAsync()` | `On()` no construtor, `StartAsync` no Initialize |
| `_connection.On("msg", handler())` | `_connection.On("msg", handler)` |
| `[ObservableProperty] ResponseDTO prop` | Crie classe de entidade separada |
| String da mensagem digitada manualmente | Copie exatamente do Hub `SendAsync` |
| Configurar `On()` espalhado pelo codigo | Centralize no construtor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
