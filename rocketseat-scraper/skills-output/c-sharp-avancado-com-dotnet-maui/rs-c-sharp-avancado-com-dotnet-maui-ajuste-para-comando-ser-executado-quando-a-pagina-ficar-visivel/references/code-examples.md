# Code Examples: EventToCommandBehavior Binding

## Exemplo completo da pagina XAML

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:xct="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             xmlns:vm="clr-namespace:App.ViewModels"
             x:Class="App.Views.UserProfilePage"
             x:DataType="vm:UserProfileViewModel"
             x:Name="pageUserProfile">

    <ContentPage.Behaviors>
        <xct:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding Path=BindingContext.InitializeCommand,
                              Source={Reference pageUserProfile}}" />
    </ContentPage.Behaviors>

    <VerticalStackLayout>
        <!-- Avatar, nome, email, etc -->
    </VerticalStackLayout>
</ContentPage>
```

## Code-behind

```csharp
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## ViewModel com o comando

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    [RelayCommand]
    private async Task Initialize()
    {
        // Recupera dados do perfil da API
        var accessToken = await SecureStorage.GetAsync("access_token");
        var response = await _userService.GetProfile(accessToken);

        if (response.IsSuccess)
        {
            Name = response.Data.Name;
            Email = response.Data.Email;
        }
    }
}
```

## Convencao de nomeacao x:Name para paginas

| Classe | x:Name correto | x:Name ERRADO |
|--------|----------------|---------------|
| `UserProfilePage` | `pageUserProfile` | `UserProfilePage` |
| `DashboardPage` | `pageDashboard` | `DashboardPage` |
| `LoginPage` | `pageLogin` | `LoginPage` |
| `SettingsPage` | `pageSettings` | `SettingsPage` |

## Comparacao: Button vs EventToCommandBehavior

### Button (binding simples funciona)
```xml
<Button Text="Salvar"
        Command="{Binding SaveCommand}" />
```
O Button herda o BindingContext da pagina naturalmente. Nao precisa de Path + Source.

### EventToCommandBehavior (requer Path + Source)
```xml
<xct:EventToCommandBehavior
    EventName="Appearing"
    Command="{Binding Path=BindingContext.InitializeCommand,
                      Source={Reference pageUserProfile}}" />
```
O Behavior NAO resolve o BindingContext sozinho. Precisa de caminho explicito.

## Debugging: como saber se o comando esta executando

1. Coloque um breakpoint na funcao `Initialize()` da ViewModel
2. Execute o app e navegue ate a pagina
3. Se o breakpoint NAO bater: o binding esta incorreto
4. Se o breakpoint bater: o comando esta conectado corretamente