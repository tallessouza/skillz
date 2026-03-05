# Code Examples: MVVM em .NET MAUI

## Estrutura basica de um projeto MVVM

```
MeuApp/
├── Models/
│   ├── User.cs              # Entidade
│   ├── LoginRequest.cs      # DTO
│   └── AuthService.cs       # Comunicacao com API
├── Views/
│   ├── LoginPage.xaml        # Definicao visual
│   └── LoginPage.xaml.cs     # Code Behind (minimo)
└── ViewModels/
    └── LoginViewModel.cs     # Propriedades + Comandos
```

## Model — Entidade

```csharp
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
}
```

## Model — Service (comunicacao com API)

```csharp
public class AuthService
{
    private readonly HttpClient httpClient;

    public AuthService(HttpClient httpClient)
    {
        this.httpClient = httpClient;
    }

    public async Task<User> Login(string email, string password)
    {
        var request = new LoginRequest { Email = email, Password = password };
        var response = await httpClient.PostAsJsonAsync("/api/login", request);
        return await response.Content.ReadFromJsonAsync<User>();
    }
}
```

## ViewModel — Completa com INotifyPropertyChanged

```csharp
public class LoginViewModel : INotifyPropertyChanged
{
    private readonly AuthService authService;

    private string email;
    public string Email
    {
        get => email;
        set
        {
            email = value;
            OnPropertyChanged();
        }
    }

    private string password;
    public string Password
    {
        get => password;
        set
        {
            password = value;
            OnPropertyChanged();
        }
    }

    private bool isAdmin;
    public bool IsAdmin
    {
        get => isAdmin;
        set
        {
            isAdmin = value;
            OnPropertyChanged(); // Notifica a View que IsAdmin mudou
        }
    }

    private string statusMessage;
    public string StatusMessage
    {
        get => statusMessage;
        set
        {
            statusMessage = value;
            OnPropertyChanged();
        }
    }

    public ICommand LoginCommand { get; }

    public LoginViewModel(AuthService authService)
    {
        this.authService = authService;
        LoginCommand = new Command(async () => await ExecuteLogin());
    }

    private async Task ExecuteLogin()
    {
        // ViewModel chama o Model (AuthService)
        // ViewModel NAO manipula elementos visuais
        var user = await authService.Login(Email, Password);
        IsAdmin = user.IsAdmin;
        StatusMessage = $"Bem-vindo, {user.Name}!";
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

## View — XAML com DataBinding

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MeuApp.Views.LoginPage">

    <VerticalStackLayout Padding="20" Spacing="15">

        <Entry Placeholder="E-mail"
               Text="{Binding Email}" />

        <Entry Placeholder="Senha"
               IsPassword="True"
               Text="{Binding Password}" />

        <Button Text="Login"
                Command="{Binding LoginCommand}" />

        <Label Text="{Binding StatusMessage}"
               FontSize="16"
               TextColor="Green" />

        <!-- Elemento controlado pela ViewModel, nao pelo Code Behind -->
        <StackLayout IsVisible="{Binding IsAdmin}">
            <Label Text="Painel Administrativo"
                   FontSize="24"
                   FontAttributes="Bold" />
        </StackLayout>

    </VerticalStackLayout>
</ContentPage>
```

## View — Code Behind minimo

```csharp
public partial class LoginPage : ContentPage
{
    public LoginPage(LoginViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel; // Conecta View com ViewModel
    }
}
```

## Code Behind aceitavel — calculo visual proporcional

```csharp
public partial class BannerPage : ContentPage
{
    public BannerPage()
    {
        InitializeComponent();

        // OK: logica puramente visual, nao e regra de negocio
        var displayInfo = DeviceDisplay.MainDisplayInfo;
        var screenWidth = displayInfo.Width / displayInfo.Density;

        // Altura proporcional: 50% da largura
        bannerImage.WidthRequest = screenWidth;
        bannerImage.HeightRequest = screenWidth * 0.5;
    }
}
```

## Fluxo completo: usuario toca no botao Login

```
1. Usuario toca "Login"
2. View dispara o Command (LoginCommand) via binding
3. ViewModel.ExecuteLogin() e chamado
4. ViewModel chama Model (AuthService.Login)
5. Model se comunica com API, retorna User
6. ViewModel atualiza propriedades (IsAdmin, StatusMessage)
7. OnPropertyChanged dispara notificacao
8. View recebe notificacao e atualiza UI automaticamente
```