---
name: rs-csharp-maui-viewmodel-init
description: "Enforces correct async initialization patterns in .NET MAUI ViewModels. Use when user asks to 'load data in ViewModel', 'initialize ViewModel', 'call API in constructor', 'fetch data on page load', or 'use OnAppearing'. Applies rules: never async in constructors, extract to Initialize method, use OnAppearing for auto-refresh, handle Result pattern correctly. Make sure to use this skill whenever creating or modifying .NET MAUI ViewModels that need data loading. Not for general C# async patterns, non-MAUI projects, or UI layout questions."
---

# Inicializacao Async de ViewModels no .NET MAUI

> Nunca faca chamadas assincronas dentro de construtores — extraia para um metodo `Initialize` e dispare via `OnAppearing`.

## Rules

1. **Nunca async em construtor** — construtores nao suportam `async/await` em C#, e workarounds causam deadlocks, travamentos e problemas de performance
2. **Extraia para metodo Initialize** — crie `public async Task Initialize()` para carregar dados, porque metodos regulares suportam `async Task` normalmente
3. **Construtor so atribui dependencias** — no construtor, apenas atribua injecoes de dependencia a campos privados, sem logica de negocio
4. **Use OnAppearing para disparar Initialize** — porque `OnAppearing` executa automaticamente quando a pagina fica visivel (abertura inicial + retorno da pilha de navegacao)
5. **Trate o Result antes de atribuir** — verifique `result.IsSuccess` antes de acessar `result.Response!`, porque `Response` e nulo quando ha erro
6. **Mantenha padroes de nomenclatura** — renomeie Use Cases que quebram o padrao estabelecido (ex: `GetProfileUseCase` → `GetUserProfileUseCase`), porque perder padrao = perder controle

## How to write

### ViewModel com Initialize

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    private readonly IGetUserProfileUseCase _getUserProfileUseCase;

    // Construtor: APENAS atribuicoes
    public UserProfileViewModel(IGetUserProfileUseCase getUserProfileUseCase)
    {
        _getUserProfileUseCase = getUserProfileUseCase;
    }

    // Metodo separado para carga async
    public async Task Initialize()
    {
        var result = await _getUserProfileUseCase.Execute();

        if (result.IsSuccess == false)
        {
            var errorMessages = result.GetErrorMessages();
            await NavigateToErrorPage(errorMessages);
            return;
        }

        Model = result.Response!;
    }
}
```

### CodeBehind com OnAppearing

```csharp
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage()
    {
        InitializeComponent();
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        // Chamar Initialize da ViewModel aqui
    }
}
```

## Example

**Before (errado — async no construtor):**
```csharp
public UserProfileViewModel(IGetUserProfileUseCase useCase)
{
    _useCase = useCase;
    // ERRADO: nao funciona, nao existe public async construtor
    var result = await _useCase.Execute();
    Model = result.Response;
}
```

**After (correto — metodo separado + OnAppearing):**
```csharp
public UserProfileViewModel(IGetUserProfileUseCase useCase)
{
    _useCase = useCase;
}

public async Task Initialize()
{
    var result = await _useCase.Execute();

    if (result.IsSuccess == false)
    {
        await NavigateToErrorPage(result.GetErrorMessages());
        return;
    }

    Model = result.Response!;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ViewModel precisa de dados da API | Crie metodo `Initialize()` async, dispare via `OnAppearing` |
| Pagina precisa refresh ao voltar da pilha | `OnAppearing` ja cobre esse cenario automaticamente |
| Result.Response pode ser nulo | Use `!` (null-forgiving) apenas dentro de bloco onde `IsSuccess == true` |
| Use Case com nome fora do padrao | Renomeie imediatamente via IDE (renomeia classe + referencias) |
| Construtor ficando complexo | Mova TODA logica para metodo separado, mantenha so atribuicoes |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `public async UserProfileViewModel(...)` | `public UserProfileViewModel(...)` + `public async Task Initialize()` |
| `Task.Run(() => ...).Wait()` no construtor | Metodo `Initialize()` chamado via `OnAppearing` |
| `Model = result.Response` sem checar sucesso | `if (result.IsSuccess == false) { ... return; }` antes |
| `GetProfileUseCase` (sem especificar dominio) | `GetUserProfileUseCase` (padrao: Verbo + Entidade + UseCase) |
| Logica de fetch no construtor | Construtor limpo, fetch no `Initialize()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
