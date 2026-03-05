---
name: rs-csharp-dotnet-maui-popup-navigation-service
description: "Enforces centralization of popup display logic through NavigationService with generic type constraints in .NET MAUI. Use when user asks to 'show popup', 'create popup service', 'refactor popup code', 'add generic constraints', or 'centralize UI logic in MAUI'. Applies patterns: extract popup logic from ViewModel to NavigationService, generic TViewModel/TResult parameters, where constraints for type safety. Make sure to use this skill whenever organizing popup or dialog code in .NET MAUI projects. Not for alert/notification handling, navigation between pages, or non-MAUI popup implementations."
---

# Centralizar PopUps via NavigationService com Tipos Genericos

> Extraia logica de exibicao de popups das ViewModels para o NavigationService usando tipos genericos com constraints, garantindo reuso, padronizacao visual e seguranca de tipos.

## Rules

1. **Nunca deixe codigo de popup na ViewModel** — extraia para NavigationService, porque copiar PopupOptions em cada ViewModel gera estilos inconsistentes e duplicacao
2. **Use tipos genericos na funcao ShowPopup** — `ShowPopup<TViewModel, TResult>()` permite reutilizar a mesma funcao para qualquer popup do app
3. **Aplique where constraints no TViewModel** — `where TViewModel : ViewModelBaseForPopup` impede que tipos invalidos (int, bool, string) sejam passados, porque causariam erro em tempo de execucao
4. **Aplique where constraints no TResult** — `where TResult : notnull` garante que o resultado nunca seja nulo, evitando NullReferenceExceptions
5. **Mantenha a interface INavigationService sincronizada** — a assinatura na interface deve ser identica a da implementacao, incluindo constraints
6. **Injete PopupService no NavigationService** — via injecao de dependencia, nao na ViewModel, porque centraliza a dependencia em um unico lugar

## How to write

### Funcao generica no NavigationService

```csharp
public async Task<TResult> ShowPopup<TViewModel, TResult>()
    where TViewModel : ViewModelBaseForPopup
    where TResult : notnull
{
    var options = new PopupOptions
    {
        // Configuracoes padronizadas para todos os popups
    };

    var result = await PopupService.ShowPopupAsync<TViewModel>(options);

    return result.Result!;
}
```

### Interface INavigationService

```csharp
public interface INavigationService
{
    Task<TResult> ShowPopup<TViewModel, TResult>()
        where TViewModel : ViewModelBaseForPopup
        where TResult : notnull;
}
```

### Chamada na ViewModel

```csharp
var optionSelected = await _navigationService
    .ShowPopup<OptionsForProfileForViewModel, ChooseFileOption>();
```

## Example

**Before (codigo na ViewModel — duplicado e acoplado):**

```csharp
public class UserProfileViewModel
{
    private readonly IPopupService _popupService;

    private async Task ChangeProfilePhoto()
    {
        var options = new PopupOptions { /* config */ };
        var result = await _popupService
            .ShowPopupAsync<OptionsForProfileForViewModel>(options);
        var chosenOption = (ChooseFileOption)result.Result;
    }
}
```

**After (centralizado no NavigationService com generics):**

```csharp
// NavigationService.cs
public async Task<TResult> ShowPopup<TViewModel, TResult>()
    where TViewModel : ViewModelBaseForPopup
    where TResult : notnull
{
    var options = new PopupOptions { /* config padronizado */ };
    var result = await PopupService.ShowPopupAsync<TViewModel>(options);
    return result.Result!;
}

// UserProfileViewModel.cs
private async Task ChangeProfilePhoto()
{
    var optionSelected = await _navigationService
        .ShowPopup<OptionsForProfileForViewModel, ChooseFileOption>();
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova ViewModel precisa exibir popup | Chame `_navigationService.ShowPopup<T, R>()`, nunca instancie PopupOptions na ViewModel |
| Popup retorna enum como resultado | Passe o enum como TResult: `ShowPopup<VM, MyEnum>()` |
| Popup retorna classe como resultado | Passe a classe como TResult: `ShowPopup<VM, MyClass>()` |
| Novo popup no app | Crie ViewModel herdando de `ViewModelBaseForPopup` — o constraint garante que so essas passam |
| Multiplos constraints necessarios | Encadeie com quebra de linha: `where T1 : Base` na linha seguinte `where T2 : notnull` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `_popupService.ShowPopupAsync<VM>(options)` direto na ViewModel | `_navigationService.ShowPopup<VM, Result>()` |
| `ShowPopup<int>()` ou `ShowPopup<bool>()` sem constraint | `where TViewModel : ViewModelBaseForPopup` bloqueia isso |
| `(ChooseFileOption)result.Result` com cast manual | Tipo generico TResult elimina necessidade de cast |
| PopupOptions duplicado em cada ViewModel | Configuracao unica centralizada no NavigationService |
| `result.Result` sem garantia de nao-nulo | `where TResult : notnull` + operador `!` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
