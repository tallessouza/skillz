# Code Examples: Estilos para Entry no .NET MAUI

## Exemplo completo do ResourceDictionary

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:fonts="clr-namespace:YourApp.Resources.Fonts">

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

## Importação no App.xaml

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <!-- Outros estilos... -->
            <ResourceDictionary Source="Resources/Styles/ButtonStyle.xaml" />
            <ResourceDictionary Source="Resources/Styles/EntryStyle.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

## Componente ANTES da refatoração

```xml
<!-- EntryAndLabelComponent.xaml — COM propriedades inline -->
<Entry
    Placeholder="{Binding Placeholder}"
    PlaceholderColor="#8E8E93"
    TextColor="Black"
    FontFamily="WorkSansRegular"
    FontSize="14" />
```

## Componente DEPOIS da refatoração

```xml
<!-- EntryAndLabelComponent.xaml — LIMPO, estilo vem do ResourceDictionary -->
<Entry Placeholder="{Binding Placeholder}" />
```

## Definição de cores no Colors.xaml (referência)

```xml
<!-- Cores que o estilo da Entry referencia -->
<Color x:Key="PlaceholderColorLight">#8E8E93</Color>
<Color x:Key="PlaceholderColorDark">#636366</Color>
<Color x:Key="PrimaryColorLight">#000000</Color>
<Color x:Key="PrimaryColorDark">#FFFFFF</Color>
```

## Classe de constantes de fonte (referência)

```csharp
namespace YourApp.Resources.Fonts;

public static class FontFamily
{
    public const string PrimaryRegular = "WorkSansBold";
    public const string SecondaryRegular = "WorkSansRegular";
    // ... outras fontes
}
```

## Variação: Entry com estilo explícito (para casos especiais)

```xml
<!-- No ResourceDictionary -->
<Style x:Key="SearchEntryStyle" TargetType="Entry">
    <Setter Property="FontFamily" Value="{x:Static fonts:FontFamily.SecondaryRegular}" />
    <Setter Property="FontSize" Value="16" />
    <Setter Property="PlaceholderColor" Value="{StaticResource PlaceholderColorLight}" />
    <Setter Property="TextColor" Value="{StaticResource PrimaryColorLight}" />
</Style>

<!-- No componente -->
<Entry Style="{StaticResource SearchEntryStyle}" Placeholder="Buscar..." />
```

## Teste manual recomendado

1. Build e deploy no dispositivo/emulador
2. Navegar para tela com Entry (ex: Login)
3. Verificar fonte e cor do placeholder no Light mode
4. Digitar texto e verificar cor do texto no Light mode
5. Alternar para Dark mode nas configurações do dispositivo
6. Repetir verificações 3 e 4 no Dark mode