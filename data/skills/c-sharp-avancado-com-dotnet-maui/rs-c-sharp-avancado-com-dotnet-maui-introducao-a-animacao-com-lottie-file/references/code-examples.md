# Code Examples: Animacoes Lottie no .NET MAUI

## 1. Instalacao via CLI

```bash
dotnet add package SkiaSharp.Extended.UI.Maui --version 2.0.0
```

## 2. Configuracao no MauiProgram.cs

```csharp
using SkiaSharp.Views.Maui.Controls.Hosting;

namespace PlanShare;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .UseSkiaSharp();  // Adicionar esta linha

        return builder.Build();
    }
}
```

## 3. Estrutura de pastas

```
PlanShare/
├── Resources/
│   ├── Raw/
│   │   └── airplane.json    ← Lottie animation file
│   ├── Images/
│   ├── Fonts/
│   └── ...
├── MauiProgram.cs
└── ...
```

## 4. Exemplo completo de pagina com loading Lottie

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skia="clr-namespace:SkiaSharp.Extended.UI.Controls;assembly=SkiaSharp.Extended.UI"
             x:Class="PlanShare.Views.RegisterPage">

    <Grid>
        <!-- Formulario: visivel quando NAO esta carregando -->
        <StackLayout IsVisible="{Binding IsNotLoading}">
            <Label Text="Criar Conta" FontSize="24" />
            <Entry Placeholder="Nome" Text="{Binding Name}" />
            <Entry Placeholder="Email" Text="{Binding Email}" />
            <Entry Placeholder="Senha" Text="{Binding Password}" IsPassword="True" />
            <Button Text="Registrar" Clicked="OnRegisterClicked" />
        </StackLayout>

        <!-- Animacao Lottie: visivel quando ESTA carregando -->
        <skia:SKLottieView
            Source="airplane.json"
            RepeatCount="-1"
            IsVisible="{Binding IsLoading}"
            HeightRequest="200"
            WidthRequest="200"
            HorizontalOptions="Center"
            VerticalOptions="Center" />
    </Grid>
</ContentPage>
```

## 5. Code-behind com controle de loading

```csharp
public partial class RegisterPage : ContentPage
{
    private bool _isLoading;
    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            _isLoading = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(IsNotLoading));
        }
    }

    public bool IsNotLoading => !IsLoading;

    private readonly ApiService _apiService;

    public RegisterPage(ApiService apiService)
    {
        InitializeComponent();
        _apiService = apiService;
        BindingContext = this;
    }

    async void OnRegisterClicked(object sender, EventArgs e)
    {
        IsLoading = true;

        try
        {
            var user = new User { Name = Name, Email = Email, Password = Password };
            await _apiService.RegisterUser(user);

            // Sucesso: navegar para dashboard
            await Navigation.PushAsync(new DashboardPage());
        }
        catch (Exception ex)
        {
            // Erro: mostrar mensagem
            await DisplayAlert("Erro", ex.Message, "OK");
        }
        finally
        {
            // Restaurar elementos visuais
            IsLoading = false;
        }
    }
}
```

## 6. Propriedades do SKLottieView

```xml
<!-- Loop infinito -->
<skia:SKLottieView
    Source="airplane.json"
    RepeatCount="-1" />

<!-- Reproduzir uma vez -->
<skia:SKLottieView
    Source="airplane.json"
    RepeatCount="0" />

<!-- Reproduzir 3 vezes -->
<skia:SKLottieView
    Source="airplane.json"
    RepeatCount="3" />
```

## 7. Controlando animacao via codigo

```csharp
// Pausar animacao
lottieView.IsAnimationEnabled = false;

// Retomar animacao
lottieView.IsAnimationEnabled = true;
```