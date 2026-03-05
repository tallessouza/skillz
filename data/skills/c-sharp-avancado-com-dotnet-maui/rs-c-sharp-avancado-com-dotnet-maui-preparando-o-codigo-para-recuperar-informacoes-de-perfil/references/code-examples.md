# Code Examples: Inicializacao Async de ViewModels

## Exemplo completo: UserProfileViewModel

### Interface do Use Case (com assinatura correta)

```csharp
public interface IGetUserProfileUseCase
{
    Task<Result<Models.User>> Execute();
}
```

**Nota importante do instrutor:** a assinatura na interface DEVE bater com a implementacao. Se voce alterou a implementacao para retornar `Task<Result<Models.User>>` mas esqueceu de atualizar a interface, tera erro de compilacao.

### Implementacao do Use Case

```csharp
public class GetUserProfileUseCase : IGetUserProfileUseCase
{
    public async Task<Result<Models.User>> Execute()
    {
        // Chamada na API para recuperar informacoes do usuario logado
        // ...
    }
}
```

### ViewModel ANTES (errado)

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    [ObservableProperty]
    private Models.User model;

    public UserProfileViewModel()
    {
        // ERRADO: dados fixos no construtor
        model = new Models.User
        {
            Name = "Wellison",
            Email = "wellison@example.com"
        };
    }
}
```

### ViewModel DEPOIS (correto)

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    private readonly IGetUserProfileUseCase _getUserProfileUseCase;

    [ObservableProperty]
    private Models.User model;

    // Construtor limpo: so atribuicoes de dependencia
    public UserProfileViewModel(IGetUserProfileUseCase getUserProfileUseCase)
    {
        _getUserProfileUseCase = getUserProfileUseCase;
    }

    // Metodo async separado para carregar dados
    public async Task Initialize()
    {
        var result = await _getUserProfileUseCase.Execute();

        if (result.IsSuccess == false)
        {
            var errorMessages = result.GetErrorMessages();
            // Navegar para pagina de erro
            return;
        }

        // result.Response! — o ! garante ao compilador que nao e nulo
        // (seguro porque estamos no else do IsSuccess == false)
        Model = result.Response!;
    }
}
```

### CodeBehind da Page

```csharp
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage()
    {
        InitializeComponent();
    }

    // OnAppearing: executa toda vez que a pagina fica visivel
    protected override void OnAppearing()
    {
        base.OnAppearing();
        // Proxima aula: como chamar Initialize() da ViewModel aqui
    }
}
```

## Fluxo completo de dados

```
UserProfilePage.OnAppearing()
    → UserProfileViewModel.Initialize()
        → IGetUserProfileUseCase.Execute()
            → API call (async)
            → Result<Models.User>
        → if IsSuccess == false → navigate to error page
        → if IsSuccess == true → Model = result.Response!
    → UI atualiza automaticamente (ObservableProperty)
```

## Padrao de rename no Visual Studio

```
ANTES:
  GetProfileUseCase.cs        → classe: GetProfileUseCase
  IGetProfileUseCase.cs       → interface: IGetProfileUseCase
  _getProfile (campo privado)

DEPOIS (via IDE Rename):
  GetUserProfileUseCase.cs    → classe: GetUserProfileUseCase
  IGetUserProfileUseCase.cs   → interface: IGetUserProfileUseCase
  _getUserProfileUseCase (campo privado — atualizar manualmente se necessario)
```