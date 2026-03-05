# Code Examples: Criando Páginas .NET MAUI com ViewModel

## Exemplo completo: ViewModel

```csharp
// ViewModels/Pages/User/ChangePassword/ChangeUserPasswordViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using PlanShare.App.Models;
using PlanShare.App.Services;

namespace PlanShare.App.ViewModels.Pages.User.ChangePassword;

public partial class ChangeUserPasswordViewModel : ViewModelBase
{
    public ChangeUserPasswordViewModel(INavigationService navigationService)
        : base(navigationService) { }

    [ObservableProperty]
    private ChangePassword _model = new();
}
```

## Exemplo completo: Model

```csharp
// Models/ChangePassword.cs
namespace PlanShare.App.Models;

public class ChangePassword
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
```

## Exemplo completo: CodeBehind

```csharp
// Views/Pages/User/ChangePassword/ChangeUserPasswordPage.xaml.cs
using PlanShare.App.ViewModels.Pages.User.ChangePassword;

namespace PlanShare.App.Views.Pages.User.ChangePassword;

public partial class ChangeUserPasswordPage : ContentPage
{
    public ChangeUserPasswordPage(ChangeUserPasswordViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## Exemplo completo: XAML da página

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Pages.User.ChangePassword"
             xmlns:animation="clr-namespace:PlanShare.App.Components.Animation"
             xmlns:inputs="clr-namespace:PlanShare.App.Components.Inputs"
             xmlns:resource="clr-namespace:PlanShare.App.Resources"
             xmlns:models="clr-namespace:PlanShare.App.Models"
             x:Class="PlanShare.App.Views.Pages.User.ChangePassword.ChangeUserPasswordPage"
             x:DataType="viewmodel:ChangeUserPasswordViewModel">

    <VerticalStackLayout Spacing="30" Padding="20">

        <!-- Animação de loading (inicialmente invisível) -->
        <animation:LottieAnimation IsVisible="false" />

        <!-- Título -->
        <Label Text="{x:Static resource:ResourceText.ChangePassword}"
               Style="{StaticResource TitleLabel}" />

        <!-- Senha atual -->
        <inputs:EntryLabelPassword
            Title="{x:Static resource:ResourceText.CurrentPassword}"
            Password="{Binding Model.CurrentPassword}" />

        <!-- Nova senha -->
        <inputs:EntryLabelPassword
            Title="{x:Static resource:ResourceText.NewPassword}"
            Password="{Binding Model.NewPassword}" />

        <!-- Botão -->
        <Button Text="{x:Static resource:ResourceText.ChangePassword}"
                Margin="0,40,0,0"
                Style="{StaticResource PrimaryButton}" />

    </VerticalStackLayout>
</ContentPage>
```

## Registro no MauiProgram

```csharp
// MauiProgram.cs — dentro do método de registro de DI
builder.Services.AddTransient<ChangeUserPasswordViewModel>();
builder.Services.AddTransient<ChangeUserPasswordPage>();

// Registro de rota
Routing.RegisterRoute(RoutesPages.UserChangePasswordPage, typeof(ChangeUserPasswordPage));
```

## Constante de rota

```csharp
// RoutesPages.cs
public static class RoutesPages
{
    // ... outras rotas ...
    public const string UserChangePasswordPage = "userChangePasswordPage";
}
```

## Comando de navegação na ViewModel de origem

```csharp
// UserProfileViewModel.cs
[RelayCommand]
public async Task ChangePassword()
{
    await _navigationService.NavigateToAsync(RoutesPages.UserChangePasswordPage);
}
```

## Binding do comando no XAML de origem

```xml
<!-- Na página de perfil do usuário -->
<Button Text="{x:Static resource:ResourceText.ChangePassword}"
        Command="{Binding ChangePasswordCommand}" />
```

## Cálculo de margens (técnica do instrutor)

```
Spacing do StackLayout = 30 (espaço automático entre elementos)
Margem desejada entre botão e elemento acima = 70

Margin do botão = 70 - 30 = 40
Portanto: Margin="0,40,0,0"
```