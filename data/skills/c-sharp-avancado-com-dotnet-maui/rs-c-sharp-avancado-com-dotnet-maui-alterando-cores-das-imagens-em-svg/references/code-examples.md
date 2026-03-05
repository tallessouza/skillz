# Code Examples: Alterando Cores de Imagens SVG no .NET MAUI

## 1. Instalacao do NuGet Package

```
NuGet\Install-Package CommunityToolkit.Maui
```

Se houver erros de versao, atualize os outros pacotes primeiro e limpe o cache:
```bash
# Feche o Visual Studio, depois:
rm -rf bin/ obj/
# Reabra e reinstale
```

## 2. Registro no MauiProgram.cs

```csharp
using CommunityToolkit.Maui;

namespace PlanShare;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit() // Obrigatorio, apos UseMauiApp
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        return builder.Build();
    }
}
```

## 3. XAML — Declaracao do namespace

```xml
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    x:Class="PlanShare.Views.LoginPage">
```

## 4. XAML — Cor fixa (teste rapido)

```xml
<!-- Vermelho -->
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior TintColor="Red" />
    </Image.Behaviors>
</Image>

<!-- Azul -->
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior TintColor="Blue" />
    </Image.Behaviors>
</Image>

<!-- Branco -->
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior TintColor="White" />
    </Image.Behaviors>
</Image>
```

## 5. XAML — Cor adaptativa com AppThemeBinding

```xml
<!-- Resource Dictionary (Colors.xaml) -->
<Color x:Key="PrimaryColorLight">#000000</Color>
<Color x:Key="PrimaryColorDark">#FFFFFF</Color>

<!-- No componente -->
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}" />
    </Image.Behaviors>
</Image>
```

Resultado: no Light mode o icone fica preto, no Dark mode fica branco — automaticamente ao trocar tema do sistema.

## 6. C# Code-Behind — Adicionar behavior programaticamente

```csharp
using CommunityToolkit.Maui.Behaviors;

// Criar o behavior com a cor desejada
var tintBehavior = new IconTintColorBehavior
{
    TintColor = Colors.Red
};

// Adicionar ao Image
myImage.Behaviors.Add(tintBehavior);
```

## 7. Componente reutilizavel completo (exemplo da aula)

O componente EntryAndLabelPasswordComponent usa o mesmo icone de olho em duas telas (Login e Criar Conta). Com IconTintColorBehavior, uma unica imagem SVG serve para ambos os temas:

```xml
<!-- EntryAndLabelPasswordComponent.xaml -->
<ContentView
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit">

    <!-- ... outros elementos ... -->

    <Image Source="icon_eye_closed.svg">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding
                    Light={StaticResource PrimaryColorLight},
                    Dark={StaticResource PrimaryColorDark}}" />
        </Image.Behaviors>
    </Image>
</ContentView>
```

## 8. Importante: forma de fechar a tag Image

```xml
<!-- ERRADO: tag auto-fechada nao permite behaviors -->
<Image Source="icon_eye.svg" />

<!-- CORRETO: tag aberta para incluir behaviors -->
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior TintColor="White" />
    </Image.Behaviors>
</Image>
```