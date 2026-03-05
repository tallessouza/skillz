# Code Examples: Toggle de Visibilidade com DataTriggers

## Modelo JoinerUser

```csharp
// Models/JoinerUser.cs
public class JoinerUser
{
    public string Name { get; set; }
    public string? ProfilePhotoUrl { get; set; }
}
```

## Propriedade observavel na ViewModel

```csharp
// ViewModels/UserConnectionGeneratorViewModel.cs
[ObservableProperty]
private JoinerUser joinerUser;
```

## Estrutura XAML completa da pagina

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             xmlns:converters="clr-namespace:PlanShare.App.Converters"
             xmlns:Models="clr-namespace:PlanShare.App.Models">

    <ContentPage.Resources>
        <converters:NameToAvatarConverter x:Key="NameToAvatarName" />
    </ContentPage.Resources>

    <!-- Layout pai unico (requisito do ContentPage) -->
    <VerticalStackLayout>

        <!-- LAYOUT A: Gerar codigo / Aguardar joiner -->
        <VerticalStackLayout>
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
                    <Setter Property="IsVisible" Value="False" />
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <!-- Imagem, titulo, skeleton, codigo, botao cancelar -->
            <Image Source="cat_image.png" />
            <Label Text="Como compartilhar tarefa" />
            <!-- SkeletonView ate API retornar -->
            <Button Text="{x:Static resources:TitleCancel}"
                    Style="{StaticResource CancelButtonStyle}"
                    Margin="0,40,0,0" />
        </VerticalStackLayout>

        <!-- LAYOUT B: Aprovar conexao -->
        <VerticalStackLayout IsVisible="False">
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
                    <Setter Property="IsVisible" Value="True" />
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <!-- Avatar -->
            <toolkit:AvatarView
                BackgroundColor="{AppThemeBinding
                    Light={StaticResource AvatarColorLight},
                    Dark={StaticResource AvatarColor}}"
                BorderWidth="0"
                FontFamily="{x:Static FontFamily.MainFontsBlack}"
                FontSize="24"
                HeightRequest="100"
                WidthRequest="100"
                CornerRadius="50"
                TextColor="{AppThemeBinding
                    Light={StaticResource SecondaryColorLight},
                    Dark={StaticResource SecondaryColorDark}}"
                Text="{Binding JoinerUser.Name,
                    Converter={StaticResource NameToAvatarName}}" />

            <!-- Nome da pessoa -->
            <Label Text="{Binding JoinerUser.Name}"
                   HorizontalTextAlignment="Center"
                   FontSize="30"
                   FontFamily="{x:Static FontFamily.MainFontsBlack}"
                   Margin="0,20,0,0" />

            <!-- Botao aceitar -->
            <Button Text="{x:Static resources:TitleAccept}"
                    TextTransform="Uppercase"
                    HeightRequest="60"
                    BackgroundColor="{AppThemeBinding
                        Light={StaticResource HighlightColorLight},
                        Dark={StaticResource HighlightColorDark}}"
                    Margin="0,70,0,0" />

            <!-- Botao cancelar -->
            <Button Text="{x:Static resources:TitleCancel}"
                    Style="{StaticResource CancelButtonStyle}"
                    Margin="0,40,0,0" />
        </VerticalStackLayout>

    </VerticalStackLayout>
</ContentPage>
```

## DataTrigger — anatomia das tres propriedades obrigatorias

```xml
<!-- 1. TargetType: tipo do elemento que contem o trigger -->
<!-- 2. Binding: propriedade da ViewModel observada -->
<!-- 3. Value: valor que dispara o trigger (enum via x:Static) -->
<DataTrigger
    TargetType="VerticalStackLayout"
    Binding="{Binding StatusPage}"
    Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
    <Setter Property="IsVisible" Value="False" />
</DataTrigger>
```

## Enum de status da pagina (referencia)

```csharp
// Models/ConnectionByCodeStatusPage.cs
public enum ConnectionByCodeStatusPage
{
    GeneratingCode,
    WaitingForJoiner,
    JoinerConnectedPendingApproval
}
```

## AppThemeBinding para suporte light/dark mode

```xml
<!-- Padrao para qualquer propriedade que muda com tema -->
BackgroundColor="{AppThemeBinding
    Light={StaticResource AvatarColorLight},
    Dark={StaticResource AvatarColor}}"

TextColor="{AppThemeBinding
    Light={StaticResource SecondaryColorLight},
    Dark={StaticResource SecondaryColorDark}}"
```

## Circulo perfeito — formula

```xml
<!-- Regra: CornerRadius = HeightRequest / 2 = WidthRequest / 2 -->
<!-- Prerequisito: HeightRequest == WidthRequest -->

<!-- 100x100 → CornerRadius=50 -->
<toolkit:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="50" />

<!-- 60x60 → CornerRadius=30 -->
<toolkit:AvatarView HeightRequest="60" WidthRequest="60" CornerRadius="30" />

<!-- 200x200 → CornerRadius=100 -->
<toolkit:AvatarView HeightRequest="200" WidthRequest="200" CornerRadius="100" />
```