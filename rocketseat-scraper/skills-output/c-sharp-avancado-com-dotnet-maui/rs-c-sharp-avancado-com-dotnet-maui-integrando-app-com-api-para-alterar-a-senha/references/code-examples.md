# Code Examples: Integrando App MAUI com API para Alterar Senha

## 1. Interface Refit completa (IUserApi)

O instrutor copia a assinatura de `UpdateProfile` e adapta para `ChangePassword`:

```csharp
public interface IUserApi
{
    // Endpoint existente — PUT /users
    [Put("/users")]
    Task<IApiResponse> UpdateProfile([Body] RequestUpdateUserJson request);

    // Novo endpoint — PUT /users/change-password
    // Rota específica para evitar conflito com UpdateProfile
    [Put("/users/change-password")]
    Task<IApiResponse> ChangePassword([Body] RequestChangePasswordJson request);
}
```

**Pontos-chave:**
- `RequestChangePasswordJson` tem duas propriedades: `Password` (atual) e `NewPassword`
- Retorno é `IApiResponse` sem tipo genérico (204 No Content)
- A rota `/users/change-password` corresponde ao `[HttpPut("change-password")]` no controller

## 2. Request da API (backend — para referência)

```csharp
public class RequestChangePasswordJson
{
    public string Password { get; set; }    // Senha atual
    public string NewPassword { get; set; } // Nova senha
}
```

## 3. Controller da API (backend — para referência)

```csharp
[HttpPut("change-password")]
public async Task<IActionResult> ChangePassword(
    [FromBody] RequestChangePasswordJson request)
{
    // Use case executa: busca usuário, valida senha atual, altera, salva
    await _changePasswordUseCase.Execute(request);
    return NoContent(); // 204
}
```

## 4. Interface do Use Case (app)

```csharp
// Pasta: UseCases/User/ChangePassword/
public interface IChangeUserPasswordUseCase
{
    Task<Result> Execute(ChangePasswordModel model);
}
```

## 5. Implementação do Use Case (app)

```csharp
public class ChangeUserPasswordUseCase : IChangeUserPasswordUseCase
{
    private readonly IUserApi _userApi;

    // Apenas IUserApi — sem Storage, sem outros serviços
    public ChangeUserPasswordUseCase(IUserApi userApi)
    {
        _userApi = userApi;
    }

    public async Task<Result> Execute(ChangePasswordModel model)
    {
        var response = await _userApi.ChangePassword(new RequestChangePasswordJson
        {
            Password = model.CurrentPassword,
            NewPassword = model.NewPassword
        });

        if (response.IsSuccessStatusCode)
            return Result.Success();

        // IApiResponse permite acessar o erro mesmo sem body de sucesso
        return Result.Failure(response.Error);
    }
}
```

## 6. Registro no serviço de injeção de dependência

```csharp
// MauiProgram.cs
private static void AddUseCases(IServiceCollection services)
{
    // ... outros use cases ...
    services.AddScoped<IChangeUserPasswordUseCase, ChangeUserPasswordUseCase>();
}
```

**O instrutor enfatiza:** registre IMEDIATAMENTE após criar o use case, senão você esquece e perde tempo debugando erro de DI em runtime.

## 7. ViewModel com inicialização do Model e Command

```csharp
public partial class ChangePasswordViewModel : ObservableObject
{
    private readonly IChangeUserPasswordUseCase _changePasswordUseCase;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private ChangePasswordModel model;

    public ChangePasswordViewModel(
        IChangeUserPasswordUseCase changePasswordUseCase,
        INavigationService navigationService)
    {
        _changePasswordUseCase = changePasswordUseCase;
        _navigationService = navigationService;

        // CRÍTICO: inicializar para evitar NullReferenceException
        // [ObservableProperty] gera "Model" (maiúsculo) — use essa versão
        Model = new ChangePasswordModel();
    }

    [RelayCommand]
    private async Task ChangePassword()
    {
        var result = await _changePasswordUseCase.Execute(Model);

        if (result.IsSuccess)
        {
            // Navegação DENTRO do if — erro do instrutor foi colocar fora
            // ".." volta para a página anterior (perfil do usuário)
            await _navigationService.GoToAsync("..");
        }
        // Se erro: usuário permanece na página para corrigir
    }
}
```

## 8. View XAML — Binding do Command

```xml
<Button Text="Alterar senha"
        Command="{Binding ChangePasswordCommand}" />
```

**Nota:** o `[RelayCommand]` decorando `ChangePassword()` gera automaticamente `ChangePasswordCommand`. O nome segue o padrão: nome do método + "Command".

## 9. Padrão de cópia e adaptação

O instrutor usa uma técnica prática: copia um endpoint/use case/command existente similar e adapta. O checklist de adaptação:

1. **Tipo da request** — mude para o tipo correto (`RequestChangePasswordJson`)
2. **Nome da função** — renomeie para o novo fluxo (`ChangePassword`)
3. **Tipo de retorno** — ajuste se necessário (`IApiResponse` vs `IApiResponse<T>`)
4. **Rota HTTP** — garanta rota única (`/users/change-password`)
5. **Propriedades da request** — mapeie os campos corretos do model

## 10. Teste de ponta a ponta

Sequência do instrutor:
```
1. F5 (run com debug)
2. Login no app → Página de perfil → Alterar senha
3. Preenche: senha atual (123456789) + nova senha (@senha123)
4. Breakpoint no controller da API → verifica request
5. F10/F11 → acompanha use case da API executar
6. Volta no app → verifica Result.Success
7. Deleta o app (simula logout forçado)
8. Login com senha antiga → espera ERRO (e-mail/senha inválidos)
9. Login com senha nova → espera SUCESSO (dashboard)
```