# Code Examples: Implementando Elementos no PopUp

## Exemplo completo do PopUp XAML

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:resources="clr-namespace:PlanShare.Resources.Texts"
    x:Class="PlanShare.Views.Popups.ProfilePhotoPopup">

    <VerticalStackLayout>

        <!-- Opcao 1: Upload de foto -->
        <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
            <Label
                Text="{x:Static resources:ResourceTexts.UploadPhoto}"
                HorizontalOptions="Center" />
            <BoxView
                HeightRequest="1"
                Color="{AppThemeBinding
                    Light={StaticResource LinesColorLight},
                    Dark={StaticResource LinesColorDark}}" />
        </VerticalStackLayout>

        <!-- Opcao 2: Tirar foto -->
        <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
            <Label
                Text="{x:Static resources:ResourceTexts.TakePhotoUpload}"
                HorizontalOptions="Center" />
            <BoxView
                HeightRequest="1"
                Color="{AppThemeBinding
                    Light={StaticResource LinesColorLight},
                    Dark={StaticResource LinesColorDark}}" />
        </VerticalStackLayout>

        <!-- Opcao 3: Deletar foto (sem linha) -->
        <VerticalStackLayout Padding="0,10,0,10">
            <Label
                Text="{x:Static resources:ResourceTexts.DeleteProfilePicture}"
                HorizontalOptions="Center" />
        </VerticalStackLayout>

        <!-- Botao cancelar -->
        <Button
            Text="{x:Static resources:ResourceTexts.Cancel}"
            Margin="0,20,0,0" />

    </VerticalStackLayout>

</toolkit:Popup>
```

## Importacao do resource file

A referencia ao arquivo de resources deve ser adicionada no topo do XAML:

```xml
xmlns:resources="clr-namespace:PlanShare.Resources.Texts"
```

Isso permite usar `{x:Static resources:ResourceTexts.NomeDaChave}` em qualquer propriedade Text.

## Arquivo de resources (.resx) — estrutura de chaves

```
| Chave                  | Valor (pt-BR)                    | Valor (en - neutro)        |
|------------------------|----------------------------------|----------------------------|
| UploadPhoto            | Fazer upload de uma foto         | Upload a photo             |
| TakePhotoUpload        | Tirar foto e fazer upload        | Take photo and upload      |
| DeleteProfilePicture   | Deletar foto de perfil           | Delete profile picture     |
| Cancel                 | Cancelar                         | Cancel                     |
```

## Cores em Colors.xaml

```xml
<!-- Resources/Styles/Colors.xaml -->
<Color x:Key="LinesColorLight">#E0E0E0</Color>
<Color x:Key="LinesColorDark">#3A3A3A</Color>
```

## AppThemeBinding — padrao para cores tematicas

```xml
<!-- Uso padrao para qualquer propriedade de cor -->
Color="{AppThemeBinding
    Light={StaticResource LinesColorLight},
    Dark={StaticResource LinesColorDark}}"
```

## Tecnica de debug visual

```xml
<!-- Temporario: visualizar area do VerticalStackLayout -->
<VerticalStackLayout
    Padding="0,10,0,0"
    BackgroundColor="Red">
    <Label Text="Opcao aqui" HorizontalOptions="Center" />
</VerticalStackLayout>
<!-- REMOVER BackgroundColor antes de commit! -->
```

## Padding — formato de 4 valores

```xml
<!-- Padding="esquerda, cima, direita, baixo" -->
Padding="0,10,0,0"   <!-- 10px apenas no topo -->
Padding="0,10,0,10"  <!-- 10px topo e 10px baixo (ultima opcao sem linha) -->
```

## Margin no Button para separacao

```xml
<!-- Margin="esquerda, cima, direita, baixo" -->
<Button Margin="0,20,0,0" />  <!-- 20px de espaco acima do botao -->
```