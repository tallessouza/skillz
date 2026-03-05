---
name: rs-csharp-maui-popup-light-dark
description: "Enforces correct light/dark mode theming for .NET MAUI Community Toolkit popups. Use when user asks to 'create a popup', 'fix dark mode', 'style a popup', 'add theme support to popup', or builds any CommunityToolkit Popup component. Applies AppThemeBinding for BackgroundColor since popups lack global style support. Make sure to use this skill whenever generating or reviewing .NET MAUI popup code. Not for native MAUI pages, ContentViews, or standard controls that support implicit styles."
---

# Popup Light & Dark Mode no .NET MAUI

> Popups do CommunityToolkit nao suportam estilos globais — defina BackgroundColor com AppThemeBinding diretamente em cada popup.

## Rules

1. **Sempre defina BackgroundColor no popup** — o default e branco independente do tema, porque a biblioteca nao respeita o tema do dispositivo automaticamente
2. **Use AppThemeBinding para cores** — `{AppThemeBinding Light={StaticResource X}, Dark={StaticResource Y}}`, porque e o mecanismo do MAUI para reagir a mudanca de tema
3. **Repita configuracoes em cada popup** — Padding, VerticalOptions, BackgroundColor devem ser definidos individualmente, porque o CommunityToolkit Popup nao suporta estilos implicitos/globais via arquivos de estilo
4. **Teste ambos os modos** — sempre valide Light e Dark Mode antes de subir para producao, porque corrigir um modo pode quebrar o outro
5. **Use as mesmas cores da pagina** — popup e uma "mini pagina", entao siga `PageBackgroundColorLight` / `PageBackgroundColorDark` para consistencia visual

## How to write

### BackgroundColor com AppThemeBinding

```xml
<toolkit:Popup xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    Padding="0"
    VerticalOptions="End"
    BackgroundColor="{AppThemeBinding 
        Light={StaticResource PageBackgroundColorLight}, 
        Dark={StaticResource PageBackgroundColorDark}}">
    <!-- conteudo do popup -->
</toolkit:Popup>
```

### Labels e BoxViews dentro do popup

```xml
<!-- Labels herdam o estilo global, mas confirme que as cores funcionam nos dois temas -->
<Label Text="Opcao 1" />

<!-- Linhas divisorias tambem precisam de AppThemeBinding -->
<BoxView Color="{AppThemeBinding 
    Light={StaticResource LinesColorLight}, 
    Dark={StaticResource LinesColorDark}}" 
    HeightRequest="1" />
```

## Example

**Before (popup invisivel no Dark Mode):**
```xml
<toolkit:Popup Padding="0" VerticalOptions="End">
    <!-- Sem BackgroundColor definido → fundo branco sempre -->
    <!-- Labels com texto branco no dark mode → invisivel -->
    <Label Text="Editar perfil" />
    <BoxView Color="{AppThemeBinding Light={StaticResource LinesColorLight}, Dark={StaticResource LinesColorDark}}" />
</toolkit:Popup>
```

**After (funciona em ambos os modos):**
```xml
<toolkit:Popup Padding="0" VerticalOptions="End"
    BackgroundColor="{AppThemeBinding 
        Light={StaticResource PageBackgroundColorLight}, 
        Dark={StaticResource PageBackgroundColorDark}}">
    <Label Text="Editar perfil" />
    <BoxView Color="{AppThemeBinding Light={StaticResource LinesColorLight}, Dark={StaticResource LinesColorDark}}" />
</toolkit:Popup>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Criando novo popup | Adicione BackgroundColor com AppThemeBinding imediatamente |
| Popup funciona no Light mas nao no Dark | Verifique se BackgroundColor esta definido |
| Tentando criar arquivo de estilo global para popups | Nao funciona — defina inline em cada popup |
| Texto invisivel no popup | Cor do texto e igual ao fundo — ajuste BackgroundColor |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Popup sem BackgroundColor | Sempre defina com AppThemeBinding |
| `BackgroundColor="White"` hardcoded | `BackgroundColor="{AppThemeBinding Light=..., Dark=...}"` |
| Criar PopupStyle.xaml global | Repetir propriedades em cada popup individualmente |
| Testar so no Light Mode | Testar ambos os modos antes de publicar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
