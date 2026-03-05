# Code Examples: Centralizar PopUps via NavigationService

## Exemplo 1: NavigationService completo

### Antes (PopupService injetado na ViewModel)

```csharp
public class UserProfileViewModel : ViewModelBase
{
    private readonly IPopupService _popupService;

    public UserProfileViewModel(IPopupService popupService)
    {
        _popupService = popupService;
    }

    [RelayCommand]
    private async Task ChangeProfilePhoto()
    {
        var options = new PopupOptions
        {
            // Customizacoes do popup
        };

        var result = await _popupService
            .ShowPopupAsync<OptionsForProfileForViewModel>(options);

        var chooseFileOption = (ChooseFileOption)result.Result;

        // Logica baseada na opcao selecionada...
    }
}
```

### Depois (PopupService movido para NavigationService)

```csharp
// NavigationService.cs
public class NavigationService : INavigationService
{
    private readonly IPopupService _popupService;

    public NavigationService(IPopupService popupService)
    {
        _popupService = popupService;
    }

    public async Task<TResult> ShowPopup<TViewModel, TResult>()
        where TViewModel : ViewModelBaseForPopup
        where TResult : notnull
    {
        var options = new PopupOptions
        {
            // Configuracoes padronizadas
        };

        var result = await _popupService
            .ShowPopupAsync<TViewModel>(options);

        return result.Result!;
    }
}
```

```csharp
// INavigationService.cs
public interface INavigationService
{
    Task<TResult> ShowPopup<TViewModel, TResult>()
        where TViewModel : ViewModelBaseForPopup
        where TResult : notnull;
}
```

```csharp
// UserProfileViewModel.cs (simplificado)
public class UserProfileViewModel : ViewModelBase
{
    private readonly INavigationService _navigationService;

    [RelayCommand]
    private async Task ChangeProfilePhoto()
    {
        var optionSelected = await _navigationService
            .ShowPopup<OptionsForProfileForViewModel, ChooseFileOption>();

        // optionSelected ja e do tipo ChooseFileOption, sem cast
    }
}
```

## Exemplo 2: Constraint bloqueando tipos invalidos

```csharp
// ERRO DE COMPILACAO — int nao herda de ViewModelBaseForPopup
await _navigationService.ShowPopup<int, ChooseFileOption>();

// ERRO DE COMPILACAO — bool nao herda de ViewModelBaseForPopup
await _navigationService.ShowPopup<bool, ChooseFileOption>();

// ERRO DE COMPILACAO — string nao herda de ViewModelBaseForPopup
await _navigationService.ShowPopup<string, ChooseFileOption>();

// OK — OptionsForProfileForViewModel herda de ViewModelBaseForPopup
await _navigationService.ShowPopup<OptionsForProfileForViewModel, ChooseFileOption>();
```

## Exemplo 3: Hierarquia de ViewModels para popups

```csharp
// Base que todas as ViewModels de popup devem herdar
public class ViewModelBaseForPopup : ObservableObject
{
    // Propriedades e metodos comuns a todos os popups
}

// ViewModel especifica para o popup de opcoes de perfil
public class OptionsForProfileForViewModel : ViewModelBaseForPopup
{
    // Comandos: tirar foto, upload galeria, cancelar
}

// Outro popup futuro — tambem herda da base
public class ConfirmDeleteViewModel : ViewModelBaseForPopup
{
    // Comandos: confirmar, cancelar
}
```

## Exemplo 4: Comparacao com generics em classes (Result<T>)

O mesmo conceito aplicado em classes:

```csharp
// Generics em classe — ja conhecido
public class Result<TResponse>
{
    public TResponse Data { get; set; }
    public bool IsSuccess { get; set; }
}

// Uso:
var result = new Result<string>();    // TResponse = string
var result = new Result<User>();      // TResponse = User
```

Agora em funcoes — mesma logica:

```csharp
// Generics em funcao
public Task<TResult> ShowPopup<TViewModel, TResult>() { }

// Uso:
await ShowPopup<OptionsForProfileForViewModel, ChooseFileOption>();
```

## Exemplo 5: Multiplos where constraints

```csharp
// Um constraint por tipo generico
public Task<TResult> ShowPopup<TViewModel, TResult>()
    where TViewModel : ViewModelBaseForPopup    // Deve herdar desta classe
    where TResult : notnull                      // Nao pode ser nullable

// Outras possibilidades de constraint:
public void Exemplo<T>() where T : class          // Tipo referencia
public void Exemplo<T>() where T : struct         // Tipo valor
public void Exemplo<T>() where T : new()          // Construtor sem params
public void Exemplo<T>() where T : Enum           // Deve ser enum
public void Exemplo<T>() where T : IDisposable    // Deve implementar interface
```