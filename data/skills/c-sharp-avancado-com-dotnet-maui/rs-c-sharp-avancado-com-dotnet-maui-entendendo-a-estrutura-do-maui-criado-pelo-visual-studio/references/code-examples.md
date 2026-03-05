# Code Examples: Estrutura de Projeto .NET MAUI

## MauiProgram.cs — Template padrao

```csharp
using Microsoft.Extensions.Logging;

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

**Nota:** O instrutor remove `using`s desnecessarios com Ctrl+R,G. O resultado limpo fica apenas com o namespace e a classe.

## App.xaml.cs — Forma obsoleta vs moderna

### Forma obsoleta (nao usar):
```csharp
public partial class App : Application
{
    public App()
    {
        InitializeComponent();
        MainPage = new AppShell(); // Obsoleto
    }
}
```

### Forma moderna (recomendada):
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

**Insight do instrutor:** Ao digitar `MainPage = new`, o proprio IntelliSense mostra que e obsoleto e sugere `CreateWindow`. A forma nova e mais explicita e alinhada com o ciclo de vida do MAUI.

## AppShell.xaml — Definindo navegacao

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:local="clr-namespace:PlanShare.App"
       x:Class="PlanShare.App.AppShell">

    <ShellContent ContentTemplate="{DataTemplate local:MainPage}"
                  Route="MainPage"
                  Title="Home" />
</Shell>
```

**Explicacao:** O `ShellContent` define qual pagina sera exibida. A propriedade `Route` permite navegacao programatica com `Shell.Current.GoToAsync("MainPage")`.

## MainPage.xaml — Template do Visual Studio

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.MainPage">

    <ScrollView>
        <VerticalStackLayout Padding="30,0"
                             Spacing="25">

            <Image HeightRequest="185"
                   SemanticProperties.Description="dot net bot in a race car number nine"
                   Source="dotnet_bot.png" />

            <Label FontSize="32"
                   HorizontalOptions="Center"
                   SemanticProperties.HeadingLevel="Level1"
                   Text="Hello, World!" />

            <Label FontSize="18"
                   HorizontalOptions="Center"
                   SemanticProperties.Description="Welcome to dot net Multi platform App U I"
                   SemanticProperties.HeadingLevel="Level2"
                   Text="Welcome to &#10;.NET Multi-platform App UI" />

            <Button x:Name="CounterBtn"
                    Clicked="OnCounterClicked"
                    HorizontalOptions="Fill"
                    SemanticProperties.Hint="Counts the number of times you click"
                    Text="Click me" />

        </VerticalStackLayout>
    </ScrollView>
</ContentPage>
```

## MainPage.xaml.cs — Code Behind com contador

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

**Insight:** O `SemanticScreenReader.Announce()` faz o leitor de tela anunciar o novo texto do botao apos cada clique — acessibilidade em acao.

## Conexao XAML ↔ Code Behind

A tag `x:Class` no XAML **deve** corresponder exatamente ao namespace + nome da classe no .cs:

```xml
<!-- No XAML -->
x:Class="PlanShare.App.MainPage"
```

```csharp
// No C#
namespace PlanShare.App;
public partial class MainPage : ContentPage { }
```

Se renomear a classe para `HomePage`, atualize ambos:

```xml
x:Class="PlanShare.App.HomePage"
```

```csharp
namespace PlanShare.App;
public partial class HomePage : ContentPage { }
```

## App.xaml — Importando estilos globais

```xml
<Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.App">

    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
                <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>
```

**Insight do instrutor:** E neste arquivo que voce importa estilos, cores e fontes para padronizar todo o app. Exemplo: definir que todos os botoes tenham mesma cor, fonte e tamanho.

## .csproj — Removendo Tizen

Antes (com Tizen comentado):
```xml
<!-- <TargetFrameworks>$(TargetFrameworks);net8.0-tizen</TargetFrameworks> -->
```

Depois (limpo):
```xml
<!-- Simplesmente delete as linhas de Tizen -->
```