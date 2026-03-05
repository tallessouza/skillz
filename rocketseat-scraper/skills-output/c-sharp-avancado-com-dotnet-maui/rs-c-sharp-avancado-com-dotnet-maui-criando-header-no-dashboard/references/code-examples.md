# Code Examples: Criando Header no Dashboard

## Exemplo completo do XAML do Dashboard

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             xmlns:resources="clr-namespace:MyApp.Resources"
             xmlns:helpers="clr-namespace:MyApp.Helpers"
             x:Class="MyApp.Pages.DashboardPage">

    <Grid ColumnDefinitions="62, *, 40, 40">

        <!-- Coluna 0: Avatar/Iniciais (implementado em aula futura) -->

        <!-- Coluna 1: Textos de boas-vindas -->
        <VerticalStackLayout Grid.Column="1">
            <Label Text="{x:Static resources:Strings.TitleWelcome}"
                   FontSize="10"
                   FontFamily="{x:Static helpers:FontFamily.MainFontRegular}" />
            <Label Text="{Binding UserName}"
                   FontSize="16"
                   FontFamily="{x:Static helpers:FontFamily.MainFontBlack}" />
        </VerticalStackLayout>

        <!-- Coluna 2: Icone do sino com rotacao -->
        <Image Source="icon_bell.png"
               Grid.Column="2"
               HeightRequest="20"
               Rotation="15">
            <Image.Behaviors>
                <toolkit:IconTintColorBehavior
                    TintColor="{AppThemeBinding
                        Light={StaticResource PrimaryColor},
                        Dark={StaticResource PrimaryColorDark}}" />
            </Image.Behaviors>
        </Image>

        <!-- Coluna 3: Icone da engrenagem -->
        <Image Source="icon_settings.png"
               Grid.Column="3"
               HeightRequest="20">
            <Image.Behaviors>
                <toolkit:IconTintColorBehavior
                    TintColor="{AppThemeBinding
                        Light={StaticResource PrimaryColor},
                        Dark={StaticResource PrimaryColorDark}}" />
            </Image.Behaviors>
        </Image>

    </Grid>

</ContentPage>
```

## ViewModel completa

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace MyApp.ViewModels;

public partial class DashboardViewModel : ObservableObject
{
    [ObservableProperty]
    private string userName;

    public DashboardViewModel(UserStorage userStorage)
    {
        // Get() retorna um record com Id e Name
        // Acessa .Name diretamente sem variavel intermediaria
        userName = userStorage.Get().Name;
    }
}
```

## Variacoes de ColumnDefinitions

### Todas fixas (nao recomendado para texto variavel)
```xml
<Grid ColumnDefinitions="62, 200, 40, 40">
    <!-- Problema: nome do usuario pode ultrapassar 200px -->
</Grid>
```

### Todas com asterisco (divisao igual)
```xml
<Grid ColumnDefinitions="*, *, *, *">
    <!-- Cada coluna ocupa 25% da largura -->
</Grid>
```

### Star sizing proporcional
```xml
<Grid ColumnDefinitions="62, 2*, *, 40">
    <!-- Coluna 1 recebe o dobro do espaco da coluna 2 -->
</Grid>
```

### Auto sizing (baseado no conteudo)
```xml
<Grid ColumnDefinitions="Auto, *, Auto, Auto">
    <!-- Auto: coluna se ajusta ao tamanho do conteudo -->
    <!-- Util quando nao sabe o tamanho exato do Figma -->
</Grid>
```

## Variacoes de Rotation

```xml
<!-- Sem rotacao (padrao) -->
<Image Source="arrow_right.png" Rotation="0" />

<!-- Rotacao horaria -->
<Image Source="arrow_right.png" Rotation="90" />  <!-- Aponta para baixo -->
<Image Source="arrow_right.png" Rotation="180" /> <!-- Aponta para esquerda -->
<Image Source="arrow_right.png" Rotation="270" /> <!-- Aponta para cima -->

<!-- Rotacao anti-horaria -->
<Image Source="arrow_right.png" Rotation="-90" /> <!-- Aponta para cima -->

<!-- Rotacao sutil para efeito visual -->
<Image Source="icon_bell.png" Rotation="15" />    <!-- Leve inclinacao -->
<Image Source="icon_bell.png" Rotation="-15" />   <!-- Inclinacao oposta -->
```

## IconTintColorBehavior para Light/Dark mode

```xml
<!-- Padrao para icones que mudam de cor com o tema -->
<Image Source="icon_name.png" HeightRequest="20">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding
                Light={StaticResource PrimaryColor},
                Dark={StaticResource PrimaryColorDark}}" />
    </Image.Behaviors>
</Image>
```

Requer o namespace do toolkit:
```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

## Usando strings de recursos para internacionalizacao

```xml
<!-- No XAML -->
<Label Text="{x:Static resources:Strings.TitleWelcome}" />
```

```xml
<!-- No arquivo de recursos (Strings.resx) -->
<!-- Key: TitleWelcome, Value (pt): "Bem-vindo" -->
<!-- Key: TitleWelcome, Value (en): "Welcome" -->
```