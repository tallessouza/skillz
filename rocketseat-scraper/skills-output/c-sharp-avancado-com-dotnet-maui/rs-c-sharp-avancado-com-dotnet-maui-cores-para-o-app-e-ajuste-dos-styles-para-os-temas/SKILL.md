---
name: rs-csharp-maui-cores-temas-styles
description: "Enforces color theming patterns in .NET MAUI apps using Resource Dictionaries and AppThemeBinding. Use when user asks to 'add dark mode', 'implement themes', 'organize colors in MAUI', 'create color resources', or 'style XAML for light and dark mode'. Applies rules: separate color file, LIGHT/DARK suffix convention, alpha prefix for transparency, correct import order in App.xaml. Make sure to use this skill whenever working with .NET MAUI theming or color management. Not for CSS styling, web themes, or non-XAML frameworks."
---

# Cores e Temas em .NET MAUI

> Organize cores em um Resource Dictionary separado, com sufixos LIGHT/DARK, e use AppThemeBinding para chavear entre temas.

## Rules

1. **Crie um Resource Dictionary XAML exclusivo para cores** — `Resources/Styles/Colors.xaml`, porque misturar cores com estilos dificulta manutenção e reuso
2. **Remova o code-behind e o x:Class** — o dicionário de cores não precisa de lógica; deixar x:Class sem code-behind causa exceção
3. **Use convenção NOME_COLOR_LIGHT / NOME_COLOR_DARK** — `HIGHLIGHT_COLOR_LIGHT`, `HIGHLIGHT_COLOR_DARK`, porque padroniza e torna explícito qual cor pertence a qual tema
4. **Importe Colors.xaml ANTES dos estilos no App.xaml** — os estilos referenciam as cores via StaticResource; se Colors vier depois, causa exceção de recurso não encontrado
5. **Use prefixo alfa hexadecimal para transparência** — `#80000000` = preto 50%, `#33FFFFFF` = branco 20%, porque são 8 caracteres hex (2 alfa + 6 cor) conforme tabela de alfa
6. **Use AppThemeBinding nos estilos, não cores fixas** — `AppThemeBinding Light={StaticResource X_LIGHT}, Dark={StaticResource X_DARK}`, porque permite chaveamento automático de tema

## How to write

### Resource Dictionary de cores

```xml
<!-- Resources/Styles/Colors.xaml -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Color x:Key="PRIMARY_COLOR_LIGHT">#000000</Color>
    <Color x:Key="PRIMARY_COLOR_DARK">#FFFFFF</Color>

    <Color x:Key="SECONDARY_COLOR_LIGHT">#FFFFFF</Color>
    <Color x:Key="SECONDARY_COLOR_DARK">#000000</Color>

    <!-- Transparência: prefixo alfa antes do hex -->
    <Color x:Key="LINES_COLOR_LIGHT">#33000000</Color>
    <Color x:Key="LINES_COLOR_DARK">#33FFFFFF</Color>
</ResourceDictionary>
```

### Import no App.xaml (ordem correta)

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <!-- Colors PRIMEIRO -->
            <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
            <!-- Styles DEPOIS -->
            <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

### AppThemeBinding nos estilos

```xml
<Style TargetType="Button">
    <Setter Property="BackgroundColor"
            Value="{AppThemeBinding
                Light={StaticResource PRIMARY_COLOR_LIGHT},
                Dark={StaticResource PRIMARY_COLOR_DARK}}" />
    <Setter Property="TextColor"
            Value="{AppThemeBinding
                Light={StaticResource SECONDARY_COLOR_LIGHT},
                Dark={StaticResource SECONDARY_COLOR_DARK}}" />
</Style>

<Style TargetType="ContentPage">
    <Setter Property="BackgroundColor"
            Value="{AppThemeBinding
                Light={StaticResource PAGE_BACKGROUND_COLOR_LIGHT},
                Dark={StaticResource PAGE_BACKGROUND_COLOR_DARK}}" />
</Style>
```

## Example

**Before (cor fixa, ignora tema):**
```xml
<Button BackgroundColor="Black" TextColor="White" />
```

**After (responde ao tema do sistema):**
```xml
<Button BackgroundColor="{AppThemeBinding
            Light={StaticResource PRIMARY_COLOR_LIGHT},
            Dark={StaticResource PRIMARY_COLOR_DARK}}"
        TextColor="{AppThemeBinding
            Light={StaticResource SECONDARY_COLOR_LIGHT},
            Dark={StaticResource SECONDARY_COLOR_DARK}}" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Cor funciona igual em light e dark (ex: botão Google) | Deixe fixa, sem AppThemeBinding |
| Cor precisa de transparência | Use prefixo alfa: `#80` = 50%, `#33` = 20% |
| Exceção ao iniciar o app após adicionar cores | Verifique ordem de import no App.xaml — Colors deve vir primeiro |
| Novo arquivo XAML sem code-behind | Remova `x:Class` do ResourceDictionary |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `BackgroundColor="Black"` em estilo global | `BackgroundColor="{AppThemeBinding Light=..., Dark=...}"` |
| Cores inline espalhadas nas pages | Cores centralizadas em Colors.xaml com x:Key |
| Import de Colors.xaml após Styles.xaml | Import de Colors.xaml antes de Styles.xaml |
| `<Color x:Key="COR">#000</Color>` com x:Class | Remova x:Class quando não há code-behind |
| Tag auto-fechada `<Color x:Key="X" />` | Tag completa `<Color x:Key="X">#HEX</Color>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
