---
name: rs-csharp-maui-organizacao-codigo
description: "Enforces code organization and refactoring patterns in C#/.NET MAUI ViewModels. Use when user asks to 'refactor ViewModel', 'clean up code', 'remove duplicate code', 'simplify if-else', 'extract common logic', or 'improve code organization' in C#/.NET MAUI projects. Applies rules: no redundant boolean comparisons, if-block executes success path, extract repeated logic to base class using protected methods and inheritance. Make sure to use this skill whenever writing or reviewing ViewModel code in .NET MAUI. Not for UI/XAML layout, database queries, or API endpoint design."
---

# Organizacao de Codigo em ViewModels (.NET MAUI)

> Pare regularmente para refatorar — codigo bagunçado hoje vira codigo impossivel de manter amanha.

## Rules

1. **Nunca compare booleanos com == true ou == false** — `if (result.IsSuccess)` nao `if (result.IsSuccess == false)`, porque a propriedade ja e booleana e a comparacao e redundante
2. **IF executa o caminho de sucesso** — coloque a logica de sucesso no `if` e a logica de erro no `else`, porque facilita a leitura e mantem um padrao consistente
3. **Remova chaves em blocos de linha unica** — se o `if` ou `else` tem apenas uma linha, omita `{ }`, porque reduz ruido visual
4. **Extraia logica duplicada para a classe base** — se 3+ ViewModels repetem o mesmo codigo, mova para `ViewModelBase` como metodo `protected`, porque centraliza a manutencao
5. **Use `protected` para membros compartilhados via heranca** — propriedades e metodos que classes filhas precisam acessar devem ser `protected`, nao `private`, porque `private` bloqueia o acesso nas subclasses
6. **Receba dependencias na base via construtor com `: base()`** — passe dependencias injetadas para o construtor da classe base usando `: base(param)`, porque a classe base precisa inicializar suas propriedades read-only

## How to write

### Condicional booleana limpa

```csharp
// CORRETO: if executa sucesso, sem comparacao redundante
if (result.IsSuccess)
    await Shell.Current.GoToAsync("//Dashboard");
else
    await GoToPageWithErrors(result);
```

### Metodo protegido na classe base

```csharp
public abstract class ViewModelBase : ObservableObject
{
    protected readonly INavigationService _navigationService;

    public ViewModelBase(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    protected async Task GoToPageWithErrors(Result result)
    {
        var parameters = new Dictionary<string, object>
        {
            { "errors", result.ErrorMessages }
        };
        await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
    }
}
```

### ViewModel concreta com heranca

```csharp
public partial class DoLoginViewModel : ViewModelBase
{
    private readonly IDoLoginUseCase _useCase;

    public DoLoginViewModel(
        INavigationService navigationService,
        IDoLoginUseCase useCase) : base(navigationService)
    {
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task DoLogin()
    {
        var result = await _useCase.Execute(Email, Password);

        if (result.IsSuccess)
            await Shell.Current.GoToAsync("//Dashboard");
        else
            await GoToPageWithErrors(result);
    }
}
```

## Example

**Before (codigo duplicado e comparacao redundante):**

```csharp
// DoLoginViewModel.cs
if (result.IsSuccess == false)
{
    var parameters = new Dictionary<string, object> { { "errors", result.ErrorMessages } };
    await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
}
else
{
    await Shell.Current.GoToAsync("//Dashboard");
}

// RegisterViewModel.cs — MESMO else copiado
// UserProfileViewModel.cs — MESMO else copiado
```

**After (com esta skill aplicada):**

```csharp
// ViewModelBase.cs — logica centralizada
protected async Task GoToPageWithErrors(Result result)
{
    var parameters = new Dictionary<string, object> { { "errors", result.ErrorMessages } };
    await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
}

// DoLoginViewModel.cs — limpo
if (result.IsSuccess)
    await Shell.Current.GoToAsync("//Dashboard");
else
    await GoToPageWithErrors(result);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mesmo bloco de codigo em 3+ ViewModels | Extraia para metodo `protected` na `ViewModelBase` |
| `if (boolProp == false)` | Inverta: `if (boolProp)` com sucesso no if |
| Propriedade precisa ser acessada por subclasses | Use `protected`, nao `private` |
| Classe base tem construtor com parametros | Use `: base(param)` nas classes filhas |
| Classe filha com tipo generico (Result<T>) herda de classe base (Result) | Aceite o tipo base como parametro — polimorfismo resolve |
| Fez refatoracao | Rebuild Solution + execute testes + teste manual |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (result.IsSuccess == false)` | `if (result.IsSuccess)` com sucesso no if |
| `if (result.IsSuccess == true)` | `if (result.IsSuccess)` |
| Mesmo else em 3+ ViewModels | Metodo `protected` na ViewModelBase |
| `private` em propriedade que subclasse precisa | `protected` |
| Construtor da filha atribuindo propriedade da base | `: base(param)` delegando ao construtor da base |
| Refatorar sem rebuild/testes depois | Sempre Rebuild Solution + testes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
