---
name: rs-csharp-maui-temas-light-dark
description: "Applies Light/Dark theme configuration patterns when building .NET MAUI applications. Use when user asks to 'add dark mode', 'implement themes', 'switch themes', 'configure light dark mode', or 'style MAUI app for themes'. Enforces AppThemeBinding for colors, images, and text instead of hardcoded values. Covers runtime theme detection and switching via Application.Current. Make sure to use this skill whenever generating XAML styles or configuring visual properties in .NET MAUI. Not for CSS theming, web apps, or Xamarin.Forms legacy projects."
---

# Temas Light/Dark no .NET MAUI

> Nunca use valores fixos de cor, imagem ou texto em XAML — use AppThemeBinding para que o app responda corretamente ao tema do dispositivo.

## Rules

1. **Sempre use AppThemeBinding para propriedades visuais** — `{AppThemeBinding Dark=Yellow, Light=Blue}` nao valores fixos, porque dispositivos podem forcar Dark Mode e inverter cores de forma horrivel
2. **Nao confie na inversao automatica de cores** — o sistema inverte de forma imprevisivel (algumas cores somem), entao declare explicitamente cada valor por tema
3. **AppThemeBinding funciona com qualquer propriedade** — BackgroundColor, TextColor, Source (imagens), Text, FontSize — nao e exclusivo de cores
4. **Strings diretas usam aspas simples** — `{AppThemeBinding Light='Oi do light', Dark='Oi do dark'}`, porque XAML exige essa sintaxe dentro de chaves
5. **Resources usam sintaxe StaticResource** — `{AppThemeBinding Light={StaticResource FileResource.Text}, Dark={StaticResource FileResource.Other}}` quando o valor vem de arquivo de resource
6. **Detecte o tema atual via C#** — `Application.Current.RequestedTheme` retorna o enum do tema atual do dispositivo
7. **Alterne temas em runtime via C#** — `Application.Current.UserAppTheme = AppTheme.Dark` forca o app a usar determinado tema

## How to write

### AppThemeBinding em XAML

```xml
<!-- Cor de fundo que responde ao tema -->
<Button BackgroundColor="{AppThemeBinding Dark=Yellow, Light=Blue}"
        Text="{AppThemeBinding Light='Login', Dark='Login'}"
        TextColor="{AppThemeBinding Dark=White, Light=Black}" />

<!-- Imagem que troca conforme o tema -->
<Image Source="{AppThemeBinding Light=hero_image.png, Dark=dark_hero.png}" />
```

### Chavear tema em runtime (C#)

```csharp
// Detectar tema atual
AppTheme currentTheme = Application.Current.RequestedTheme;

// Alternar entre temas
Application.Current.UserAppTheme =
    currentTheme == AppTheme.Dark ? AppTheme.Light : AppTheme.Dark;
```

## Example

**Before (problema — valor fixo):**
```xml
<Button BackgroundColor="Red" Text="Login" TextColor="Black" />
<!-- Dispositivo forca Dark Mode → cores invertidas de forma imprevisivel -->
```

**After (com AppThemeBinding):**
```xml
<Button BackgroundColor="{AppThemeBinding Dark=Yellow, Light=Blue}"
        Text="{AppThemeBinding Light='Login com email', Dark='Login com email'}"
        TextColor="{AppThemeBinding Dark=White, Light=Black}" />
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Qualquer propriedade visual em XAML | Usar AppThemeBinding com valores para Light e Dark |
| Precisa saber o tema atual no code-behind | `Application.Current.RequestedTheme` |
| Precisa forcar um tema especifico | `Application.Current.UserAppTheme = AppTheme.X` |
| Texto vem de resource file | Usar sintaxe `{StaticResource ...}` dentro do AppThemeBinding |
| Texto e string literal | Usar aspas simples dentro do AppThemeBinding |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `BackgroundColor="Black"` (fixo) | `BackgroundColor="{AppThemeBinding Dark=..., Light=...}"` |
| Confiar na inversao automatica do SO | Declarar explicitamente cada valor por tema |
| Ignorar configuracao de tema | Sempre configurar — dispositivos forcam Dark Mode |
| Setar cor sem testar ambos os temas | Testar Light e Dark antes de publicar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
