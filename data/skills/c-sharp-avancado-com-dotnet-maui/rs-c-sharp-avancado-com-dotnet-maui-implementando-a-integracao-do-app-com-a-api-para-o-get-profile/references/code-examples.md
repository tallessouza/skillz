# Code Examples: Integração Refit GetProfile

## Exemplo completo da interface Refit

```csharp
// Data/Network/Api/IUserApi.cs
public interface IUserApi
{
    // POST - registro de conta (já existente)
    [Post("/users")]
    Task<ApiResponse<ResponseRegisterUserJson>> Register(
        [Body] RequestRegisterUserJson request);

    // GET - perfil do usuário (novo)
    [Get("/users")]
    Task<ApiResponse<ResponseUserProfileJson>> GetProfile();
}
```

**Observações:**
- `[Get("/users")]` — a rota corresponde ao controller `UsersController` no backend
- Sem parâmetros — GET não aceita body, e o endpoint identifica o usuário pelo token (implementação futura)
- `ResponseUserProfileJson` — classe do projeto de comunicação compartilhado entre app e API

## Estrutura de pastas do UseCase

```
UseCases/
└── User/
    ├── Register/
    │   ├── IRegisterAccountUseCase.cs
    │   └── RegisterAccountUseCase.cs
    └── GetProfile/
        ├── IGetProfileUseCase.cs
        └── GetProfileUseCase.cs
```

## Interface do UseCase

```csharp
// UseCases/User/GetProfile/IGetProfileUseCase.cs
using PlanShare.App.Models.ValueObjects;

public interface IGetProfileUseCase
{
    Task<Result> Execute();
}
```

**Cuidado:** não deixar a interface vazia. O instrutor quase esqueceu de colar a assinatura de `Execute()` e alertou que sem ela, a ViewModel não consegue acessar a função.

## Implementação do UseCase

```csharp
// UseCases/User/GetProfile/GetProfileUseCase.cs
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
            // TODO: devolver dados do perfil (próxima aula)
            return Result.Success();
        }

        return response.GetResponseError();
    }
}
```

**Diferenças do RegisterAccountUseCase:**
- Não recebe parâmetros em `Execute()` (sem request body)
- Não precisa criar request object
- Não precisa salvar token/storage
- Usa o mesmo padrão de verificação `IsSuccessStatusCode`

## Registro no DI Container

```csharp
// MauiProgram.cs
// Registros existentes
builder.Services.AddTransient<IRegisterAccountUseCase, RegisterAccountUseCase>();
builder.Services.AddTransient<ILoginUseCase, LoginUseCase>();

// Novo registro
builder.Services.AddTransient<IGetProfileUseCase, GetProfileUseCase>();
```

## Injeção na ViewModel

```csharp
// ViewModels/User/Profile/UserProfileViewModel.cs
public class UserProfileViewModel
{
    private readonly IGetProfileUseCase _getProfileUseCase;

    public UserProfileViewModel(IGetProfileUseCase getProfileUseCase)
    {
        _getProfileUseCase = getProfileUseCase;
    }

    // A chamada será implementada nas próximas aulas:
    // var result = await _getProfileUseCase.Execute();
}
```

## Comparação: RegisterUseCase vs GetProfileUseCase

```csharp
// RegisterAccountUseCase — recebe dados, salva token
public async Task<Result> Execute(RequestRegisterUserJson request)
{
    var response = await _userApi.Register(request);

    if (response.IsSuccessStatusCode)
    {
        // Salva token, faz storage
        return Result.Success();
    }

    return response.GetResponseError();
}

// GetProfileUseCase — sem parâmetros, retorna dados (futuro)
public async Task<Result> Execute()
{
    var response = await _userApi.GetProfile();

    if (response.IsSuccessStatusCode)
    {
        // TODO: retornar nome e email
        return Result.Success();
    }

    return response.GetResponseError();
}
```

## Endpoint do backend (referência)

```csharp
// Controllers/UsersController.cs
[HttpGet("profile")]
[ProducesResponseType(typeof(ResponseUserProfileJson), StatusCodes.Status200OK)]
public async Task<IActionResult> GetProfile()
{
    // Identifica usuário pelo token JWT
    var response = await _getProfileUseCase.Execute();
    return Ok(response);
}
```

**Correção feita na aula:** `ProducesResponseType` estava com `ResponseHashtagUserJson` — corrigido para `ResponseUserProfileJson`.