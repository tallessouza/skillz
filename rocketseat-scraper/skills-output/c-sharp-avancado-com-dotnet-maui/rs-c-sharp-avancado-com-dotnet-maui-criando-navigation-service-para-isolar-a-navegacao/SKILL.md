---
name: rs-csharp-maui-navigation-service
description: "Enforces navigation isolation via service pattern in .NET MAUI ViewModels. Use when user asks to 'add navigation', 'navigate between pages', 'create ViewModel', 'refactor Shell.Current', or 'make ViewModel testable'. Applies rules: never call Shell.Current directly in ViewModels, create INavigationService interface, register as singleton in DI, receive via constructor injection. Make sure to use this skill whenever writing .NET MAUI navigation code or creating new ViewModels. Not for Blazor routing, ASP.NET navigation, or non-MAUI frameworks."
---

# Navigation Service para Isolar Navegacao em .NET MAUI

> Nunca chame Shell.Current diretamente na ViewModel — isole a navegacao em um servico com interface para permitir injecao de dependencia e testabilidade.

## Rules

1. **Nunca use Shell.Current na ViewModel** — `_navigationService.GoToAsync(state)` nao `Shell.Current.GoToAsync(route)`, porque Shell.Current so existe com o app executando e quebra testes de unidade
2. **Crie uma interface INavigationService** — declare o contrato de navegacao como interface, porque permite mock nos testes e desacopla da implementacao MAUI
3. **Copie a assinatura exata do Shell** — use `ShellNavigationState` como parametro, nao `string`, porque o Shell espera esse tipo especifico
4. **Registre como Singleton no DI** — navegacao nao precisa de instancia nova a cada uso, reutilize durante todo o ciclo de vida do app
5. **Receba via construtor na ViewModel** — propriedade privada `readonly` com prefixo underscore, porque garante imutabilidade e segue convencao Microsoft

## How to write

### Interface de navegacao

```csharp
public interface INavigationService
{
    Task GoToAsync(ShellNavigationState state);
}
```

### Implementacao do servico

```csharp
public class NavigationService : INavigationService
{
    public async Task GoToAsync(ShellNavigationState state) =>
        await Shell.Current.GoToAsync(state);
}
```

### Registro no MauiProgram

```csharp
private static MauiAppBuilder AddNavigationService(this MauiAppBuilder appBuilder)
{
    appBuilder.Services.AddSingleton<INavigationService, NavigationService>();
    return appBuilder;
}
```

### ViewModel com injecao

```csharp
public class OnBoardViewModel
{
    private readonly INavigationService _navigationService;

    public OnBoardViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    // Nos comandos:
    await _navigationService.GoToAsync(RoutePages.LoginPage);
}
```

## Example

**Before (Shell.Current direto na ViewModel):**
```csharp
public class OnBoardViewModel
{
    [RelayCommand]
    async Task GoToLogin()
    {
        await Shell.Current.GoToAsync(RoutePages.LoginPage);
    }

    [RelayCommand]
    async Task GoToRegister()
    {
        await Shell.Current.GoToAsync(RoutePages.RegisterPage);
    }
}
```

**After (com NavigationService isolado):**
```csharp
public class OnBoardViewModel
{
    private readonly INavigationService _navigationService;

    public OnBoardViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    async Task GoToLogin()
    {
        await _navigationService.GoToAsync(RoutePages.LoginPage);
    }

    [RelayCommand]
    async Task GoToRegister()
    {
        await _navigationService.GoToAsync(RoutePages.RegisterPage);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova ViewModel precisa navegar | Receba INavigationService no construtor |
| Teste de unidade para ViewModel | Passe mock de INavigationService |
| Multiplas ViewModels navegam | Todas recebem o mesmo singleton via DI |
| Novo metodo de navegacao necessario | Adicione na interface primeiro, depois implemente |
| Pasta navigation ja existe no projeto | Coloque interface e classe la |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Shell.Current.GoToAsync(...)` na ViewModel | `_navigationService.GoToAsync(...)` |
| `GoToAsync(string route)` na interface | `GoToAsync(ShellNavigationState state)` |
| `AddTransient<NavigationService>()` | `AddSingleton<INavigationService, NavigationService>()` |
| Navegacao sem interface | Sempre via INavigationService |
| Propriedade publica para o servico | `private readonly INavigationService _navigationService` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
