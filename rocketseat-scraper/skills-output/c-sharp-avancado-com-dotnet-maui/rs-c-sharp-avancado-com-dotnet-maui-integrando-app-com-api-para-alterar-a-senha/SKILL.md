---
name: rs-csharp-maui-api-change-password
description: "Applies .NET MAUI password change integration pattern when building authenticated user flows with Refit API communication. Use when user asks to 'integrate API', 'change password flow', 'add Refit endpoint', 'create use case for MAUI', or 'connect ViewModel to API'. Covers Refit interface routing, use case creation, DI registration, and ViewModel command binding. Make sure to use this skill whenever implementing authenticated API communication flows in .NET MAUI with Refit. Not for forgot-password flows, authentication/login implementation, or backend API controller development."
---

# Integrando App MAUI com API — Fluxo de Alteração de Senha

> Ao implementar comunicação com API no .NET MAUI usando Refit, siga o pipeline completo: Interface Refit → Use Case → Registro DI → ViewModel Command → View Binding.

## Rules

1. **Distinga fluxos de senha** — alterar senha (usuário logado) e esqueci a senha são fluxos completamente diferentes com endpoints, requests e ações distintas, porque misturá-los causa bugs de autenticação e UX confusa
2. **Nunca duplique rotas HTTP** — dois endpoints com mesmo método HTTP e mesma rota causam conflito; use rota específica como `[HttpPut("change-password")]`, porque o framework não resolve ambiguidade de rotas
3. **Registre no DI imediatamente** — ao criar um use case, registre no `MauiProgram` na função `addUseCases` antes de continuar, porque esquecer causa erro de resolução em runtime
4. **Inicialize ObservableProperties no construtor** — models decorados com `[ObservableProperty]` são nulos por default; inicialize no construtor da ViewModel, porque binding com model nulo causa crash
5. **Navegação condicional ao sucesso** — `await NavigationService.GoToAsync("..")` deve estar dentro do `if (sucesso)`, não no final da função, porque navegar após erro remove contexto do usuário
6. **Use case recebe apenas o necessário via DI** — injete somente `IUserApi`, sem Storage ou serviços extras desnecessários, porque acoplamento excessivo dificulta testes e manutenção

## How to write

### Interface Refit com rota específica

```csharp
// Evite duplicar método HTTP + rota — use rota complementar
[Put("/users/change-password")]
Task<IApiResponse> ChangePassword([Body] RequestChangePasswordJson request);
```

### Use Case — Interface e Implementação

```csharp
// Interface limpa com retorno Result
public interface IChangeUserPasswordUseCase
{
    Task<Result> Execute(ChangePasswordModel model);
}

// Implementação injeta apenas IUserApi
public class ChangeUserPasswordUseCase : IChangeUserPasswordUseCase
{
    private readonly IUserApi _userApi;

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

        // Tratar erro via IApiResponse
        return Result.Failure(response.Error);
    }
}
```

### Registro no DI

```csharp
// MauiProgram.cs — addUseCases()
services.AddScoped<IChangeUserPasswordUseCase, ChangeUserPasswordUseCase>();
```

### ViewModel com inicialização do Model

```csharp
public ChangePasswordViewModel(
    IChangeUserPasswordUseCase changePasswordUseCase,
    INavigationService navigationService)
{
    _changePasswordUseCase = changePasswordUseCase;
    _navigationService = navigationService;
    // Inicialize para evitar NullReferenceException no binding
    Model = new ChangePasswordModel();
}

[RelayCommand]
private async Task ChangePassword()
{
    var result = await _changePasswordUseCase.Execute(Model);

    if (result.IsSuccess)
    {
        // Navegação DENTRO do if — só após sucesso
        await _navigationService.GoToAsync("..");
    }
}
```

### View Binding do Command

```xml
<Button Text="Alterar senha"
        Command="{Binding ChangePasswordCommand}" />
```

## Example

**Before (erros comuns):**
```csharp
// Rota duplicada — conflito com UpdateProfile
[Put("/users")]
Task<IApiResponse> ChangePassword([Body] RequestChangePasswordJson request);

// Model não inicializado — crash no binding
public ChangePasswordViewModel() { }

// Navegação fora do if — navega mesmo com erro
await _changePasswordUseCase.Execute(Model);
await _navigationService.GoToAsync("..");
```

**After (com esta skill aplicada):**
```csharp
// Rota específica — sem conflito
[Put("/users/change-password")]
Task<IApiResponse> ChangePassword([Body] RequestChangePasswordJson request);

// Model inicializado no construtor
public ChangePasswordViewModel()
{
    Model = new ChangePasswordModel();
}

// Navegação condicional ao sucesso
var result = await _changePasswordUseCase.Execute(Model);
if (result.IsSuccess)
    await _navigationService.GoToAsync("..");
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dois endpoints PUT no mesmo controller | Dê rota específica: `[HttpPut("nome-acao")]` |
| API retorna 204 No Content | Use `IApiResponse` sem tipo genérico no Refit |
| Use case criado | Registre no DI imediatamente, antes de usar na ViewModel |
| ObservableProperty é objeto complexo | Inicialize no construtor da ViewModel |
| Ação concluída com sucesso em página secundária | Navegue de volta com `GoToAsync("..")` dentro do `if` |
| Precisa senha atual + nova senha | São dois campos distintos no model e na request |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `[Put("/users")]` duplicado no mesmo controller | `[Put("/users/change-password")]` com rota específica |
| `Model` sem inicialização no construtor | `Model = new ChangePasswordModel()` no construtor |
| `await nav.GoToAsync()` fora do if de sucesso | Dentro de `if (result.IsSuccess)` |
| Injetar Storage, Logger, etc. no use case sem necessidade | Injetar apenas `IUserApi` |
| Criar use case e esquecer de registrar no DI | Registrar em `addUseCases()` imediatamente |
| Usar `model` minúsculo quando `[ObservableProperty]` gera `Model` | Usar `Model` maiúsculo (gerado pelo source generator) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
