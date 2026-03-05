---
name: rs-csharp-aprovando-cancelando-conexao
description: "Applies SignalR connection approve/cancel command patterns in .NET MAUI ViewModels. Use when user asks to 'implement accept/reject flow', 'approve or cancel SignalR connection', 'create relay commands for hub actions', or 'handle connection code with spaces'. Enforces string sanitization before hub invocation, proper connection lifecycle (invoke, stop, close), and XAML DataTrigger visibility patterns. Make sure to use this skill whenever implementing SignalR command flows in MAUI apps. Not for initial SignalR setup, hub server-side logic, or REST API endpoints."
---

# Approve/Cancel Connection Commands (SignalR + MAUI)

> Ao implementar comandos de conexao SignalR, sempre sanitize o codigo antes de enviar ao hub e gerencie o ciclo de vida completo: invoke → stop → close.

## Rules

1. **Sanitize connection codes antes de enviar ao hub** — use `.Replace(" ", string.Empty)` porque codes exibidos com espacos entre digitos causam falha silenciosa no hub
2. **Siga o ciclo invoke → stop → close** — apos invocar a funcao do hub, pare a conexao e feche a pagina, porque manter conexao aberta apos cancelar/aprovar desperdiça recursos
3. **Use DataTrigger para visibilidade condicional** — botoes que dependem de dados da API devem comecar `IsVisible="False"` e aparecer via trigger, porque clicar antes dos dados chegarem causa erro
4. **Copie nomes de funcoes do hub com Ctrl+C** — nunca digite manualmente o nome da funcao no `InvokeAsync`, porque erros de digitacao causam falhas silenciosas em runtime

## How to write

### RelayCommand para cancel/approve

```csharp
[RelayCommand]
public async Task Cancel()
{
    var code = ConnectionCode.Replace(" ", string.Empty);
    await _connection.InvokeAsync("Cancel", code);
    await _connection.StopAsync();
    await _navigationService.ClosePage();
}

[RelayCommand]
public async Task Approve()
{
    var code = ConnectionCode.Replace(" ", string.Empty);
    await _connection.InvokeAsync("ConfirmCodeJoin", code);
    await _connection.StopAsync();
    await _navigationService.ClosePage();
}
```

### XAML com DataTrigger para visibilidade

```xml
<Button Text="Cancelar Operação"
        Command="{Binding CancelCommand}"
        IsVisible="False">
    <Button.Triggers>
        <DataTrigger TargetType="Button"
                     Binding="{Binding StatusPage}"
                     Value="Waiting for joiner">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </Button.Triggers>
</Button>
```

## Example

**Before (bug — envia codigo com espacos):**
```csharp
await _connection.InvokeAsync("Cancel", ConnectionCode);
// ConnectionCode = "1 6 1 0 6 2" → hub nao encontra
```

**After (correto — sanitiza antes):**
```csharp
var code = ConnectionCode.Replace(" ", string.Empty);
await _connection.InvokeAsync("Cancel", code);
// code = "161062" → hub encontra normalmente
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Codigo exibido com formatacao visual (espacos, hifens) | Sempre `.Replace()` antes de enviar ao hub |
| Botao depende de dados assincronos | `IsVisible="False"` + DataTrigger |
| Apos acao final (cancel/approve) | Sempre `StopAsync()` + `ClosePage()` |
| Multiplos botoes com mesmo comando em telas diferentes | Bind o mesmo command em ambos os VerticalStackLayouts |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `InvokeAsync("Cancel", ConnectionCode)` direto | `InvokeAsync("Cancel", ConnectionCode.Replace(" ", string.Empty))` |
| Digitar nome da funcao do hub manualmente | Copiar do hub com Ctrl+C para evitar typos |
| Deixar botao cancel visivel antes do codigo chegar | `IsVisible="False"` + DataTrigger no StatusPage |
| Fechar pagina sem parar conexao | `StopAsync()` antes de `ClosePage()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
