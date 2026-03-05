# Code Examples: Navegacao com Parametros no .NET MAUI

## Exemplo completo: ErrorViewModel

```csharp
public partial class ErrorViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty]
    private ObservableCollection<string> errorsList = [];

    // Chamado automaticamente pelo Shell ao navegar para esta pagina
    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        // Protecao: so executa se recebeu parametros
        if (query.Count > 0)
        {
            // Cast seguro com 'as' — retorna null se tipo nao bater
            var errorList = query["errors"] as List<string>;

            if (errorList is not null)
            {
                // Construtor preenche automaticamente com todos os elementos
                ErrorsList = new ObservableCollection<string>(errorList);
            }
        }
    }
}
```

## Exemplo completo: LoginViewModel (origem da navegacao)

```csharp
public partial class LoginViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;
    private readonly ILoginUseCase _loginUseCase;

    [RelayCommand]
    private async Task Login()
    {
        var result = await _loginUseCase.Execute(Email, Password);

        if (result.IsSuccess == false)
        {
            // Cria dicionario com a lista de erros
            var parameters = new Dictionary<string, object>
            {
                { "errors", result.ErrorMessages }
            };

            // Navega para pagina de erro passando parametros
            await _navigationService.GoToAsync(
                ShellNavigationState.Parse("//ErrorPage"),
                parameters
            );
        }
    }
}
```

## Exemplo completo: NavigationService com overload

```csharp
// Interface com ambas assinaturas
public interface INavigationService
{
    Task GoToAsync(ShellNavigationState state);
    Task GoToAsync(ShellNavigationState state, Dictionary<string, object> parameters);
}

// Implementacao
public class NavigationService : INavigationService
{
    // Versao sem parametros
    public async Task GoToAsync(ShellNavigationState state)
    {
        await Shell.Current.GoToAsync(state);
    }

    // Overload com parametros
    public async Task GoToAsync(ShellNavigationState state, Dictionary<string, object> parameters)
    {
        // Shell.Current.GoToAsync tem 5+ overloads internos
        // incluindo um que aceita IDictionary<string, object>
        await Shell.Current.GoToAsync(state, parameters);
    }
}
```

## Exemplo: RegisterAccountViewModel (mesmo padrao reutilizado)

```csharp
public partial class RegisterAccountViewModel : ObservableObject
{
    [RelayCommand]
    private async Task Register()
    {
        var result = await _registerUseCase.Execute(Name, Email, Password);

        if (result.IsSuccess == false)
        {
            var parameters = new Dictionary<string, object>
            {
                { "errors", result.ErrorMessages }
            };

            await _navigationService.GoToAsync(
                ShellNavigationState.Parse("//ErrorPage"),
                parameters
            );
        }
    }
}
```

## Demonstracao do cast direto vs cast seguro

```csharp
// PERIGOSO — lanca excecao se tipo errado
object value = query["errors"];
List<string> errors = (List<string>)value; // InvalidCastException se nao for List<string>

// SEGURO — retorna null se tipo errado
object value = query["errors"];
List<string>? errors = value as List<string>; // null se nao for List<string>
```

## Melhoria futura: constantes para chaves

```csharp
// Definir constante em local compartilhado
public static class NavigationParameters
{
    public const string Errors = "errors";
}

// Usar na ViewModel origem
var parameters = new Dictionary<string, object>
{
    { NavigationParameters.Errors, result.ErrorMessages }
};

// Usar na ViewModel destino
var errorList = query[NavigationParameters.Errors] as List<string>;
```

## Melhoria futura: funcao auxiliar para navegacao com erros

```csharp
public static class NavigationHelper
{
    private const string ErrorsKey = "errors";

    public static Dictionary<string, object> CreateErrorParameters(List<string> errors)
    {
        return new Dictionary<string, object>
        {
            { ErrorsKey, errors }
        };
    }
}

// Uso simplificado
var parameters = NavigationHelper.CreateErrorParameters(result.ErrorMessages);
await _navigationService.GoToAsync(state, parameters);
```