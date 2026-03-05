# Code Examples: Criando Tela de Perfil e Navegacao

## Exemplo 1: ViewModel completa

```csharp
// ViewModels/Pages/User/Profile/UserProfileViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;

namespace PlainShare.App.ViewModels.Pages.User.Profile;

public partial class UserProfileViewModel : ViewModelBase
{
    // Sera expandida nas proximas aulas com propriedades de nome, email, foto
}
```

## Exemplo 2: Page CodeBehind com DI

```csharp
// Pages/User/Profile/UserProfilePage.xaml.cs
using PlainShare.App.ViewModels.Pages.User.Profile;

namespace PlainShare.App.Pages.User.Profile;

public partial class UserProfilePage : ContentPage
{
    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## Exemplo 3: XAML da page com DataType

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlainShare.App.ViewModels.Pages.User.Profile"
             x:Class="PlainShare.App.Pages.User.Profile.UserProfilePage"
             x:DataType="viewModel:UserProfileViewModel">

    <!-- Conteudo da pagina -->

</ContentPage>
```

## Exemplo 4: Registro no MauiProgram

```csharp
// No metodo addPages do MauiProgram.cs
builder.Services.AddTransient<UserProfilePage>();
builder.Services.AddTransient<UserProfileViewModel>();

// Registro de rota
Routing.RegisterRoute(RoutePages.UserUpdateProfilePage, typeof(UserProfilePage));
```

## Exemplo 5: DashboardViewModel com comando de navegacao

```csharp
public partial class DashboardViewModel : ViewModelBase
{
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string _username;

    public DashboardViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    private async Task CProfile()
    {
        await _navigationService.GoToAsync(RoutePages.UserUpdateProfilePage);
    }
}
```

## Exemplo 6: Dashboard XAML com GestureRecognizers

```xml
<!-- Avatar com gesto de toque -->
<AvatarView HeightRequest="62" WidthRequest="62">
    <AvatarView.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding CProfileCommand}" />
    </AvatarView.GestureRecognizers>
</AvatarView>

<!-- Textos de boas-vindas com gesto de toque -->
<VerticalStackLayout>
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding CProfileCommand}" />
    </VerticalStackLayout.GestureRecognizers>

    <Label Text="Bem-vindo(a)" />
    <Label Text="{Binding Username}" />
</VerticalStackLayout>
```

## Exemplo 7: Constantes de rotas

```csharp
public static class RoutePages
{
    public const string UserRegisterAccountPage = "User_RegisterAccountPage";
    public const string UserUpdateProfilePage = "User_UpdateProfilePage";
    // ... outras rotas
}
```

## Variacao: Tag simplificada vs extenso

```xml
<!-- SIMPLIFICADA (sem filhos) -->
<AvatarView HeightRequest="62" WidthRequest="62" />

<!-- EXTENSO (quando precisa de GestureRecognizers) -->
<AvatarView HeightRequest="62" WidthRequest="62">
    <AvatarView.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding CProfileCommand}" />
    </AvatarView.GestureRecognizers>
</AvatarView>
```