# Code Examples: Use Case Layer em .NET MAUI

## 1. Estrutura completa de pastas criada na aula

```
PlanShare.App/
├── UseCases/
│   └── User/
│       └── Register/
│           ├── IRegisterUserUseCase.cs
│           └── RegisterUserUseCase.cs
├── Models/
│   └── UserRegisterAccount.cs
├── ViewModels/
│   └── RegisterAccountViewModel.cs
└── MauiProgram.cs
```

## 2. Interface do Use Case

```csharp
// UseCases/User/Register/IRegisterUserUseCase.cs
using PlanShare.App.Models;

public interface IRegisterUserUseCase
{
    Task Execute(UserRegisterAccount user);
}
```

Nota: por enquanto retorna apenas `Task` (caminho feliz). Em aulas futuras, o instrutor promete implementar um result pattern para retornar sucesso/erro.

## 3. Implementacao do Use Case

```csharp
// UseCases/User/Register/RegisterUserUseCase.cs
using PlanShare.App.Models;
using PlanShare.Communication.Requests;

public class RegisterUserUseCase : IRegisterUserUseCase
{
    private readonly IUserApi _userApi;

    public RegisterUserUseCase(IUserApi userApi)
    {
        _userApi = userApi;
    }

    public async Task Execute(UserRegisterAccount user)
    {
        // Mapeamento manual: Model → Request JSON
        var request = new RequestRegisterUserJson
        {
            Name = user.Name,
            Email = user.Email,
            Password = user.Password
        };

        // Chamada a API via Refit
        var response = await _userApi.Register(request);
    }
}
```

## 4. Registro no container de DI

```csharp
// MauiProgram.cs — funcao de extensao separada
public static class UseCasesExtensions
{
    public static void AddUseCases(this IServiceCollection services)
    {
        services.AddTransient<IRegisterUserUseCase, RegisterUserUseCase>();
    }
}
```

```csharp
// MauiProgram.cs — chamada na configuracao
public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();

    // ... outras configuracoes ...

    builder.Services.AddUseCases(); // NAO esquecer de chamar!

    return builder.Build();
}
```

## 5. ViewModel consumindo o Use Case

```csharp
// ViewModels/RegisterAccountViewModel.cs
public partial class RegisterAccountViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;
    private readonly IRegisterUserUseCase _registerUserUseCase;

    public RegisterAccountViewModel(
        INavigationService navigationService,
        IRegisterUserUseCase registerUserUseCase)
    {
        _navigationService = navigationService;
        _registerUserUseCase = registerUserUseCase;
    }

    [ObservableProperty]
    private UserRegisterAccount model;

    [RelayCommand]
    private async Task RegisterAccount()
    {
        // Model com M maiusculo — propriedade gerada pelo toolkit
        await _registerUserUseCase.Execute(Model);
    }
}
```

## 6. Interface Refit renomeada

```csharp
// Antes (nome que o instrutor nao gostou):
public interface IUserApiClient
{
    [Post("/api/user")]
    Task<CommunicationResponse<ResponseRegisterUserJson>> Register(
        RequestRegisterUserJson request);
}

// Depois (seguindo padrao da documentacao do Refit):
public interface IUserApi
{
    [Post("/api/user")]
    Task<CommunicationResponse<ResponseRegisterUserJson>> Register(
        RequestRegisterUserJson request);
}
```

## 7. O que NAO fazer — exemplo da aula

O instrutor mostrou e desfez este codigo para ilustrar o anti-pattern:

```csharp
// ERRADO — API client direto na ViewModel
public RegisterAccountViewModel(
    INavigationService navigationService,
    IUserApi userApi)  // ← NAO faca isso
{
    _navigationService = navigationService;
    _userApi = userApi;
}

[RelayCommand]
private async Task RegisterAccount()
{
    // Toda a logica de mapeamento, tratamento de erro,
    // armazenamento de token ficaria aqui — ERRADO
    await _userApi.Register(request);
}
```

## 8. Mapeamento manual vs AutoMapper

```csharp
// MANUAL (recomendado para mobile) — usado na aula
var request = new RequestRegisterUserJson
{
    Name = user.Name,
    Email = user.Email,
    Password = user.Password
};

// AUTOMAPPER (aceitavel apenas no backend)
// var request = _mapper.Map<RequestRegisterUserJson>(user);
// Consome mais memoria e CPU — evitar em apps mobile
```