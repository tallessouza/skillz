# Code Examples: Event to Command em .NET MAUI

## 1. Abordagem incorreta (code-behind poluido)

O instrutor mostra e imediatamente desfaz esse codigo:

```csharp
public partial class UserProfilePage : ContentPage
{
    // ERRADO: salvando referencia da ViewModel
    private readonly UserProfileViewModel _viewModel;

    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
        _viewModel = viewModel; // referencia desnecessaria
    }

    // ERRADO: async void, chamada direta ao VM
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.InitializeAllies();
    }
}
```

## 2. ViewModel com RelayCommand

```csharp
using CommunityToolkit.Mvvm.Input;

public partial class UserProfileViewModel : ObservableObject
{
    private readonly IGetUserProfileUseCase _getUserProfileUseCase;

    [ObservableProperty]
    private UserProfileModel _userProfile;

    public UserProfileViewModel(IGetUserProfileUseCase getUserProfileUseCase)
    {
        _getUserProfileUseCase = getUserProfileUseCase;
    }

    [RelayCommand]
    private async Task InitializeAllies()
    {
        var profile = await _getUserProfileUseCase.Execute();
        UserProfile = profile;
    }
}
```

O atributo `[RelayCommand]` gera automaticamente a propriedade `InitializeAlliesCommand` do tipo `IAsyncRelayCommand`.

## 3. XAML com EventToCommandBehavior

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Class="PlanShare.App.Pages.UserProfilePage">

    <ContentPage.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding InitializeAlliesCommand}" />
    </ContentPage.Behaviors>

    <!-- Resto do conteudo da pagina -->
</ContentPage>
```

Nota: o namespace `toolkit` ja deve estar declarado no `ContentPage` (usado tambem para outras funcionalidades como troca de cor de imagem).

## 4. Code-behind limpo (resultado final)

```csharp
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
    // Sem OnAppearing, sem referencia ao ViewModel
    // Tudo e feito via XAML com EventToCommandBehavior
}
```

## 5. Registro de DependencyInjection corrigido

```csharp
// ANTES (causa excecao):
builder.Services.AddSingleton<PlanShareHandler>();

// DEPOIS (correto):
builder.Services.AddTransient<PlanShareHandler>();

// Os HttpClients continuam iguais:
builder.Services.AddRefitClient<IUserApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

builder.Services.AddRefitClient<ILoginApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();
```

## 6. PlanShareHandler — fluxo de tokens

```csharp
public class PlanShareHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // Cultura no header
        ChangeRequestCulture(request);

        // Busca tokens salvos
        var tokens = await GetTokens();

        // Se nao tem token (login/registro), nao adiciona authorization
        if (!string.IsNullOrEmpty(tokens.AccessToken))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", tokens.AccessToken);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
```

## 7. Mapeamento evento ↔ funcao override

| Funcao Override | Nome do Evento | Uso no XAML |
|-----------------|---------------|-------------|
| `OnAppearing` | `Appearing` | `EventName="Appearing"` |
| `OnDisappearing` | `Disappearing` | `EventName="Disappearing"` |
| `OnNavigatedTo` | `NavigatedTo` | `EventName="NavigatedTo"` |
| `OnNavigatedFrom` | `NavigatedFrom` | `EventName="NavigatedFrom"` |

Regra: remova o prefixo "On" para obter o nome do evento.