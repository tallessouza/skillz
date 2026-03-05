---
name: rs-csharp-maui-entry-styles
description: "Applies .NET MAUI Entry styling patterns when creating or modifying Entry controls in XAML. Use when user asks to 'style entries', 'customize input fields', 'create entry styles', 'theme text inputs', or 'style MAUI forms'. Enforces implicit styles via ResourceDictionary, AppThemeBinding for light/dark mode, and proper separation of style concerns. Make sure to use this skill whenever styling Entry controls in .NET MAUI. Not for platform-specific handlers, custom renderers, or non-Entry controls."
---

# Estilos para Entry no .NET MAUI

> Defina estilos implícitos para Entry em ResourceDictionary separado, usando AppThemeBinding para suportar temas claro e escuro.

## Rules

1. **Crie um ResourceDictionary separado para Entry styles** — arquivo dedicado em `Resources/Styles/`, porque mantém organização e facilita manutenção
2. **Delete o code-behind do ResourceDictionary** — remova o arquivo `.xaml.cs` e a referência `x:Class` no XAML, porque ResourceDictionary de estilo não precisa de code-behind
3. **Use estilos implícitos (sem x:Key)** — omita a chave para que todas as Entry do app herdem o estilo automaticamente, porque garante consistência visual
4. **Remova propriedades de estilo inline dos componentes** — ao criar um estilo centralizado, delete `PlaceholderColor`, `TextColor`, `FontFamily` etc. dos componentes individuais, porque evita conflito e duplicação
5. **Use AppThemeBinding para cores que mudam com o tema** — `PlaceholderColor` e `TextColor` devem adaptar-se a light/dark mode, porque o app deve funcionar nos dois temas
6. **Importe o ResourceDictionary no App.xaml** — adicione `<ResourceDictionary Source="..."` senão o estilo será ignorado silenciosamente

## How to write

### ResourceDictionary de Entry

```xml
<!-- Resources/Styles/EntryStyle.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="Entry">
        <Setter Property="FontFamily" Value="{x:Static fonts:FontFamily.SecondaryRegular}" />
        <Setter Property="FontSize" Value="14" />
        <Setter Property="PlaceholderColor"
                Value="{AppThemeBinding
                    Light={StaticResource PlaceholderColorLight},
                    Dark={StaticResource PlaceholderColorDark}}" />
        <Setter Property="TextColor"
                Value="{AppThemeBinding
                    Light={StaticResource PrimaryColorLight},
                    Dark={StaticResource PrimaryColorDark}}" />
    </Style>
</ResourceDictionary>
```

### Importação no App.xaml

```xml
<ResourceDictionary Source="Resources/Styles/EntryStyle.xaml" />
```

## Example

**Before (estilo inline no componente):**
```xml
<Entry
    Placeholder="E-mail"
    PlaceholderColor="#999"
    TextColor="Black"
    FontSize="14" />
```

**After (estilo implícito aplicado):**
```xml
<!-- Componente limpo — estilo vem do ResourceDictionary -->
<Entry Placeholder="E-mail" />
```

## Heuristics

| Situação | Faça |
|----------|------|
| Entry precisa de cor diferente por tema | Use `AppThemeBinding` com cores definidas em Colors.xaml |
| FontFamily usa fonte customizada | Referencie via `x:Static` apontando para constante |
| Propriedade de estilo está no componente E no ResourceDictionary | Remova do componente — o estilo centralizado prevalece |
| Precisa de estilo diferente para uma Entry específica | Crie estilo com `x:Key` e aplique via `Style="{StaticResource ...}"` |
| Precisa customizar cursor ou underline da Entry | Use handlers platform-specific (não coberto aqui) |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Deixar code-behind em ResourceDictionary de estilo | Delete `.xaml.cs` e remova `x:Class` |
| Definir `TextColor="Black"` hardcoded | Use `AppThemeBinding` com cores do tema |
| Duplicar propriedades de estilo no componente e no ResourceDictionary | Centralize no ResourceDictionary, limpe o componente |
| Esquecer de importar o ResourceDictionary no App.xaml | Sempre adicione `<ResourceDictionary Source="..." />` |
| Confiar em valores de cor sem conferir o Figma | Siga fielmente os valores do protótipo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
