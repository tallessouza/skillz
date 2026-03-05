---
name: rs-csharp-maui-mainthread-nav
description: "Enforces .NET MAUI MainThread and navigation patterns when writing SignalR hub callbacks or real-time connection handlers. Use when user asks to 'handle hub messages', 'navigate after SignalR response', 'update UI from background thread', 'fix MAUI visual bug not updating', or 'close page and navigate'. Applies rules: always wrap hub callbacks in MainThread.BeginInvokeOnMainThread, use ../ navigation syntax to close-and-navigate, handle error codes with conditional navigation. Make sure to use this skill whenever writing SignalR/WebSocket callback code in .NET MAUI. Not for general navigation, non-realtime MAUI commands, or API controller code."
---

# MainThread e Navegação em Callbacks Real-Time (.NET MAUI)

> Callbacks de conexões real-time (SignalR) executam em threads secundárias — qualquer alteração visual DEVE ser envolvida em MainThread.BeginInvokeOnMainThread.

## Rules

1. **Sempre envolva callbacks de hub em MainThread.BeginInvokeOnMainThread** — porque apenas a thread principal pode alterar elementos visuais no .NET MAUI; sem isso, navegação e feedback simplesmente não aparecem (o app parece travado)
2. **Use `../` na rota para fechar e navegar** — `await NavigationService.GoToAsync("../NovaPagina")` fecha a página atual e abre a próxima, sem precisar de ClosePage separado
3. **Commands do .NET MAUI já executam na main thread** — só se preocupe com MainThread em callbacks de conexão (hub.On), não em ICommand/RelayCommand
4. **Trate error codes com navegação condicional** — se o erro for recuperável (ex: código inválido), navegue de volta à página de input; se for fatal, feche a página
5. **Envie o idioma do dispositivo na conexão do hub** — sem isso, mensagens do hub voltam em inglês por padrão

## How to write

### Callback de hub com MainThread

```csharp
connection.On<ConnectionResult>("ResultCallback", (result) =>
{
    MainThread.BeginInvokeOnMainThread(async () =>
    {
        if (result.IsSuccess)
        {
            await _navigationService.GoToAsync("../DashboardPage");
            return;
        }

        await StopAsync();

        if (result.ErrorCode == "INVALID_CODE")
        {
            await ShowFeedback(result.Message, isError: true);
            await _navigationService.GoToAsync("../CodeInputPage");
        }
        else
        {
            await ShowFeedback(result.Message, isError: true);
            await _navigationService.ClosePage();
        }
    });
});
```

### Navegação fechar-e-abrir (sintaxe ../)

```csharp
// Fecha a página atual E navega para a próxima em uma chamada
await _navigationService.GoToAsync("../ConnectionHubPage");

// Equivalente manual (não use, prefira o de cima):
// await _navigationService.ClosePage();
// await _navigationService.GoToAsync("ConnectionHubPage");
```

### Configurar idioma na conexão do hub

```csharp
connection = new HubConnectionBuilder()
    .WithUrl(hubUrl, options =>
    {
        options.Headers.Add("Accept-Language",
            CultureInfo.CurrentCulture.TwoLetterISOLanguageName);
    })
    .Build();
```

## Example

**Before (bug: UI não atualiza após callback do hub):**
```csharp
connection.On<ConnectionResult>("OnConfirm", async (result) =>
{
    await ShowFeedback("Conexão aceita!");
    await _navigationService.ClosePage();
    await _navigationService.GoToAsync("DashboardPage");
});
```

**After (com MainThread e navegação correta):**
```csharp
connection.On<ConnectionResult>("OnConfirm", (result) =>
{
    MainThread.BeginInvokeOnMainThread(async () =>
    {
        await ShowFeedback("Conexão aceita!");
        await _navigationService.GoToAsync("../DashboardPage");
    });
});
```

## Heuristics

| Situação | Faça |
|----------|------|
| Callback de `connection.On<T>` altera UI | Envolva em `MainThread.BeginInvokeOnMainThread` |
| Command (ICommand/RelayCommand) | Não precisa de MainThread — já executa na principal |
| Fechar página e abrir outra | Use `"../NovaPagina"` na rota |
| Erro recuperável (código inválido) | Navegue de volta à página de input |
| Erro fatal (conexão perdida) | Feche a página com feedback |
| Mensagens do hub vêm em inglês | Adicione `Accept-Language` na conexão |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `connection.On("X", async () => { await Navigate(...) })` sem MainThread | `connection.On("X", () => { MainThread.BeginInvokeOnMainThread(async () => { ... }); })` |
| `ClosePage()` + `GoToAsync("Page")` separados | `GoToAsync("../Page")` |
| Hub sem idioma configurado | `options.Headers.Add("Accept-Language", CultureInfo.CurrentCulture.TwoLetterISOLanguageName)` |
| `async void` em callback de hub | Delegate síncrono com MainThread internamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
