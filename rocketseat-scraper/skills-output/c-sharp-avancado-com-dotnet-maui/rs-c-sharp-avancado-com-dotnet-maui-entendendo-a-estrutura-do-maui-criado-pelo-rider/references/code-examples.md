# Code Examples: Estrutura do Projeto .NET MAUI — Rider vs Visual Studio

## MauiProgram.cs — Template Rider (ANTES)

```csharp
using CommunityToolkit.Maui;
using PlanShare.App.Pages;
using PlanShare.App.Services;

namespace PlanShare.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Injecao de dependencia do template Rider
        builder.Services.AddSingleton<IErrorHandler, ModalErrorHandler>();
        builder.Services.AddSingleton<MainPageModel>();
        builder.Services.AddTransient<LoginPage>();

        return builder.Build();
    }
}
```

## MauiProgram.cs — Template Visual Studio (DEPOIS)

```csharp
namespace PlanShare.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        return builder.Build();
    }
}
```

## GlobalUsings.cs — Arquivo a ser DELETADO

```csharp
// Este arquivo inteiro deve ser removido
global using PlanShare.App.Pages;
global using PlanShare.App.Services;
global using PlanShare.App.Models;
global using PlanShare.App.PageModels;
global using CommunityToolkit.Maui;
```

## AppShell.xaml — Template Rider (ANTES)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:pages="clr-namespace:PlanShare.App.Pages"
       xmlns:syncfusion="clr-namespace:Syncfusion.Maui.Core;assembly=Syncfusion.Maui.Core"
       x:Class="PlanShare.App.AppShell"
       FlyoutBehavior="Flyout">

    <ShellContent
        Title="Dashboard"
        ContentTemplate="{DataTemplate pages:DashboardPage}"
        Route="Dashboard" />

    <ShellContent
        Title="Login"
        ContentTemplate="{DataTemplate pages:LoginPage}"
        Route="Login" />

    <!-- Mais paginas do template... -->

</Shell>
```

## AppShell.xaml — Template Visual Studio (DEPOIS)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:local="clr-namespace:PlanShare.App"
       x:Class="PlanShare.App.AppShell"
       FlyoutBehavior="Disabled">

    <ShellContent
        Title="Home"
        ContentTemplate="{DataTemplate local:MainPage}"
        Route="MainPage" />

</Shell>
```

## App.xaml.cs — Code-behind (igual em ambos)

```csharp
namespace PlanShare.App;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell());
    }
}
```

## MainPage.xaml — Pagina inicial basica

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.MainPage">

    <ScrollView>
        <VerticalStackLayout
            Padding="30,0"
            Spacing="25">

            <Image
                Source="dotnet_bot.png"
                HeightRequest="185"
                Aspect="AspectFit"
                SemanticProperties.Description="dot net bot in a hovercraft number nine" />

            <Label
                Text="Hello, World!"
                Style="{StaticResource Headline}"
                SemanticProperties.HeadingLevel="Level1" />

            <Label
                Text="Welcome to &#10;.NET Multi-platform App UI"
                Style="{StaticResource SubHeadline}"
                SemanticProperties.HeadingLevel="Level2"
                SemanticProperties.Description="Welcome to dot net Multi platform App U I" />

            <Button
                x:Name="CounterBtn"
                Text="Click me"
                SemanticProperties.Hint="Counts the number of times you click"
                Clicked="OnCounterClicked"
                HorizontalOptions="Fill" />

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

## MainPage.xaml.cs — Code-behind do MainPage

```csharp
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

## .csproj — Packages minimos (referencia do Visual Studio)

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Maui.Controls" Version="$(MauiVersion)" />
    <PackageReference Include="Microsoft.Maui.Controls.Compatibility" Version="$(MauiVersion)" />
    <PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="9.0.0" />
</ItemGroup>
```

## Estrutura de pastas — Rider (ANTES)

```
PlanShare.App/
├── Data/
│   └── Repository.cs
├── Models/
│   └── Category.cs
├── Pages/
│   ├── MainPage.xaml
│   ├── LoginPage.xaml
│   └── DashboardPage.xaml
├── PageModels/
│   └── MainPageModel.cs
├── Platforms/
│   ├── Android/
│   ├── iOS/
│   ├── MacCatalyst/
│   ├── Tizen/
│   └── Windows/
├── Properties/
│   └── launchSettings.json
├── Resources/
│   ├── AppIcon/
│   ├── Fonts/
│   ├── Images/
│   ├── Splash/
│   └── Styles/
│       ├── AppStyles.xaml
│       ├── Colors.xaml
│       └── Styles.xaml
├── Services/
│   ├── IErrorHandler.cs
│   └── ModalErrorHandler.cs
├── App.xaml
├── App.xaml.cs
├── AppShell.xaml
├── AppShell.xaml.cs
├── GlobalUsings.cs
└── MauiProgram.cs
```

## Estrutura de pastas — Visual Studio (DEPOIS)

```
PlanShare.App/
├── Platforms/
│   ├── Android/
│   ├── iOS/
│   ├── MacCatalyst/
│   └── Windows/
├── Resources/
│   ├── AppIcon/
│   ├── Fonts/
│   ├── Images/
│   ├── Splash/
│   └── Styles/
│       ├── Colors.xaml
│       └── Styles.xaml
├── App.xaml
├── App.xaml.cs
├── AppShell.xaml
├── AppShell.xaml.cs
├── MainPage.xaml
├── MainPage.xaml.cs
└── MauiProgram.cs
```