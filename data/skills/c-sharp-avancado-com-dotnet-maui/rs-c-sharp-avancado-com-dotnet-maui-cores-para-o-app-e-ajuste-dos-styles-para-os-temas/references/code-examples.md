# Code Examples: Cores para Temas em .NET MAUI

## Paleta completa de cores (Colors.xaml)

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Color x:Key="AVATAR_COLOR_LIGHT">#663399</Color>
    <Color x:Key="AVATAR_COLOR_DARK">#AEA8D3</Color>

    <Color x:Key="DANGER_ACTION_COLOR_LIGHT">#DF340C</Color>
    <Color x:Key="DANGER_ACTION_COLOR_DARK">#F64747</Color>

    <Color x:Key="HIGHLIGHT_COLOR_LIGHT">#0065F2</Color>
    <Color x:Key="HIGHLIGHT_COLOR_DARK">#19B5FE</Color>

    <Color x:Key="PAGE_BACKGROUND_COLOR_LIGHT">#FFFFFF</Color>
    <Color x:Key="PAGE_BACKGROUND_COLOR_DARK">#3D3C40</Color>

    <Color x:Key="PRIMARY_COLOR_LIGHT">#000000</Color>
    <Color x:Key="PRIMARY_COLOR_DARK">#FFFFFF</Color>

    <Color x:Key="SECONDARY_COLOR_LIGHT">#FFFFFF</Color>
    <Color x:Key="SECONDARY_COLOR_DARK">#000000</Color>

    <Color x:Key="SKELETON_LOADING_COLOR_LIGHT">#E0E0E0</Color>
    <Color x:Key="SKELETON_LOADING_COLOR_DARK">#494949</Color>

    <Color x:Key="UPLOADFILE_COLOR_LIGHT">#F6F8FA</Color>
    <Color x:Key="UPLOADFILE_COLOR_DARK">#555459</Color>

    <!-- Transparência via prefixo alfa -->
    <Color x:Key="LINES_COLOR_LIGHT">#33000000</Color>     <!-- preto 20% -->
    <Color x:Key="LINES_COLOR_DARK">#33FFFFFF</Color>       <!-- branco 20% -->

    <Color x:Key="PLACEHOLDER_COLOR_LIGHT">#80000000</Color> <!-- preto 50% -->
    <Color x:Key="PLACEHOLDER_COLOR_DARK">#33FFFFFF</Color>   <!-- branco 20% -->

    <Color x:Key="KEYBOARD_COLOR_LIGHT">#BEBEBE</Color>
    <Color x:Key="KEYBOARD_COLOR_DARK">#AEA8D3</Color>
</ResourceDictionary>
```

## App.xaml — Import na ordem correta

```xml
<Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <!-- PRIMEIRO: Colors (sem dependências) -->
                <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
                <!-- DEPOIS: Styles (depende de Colors) -->
                <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>
```

## Styles.xaml — Estilos usando AppThemeBinding

### Estilo de botão

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
```

### Estilo de ContentPage (background)

```xml
<Style TargetType="ContentPage">
    <Setter Property="BackgroundColor"
            Value="{AppThemeBinding
                Light={StaticResource PAGE_BACKGROUND_COLOR_LIGHT},
                Dark={StaticResource PAGE_BACKGROUND_COLOR_DARK}}" />
</Style>
```

### Estilo de Label (texto)

```xml
<Style TargetType="Label">
    <Setter Property="TextColor"
            Value="{AppThemeBinding
                Light={StaticResource PRIMARY_COLOR_LIGHT},
                Dark={StaticResource PRIMARY_COLOR_DARK}}" />
</Style>
```

## Uso inline em pages (highlight para links/spans)

```xml
<!-- OnboardingPage.xaml -->
<Span TextColor="{AppThemeBinding
        Light={StaticResource HIGHLIGHT_COLOR_LIGHT},
        Dark={StaticResource HIGHLIGHT_COLOR_DARK}}"
      Text="clicando aqui" />
```

## Exemplo de cor fixa (quando o contraste funciona em ambos os temas)

```xml
<!-- Botão Google — cor fixa, não precisa de AppThemeBinding -->
<Button BackgroundColor="#F6F6FB"
        TextColor="#000000"
        Text="Fazer login com Google" />
```

## Referência rápida de alfa hexadecimal

| Opacidade | Prefixo | Exemplo (preto) | Exemplo (branco) |
|-----------|---------|------------------|-------------------|
| 100% | `FF` | `#FF000000` | `#FFFFFFFF` |
| 80% | `CC` | `#CC000000` | `#CCFFFFFF` |
| 50% | `80` | `#80000000` | `#80FFFFFF` |
| 20% | `33` | `#33000000` | `#33FFFFFF` |
| 10% | `1A` | `#1A000000` | `#1AFFFFFF` |
| 0% | `00` | `#00000000` | `#00FFFFFF` |