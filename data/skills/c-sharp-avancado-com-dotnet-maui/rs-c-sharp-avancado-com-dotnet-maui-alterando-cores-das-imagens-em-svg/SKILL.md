---
name: rs-csharp-maui-svg-icon-tint
description: "Applies SVG icon tint color techniques in .NET MAUI using CommunityToolkit.Maui IconTintColorBehavior. Use when user asks to 'change icon color', 'tint SVG', 'dynamic icon theme', 'swap image color dark mode', or 'color SVG in MAUI'. Covers XAML and C# approaches with theme-aware binding. Make sure to use this skill whenever working with SVG icons in .NET MAUI that need color changes. Not for PNG/JPG image manipulation, custom drawing, or SkiaSharp rendering."
---

# Alterando Cores de Imagens SVG no .NET MAUI

> Use IconTintColorBehavior do CommunityToolkit.Maui para alterar a cor de icones SVG, nunca manipule PNGs/JPGs dessa forma.

## Rules

1. **Somente SVG** — IconTintColorBehavior so funciona com imagens SVG, porque o comportamento altera o preenchimento vetorial inteiro; PNGs e JPGs serao ignorados
2. **Cor unica por imagem** — O behavior aplica UMA cor a imagem inteira, nao permite colorir areas especificas, porque o pacote nao faz parsing de paths individuais do SVG
3. **Registre o toolkit no MauiProgram** — Chame `.UseMauiCommunityToolkit()` apos `.UseMauiApp()`, porque sem isso o behavior nao sera reconhecido e dara erro silencioso
4. **Prefira AppThemeBinding para temas** — Use `AppThemeBinding` com cores do resource dictionary para Light/Dark, porque garante contraste automatico ao trocar tema
5. **Limpe cache ao instalar** — Se der erro apos instalar o NuGet, feche o IDE e apague as pastas `bin/` e `obj/`, porque cache antigo causa conflitos de versao

## How to write

### Setup no MauiProgram.cs

```csharp
var builder = MauiApp.CreateBuilder();
builder
    .UseMauiApp<App>()
    .UseMauiCommunityToolkit() // DEVE vir apos UseMauiApp
    .ConfigureFonts(fonts => { /* ... */ });
```

### XAML — Tint com cor fixa

```xml
<ContentPage xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit">

<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior TintColor="Red" />
    </Image.Behaviors>
</Image>
```

### XAML — Tint com tema (Light/Dark)

```xml
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}" />
    </Image.Behaviors>
</Image>
```

### C# Code-Behind

```csharp
var behavior = new IconTintColorBehavior
{
    TintColor = Colors.White
};
myImage.Behaviors.Add(behavior);
```

## Example

**Before (imagem estatica, sem contraste no dark mode):**
```xml
<Image Source="icon_eye.svg" />
```

**After (cor adaptativa por tema):**
```xml
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}" />
    </Image.Behaviors>
</Image>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Icone precisa mudar cor por tema | Use AppThemeBinding com IconTintColorBehavior |
| Icone com cor fixa | Passe TintColor direto no XAML |
| Precisa alterar cor em runtime | Use code-behind com Behaviors.Add |
| Imagem e PNG/JPG | NAO use IconTintColorBehavior — use imagens separadas por tema |
| Precisa colorir areas especificas do SVG | NAO e possivel com esse pacote — considere imagens separadas |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Ter multiplas copias do mesmo icone em cores diferentes | Uma imagem SVG + IconTintColorBehavior |
| Fechar a tag Image de forma simplificada `<Image ... />` ao usar behavior | Fechar de forma estendida `<Image>...</Image>` |
| Chamar UseMauiCommunityToolkit antes de UseMauiApp | Chamar APOS UseMauiApp |
| Tentar usar IconTintColorBehavior em PNG | Converter imagem para SVG primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
