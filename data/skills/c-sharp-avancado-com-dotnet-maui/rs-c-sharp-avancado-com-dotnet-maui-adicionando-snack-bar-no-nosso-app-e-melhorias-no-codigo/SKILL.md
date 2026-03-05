---
name: rs-csharp-maui-snackbar-navigation-service
description: "Enforces centralized alert/feedback logic in .NET MAUI apps by encapsulating SnackBar and navigation actions in a service layer. Use when user asks to 'add snackbar', 'show feedback', 'create alert', 'refactor navigation', or 'centralize UI logic' in MAUI/Xamarin. Applies rules: no hardcoded UI feedback in ViewModels, wrap shell navigation syntax in named methods, use resource text for all strings. Make sure to use this skill whenever implementing user feedback or navigation helpers in .NET MAUI. Not for web apps, Blazor, or non-MAUI notification systems."
---

# SnackBar e Centralização de Navegação no Navigation Service

> Encapsule toda lógica de alertas e navegação Shell em métodos nomeados no NavigationService — ViewModels apenas chamam métodos com nomes descritivos.

## Rules

1. **Nunca instancie SnackBar na ViewModel** — crie um método no NavigationService que recebe apenas a mensagem, porque duplicar configuração de cores/fontes em cada ViewModel gera inconsistência visual e dificulta manutenção
2. **Nunca use strings hardcoded para textos de UI** — use ResourceText (arquivos .resx), porque isso habilita traduções e centraliza alterações de texto
3. **Encapsule sintaxes de navegação Shell em métodos nomeados** — `ClosePage()` em vez de `GoToAsync("..")`, `GoToDashboardPage()` em vez de `GoToAsync("//DashboardPage")`, porque a sintaxe Shell é críptica e mudanças futuras da Microsoft quebrariam código espalhado
4. **Declare a assinatura na interface antes de usar** — todo método novo no NavigationService precisa estar na INavigationService, senão a ViewModel não consegue acessar via injeção de dependência
5. **Coloque ações pós-sucesso dentro do bloco if de sucesso** — fechar página após operação bem-sucedida deve estar dentro do `if (success)`, nunca após o else, porque senão executa independente do resultado

## How to write

### Método de feedback no NavigationService

```csharp
public async Task ShowSuccessFeedback(string message)
{
    var snackbarOptions = new SnackbarOptions
    {
        BackgroundColor = AppColors.SecondaryColor,
        TextColor = Colors.White,
        CornerRadius = 10,
        ActionButtonTextColor = AppColors.SecondaryColor,
        Font = FontConstants.MainFontBlack,
        ActionButtonFont = FontConstants.SecondaryFontRegular,
        CharacterSpacing = 0.1
    };

    var snackbar = Snackbar.Make(
        message,
        action: null,
        actionButtonText: ResourceText.TitleClose,
        duration: TimeSpan.FromSeconds(3),
        snackbarOptions);

    await snackbar.Show();
}
```

### Métodos de navegação encapsulados

```csharp
public async Task ClosePage()
{
    await GoToAsync("..");
}

public async Task GoToDashboardPage()
{
    await GoToAsync("//DashboardPage");
}
```

### Chamada na ViewModel

```csharp
if (success)
{
    await _navigationService.ShowSuccessFeedback(ResourceText.PasswordChangedSuccess);
    await _navigationService.ClosePage();
}
```

## Example

**Before (configuração duplicada nas ViewModels):**
```csharp
// UserProfileViewModel.cs
var options = new SnackbarOptions { BackgroundColor = Colors.Green, /* ... */ };
var snackbar = Snackbar.Make("Dados atualizados com sucesso", null, "Fechar", TimeSpan.FromSeconds(3), options);
await snackbar.Show();

// ChangeUserPasswordViewModel.cs — mesma coisa copiada
var options = new SnackbarOptions { BackgroundColor = Colors.Blue, /* cores diferentes! */ };
var snackbar = Snackbar.Make("Senha alterada", null, "Fechar", TimeSpan.FromSeconds(3), options);
await snackbar.Show();
await Shell.Current.GoToAsync(".."); // fora do if de sucesso!
```

**After (centralizado no NavigationService):**
```csharp
// UserProfileViewModel.cs
if (success)
    await _navigationService.ShowSuccessFeedback(ResourceText.ProfileUpdatedSuccess);

// ChangeUserPasswordViewModel.cs
if (success)
{
    await _navigationService.ShowSuccessFeedback(ResourceText.PasswordChangedSuccess);
    await _navigationService.ClosePage();
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa exibir feedback de sucesso | Chame `ShowSuccessFeedback(message)` do NavigationService |
| Precisa de feedback de erro (futuro) | Crie `ShowErrorFeedback(message)` com cores/config próprias |
| Precisa fechar página atual | Chame `ClosePage()` em vez de `GoToAsync("..")` |
| Precisa trocar página raiz | Crie método nomeado como `GoToDashboardPage()` |
| Novo método no service | Adicione assinatura na interface primeiro |
| Ação pós-operação (fechar, navegar) | Coloque dentro do `if (success)`, nunca fora |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `new SnackbarOptions { ... }` na ViewModel | `_navigationService.ShowSuccessFeedback(msg)` |
| `Snackbar.Make("texto hardcoded", ...)` | `Snackbar.Make(ResourceText.Key, ...)` |
| `await Shell.Current.GoToAsync("..")` | `await _navigationService.ClosePage()` |
| `await Shell.Current.GoToAsync("//Page")` | `await _navigationService.GoToPageName()` |
| `await _navigationService.ClosePage()` fora do if | Dentro do `if (success) { ... }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
