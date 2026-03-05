---
name: rs-csharp-maui-refresh-token-error-handling
description: "Applies refresh token error handling patterns in .NET MAUI apps when user asks to 'implement refresh token', 'handle token expiration', 'redirect on auth failure', or 'handle API authentication errors'. Enforces rules: redirect to onboarding on refresh failure, clear local storage on token failure, suppress token-expired error pages, maintain execution flow awareness after navigation. Make sure to use this skill whenever implementing token refresh error flows or authentication failure recovery in MAUI apps. Not for initial token acquisition, login flow implementation, or server-side token validation."
---

# Refresh Token Error Handling em .NET MAUI

> Quando o refresh token falha, limpe o storage local, suprima mensagens de erro tecnicas e redirecione para onboarding — sem deixar o fluxo de execucao continuar apos a navegacao.

## Rules

1. **Sempre verifique `isSuccess` apos trocar refresh token** — nunca assuma que o use case retornou sucesso, porque a API pode ter invalidado o token
2. **Redirecione para onboarding em qualquer erro de refresh** — nao importa o motivo da falha, force novo login, porque tentar recuperar de erros especificos de refresh e fragil e inseguro
3. **Limpe todo o storage local antes de redirecionar** — `userStorage.Clear()` e `tokensStorage.Clear()`, porque o AppShell verifica `isLoggedIn` pelo storage e sem limpar o usuario volta ao dashboard ao reabrir o app
4. **Suprima mensagens de "token expired" na pagina de erro** — verifique `results.Messages.Contains("Token expired")` e retorne antes de navegar para a error page, porque essa mensagem e tecnica e nao faz sentido para o usuario
5. **Centralize a supressao em `GoToPageWithErrors`** — nao trate em cada ViewModel individualmente, porque a funcao compartilhada resolve para todas as paginas de uma vez
6. **Lembre que navegacao nao mata execucao em andamento** — apos `GoToOnboardingPage()`, o codigo continua executando ate encontrar um `return`, entao sempre adicione `return` apos navegacao de redirecionamento

## How to write

### Verificacao de sucesso no handler de refresh token

```csharp
if (result.IsSuccess)
{
    // Atualiza tokens e refaz requisicao
    await _tokensStorage.Save(result.Tokens!);
    // Refaz a request original...
}
else
{
    // Limpa storage para forcar novo login
    _userStorage.Clear();
    _tokensStorage.Clear();

    await _navigationService.GoToOnboardingPage();
    return; // CRITICO: sem return, execucao continua
}
```

### Supressao de erro tecnico centralizada

```csharp
// Em GoToPageWithErrors (funcao compartilhada por todas ViewModels)
if (results.Messages.Contains("Token expired"))
{
    return; // Nao exibe pagina de erro para token expirado
}

// Somente erros relevantes mostram a error page
await NavigateToErrorPage(results.Messages);
```

### Interface de navegacao com GoToOnboarding

```csharp
public interface INavigationService
{
    Task GoToDashboardPage();
    Task GoToOnboardingPage(); // Substitui pagina principal com //
}

// Implementacao usa "//" para substituir a pagina raiz
public async Task GoToOnboardingPage()
{
    await Shell.Current.GoToAsync("//OnBoardingPage");
}
```

## Example

**Before (apenas caminho feliz, sem tratamento de erro):**
```csharp
// No handler de refresh token
var result = await _useRefreshTokenUseCase.Execute();
await _tokensStorage.Save(result.Tokens);
// Refaz request... sem verificar se deu erro
```

**After (com tratamento completo):**
```csharp
var result = await _useRefreshTokenUseCase.Execute();

if (result.IsSuccess)
{
    await _tokensStorage.Save(result.Tokens!);
    // Refaz request original
}
else
{
    _userStorage.Clear();
    _tokensStorage.Clear();
    await _navigationService.GoToOnboardingPage();
    return;
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Refresh token falhou por qualquer motivo | Limpar storage + redirecionar para onboarding |
| Mensagem de erro contem "Token expired" | Suprimir — nao exibir error page |
| Navegou para outra pagina no meio de execucao | Sempre colocar `return` apos a navegacao |
| App reaberto apos falha de refresh | Verificar que storage foi limpo para nao voltar ao dashboard |
| Precisar testar fluxo de erro de refresh | Deletar refresh token no banco e reabrir o app |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Navegar sem `return` apos redirecionamento | `await nav.GoToOnboardingPage(); return;` |
| Tratar erro de token em cada ViewModel | Centralizar em `GoToPageWithErrors` |
| Mostrar "Token expired" para o usuario | Suprimir com `Contains("Token expired")` e retornar |
| Deixar storage com dados apos falha de refresh | `userStorage.Clear(); tokensStorage.Clear();` |
| Assumir que navegacao mata execucao pendente | Saber que o fluxo continua ate encontrar `return` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
