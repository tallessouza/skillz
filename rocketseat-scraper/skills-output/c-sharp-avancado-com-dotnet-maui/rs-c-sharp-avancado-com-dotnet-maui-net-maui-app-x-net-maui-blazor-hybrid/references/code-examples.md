# Code Examples: .NET MAUI App vs .NET MAUI Blazor Hybrid

## Estrutura de projeto — .NET MAUI App

```
MyMauiApp/
├── App.xaml              # Recursos globais da aplicacao
├── App.xaml.cs           # Logica de inicializacao
├── MainPage.xaml         # Interface grafica em XAML
├── MainPage.xaml.cs      # Code-behind (logica C#)
├── MauiProgram.cs        # Entry point e configuracao
└── Platforms/            # Codigo especifico por plataforma
    ├── Android/
    ├── iOS/
    ├── MacCatalyst/
    └── Windows/
```

## Estrutura de projeto — .NET MAUI Blazor Hybrid

```
MyMauiBlazorApp/
├── App.xaml
├── App.xaml.cs
├── MainPage.xaml          # Contem o BlazorWebView
├── MauiProgram.cs
├── Pages/
│   └── Index.razor        # Componente Blazor (HTML/CSS)
├── Shared/
│   └── MainLayout.razor   # Layout Blazor
└── wwwroot/
    └── css/               # Estilos CSS
```

## Exemplo basico — MAUI App (XAML + C#)

### MainPage.xaml (visual)
```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MyApp.MainPage">

    <VerticalStackLayout Spacing="20" Padding="30">
        <Label Text="Bem-vindo ao .NET MAUI App"
               FontSize="24"
               HorizontalOptions="Center" />

        <Entry x:Name="NameEntry"
               Placeholder="Digite seu nome" />

        <Button Text="Saudar"
                Clicked="OnGreetClicked" />

        <Label x:Name="GreetingLabel"
               FontSize="18"
               HorizontalOptions="Center" />
    </VerticalStackLayout>

</ContentPage>
```

### MainPage.xaml.cs (logica C#)
```csharp
namespace MyApp;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();
    }

    private void OnGreetClicked(object sender, EventArgs e)
    {
        string name = NameEntry.Text;
        GreetingLabel.Text = $"Ola, {name}! Bem-vindo!";
    }
}
```

## Exemplo equivalente — Blazor Hybrid (HTML/CSS + C#)

### MainPage.xaml (contem a WebView)
```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:MyBlazorApp"
             x:Class="MyBlazorApp.MainPage">

    <BlazorWebView HostPage="wwwroot/index.html">
        <BlazorWebView.RootComponents>
            <RootComponent Selector="#app" ComponentType="{x:Type local:Pages.Index}" />
        </BlazorWebView.RootComponents>
    </BlazorWebView>

</ContentPage>
```

### Pages/Index.razor (componente Blazor)
```razor
@page "/"

<div style="padding: 30px; text-align: center;">
    <h1>Bem-vindo ao .NET MAUI Blazor Hybrid</h1>

    <input @bind="name" placeholder="Digite seu nome" />

    <button @onclick="Greet">Saudar</button>

    <p>@greeting</p>
</div>

@code {
    private string name = "";
    private string greeting = "";

    private void Greet()
    {
        greeting = $"Ola, {name}! Bem-vindo!";
    }
}
```

## Comparacao visual lado a lado

| Conceito | MAUI App (XAML) | Blazor Hybrid (HTML) |
|----------|-----------------|----------------------|
| Botao | `<Button Text="Clique" />` | `<button>Clique</button>` |
| Label | `<Label Text="Texto" />` | `<p>Texto</p>` |
| Input | `<Entry Placeholder="..." />` | `<input placeholder="..." />` |
| Layout vertical | `<VerticalStackLayout>` | `<div style="display:flex; flex-direction:column">` |
| Evento de clique | `Clicked="Handler"` | `@onclick="Handler"` |
| Binding | `Text="{Binding Name}"` | `@bind="name"` |

## Criando projetos via CLI

```bash
# .NET MAUI App
dotnet new maui -n MyMauiApp

# .NET MAUI Blazor Hybrid
dotnet new maui-blazor -n MyBlazorApp
```