---
name: rs-csharp-maui-integracao-refit-getprofile
description: "Applies the Refit integration pattern for GET endpoints in .NET MAUI apps. Use when user asks to 'add API endpoint', 'integrate with API', 'create use case', 'call GET endpoint', or 'configure Refit interface'. Follows the pattern: Refit interface → UseCase → DI registration → ViewModel injection. Make sure to use this skill whenever adding new API communication in MAUI projects using Refit. Not for backend/API controller implementation, authentication token handling, or HTTP client configuration from scratch."
---

# Integração Refit para GET Endpoints no .NET MAUI

> Ao adicionar comunicação com API via Refit, siga sempre a sequência: Interface → UseCase → DI → ViewModel.

## Rules

1. **Sempre use ApiResponse como wrapper** — `Task<ApiResponse<TResponse>>` nunca `Task<TResponse>`, porque ApiResponse permite tratar status code, erro e sucesso de forma uniforme
2. **GET não recebe body** — métodos GET no Refit não têm parâmetros de corpo, apenas route/query parameters quando necessário
3. **UseCase encapsula a chamada** — ViewModels nunca chamam a API diretamente, porque o UseCase isola a lógica de comunicação e tratamento de resposta
4. **Registre no DI imediatamente** — após criar interface + classe do UseCase, registre com `AddTransient<IUseCase, UseCase>()` no MauiProgram, porque esquecer causa erro silencioso em runtime
5. **Interface do UseCase deve ter a assinatura de Execute** — nunca deixe a interface vazia, porque a ViewModel depende dela para acessar a função
6. **Cuidado com usings ambíguos** — `Result` pode vir de `Android.App`, `Android.Database` etc. Use explicitamente o namespace correto do projeto

## Steps

### Step 1: Adicionar função na interface Refit

```csharp
// Data/Network/Api/IUserApi.cs
public interface IUserApi
{
    // Função existente
    [Post("/users")]
    Task<ApiResponse<ResponseRegisterUserJson>> Register([Body] RequestRegisterUserJson request);

    // Nova função GET — sem parâmetros de body
    [Get("/users")]
    Task<ApiResponse<ResponseUserProfileJson>> GetProfile();
}
```

### Step 2: Criar pasta e interface do UseCase

```
UseCases/
└── User/
    └── GetProfile/
        ├── IGetProfileUseCase.cs
        └── GetProfileUseCase.cs
```

```csharp
// IGetProfileUseCase.cs
public interface IGetProfileUseCase
{
    Task<Result> Execute();
}
```

### Step 3: Implementar o UseCase

```csharp
// GetProfileUseCase.cs
using PlanShare.App.Models.ValueObjects;
using PlanShare.App.Extensions;

public class GetProfileUseCase : IGetProfileUseCase
{
    private readonly IUserApi _userApi;

    public GetProfileUseCase(IUserApi userApi)
    {
        _userApi = userApi;
    }

    public async Task<Result> Execute()
    {
        var response = await _userApi.GetProfile();

        if (response.IsSuccessStatusCode)
        {
            // Tratar sucesso — retornar dados do perfil
            return Result.Success();
        }

        return response.GetResponseError();
    }
}
```

### Step 4: Registrar no serviço de injeção de dependência

```csharp
// MauiProgram.cs
builder.Services.AddTransient<IGetProfileUseCase, GetProfileUseCase>();
```

### Step 5: Injetar na ViewModel

```csharp
// ViewModels/User/Profile/UserProfileViewModel.cs
public class UserProfileViewModel
{
    private readonly IGetProfileUseCase _getProfileUseCase;

    public UserProfileViewModel(IGetProfileUseCase getProfileUseCase)
    {
        _getProfileUseCase = getProfileUseCase;
    }
}
```

## Verification

- Interface Refit tem `[Get("/route")]` com `Task<ApiResponse<T>>` como retorno
- UseCase recebe `IUserApi` via construtor
- Interface do UseCase declara `Execute()` com mesma assinatura da classe
- `MauiProgram.cs` tem `AddTransient` registrando interface → implementação
- ViewModel recebe `IGetProfileUseCase` via construtor com `private readonly`

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `Task<ResponseUserProfileJson> GetProfile()` | `Task<ApiResponse<ResponseUserProfileJson>> GetProfile()` |
| ViewModel chamando `_userApi.GetProfile()` diretamente | ViewModel chamando `_getProfileUseCase.Execute()` |
| Interface do UseCase vazia sem `Execute()` | Sempre declarar assinatura de `Execute()` na interface |
| `using Android.App` para Result | `using PlanShare.App.Models.ValueObjects` |
| Esquecer o registro no DI | Registrar imediatamente após criar UseCase |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
