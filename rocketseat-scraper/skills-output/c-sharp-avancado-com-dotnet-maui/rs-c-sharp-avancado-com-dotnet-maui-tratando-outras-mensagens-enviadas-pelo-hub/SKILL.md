---
name: rs-csharp-maui-hub-message-handlers
description: "Applies SignalR Hub message handling patterns when writing .NET MAUI ViewModels that receive real-time notifications. Use when user asks to 'handle hub messages', 'listen for SignalR events', 'treat connection events', 'handle real-time notifications in MAUI', or 'implement connection.On handlers'. Enforces pattern: register On handlers in constructor, create private async methods per message type, stop connection + close page + show feedback on each event. Make sure to use this skill whenever implementing SignalR client-side message handlers in .NET MAUI. Not for server-side Hub implementation, API controllers, or non-real-time features."
---

# Tratando Mensagens do Hub no ViewModel

> Registre handlers no construtor via `connection.On()`, crie metodos privados async por tipo de mensagem, e sempre execute stop + close + feedback em cada handler.

## Rules

1. **Registre cada handler no construtor** — `_connection.On("NomeExato", MetodoHandler)`, porque o registro precisa acontecer antes de qualquer mensagem chegar
2. **String do On deve ser identica ao Send do Hub** — copie a string exata do Hub com Ctrl+C/Ctrl+V, porque erro de digitacao causa falha silenciosa
3. **Um metodo privado por tipo de mensagem** — `async Task OnCancelled()`, `async Task OnConnectionConfirmed()`, porque cada evento tem feedback diferente
4. **Trifeta obrigatoria em cada handler** — stop connection + close page + show feedback, porque o usuario precisa sair do fluxo e entender o que aconteceu
5. **Use feedback apropriado ao contexto** — sucesso para aprovacao, falha para cancelamento/erro/desconexao, porque o tipo de feedback comunica a natureza do evento
6. **Personalize mensagens com string.Format** — inclua o nome da pessoa usando dados ja disponíveis no ViewModel (ex: `GeneratedBy`), porque humaniza a experiencia

## How to write

### Registro de handlers no construtor

```csharp
public UserConnectionJoinerViewModel(HubConnection connection)
{
    _connection = connection;

    // Sem tipo generico quando nao recebe parametro
    _connection.On("onCancelled", OnCancelled);
    _connection.On("onConnectionConfirmed", OnConnectionConfirmed);
    _connection.On("onUserDisconnected", OnUserDisconnected);
    _connection.On("onConnectionErrorOccurrence", OnConnectionErrorOccurrence);
}
```

### Handler privado padrao (trifeta: stop + close + feedback)

```csharp
private async Task OnCancelled()
{
    await _connection.StopAsync();

    await NavigationService.ClosePage();

    await NavigationService.ShowFeedback(
        FeedbackType.Failure,
        string.Format(ResourceText.CONNECTION_CANCELLED, GeneratedBy)
    );
}
```

### Handler de sucesso (mesmo padrao, feedback diferente)

```csharp
private async Task OnConnectionConfirmed()
{
    await _connection.StopAsync();

    await NavigationService.ClosePage();

    await NavigationService.ShowFeedback(
        FeedbackType.Success,
        string.Format(ResourceText.CONNECTION_APPROVED, GeneratedBy)
    );
}
```

## Example

**Before (handler unico sem padrao):**
```csharp
_connection.On("onCancelled", async () =>
{
    // esqueceu de parar a conexao
    await NavigationService.ClosePage();
    // sem feedback para o usuario
});
```

**After (com esta skill aplicada):**
```csharp
_connection.On("onCancelled", OnCancelled);

// ...

private async Task OnCancelled()
{
    await _connection.StopAsync();
    await NavigationService.ClosePage();
    await NavigationService.ShowFeedback(
        FeedbackType.Failure,
        string.Format(ResourceText.CONNECTION_CANCELLED, GeneratedBy)
    );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mensagem sem parametros do Hub | `_connection.On("nome", Handler)` sem tipo generico |
| Mensagem com parametros do Hub | `_connection.On<TipoParam>("nome", Handler)` |
| Evento positivo (aprovacao) | FeedbackType.Success |
| Evento negativo (cancelamento, erro, desconexao) | FeedbackType.Failure (ou crie um terceiro tipo neutro) |
| Nome da string no On | Copie exatamente do Hub, nunca digite manualmente |
| Dados da outra pessoa (nome) | Use propriedades ja preenchidas no ViewModel (ex: GeneratedBy) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Lambda inline longa no `.On()` | Metodo privado nomeado passado como referencia |
| Esquecer `StopAsync` no handler | Sempre primeira linha: `await _connection.StopAsync()` |
| Digitar a string do evento manualmente | Copiar exatamente do Hub |
| Handler sem feedback ao usuario | Sempre mostrar feedback com mensagem personalizada |
| Fechar pagina sem parar conexao | Stop primeiro, close depois |
| Mensagem generica "Erro ocorreu" | Incluir nome da pessoa: `string.Format(msg, GeneratedBy)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
