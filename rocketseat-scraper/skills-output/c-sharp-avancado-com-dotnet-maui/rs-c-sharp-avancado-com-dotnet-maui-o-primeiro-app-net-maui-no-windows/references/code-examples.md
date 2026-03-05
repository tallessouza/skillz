# Code Examples: Primeiro App .NET MAUI no Windows

## Estrutura do projeto criado

Ao criar um projeto .NET MAUI App, o Visual Studio gera a seguinte estrutura:

```
PlanShare.App/
├── Platforms/
│   ├── Android/
│   ├── iOS/
│   ├── MacCatalyst/
│   ├── Tizen/
│   └── Windows/
├── Resources/
│   ├── AppIcon/
│   ├── Fonts/
│   ├── Images/
│   ├── Raw/
│   ├── Splash/
│   └── Styles/
├── App.xaml
├── App.xaml.cs
├── AppShell.xaml
├── AppShell.xaml.cs
├── MainPage.xaml
├── MainPage.xaml.cs
├── MauiProgram.cs
└── PlanShare.App.csproj
```

## Template Hello World gerado

O template padrao gera uma pagina com um botao contador:

```xml
<!-- MainPage.xaml (template padrao) -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.MainPage">
    <ScrollView>
        <VerticalStackLayout Padding="30,0" Spacing="25">
            <Image Source="dotnet_bot.png" HeightRequest="185" />
            <Label Text="Hello, World!" FontSize="32" HorizontalOptions="Center" />
            <Label Text="Welcome to &#10;.NET Multi-platform App UI" FontSize="18" HorizontalOptions="Center" />
            <Button x:Name="CounterBtn" Text="Click me" Clicked="OnCounterClicked" HorizontalOptions="Fill" />
        </VerticalStackLayout>
    </ScrollView>
</ContentPage>
```

```csharp
// MainPage.xaml.cs (template padrao)
namespace PlanShare.App;

public partial class MainPage : ContentPage
{
    int count = 0;

    public MainPage()
    {
        InitializeComponent();
    }

    private void OnCounterClicked(object sender, EventArgs e)
    {
        count++;

        if (count == 1)
            CounterBtn.Text = $"Clicked {count} time";
        else
            CounterBtn.Text = $"Clicked {count} times";

        SemanticScreenReader.Announce(CounterBtn.Text);
    }
}
```

## Configuracao do projeto (.csproj)

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFrameworks>net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>
        <OutputType>Exe</OutputType>
        <RootNamespace>PlanShare.App</RootNamespace>
        <UseMaui>true</UseMaui>
        <SingleProject>true</SingleProject>
    </PropertyGroup>
</Project>
```

## Organizacao da solucao (.sln)

```
PlanShare.sln
└── Source/
    ├── BackEnd/
    │   └── PlanShare.API/
    ├── Shared/
    │   └── PlanShare.Shared/
    └── Mobile/
        └── PlanShare.App/    ← projeto MAUI
```

## Tabela de referencia: Android Version → API Level

| Android Version | API Level | Nome |
|----------------|-----------|------|
| 12 | 31 | Snow Cone |
| 12L | 32 | Snow Cone v2 |
| 13 | 33 | Tiramisu |
| 14 | 34 | Upside Down Cake |
| 15 | 35 | Vanilla Ice Cream |