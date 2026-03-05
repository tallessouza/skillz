---
name: rs-csharp-maui-usecase-layer
description: "Enforces Use Case layer separation in .NET MAUI apps when writing ViewModels, commands, or API integration code. Use when user asks to 'connect to API', 'call endpoint from ViewModel', 'implement registration', 'add API client to ViewModel', or any MAUI MVVM integration task. Applies rules: never inject API clients directly into ViewModels, create Use Case classes to mediate, manual mapping over AutoMapper in mobile, register Use Cases as Transient. Make sure to use this skill whenever integrating API calls in .NET MAUI ViewModels. Not for API-side controller design, backend use cases, or web app architecture."
---

# Use Case Layer em .NET MAUI

> ViewModels nunca chamam API clients diretamente — sempre delegam para Use Cases que encapsulam regras de negocio, tratamento de erros e armazenamento de dados sensiveis.

## Rules

1. **Nunca injete API clients na ViewModel** — crie um Use Case intermediario, porque a ViewModel nao deve manipular tokens, tratar erros de rede, nem mapear dados. Ela funciona como um controller: recebe input, delega, reage ao output
2. **Use Cases recebem Models, nao requests** — o mapeamento de Model para Request JSON acontece dentro do Use Case, porque isso isola a ViewModel do formato de comunicacao com a API
3. **Mapeamento manual em apps mobile** — nao use AutoMapper/Mapster em apps mobile, porque bibliotecas de mapeamento consomem mais memoria e CPU, e voce nao controla o dispositivo do usuario. No servidor, tudo bem usar
4. **Registre Use Cases como Transient** — mesmo ciclo de vida das ViewModels, sem instancia permanente em memoria
5. **Use Case retorna resultado tipado** — a ViewModel precisa saber se deu sucesso ou erro para navegar para a pagina correta
6. **Passe a propriedade com letra maiuscula** — no Community Toolkit MVVM, passe `Model` (gerado pelo `[ObservableProperty]`), nunca `model` (campo privado)

## How to write

### Estrutura de pastas

```
UseCases/
└── User/
    └── Register/
        ├── IRegisterUserUseCase.cs
        └── RegisterUserUseCase.cs
```

### Interface do Use Case

```csharp
public interface IRegisterUserUseCase
{
    Task Execute(UserRegisterAccount user);
}
```

### Implementacao do Use Case

```csharp
public class RegisterUserUseCase : IRegisterUserUseCase
{
    private readonly IUserApi _userApi;

    public RegisterUserUseCase(IUserApi userApi)
    {
        _userApi = userApi;
    }

    public async Task Execute(UserRegisterAccount user)
    {
        var request = new RequestRegisterUserJson
        {
            Name = user.Name,
            Email = user.Email,
            Password = user.Password
        };

        var response = await _userApi.Register(request);
    }
}
```

### Registro no DI Container

```csharp
public static class UseCasesExtensions
{
    public static void AddUseCases(this IServiceCollection services)
    {
        services.AddTransient<IRegisterUserUseCase, RegisterUserUseCase>();
    }
}

// Em MauiProgram.cs:
builder.Services.AddUseCases();
```

### ViewModel consumindo o Use Case

```csharp
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

    [RelayCommand]
    private async Task RegisterAccount()
    {
        await _registerUserUseCase.Execute(Model); // M maiusculo!
    }
}
```

## Example

**Before (API client direto na ViewModel — errado):**
```csharp
public RegisterAccountViewModel(INavigationService nav, IUserApi userApi)
{
    _userApi = userApi;
}

[RelayCommand]
private async Task RegisterAccount()
{
    var request = new RequestRegisterUserJson { Name = model.Name, ... };
    var response = await _userApi.Register(request);
    // tratamento de token aqui? tratamento de erro aqui? NAO!
}
```

**After (com Use Case — correto):**
```csharp
public RegisterAccountViewModel(INavigationService nav, IRegisterUserUseCase useCase)
{
    _registerUserUseCase = useCase;
}

[RelayCommand]
private async Task RegisterAccount()
{
    await _registerUserUseCase.Execute(Model);
    // ViewModel so reage ao resultado: navegar ou mostrar erro
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ViewModel precisa chamar API | Crie um Use Case intermediario |
| Use Case precisa retornar sucesso/erro | Implemente um result pattern (aula futura) |
| Mapeamento Model → Request | Faca manual dentro do Use Case |
| Mapeamento no backend/API | AutoMapper/Mapster sao aceitaveis |
| Multiplas ViewModels usam mesma logica | Compartilhe o mesmo Use Case |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `IUserApi` no construtor da ViewModel | `IRegisterUserUseCase` no construtor da ViewModel |
| Tratar tokens na ViewModel | Tratar tokens no Use Case |
| `await _userApi.Register(request)` na ViewModel | `await _useCase.Execute(Model)` na ViewModel |
| `AutoMapper` em app mobile | Mapeamento manual propriedade por propriedade |
| Passar `model` (minusculo) no comando | Passar `Model` (maiusculo, gerado pelo ObservableProperty) |
| Registrar Use Case como Singleton | Registrar como Transient |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
