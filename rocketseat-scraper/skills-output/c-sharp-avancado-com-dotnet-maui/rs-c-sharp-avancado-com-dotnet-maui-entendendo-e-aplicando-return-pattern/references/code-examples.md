# Code Examples: Return Pattern em C# / .NET MAUI

## 1. Classe Result completa (Value Object)

Localização: `Models/ValueObjects/Result.cs`

```csharp
using System.Collections.Generic;

namespace PlanShare.App.Models.ValueObjects
{
    public class Result
    {
        public bool IsSuccess { get; private set; }
        public IList<string>? ErrorMessages { get; private set; }

        public static Result Success() => new() { IsSuccess = true };

        public static Result Failure(IList<string> errorMessages) => new()
        {
            IsSuccess = false,
            ErrorMessages = errorMessages
        };
    }
}
```

## 2. Login Use Case com Return Pattern

```csharp
public async Task<Result> Execute(LoginRequestJson request)
{
    var response = await _api.Login(request);

    if (response.IsSuccessStatusCode)
    {
        // criar records, salvar no local storage / secure storage
        return Result.Success();
    }

    var errorResponse = await response.Content.ReadFromJsonAsync<ResponseErrorJson>();
    return Result.Failure(errorResponse.Errors);
}
```

**Pontos importantes:**
- O tipo de retorno mudou de `Task` para `Task<Result>`
- Não há `else` — o `return` dentro do `if` já encerra o fluxo de sucesso
- `errorResponse.Errors` já é uma `IList<string>` que vem do JSON da API

## 3. Register Use Case com Return Pattern

```csharp
public async Task<Result> Execute(RegisterRequestJson request)
{
    var response = await _api.Register(request);

    if (response.IsSuccessStatusCode)
    {
        return Result.Success();
    }

    var errorResponse = await response.Content.ReadFromJsonAsync<ResponseErrorJson>();
    return Result.Failure(errorResponse.Errors);
}
```

## 4. Interface do Use Case atualizada

```csharp
using PlanShare.App.Models.ValueObjects;

public interface ILoginUseCase
{
    Task<Result> Execute(LoginRequestJson request);
}

public interface IRegisterUseCase
{
    Task<Result> Execute(RegisterRequestJson request);
}
```

**Nota do instrutor:** ao adicionar o `using` para `PlanShare.App.Models.ValueObjects`, cuidado para não selecionar `Result` de outros namespaces como `Android.App` ou `Java.Xml.Transform`.

## 5. ViewModel consumindo o resultado

```csharp
var result = await _loginUseCase.Execute(request);

if (result.IsSuccess)
{
    // navegar para página principal
    await Shell.Current.GoToAsync("//MainPage");
}
else
{
    // exibir mensagens de erro
    foreach (var error in result.ErrorMessages!)
    {
        // mostrar no UI
    }
}
```

## 6. Evolução futura: Result genérico (mencionado mas não implementado)

```csharp
// Será implementado quando um use case precisar retornar dados junto com o sucesso
public class Result<T> : Result
{
    public T? Value { get; private set; }

    public static Result<T> Success(T value) => new()
    {
        IsSuccess = true,
        Value = value
    };
}

// Uso futuro:
public async Task<Result<UserJson>> Execute(string userId)
{
    var user = await _api.GetUser(userId);
    return Result<UserJson>.Success(user);
}
```