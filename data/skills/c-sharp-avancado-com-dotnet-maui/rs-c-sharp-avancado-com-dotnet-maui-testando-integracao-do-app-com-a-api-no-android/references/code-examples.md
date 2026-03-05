# Code Examples: Testando Integracao do App com a API no Android

## Fluxo de Debug Completo

### Breakpoint no construtor da ViewModel

```csharp
// ViewModel/Pages/UserRegisterAccountViewModel.cs
public class UserRegisterAccountViewModel
{
    private readonly INavigationService _navigationService;
    private readonly IRegisterUserUseCase _registerUserUseCase;

    // Breakpoint aqui para verificar dependency injection
    public UserRegisterAccountViewModel(
        INavigationService navigationService,
        IRegisterUserUseCase registerUserUseCase)
    {
        _navigationService = navigationService;   // Verificar: nao e nulo
        _registerUserUseCase = registerUserUseCase; // Verificar: nao e nulo
    }
}
```

### Breakpoint no comando de registro

```csharp
// No metodo executado ao clicar "Criar minha conta"
public async Task RegisterAccount()
{
    // Breakpoint aqui para inspecionar dados antes de enviar
    var user = new RegisterUserRequest
    {
        Name = Name,       // Ex: "Ellison"
        Email = Email,     // Ex: "ellison@gmail.com"
        Password = Password // Ex: "12345678"
    };

    await _registerUserUseCase.Execute(user);
}
```

### Breakpoint no Controller da API

```csharp
// Controllers/UsersController.cs
[HttpPost]
[Route("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest request)
{
    // Breakpoint aqui — confirma que o request chegou do app
    // F10 para step over, F11 para step into no use case
    var response = await _registerUseCase.Execute(request);

    return Ok(response);
    // Response contem: id, nome, tokens
}
```

## Configuracao de Multiple Startup Projects (Visual Studio)

### Via Properties da Solution

```
Solution 'PlanShare' (botao direito) → Properties

Startup Project:
  ○ Single startup project: PlanShare.App
  ● Multiple startup projects:

  Project              | Action
  ---------------------|------------------------
  PlanShare.Api        | Start  (ou Start Without Debugging)
  PlanShare.App        | Start
```

### Via Start New Instance

```
Solution Explorer:
  └── PlanShare.Api (botao direito)
       └── Debug
            └── Start New Instance    ← clique aqui
```

## Queries de verificacao no banco

```sql
-- MySQL Workbench: verificar registro criado
SELECT * FROM users;
-- Resultado esperado:
-- | id | name     | email              | ...tokens... |
-- | 1  | Edilaine | edilaine@gmail.com  | ...          |

-- SQL Server: mesma verificacao
SELECT * FROM users;
-- | id | name    | email             | ...tokens... |
-- | 1  | William | william@gmail.com | ...          |
```

## Checklist pre-execucao

```
Antes de pressionar F5:

[x] DevTunnel selecionado (seta ao lado do Start → DevTunnels → nome do tunnel)
[x] Dispositivo Android selecionado (Android Local Devices → seu dispositivo)
[x] Projeto(s) configurado(s) com Start (nao "None")
[x] Banco de dados acessivel e limpo para teste
```