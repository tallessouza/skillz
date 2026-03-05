---
name: rs-csharp-maui-hub-result-handling
description: "Enforces proper success/failure handling for SignalR Hub responses in .NET MAUI apps. Use when user asks to 'handle hub response', 'treat SignalR result', 'show error feedback', 'implement result pattern', or 'handle connection errors in MAUI'. Applies conditional branching on HubOperationResult, Snackbar feedback for failures, and connection cleanup on error. Make sure to use this skill whenever implementing Hub invoke flows that return results. Not for HTTP API error handling, REST clients, or general exception handling."
---

# Tratamento de Retorno Sucesso ou Falha do Hub

> Toda invocacao ao Hub que retorna um resultado deve ter tratamento condicional explicito — sucesso segue o fluxo, falha para conexao, fecha pagina e notifica o usuario.

## Rules

1. **Sempre verifique IsSuccess no resultado do Hub** — `if (result.IsSuccess)` antes de usar a resposta, porque o Hub pode retornar falhas que precisam de tratamento diferente
2. **Falha exige 3 acoes em sequencia** — parar conexao, fechar pagina, exibir feedback, porque deixar conexao aberta apos erro gera estado inconsistente
3. **Use Snackbar para erros de mensagem unica** — nao redirecione para pagina de erros quando ha apenas uma mensagem, porque a pagina de erros e para listas de erros
4. **Feedback de falha usa cor danger e duracao maior** — 4 segundos ao inves de 3, porque o usuario precisa de mais tempo para ler mensagens de erro
5. **Nem todo comando precisa de tratamento de resultado** — operacoes como cancelar onde sucesso e falha levam ao mesmo estado nao precisam de condicional, porque o Hub ja trata ambos os cenarios identicamente
6. **Extraia o feedback para a interface de navegacao** — `ShowFailureFeedback` deve estar no `INavigationService`, porque a ViewModel nao deve conhecer detalhes de UI

## How to write

### Tratamento padrao de falha no comando

```csharp
var result = await _connection.InvokeAsync<HubOperationResult>("MethodName", args);

if (result.IsSuccess)
{
    // Fluxo de sucesso — usar result.Data
}
else
{
    await _connection.Stop();
    await _navigationService.ClosePage();
    await _navigationService.ShowFailureFeedback(result.Error);
}
```

### Feedback de falha no NavigationService

```csharp
public async Task ShowFailureFeedback(string message)
{
    var snackbarOptions = new SnackbarOptions
    {
        BackgroundColor = Application.Current.GetDangerColor(),
        // Mesma config do sucesso, mas cor danger e duracao 4s
    };

    var snackbar = Snackbar.Make(message, duration: TimeSpan.FromSeconds(4),
        visualOptions: snackbarOptions);
    await snackbar.Show();
}
```

### Comando que NAO precisa de tratamento

```csharp
// Cancel — resultado nao importa, Hub trata ambos os cenarios
await _connection.InvokeAsync("Cancel", code);
await _connection.Stop();
await _navigationService.ClosePage();
```

## Example

**Before (assume sempre sucesso):**
```csharp
var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");
ConnectionCode = FormatCode(result.Data);
```

**After (com tratamento condicional):**
```csharp
var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");

if (result.IsSuccess)
{
    ConnectionCode = FormatCode(result.Data);
}
else
{
    await _connection.Stop();
    await _navigationService.ClosePage();
    await _navigationService.ShowFailureFeedback(result.Error);
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Hub retorna dado que sera exibido na tela | Tratar sucesso E falha obrigatoriamente |
| Operacao de cancelamento/cleanup | Nao precisa de tratamento — resultado irrelevante |
| Aprovacao de conexao com feedback ao usuario | Tratar sucesso com mensagem positiva, falha com cleanup completo |
| Mensagem de sucesso com nome do usuario | Usar `string.Format` com resource string parametrizada |
| Decidindo entre Snackbar e pagina de erro | Uma mensagem = Snackbar, lista de erros = pagina de erros |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `var result = await hub.Invoke(...); UseResult(result.Data);` | `if (result.IsSuccess) { UseResult(result.Data); } else { HandleFailure(); }` |
| Deixar conexao aberta apos erro | `await _connection.Stop()` no bloco else |
| Manter pagina aberta apos falha no hub | `await _navigationService.ClosePage()` antes do feedback |
| Duplicar snackbar config sem extrair | Extrair para funcao privada se configs forem identicas |
| Tratar cancel com condicional de resultado | Executar cleanup direto sem verificar IsSuccess |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
