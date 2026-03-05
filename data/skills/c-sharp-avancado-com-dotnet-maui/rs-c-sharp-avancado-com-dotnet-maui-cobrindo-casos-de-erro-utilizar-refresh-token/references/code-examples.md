# Code Examples: Refresh Token Error Handling em .NET MAUI

## 1. Handler completo com tratamento de erro

```csharp
// PlaneShareHandler.cs
public class PlaneShareHandler
{
    private readonly IUseRefreshTokenUseCase _useRefreshTokenUseCase;
    private readonly ITokensStorage _tokensStorage;
    private readonly IUserStorage _userStorage;
    private readonly INavigationService _navigationService;

    public PlaneShareHandler(
        IUseRefreshTokenUseCase useRefreshTokenUseCase,
        ITokensStorage tokensStorage,
        IUserStorage userStorage,
        INavigationService navigationService)
    {
        _useRefreshTokenUseCase = useRefreshTokenUseCase;
        _tokensStorage = tokensStorage;
        _userStorage = userStorage;
        _navigationService = navigationService;
    }

    public async Task Handle(HttpResponseMessage response)
    {
        // Detecta token expirado
        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            // Tenta trocar refresh token
            var result = await _useRefreshTokenUseCase.Execute();

            if (result.IsSuccess)
            {
                // Caminho feliz: salva novos tokens e refaz request
                await _tokensStorage.Save(result.Tokens!);
                // Refaz a requisicao original com novos tokens...
            }
            else
            {
                // Caminho de erro: limpa tudo e forca novo login
                _userStorage.Clear();
                _tokensStorage.Clear();

                await _navigationService.GoToOnboardingPage();
                return; // Impede que o fluxo continue
            }
        }
    }
}
```

## 2. Interface INavigationService atualizada

```csharp
public interface INavigationService
{
    Task GoToDashboardPage();
    Task GoToOnboardingPage(); // NOVO: para redirecionamento em falha de auth
}
```

## 3. Implementacao de GoToOnboardingPage

```csharp
public class NavigationService : INavigationService
{
    public async Task GoToDashboardPage()
    {
        await Shell.Current.GoToAsync("//DashboardPage");
    }

    public async Task GoToOnboardingPage()
    {
        // "//" substitui a pagina raiz — nao empilha navegacao
        await Shell.Current.GoToAsync("//OnBoardingPage");
    }
}
```

## 4. Supressao de erro em GoToPageWithErrors

```csharp
// BaseViewModel ou classe compartilhada
protected void GoToPageWithErrors(Result results)
{
    // Suprime mensagem tecnica de token expirado
    if (results.Messages.Contains("Token expired"))
    {
        return; // Nao mostra error page para esse caso
    }

    // Somente erros relevantes para o usuario
    NavigateToErrorPage(results.Messages);
    StatusPage = StatusPage.Error;
}
```

## 5. AppShell — logica de decisao de pagina inicial

```csharp
// AppShell.xaml.cs
public AppShell(IUserStorage userStorage)
{
    InitializeComponent();

    if (userStorage.IsLoggedIn())
    {
        // Tem dados no storage → dashboard
        GoToDashboardSection();
    }
    else
    {
        // Storage limpo → onboarding (forca login)
        GoToOnboardingSection();
    }
}
```

## 6. UserStorage.IsLoggedIn — verificacao simples

```csharp
public bool IsLoggedIn()
{
    // Verifica se existe ID da pessoa no local storage
    return !string.IsNullOrEmpty(Get(IdKey));
}
```

## 7. Backend — mensagem fixa de token expirado

```csharp
// AuthenticatedUserFilter.cs (API)
catch (SecurityTokenExpiredException)
{
    // Mensagem fixa — usada no frontend para supressao
    return Unauthorized("Token expired");
}
```