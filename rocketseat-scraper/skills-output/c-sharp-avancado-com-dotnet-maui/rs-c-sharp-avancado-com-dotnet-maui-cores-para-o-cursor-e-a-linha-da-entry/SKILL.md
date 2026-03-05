---
name: rs-csharp-maui-entry-colors
description: "Applies .NET MAUI resource dictionary color retrieval patterns when customizing Entry controls. Use when user asks to 'customize entry', 'change cursor color', 'style input fields', 'access colors.xaml', or 'create extension methods for colors' in MAUI. Enforces theme-aware color access via Application.Current.Resources with proper casting and extension methods. Make sure to use this skill whenever working with MAUI Entry handlers or resource dictionary color access. Not for CSS styling, Xamarin.Forms, or web input styling."
---

# Cores para Cursor e Linha da Entry no .NET MAUI

> Acesse cores do dicionario de recursos (colors.xaml) via C# usando Application.Current.Resources com extension methods theme-aware.

## Rules

1. **Acesse recursos via Application.Current.Resources["chave"]** — porque e um dicionario chave-valor que espelha o colors.xaml
2. **Faca cast explicito para Color** — o dicionario retorna `object`, mas sabemos que a chave mapeia para uma cor
3. **Use `!` (null-forgiving) em Application.Current** — porque no contexto de handlers, o app ja esta inicializado e current nunca sera nulo
4. **Crie extension methods em classe estatica separada** — pasta `Extensions/`, classe `ApplicationExtensions`, porque centraliza a logica de recuperacao de cores
5. **Determine light/dark mode antes de montar a chave** — use `Application.Current.RequestedTheme == AppTheme.Light` para decidir qual variante da cor usar
6. **Nomeie as chaves exatamente como no colors.xaml** — `PrimaryColorLight`, `PrimaryColorDark`, `LinesColorLight`, `LinesColorDark`, porque sao chaves de dicionario case-sensitive

## How to write

### Extension method para cor theme-aware

```csharp
public static class ApplicationExtensions
{
    public static bool IsLightMode(this Application application)
        => application.RequestedTheme == AppTheme.Light;

    public static Color GetPrimaryColor(this Application application)
    {
        var isLightMode = application.IsLightMode();
        var key = isLightMode ? "PrimaryColorLight" : "PrimaryColorDark";
        return (Color)application.Resources[key];
    }

    public static Color GetLineColor(this Application application)
    {
        var isLightMode = application.IsLightMode();
        var key = isLightMode ? "LinesColorLight" : "LinesColorDark";
        return (Color)application.Resources[key];
    }
}
```

### Uso no Custom Entry Handler

```csharp
// Dentro do handler mapping function
var cursorColor = Application.Current!.GetPrimaryColor();
var lineColor = Application.Current!.GetLineColor();
```

## Example

**Before (hardcoded, sem tema):**
```csharp
var cursorColor = (Color)Application.Current.Resources["PrimaryColorLight"];
// Ignora dark mode, hardcoded key, sem reuso
```

**After (extension method theme-aware):**
```csharp
var cursorColor = Application.Current!.GetPrimaryColor();
var lineColor = Application.Current!.GetLineColor();
// Automaticamente seleciona light/dark, reutilizavel em qualquer handler
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Handler executa N vezes | Normal — executa uma vez por Entry na tela (2 entries = 2 execucoes) |
| Precisa debugar a cor | Use `color.ToHex()` para ver o valor hexadecimal |
| Alpha < 1.0 na cor | Significa transparencia parcial (ex: 0.2 = 20% cor, 80% transparente) |
| Precisa da referencia da Entry no handler | Use o segundo parametro `view` (IEntry) da funcao de mapeamento |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Chave hardcoded no handler | Extension method centralizado |
| Ignorar dark mode | Checar `IsLightMode()` e selecionar chave correta |
| `Application.Current.Resources["key"]` sem cast | `(Color)Application.Current!.Resources[key]` |
| Logica de tema duplicada em cada handler | Um `IsLightMode()` extension reutilizavel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
