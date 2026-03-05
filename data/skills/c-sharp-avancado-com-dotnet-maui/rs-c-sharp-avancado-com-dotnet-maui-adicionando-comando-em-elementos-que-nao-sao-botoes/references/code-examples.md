# Code Examples: Comandos em Elementos Não-Botão (.NET MAUI)

## 1. Estrutura de pastas para páginas

```
Views/
└── Pages/
    ├── Login/
    │   └── LoginPage.xaml
    ├── Onboard/
    │   └── OnboardPage.xaml
    └── User/
        ├── Register/
        │   ├── RegisterUserAccountPage.xaml
        │   └── RegisterUserAccountPage.xaml.cs
        ├── Update/
        └── Delete/
```

## 2. Página mínima criada (RegisterUserAccountPage.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.Views.Pages.User.Register.RegisterUserAccountPage"
             Title="">

    <Label Text="Criar minha conta" />

</ContentPage>
```

Notas:
- `Title=""` remove o título da barra de navegação (não da barra de status)
- Removidos `VerticalOptions="Center"` e `HorizontalOptions="Center"` do template padrão

## 3. Classe RoutePages completa

```csharp
namespace PlanShare.App.Navigation;

public class RoutePages
{
    // Onboarding
    public const string OnboardPage = "OnboardingPage";

    // Login
    public const string LoginPage = "LoginPage";

    // User
    public const string UserRegisterAccountPage = "RegisterUserAccountPage";
    // Futuras rotas seguindo o padrão:
    // public const string UserUpdateAccountPage = "UpdateUserAccountPage";
    // public const string UserDeleteAccountPage = "DeleteUserAccountPage";
    // public const string UserChangePasswordPage = "ChangePasswordPage";
}
```

## 4. Registro de rotas no Program.cs

```csharp
// Antes (hardcoded):
Routing.RegisterRoute("LoginPage", typeof(LoginPage));

// Depois (com constantes):
Routing.RegisterRoute(RoutePages.LoginPage, typeof(LoginPage));
Routing.RegisterRoute(RoutePages.UserRegisterAccountPage, typeof(RegisterUserAccountPage));
```

## 5. AppShell.xaml com constante via x:Static

```xml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:pages="clr-namespace:PlanShare.App.Views.Pages.Onboard"
       xmlns:navigation="clr-namespace:PlanShare.App.Navigation"
       x:Class="PlanShare.App.AppShell">

    <ShellContent
        Route="{x:Static navigation:RoutePages.OnboardPage}"
        ContentTemplate="{DataTemplate pages:OnboardPage}" />

</Shell>
```

## 6. OnboardingViewModel com comandos

```csharp
// Antes (hardcoded, múltiplas linhas):
[RelayCommand]
async Task GoToLogin()
{
    await Shell.Current.GoToAsync("LoginPage");
}

// Depois (constante, arrow function):
[RelayCommand]
async Task GoToLogin() =>
    await Shell.Current.GoToAsync(RoutePages.LoginPage);

[RelayCommand]
async Task GoToRegisterUserAccount() =>
    await Shell.Current.GoToAsync(RoutePages.UserRegisterAccountPage);
```

## 7. GestureRecognizer direto no Label (funciona mas ruim para UX)

```xml
<Label Text="Não tem uma conta? Crie a sua conta">
    <Label.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding RegisterUserAccountCommand}" />
    </Label.GestureRecognizers>
</Label>
```

## 8. GestureRecognizer em Image (sintaxe similar)

```xml
<Image Source="eye_icon.png">
    <Image.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding TogglePasswordVisibilityCommand}" />
    </Image.GestureRecognizers>
</Image>
```

## 9. Padrão final com área de toque ampliada

```xml
<VerticalStackLayout HeightRequest="40" Padding="0,7,0,0">
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding RegisterUserAccountCommand}" />
    </VerticalStackLayout.GestureRecognizers>

    <Label Text="Não tem uma conta? Crie a sua conta"
           FontSize="18" />
</VerticalStackLayout>
```

## 10. Debug visual com BackgroundColor

```xml
<!-- Use temporariamente para visualizar área de toque -->
<VerticalStackLayout HeightRequest="40" BackgroundColor="Blue">
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding SomeCommand}" />
    </VerticalStackLayout.GestureRecognizers>

    <Label Text="Texto clicável" BackgroundColor="Red" />
</VerticalStackLayout>

<!-- Remova BackgroundColor antes de commitar — default transparente esconde o truque -->
```

## 11. NumberOfTapsRequired (uso raro)

```xml
<!-- Comando só executa após 5 toques consecutivos -->
<TapGestureRecognizer
    Command="{Binding SecretCommand}"
    NumberOfTapsRequired="5" />
```

## 12. Outros GestureRecognizers disponíveis

```xml
<!-- Swipe (deslizar) -->
<SwipeGestureRecognizer Direction="Left" Command="{Binding SwipeLeftCommand}" />

<!-- Pointer (mouse hover — desktop) -->
<PointerGestureRecognizer PointerEnteredCommand="{Binding HoverCommand}" />

<!-- Drop (drag and drop) -->
<DropGestureRecognizer AllowDrop="True" DropCommand="{Binding DropCommand}" />
```