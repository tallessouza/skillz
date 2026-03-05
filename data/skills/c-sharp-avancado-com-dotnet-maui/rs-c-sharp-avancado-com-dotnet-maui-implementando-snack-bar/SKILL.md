---
name: rs-csharp-maui-implementando-snack-bar
description: "Generates SnackBar alerts in .NET MAUI with full customization options. Use when user asks to 'show alert', 'display snackbar', 'create notification', 'show feedback message', or 'implement toast alternative' in .NET MAUI projects. Applies SnackBar.Make pattern with action buttons, duration, visual options, and anchor positioning. Make sure to use this skill whenever implementing user feedback alerts in .NET MAUI. Not for system notifications, push notifications, or DisplayAlert dialogs."
---

# SnackBar em .NET MAUI

> Utilize SnackBar como alerta preferencial em .NET MAUI por oferecer customizacao visual e acoes interativas superiores ao Toast.

## Rules

1. **Use SnackBar ao inves de Toast** — SnackBar oferece customizacao de cores, fontes, duracao e botao de acao, porque Toast nao permite praticamente nenhuma personalizacao
2. **Sempre passe uma duracao razoavel** — use `TimeSpan.FromSeconds(3)` como padrao, porque 10 segundos prende o usuario sem necessidade
3. **Mantenha o botao de fechar mesmo sem acao** — passe texto "Fechar" com action null para permitir dismiss manual, porque sem botao o usuario fica preso ate o timeout
4. **Extraia cores dos recursos da aplicacao** — use metodos de extensao como `GetHighlightColor()` e `GetSecondaryColor()`, porque garante consistencia com light/dark mode
5. **SnackBar.Make eh assincrono** — sempre use `await` no `Show()`, porque eh uma operacao assincrona

## How to write

### SnackBar basico com acao

```csharp
// Criar fonte customizada
var fonte = Microsoft.Maui.Font.OfSize("MainFontRegular", 14);

// Configurar opcoes visuais
var options = new SnackBarOptions
{
    BackgroundColor = Application.Current!.GetHighlightColor(),
    TextColor = Application.Current!.GetSecondaryColor(),
    ActionButtonTextColor = Application.Current!.GetSecondaryColor(),
    CornerRadius = 8,
    Font = fonte,
    ActionButtonFont = fonte,
    CharacterSpacing = 0.10
};

// Definir duracao
var duration = TimeSpan.FromSeconds(3);

// Criar e exibir
var snackbar = SnackBar.Make(
    "Dados atualizados com sucesso",
    action: () => ExecutarDesfazer(),
    actionButtonText: "Desfazer",
    duration: duration,
    visualOptions: options
);

await snackbar.Show();
```

### SnackBar sem acao (apenas fechar)

```csharp
var snackbar = SnackBar.Make(
    "Operacao realizada com sucesso",
    action: null,
    actionButtonText: "Fechar"
);

await snackbar.Show();
```

### SnackBar sem botao

```csharp
// Passa string vazia para ocultar o botao
var snackbar = SnackBar.Make(
    "Dados salvos",
    action: null,
    actionButtonText: string.Empty
);

await snackbar.Show();
```

## Example

**Before (usando Toast sem customizacao):**
```csharp
var toast = Toast.Make("Salvo com sucesso");
await toast.Show();
// Sem cores, sem botao, sem controle de duracao
```

**After (SnackBar customizado):**
```csharp
var options = new SnackBarOptions
{
    BackgroundColor = Application.Current!.GetHighlightColor(),
    TextColor = Application.Current!.GetSecondaryColor(),
    CornerRadius = 8
};

var snackbar = SnackBar.Make(
    "Dados atualizados com sucesso",
    action: null,
    actionButtonText: "Fechar",
    duration: TimeSpan.FromSeconds(3),
    visualOptions: options
);

await snackbar.Show();
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Feedback de sucesso simples | SnackBar com botao "Fechar", duracao 3s |
| Operacao reversivel (salvar, deletar) | SnackBar com botao "Desfazer" e action implementada |
| Feedback sem necessidade de interacao | SnackBar com `actionButtonText: string.Empty` |
| Posicionar perto de um componente | Passe o componente via parametro `anchor` (mais util em code-behind que em ViewModel) |
| Light/Dark mode | Use metodos de extensao para buscar cores do resource dictionary |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `duration: TimeSpan.FromSeconds(10)` | `duration: TimeSpan.FromSeconds(3)` |
| Cores hardcoded no SnackBarOptions | `Application.Current!.GetHighlightColor()` |
| Toast para feedback que precisa de acao | SnackBar com action button |
| Omitir botao de fechar sem motivo | Sempre oferecer forma de dismiss manual |
| Repetir codigo de SnackBar em cada ViewModel | Extrair para NavigationService ou helper |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
