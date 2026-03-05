---
name: rs-csharp-maui-status-bar-styling
description: "Applies .NET MAUI status bar color and style customization using CommunityToolkit. Use when user asks to 'change status bar color', 'style status bar', 'customize status bar in MAUI', or 'match status bar to page background'. Covers StatusBarBehavior setup, light/dark theme handling, and navigation inheritance strategy. Make sure to use this skill whenever working with .NET MAUI app theming that involves the device status bar. Not for navigation bar styling, tab bar customization, or non-MAUI mobile frameworks."
---

# Status Bar Styling no .NET MAUI

> Defina cor e estilo da status bar apenas nas paginas raiz — as navegacoes subsequentes herdam automaticamente.

## Rules

1. **Use CommunityToolkit.Maui** — o pacote `CommunityToolkit.Maui` fornece `StatusBarBehavior`, porque nao existe API nativa simples no MAUI para isso
2. **Declare apenas nas paginas raiz** — OnBoard e Dashboard sao as unicas que precisam do codigo, porque todas as navegacoes subsequentes herdam a ultima definicao
3. **StatusBarColor aceita qualquer cor** — use `AppThemeBinding` para alternar entre Light e Dark automaticamente
4. **StatusBarStyle so tem duas opcoes** — `LightContent` (icones claros) ou `DarkContent` (icones escuros), porque e um enum fixo
5. **Inverta o StatusBarStyle em relacao ao tema** — no Light mode use `DarkContent` (icones escuros sobre fundo claro), no Dark mode use `LightContent` (icones claros sobre fundo escuro), porque o objetivo e contraste

## How to write

### Namespace XAML

```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

### StatusBarBehavior com AppThemeBinding

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior
        StatusBarColor="{AppThemeBinding
            Light={StaticResource PageBackgroundColorLight},
            Dark={StaticResource PageBackgroundColorDark}}"
        StatusBarStyle="{AppThemeBinding
            Light=DarkContent,
            Dark=LightContent}" />
</ContentPage.Behaviors>
```

### Cor fixa (sem tema)

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior StatusBarColor="Red" />
</ContentPage.Behaviors>
```

## Example

**Before (status bar com cor padrao do sistema):**
```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">
    <!-- Sem StatusBarBehavior — barra de status ignora tema do app -->
</ContentPage>
```

**After (status bar integrada ao tema):**
```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit">

    <ContentPage.Behaviors>
        <toolkit:StatusBarBehavior
            StatusBarColor="{AppThemeBinding
                Light={StaticResource PageBackgroundColorLight},
                Dark={StaticResource PageBackgroundColorDark}}"
            StatusBarStyle="{AppThemeBinding
                Light=DarkContent,
                Dark=LightContent}" />
    </ContentPage.Behaviors>

    <!-- resto do conteudo -->
</ContentPage>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina e raiz do app (OnBoard, Dashboard) | Adicione StatusBarBehavior |
| Pagina intermediaria na navegacao | Nao adicione — herda da pagina anterior |
| Pagina intermediaria precisa de cor diferente | Adicione StatusBarBehavior — mas saiba que ao voltar, a cor anterior so restaura se a pagina anterior tambem define |
| App suporta Light e Dark mode | Use AppThemeBinding para cor E estilo |
| App so tem um tema | Use cor fixa diretamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Declarar StatusBarBehavior em todas as paginas | Declarar apenas nas paginas raiz (OnBoard, Dashboard) |
| `Light=LightContent, Dark=DarkContent` | `Light=DarkContent, Dark=LightContent` (invertido para contraste) |
| Esquecer o namespace `toolkit` | Adicionar `xmlns:toolkit` no ContentPage |
| Confundir StatusBarStyle com tema do dispositivo | StatusBarStyle controla a cor dos ICONES, nao o fundo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
