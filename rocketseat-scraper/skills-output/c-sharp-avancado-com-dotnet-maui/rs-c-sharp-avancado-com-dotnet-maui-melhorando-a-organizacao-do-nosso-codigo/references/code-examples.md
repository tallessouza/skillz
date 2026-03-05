# Code Examples: Organizacao de Codigo em ViewModels

## Exemplo completo: ViewModelBase antes e depois

### Antes

```csharp
public abstract class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private StatusPage _statusPage;
}
```

### Depois

```csharp
public abstract class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private StatusPage _statusPage;

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

## Exemplo completo: DoLoginViewModel antes e depois

### Antes

```csharp
public partial class DoLoginViewModel : ViewModelBase
{
    private readonly INavigationService _navigationService;
    private readonly IDoLoginUseCase _useCase;

    public DoLoginViewModel(
        INavigationService navigationService,
        IDoLoginUseCase useCase)
    {
        _navigationService = navigationService;
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task DoLogin()
    {
        var result = await _useCase.Execute(Email, Password);

        if (result.IsSuccess == false)
        {
            var parameters = new Dictionary<string, object>
            {
                { "errors", result.ErrorMessages }
            };
            await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
        }
        else
        {
            await Shell.Current.GoToAsync("//Dashboard");
        }
    }
}
```

### Depois

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

## Exemplo: RegisterUserAccountViewModel

### Antes

```csharp
public partial class RegisterUserAccountViewModel : ViewModelBase
{
    private readonly INavigationService _navigationService;
    private readonly IRegisterUserUseCase _useCase;

    public RegisterUserAccountViewModel(
        INavigationService navigationService,
        IRegisterUserUseCase useCase)
    {
        _navigationService = navigationService;
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task Register()
    {
        var result = await _useCase.Execute(Name, Email, Password);

        if (result.IsSuccess == false)
        {
            var parameters = new Dictionary<string, object>
            {
                { "errors", result.ErrorMessages }
            };
            await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
        }
        else
        {
            await Shell.Current.GoToAsync("//Dashboard");
        }
    }
}
```

### Depois

```csharp
public partial class RegisterUserAccountViewModel : ViewModelBase
{
    private readonly IRegisterUserUseCase _useCase;

    public RegisterUserAccountViewModel(
        INavigationService navigationService,
        IRegisterUserUseCase useCase) : base(navigationService)
    {
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task Register()
    {
        var result = await _useCase.Execute(Name, Email, Password);

        if (result.IsSuccess)
            await Shell.Current.GoToAsync("//Dashboard");
        else
            await GoToPageWithErrors(result);
    }
}
```

## Exemplo: UserProfileViewModel (com Result<T>)

### Antes

```csharp
public partial class UserProfileViewModel : ViewModelBase
{
    private readonly INavigationService _navigationService;
    private readonly IGetUserProfileUseCase _useCase;

    [ObservableProperty]
    private User _model;

    public UserProfileViewModel(
        INavigationService navigationService,
        IGetUserProfileUseCase useCase)
    {
        _navigationService = navigationService;
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task LoadProfile()
    {
        var result = await _useCase.Execute();

        if (result.IsSuccess == false)
        {
            var parameters = new Dictionary<string, object>
            {
                { "errors", result.ErrorMessages }
            };
            await _navigationService.NavigateToAsync(RoutePages.Error, parameters);
        }
        else
        {
            Model = result.Data;
        }
    }
}
```

### Depois

```csharp
public partial class UserProfileViewModel : ViewModelBase
{
    private readonly IGetUserProfileUseCase _useCase;

    [ObservableProperty]
    private User _model;

    public UserProfileViewModel(
        INavigationService navigationService,
        IGetUserProfileUseCase useCase) : base(navigationService)
    {
        _useCase = useCase;
    }

    [RelayCommand]
    private async Task LoadProfile()
    {
        var result = await _useCase.Execute();

        if (result.IsSuccess)
            Model = result.Data;
        else
            await GoToPageWithErrors(result);
    }
}
```

Note que `result` aqui e `Result<User>` (classe filha), mas `GoToPageWithErrors` aceita `Result` (classe base). Funciona por polimorfismo.

## ViewModels afetadas indiretamente

Apos mover `INavigationService` para o construtor da `ViewModelBase`, TODAS as ViewModels que herdam dela precisam do `: base(navigationService)`, mesmo as que nao foram foco da refatoracao:

```csharp
// DashboardViewModel.cs
public DashboardViewModel(
    INavigationService navigationService) : base(navigationService) { }

// OnboardViewModel.cs
public OnboardViewModel(
    INavigationService navigationService) : base(navigationService) { }
```

O Rebuild Solution revelou esses erros — por isso e obrigatorio apos qualquer refatoracao.