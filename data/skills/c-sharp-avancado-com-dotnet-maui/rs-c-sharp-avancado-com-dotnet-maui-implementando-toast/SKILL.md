---
name: rs-csharp-maui-implementando-toast
description: "Applies .NET MAUI Toast alert pattern using CommunityToolkit.Maui when writing notification or feedback code. Use when user asks to 'show a toast', 'display alert', 'notify user', 'show feedback message', or 'implement toast in MAUI'. Covers Toast.Make configuration, duration, font size, and async display. Make sure to use this skill whenever implementing simple user feedback in .NET MAUI apps. Not for custom popups, snackbars, or complex styled alerts."
---

# Toast no .NET MAUI

> Usar Toast para feedback simples e temporario ao usuario, via CommunityToolkit.Maui.

## Rules

1. **Use o namespace correto** — `CommunityToolkit.Maui.Alerts`, nunca `Android.Widgets.Toast`, porque o Android tem uma classe Toast nativa que causa confusao no IntelliSense
2. **Toast.Make e estatico** — chame diretamente `Toast.Make(...)` sem instanciar a classe, porque e um factory method
3. **Show e async** — sempre use `await toast.Show()`, porque a exibicao e assincrona
4. **Mensagem e obrigatoria, resto e opcional** — duration e fontSize tem defaults (Short=2s, fontSize=14), so passe se precisar alterar
5. **Nao use Toast quando precisar de personalizacao visual** — Toast nao permite alterar cor de fundo, cor de texto, nem remover o icone do app, porque e um alerta minimalista sem controle visual

## How to write

### Toast basico (defaults)

```csharp
using CommunityToolkit.Maui.Alerts;

var toast = Toast.Make("Operacao realizada com sucesso!");
await toast.Show();
```

### Toast com duracao e fonte customizados

```csharp
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;

var toast = Toast.Make(
    "Perfil atualizado com sucesso!",
    duration: ToastDuration.Long,
    textSize: 24
);
await toast.Show();
```

## Example

**Before (sem feedback ao usuario):**
```csharp
if (result.IsSuccess)
{
    // nada acontece — usuario nao sabe se funcionou
}
```

**After (com Toast):**
```csharp
if (result.IsSuccess)
{
    var toast = Toast.Make(
        "Perfil atualizado com sucesso!",
        duration: ToastDuration.Long,
        textSize: 24
    );
    await toast.Show();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Feedback simples sem acao do usuario | Toast com duracao Short (2s) |
| Mensagem que precisa de mais tempo de leitura | Toast com duracao Long (3.5s) |
| Precisa de cor customizada ou botao de acao | NAO use Toast — use Snackbar ou popup customizado |
| Plataforma Windows | Configure dependencias extras conforme documentacao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `using Android.Widgets` para Toast | `using CommunityToolkit.Maui.Alerts` |
| `Toast.Make(msg).Show()` sem await | `await Toast.Make(msg).Show()` |
| Toast para erros criticos que exigem acao | Use Dialog ou popup customizado |
| Toast com informacao longa demais | Limite a 1 frase curta, use popup para mais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
