# Code Examples: Testes de ViewModel com Cenarios de Falha

## Exemplo 1: Sintaxe simplificada vs tradicional de listas

### Tradicional
```csharp
var x = new List<string> { "error 1", "error 2" };
Result.Failure(x);
```

### Simplificada (passada direto como argumento)
```csharp
Result.Failure(["error 1", "error 2"])
```

### NAO funciona com var
```csharp
// Erro de compilacao:
var x = ["error 1", "error 2"];
```

## Exemplo 2: CreateViewModel com resultado de falha

```csharp
// O mock do use case vai retornar falha com uma lista de erros
var viewModel = CreateViewModel(Result.Failure(["error 1"]));
```

## Exemplo 3: Helper para validacao de rota

```csharp
private ShellNavigationState GetValidationForRoute(string route)
{
    return It.Is<ShellNavigationState>(
        s => s.Location.OriginalString.Equals(route)
    );
}
```

### Uso no Verify
```csharp
// Reutilizavel para qualquer rota
GetValidationForRoute(Routes.Pages.ErrorPage)
GetValidationForRoute(Routes.Pages.LoginPage)
```

## Exemplo 4: Helper para validacao de dicionario de erros

```csharp
private IDictionary<string, object> GetValidationForDictionaryErrors(string errorMessage)
{
    return It.Is<IDictionary<string, object>>(dictionary =>
        dictionary.ContainsKey("errors")
        && dictionary["errors"] is IList<string>
        && ((IList<string>)dictionary["errors"]).Count == 1
        && ((IList<string>)dictionary["errors"]).Contains(errorMessage)
    );
}
```

### Detalhamento das validacoes do dicionario

```csharp
// 1. Verifica que a chave "errors" existe
dictionary.ContainsKey("errors")

// 2. Verifica que o valor e uma lista de strings
dictionary["errors"] is IList<string>

// 3. Verifica o tamanho da lista (com cast obrigatorio)
((IList<string>)dictionary["errors"]).Count == 1

// 4. Verifica que contem a mensagem esperada
((IList<string>)dictionary["errors"]).Contains(errorMessage)
```

## Exemplo 5: Verify completo com helpers

```csharp
_navigationServiceMock.Verify(
    nav => nav.GoToAsync(
        GetValidationForRoute(Routes.Pages.ErrorPage),
        GetValidationForDictionaryErrors("error 1")
    ),
    Times.Once
);
```

## Exemplo 6: Teste completo

```csharp
[Fact]
public async Task CreateViewModel_UseCaseReturnsFailure_NavigatesToErrorPage()
{
    // Arrange
    var viewModel = CreateViewModel(Result.Failure(["error 1"]));

    // Act
    var action = async () => await viewModel.RegisterCommand.ExecuteAsync(null);
    await action.Should().NotThrowAsync();

    // Assert
    viewModel.StatusPage.Should().Be(StatusPage.Default);

    _navigationServiceMock.Verify(
        nav => nav.GoToAsync(
            GetValidationForRoute(Routes.Pages.ErrorPage),
            GetValidationForDictionaryErrors("error 1")
        ),
        Times.Once
    );
}
```

## Exemplo 7: Forcando erros intencionais para validar asserts

### Teste 1 — Trocar chave do dicionario na ViewModel
```csharp
// Na ViewModelBase, trocar:
var parameters = new Dictionary<string, object>
{
    { "errors", errorMessages }  // CORRETO
};

// Para:
var parameters = new Dictionary<string, object>
{
    { "ellison", errorMessages }  // PROPOSITAL — teste deve falhar
};

// Resultado: Moq lanca excecao
// "Expected invocation on the mock once, but was 0 times"
```

### Teste 2 — Trocar rota na ViewModel
```csharp
// Na ViewModelBase, trocar:
await NavigationService.GoToAsync(Routes.Pages.ErrorPage, parameters);

// Para:
await NavigationService.GoToAsync(Routes.Pages.OnboardingPage, parameters);

// Resultado: Moq lanca excecao — rota nao bate com o esperado
```

## Exemplo 8: Truque do void + return para descobrir tipo

```csharp
// Passo 1: Declare como void
private void GetValidationForRoute(string route)
{
    return It.Is<ShellNavigationState>(s => s.Location.OriginalString.Equals(route));
    // IDE reclama: "Cannot return a value from void"
}

// Passo 2: Use "Show potential fix" no Visual Studio
// IDE corrige automaticamente para:
private ShellNavigationState GetValidationForRoute(string route)
{
    return It.Is<ShellNavigationState>(s => s.Location.OriginalString.Equals(route));
}
```

## Exemplo 9: Reutilizacao dos helpers entre testes

```csharp
// Teste de login — reutiliza GetValidationForRoute
_navigationServiceMock.Verify(
    nav => nav.GoToAsync(GetValidationForRoute(Routes.Pages.LoginPage)),
    Times.Once
);

// Teste de erro — reutiliza ambos helpers
_navigationServiceMock.Verify(
    nav => nav.GoToAsync(
        GetValidationForRoute(Routes.Pages.ErrorPage),
        GetValidationForDictionaryErrors("error 1")
    ),
    Times.Once
);
```