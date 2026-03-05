---
name: rs-csharp-maui-ios-entry-customization
description: "Applies iOS-specific Entry customization patterns in .NET MAUI when writing custom handlers or platform-specific code. Use when user asks to 'customize entry on iOS', 'change cursor color iOS', 'style entry border iOS MAUI', or 'platform-specific handler code'. Covers border color, border width, corner radius, cursor tint color, and transparent background using conditional compilation. Make sure to use this skill whenever implementing iOS entry styling in .NET MAUI. Not for Android entry customization, general XAML styling, or cross-platform shared code."
---

# Customizacao de Entry no iOS com .NET MAUI

> Ao customizar entries no iOS via handlers, configure border color, border width, corner radius, tint color e background color usando null-conditional operators e compilacao condicional.

## Rules

1. **Use null-conditional operator (`?.`)** — `handler?.PlatformView?.Layer.BorderColor` nao `if (handler != null && handler.PlatformView != null)`, porque reduz verbosidade sem perder seguranca
2. **Use `#elif` para plataformas adicionais** — `#elif IOS || MACCATALYST` nao outro `#if`, porque mantem a condicional de compilacao limpa e cobre iOS e Mac simultaneamente
3. **Sempre defina `BorderWidth`** — valor default e zero, sem definir a borda nao aparece mesmo com cor configurada
4. **Sempre defina `CornerRadius`** — valor default e zero, sem definir a entry fica quadrada perdendo o visual arredondado
5. **Sempre defina `BackgroundColor = UIColor.Clear`** — ao alterar layer properties, o iOS infere background preto, quebrando o Dark Mode
6. **Use `ToCGColor()` para `BorderColor`** — tipo esperado e `CGColor`, nao `UIColor`; `ToPlatform()` retorna `UIColor` e causa erro de compilacao
7. **Use `ToPlatform()` para `TintColor`** — tipo esperado e `UIColor`, que e exatamente o que `ToPlatform()` retorna

## How to write

### Customizacao completa de Entry no iOS

```csharp
#elif IOS || MACCATALYST
handler?.PlatformView?.Layer.BorderColor = lineColor.ToCGColor();
handler?.PlatformView?.Layer.BorderWidth = 1f;
handler?.PlatformView?.Layer.CornerRadius = 7f;
handler?.PlatformView?.TintColor = cursorColor.ToPlatform();
handler?.PlatformView?.BackgroundColor = UIColor.Clear;
#endif
```

### Simplificacao de null-check com `?.`

```csharp
// ANTES: if verboso
if (handler != null && handler.PlatformView != null)
{
    handler.PlatformView.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
    handler.PlatformView.Background?.SetTint(lineColor.ToPlatform());
}

// DEPOIS: null-conditional operator
handler?.PlatformView?.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
handler?.PlatformView?.Background?.SetTint(lineColor.ToPlatform());
```

## Example

**Before (entry sem customizacao iOS):**
```csharp
#if ANDROID
handler?.PlatformView?.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
handler?.PlatformView?.Background?.SetTint(lineColor.ToPlatform());
#endif
// iOS: cursor azul default, sem borda customizada
```

**After (com customizacao iOS completa):**
```csharp
#if ANDROID
handler?.PlatformView?.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
handler?.PlatformView?.Background?.SetTint(lineColor.ToPlatform());
#elif IOS || MACCATALYST
handler?.PlatformView?.Layer.BorderColor = lineColor.ToCGColor();
handler?.PlatformView?.Layer.BorderWidth = 1f;
handler?.PlatformView?.Layer.CornerRadius = 7f;
handler?.PlatformView?.TintColor = cursorColor.ToPlatform();
handler?.PlatformView?.BackgroundColor = UIColor.Clear;
#endif
```

## Heuristics

| Situacao | Faca |
|----------|------|
| BorderColor nao aparece | Verifique se `BorderWidth` esta definido (default = 0) |
| Entry ficou quadrada | Adicione `CornerRadius` (ex: 7f) |
| Background preto no Dark Mode | Adicione `BackgroundColor = UIColor.Clear` |
| Erro de tipo em BorderColor | Use `ToCGColor()` ao inves de `ToPlatform()` |
| Codigo iOS tambem serve para Mac | Use `#elif IOS \|\| MACCATALYST` |
| Valores float como BorderWidth | Adicione sufixo `f` (ex: `1f`, `0.7f`) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `lineColor.ToPlatform()` em `BorderColor` | `lineColor.ToCGColor()` |
| `#if IOS` separado do Android | `#elif IOS \|\| MACCATALYST` na mesma condicional |
| Alterar border sem `BackgroundColor = UIColor.Clear` | Sempre incluir para evitar fundo preto |
| `if (handler != null && handler.PlatformView != null)` | `handler?.PlatformView?.Property` |
| Definir `BorderColor` sem `BorderWidth` | Sempre definir ambos |
| Definir `BorderWidth` sem `CornerRadius` | Sempre definir ambos para manter visual arredondado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
