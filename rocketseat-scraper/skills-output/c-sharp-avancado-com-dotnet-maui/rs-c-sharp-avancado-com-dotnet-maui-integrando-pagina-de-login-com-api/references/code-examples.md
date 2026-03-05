# Code Examples: Integrando Paginas .NET MAUI com API

## Interface Refit completa para Login

```csharp
// Data/Network/API/ILoginAPI.cs
using PlanShare.App.Data.Network.Request;
using PlanShare.App.Data.Network.Response;
using Refit;

namespace PlanShare.App.Data.Network.API;

public interface ILoginAPI
{
    [Post("/login")]
    Task<ResponseRegisterUserJSON> Login([Body] RequestLoginJSON request);
}
```

Comparacao com a interface de Register:

```csharp
// Data/Network/API/IUserAPI.cs (ja existente)
public interface IUserAPI
{
    [Post("/users")]
    Task<ResponseRegisterUserJSON> Register([Body] RequestRegisterUserJSON request);
}
```

Note: ambas retornam `ResponseRegisterUserJSON` — mesma resposta da API.

## Interface do UseCase

```csharp
// UseCases/Login/IDoLoginUseCase.cs
using PlanShare.App.Models;

namespace PlanShare.App.UseCases.Login;

public interface IDoLoginUseCase
{
    Task Execute(Login login);
}
```

## Implementacao completa do UseCase

```csharp
// UseCases/Login/DoLoginUseCase.cs
using PlanShare.App.Data.Network.API;
using PlanShare.App.Data.Network.Request;
using PlanShare.App.Models;

namespace PlanShare.App.UseCases.Login;

public class DoLoginUseCase : IDoLoginUseCase
{
    private readonly ILoginAPI _loginAPI;

    public DoLoginUseCase(ILoginAPI loginAPI)
    {
        _loginAPI = loginAPI;
    }

    public async Task Execute(Login login)
    {
        var request = new RequestLoginJSON
        {
            Email = login.Email,
            Password = login.Password
        };

        var result = await _loginAPI.Login(request);
    }
}
```

## Registro no MauiProgram.cs

```csharp
// Refit client para Login
builder.Services.AddRefitClient<ILoginAPI>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiUrl));

// UseCase para Login
builder.Services.AddTransient<IDoLoginUseCase, DoLoginUseCase>();
```

Truque do instrutor para duplicar registros rapido:
1. Clique no final da linha do UseCase ja registrado
2. Ctrl+D para duplicar
3. Troque interface e classe

## ViewModel completa

```csharp
// Pages/Login/DoLoginViewModel.cs
using PlanShare.App.Models;
using PlanShare.App.UseCases.Login;

namespace PlanShare.App.Pages.Login;

public class DoLoginViewModel
{
    private readonly IDoLoginUseCase _doLoginUseCase;

    public Login Model { get; set; } = new();
    public Models.StatusPage StatusPage { get; set; }

    public DoLoginViewModel(IDoLoginUseCase doLoginUseCase)
    {
        _doLoginUseCase = doLoginUseCase;
    }

    public async Task DoLogin()
    {
        StatusPage = Models.StatusPage.Sending;

        await _doLoginUseCase.Execute(Model);

        StatusPage = Models.StatusPage.Default;
    }
}
```

Nota: `Models.StatusPage` usa caminho completo porque o nome da propriedade `StatusPage` conflita com o nome do enum.

## XAML completo com triggers e animacao

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:animation="clr-namespace:PlanShare.App.Components"
             xmlns:models="clr-namespace:PlanShare.App.Models">

    <!-- Formulario - visivel quando StatusPage == Default -->
    <VerticalStackLayout IsVisible="False">
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Default}">
                <Setter Property="IsVisible" Value="True"/>
            </DataTrigger>
        </VerticalStackLayout.Triggers>

        <!-- Campos de email e senha aqui -->
        <Entry Placeholder="E-mail" Text="{Binding Model.Email}" />
        <Entry Placeholder="Senha" Text="{Binding Model.Password}" IsPassword="True" />
        <Button Text="Login" Command="{Binding DoLoginCommand}" />
    </VerticalStackLayout>

    <!-- Animacao - visivel quando StatusPage == Sending -->
    <animation:AnimationSendInformationComponent IsVisible="False">
        <animation:AnimationSendInformationComponent.Triggers>
            <DataTrigger TargetType="animation:AnimationSendInformationComponent"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Sending}">
                <Setter Property="IsVisible" Value="True"/>
            </DataTrigger>
        </animation:AnimationSendInformationComponent.Triggers>
    </animation:AnimationSendInformationComponent>

</ContentPage>
```

## Estrutura de pastas resultante

```
PlanShare.App/
├── Data/
│   └── Network/
│       ├── API/
│       │   ├── IUserAPI.cs          # Register endpoint
│       │   └── ILoginAPI.cs         # Login endpoint (NOVO)
│       ├── Request/
│       │   ├── RequestRegisterUserJSON.cs
│       │   └── RequestLoginJSON.cs
│       └── Response/
│           └── ResponseRegisterUserJSON.cs  # Compartilhado
├── UseCases/
│   ├── Register/
│   │   ├── IDoRegisterUseCase.cs
│   │   └── DoRegisterUseCase.cs
│   └── Login/                       # NOVO
│       ├── IDoLoginUseCase.cs
│       └── DoLoginUseCase.cs
├── Pages/
│   └── Login/
│       ├── DoLoginViewModel.cs
│       └── DoLoginPage.xaml
├── Models/
│   ├── Login.cs
│   └── StatusPage.cs               # Enum: Default, Sending
└── Components/
    └── AnimationSendInformationComponent.xaml  # Reutilizado
```

## Fluxo de debug demonstrado

1. Breakpoint no construtor da ViewModel → verificar que UseCase foi injetado (nao nulo)
2. Breakpoint no controller da API → simular delay para ver animacao
3. F10 (step over) para avancar e ver resposta
4. F5 para continuar — StatusPage volta para Default