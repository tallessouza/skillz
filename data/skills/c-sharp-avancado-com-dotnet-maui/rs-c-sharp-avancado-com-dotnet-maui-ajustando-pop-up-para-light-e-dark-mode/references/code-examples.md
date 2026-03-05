# Code Examples: Popup Light & Dark Mode no .NET MAUI

## Exemplo 1: Diagnosticando o problema com cor temporaria

Para confirmar que os elementos existem mas estao invisiveis:

```xml
<!-- Teste rapido: coloque vermelho para ver os elementos -->
<toolkit:Popup Padding="0" VerticalOptions="End"
    BackgroundColor="Red">
    <VerticalStackLayout>
        <Label Text="Editar perfil" />
        <BoxView Color="{AppThemeBinding 
            Light={StaticResource LinesColorLight}, 
            Dark={StaticResource LinesColorDark}}" 
            HeightRequest="1" />
        <Label Text="Compartilhar" />
        <Button Text="Cancelar" />
    </VerticalStackLayout>
</toolkit:Popup>
```

Com Hot Reload, o fundo muda para vermelho instantaneamente e todos os elementos ficam visiveis.

## Exemplo 2: Correcao final com AppThemeBinding

```xml
<toolkit:Popup 
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    Padding="0"
    VerticalOptions="End"
    BackgroundColor="{AppThemeBinding 
        Light={StaticResource PageBackgroundColorLight}, 
        Dark={StaticResource PageBackgroundColorDark}}">
    
    <VerticalStackLayout>
        <Label Text="Editar perfil" />
        
        <BoxView 
            Color="{AppThemeBinding 
                Light={StaticResource LinesColorLight}, 
                Dark={StaticResource LinesColorDark}}" 
            HeightRequest="1" />
        
        <Label Text="Compartilhar" />
        
        <BoxView 
            Color="{AppThemeBinding 
                Light={StaticResource LinesColorLight}, 
                Dark={StaticResource LinesColorDark}}" 
            HeightRequest="1" />
        
        <Button Text="Cancelar" />
    </VerticalStackLayout>
</toolkit:Popup>
```

## Exemplo 3: Definicoes de cores no arquivo Colors.xaml

```xml
<!-- Resources/Styles/Colors.xaml -->
<ResourceDictionary>
    <!-- Cores de fundo da pagina -->
    <Color x:Key="PageBackgroundColorLight">#FFFFFF</Color>
    <Color x:Key="PageBackgroundColorDark">#1A1A2E</Color>
    
    <!-- Cores das linhas divisorias -->
    <Color x:Key="LinesColorLight">#33000000</Color>  <!-- preto com transparencia -->
    <Color x:Key="LinesColorDark">#33FFFFFF</Color>    <!-- branco com transparencia -->
    
    <!-- Cores primarias (usadas em Labels globais) -->
    <Color x:Key="PrimaryColorLight">#1A1A2E</Color>   <!-- escuro para light mode -->
    <Color x:Key="PrimaryColorDark">#FFFFFF</Color>     <!-- branco para dark mode -->
</ResourceDictionary>
```

## Exemplo 4: Estilo global de Label (funciona para componentes nativos, NAO para popup)

```xml
<!-- Resources/Styles/LabelStyle.xaml -->
<Style TargetType="Label">
    <Setter Property="TextColor" 
        Value="{AppThemeBinding 
            Light={StaticResource PrimaryColorLight}, 
            Dark={StaticResource PrimaryColorDark}}" />
</Style>
```

```xml
<!-- App.xaml — importacao dos estilos -->
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
            <ResourceDictionary Source="Resources/Styles/LabelStyle.xaml" />
            <ResourceDictionary Source="Resources/Styles/ButtonStyle.xaml" />
            <ResourceDictionary Source="Resources/Styles/EntryStyle.xaml" />
            <!-- PopupStyle.xaml NAO funcionaria aqui -->
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

## Exemplo 5: Template para novos popups (copiar e adaptar)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup 
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    x:Class="MeuApp.Views.Popups.MeuNovoPopup"
    Padding="0"
    VerticalOptions="End"
    BackgroundColor="{AppThemeBinding 
        Light={StaticResource PageBackgroundColorLight}, 
        Dark={StaticResource PageBackgroundColorDark}}">
    
    <VerticalStackLayout Spacing="0">
        <!-- Seu conteudo aqui -->
    </VerticalStackLayout>
</toolkit:Popup>
```