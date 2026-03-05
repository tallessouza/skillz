# Code Examples: Return Pattern com Valores Genéricos

## Exemplo 1: Classe Result base (sem dados de retorno)

```csharp
public class Result
{
    public bool IsSuccess { get; private set; }
    public IList<string> ErrorMessages { get; private set; }

    protected Result() { }

    protected Result(bool isSuccess, IList<string> errorMessages)
    {
        IsSuccess = isSuccess;
        ErrorMessages = errorMessages;
    }

    public static Result Success()
    {
        return new Result { IsSuccess = true };
    }

    public static Result Failure(IList<string> errorMessages)
    {
        return new Result
        {
            IsSuccess = false,
            ErrorMessages = errorMessages
        };
    }
}
```

## Exemplo 2: Classe Result&lt;TResponse&gt; com herança

```csharp
public class Result<TResponse> : Result
{
    public TResponse? Response { get; private set; }

    protected Result(TResponse response) : base()
    {
        Response = response;
    }

    protected Result(IList<string> errorMessages) : base(false, errorMessages) { }

    public static Result<TResponse> Success(TResponse response)
    {
        return new Result<TResponse>(response) { IsSuccess = true };
    }

    public new static Result<TResponse> Failure(IList<string> errorMessages)
    {
        return new Result<TResponse>(errorMessages);
    }
}
```

## Exemplo 3: UseCase SEM dados de retorno (registro)

```csharp
public class RegisterAccountUseCase
{
    public async Task<Result> Execute(RegisterRequest request)
    {
        var response = await _api.Register(request);

        if (response.IsSuccessStatusCode)
            return Result.Success(); // Sem TResponse — apenas sucesso

        return Result.Failure(response.Errors);
    }
}
```

## Exemplo 4: UseCase COM dados de retorno (get profile)

```csharp
public class GetUserProfileUseCase
{
    public async Task<Result<Models.User>> Execute()
    {
        var response = await _api.GetUserProfile();

        if (response.IsSuccessStatusCode)
        {
            var model = new Models.User
            {
                Name = response.Content.Name,
                Email = response.Content.Email
            };

            return Result<Models.User>.Success(model);
        }

        return Result<Models.User>.Failure(response.Errors);
    }
}
```

## Exemplo 5: ViewModel consumindo Result&lt;T&gt;

```csharp
public class UserProfileViewModel
{
    private readonly GetUserProfileUseCase _useCase;

    public string Name { get; set; }
    public string Email { get; set; }

    public async Task LoadProfile()
    {
        var result = await _useCase.Execute();

        if (result.IsSuccess)
        {
            // Sem cast — compilador sabe que Response é Models.User
            Name = result.Response.Name;
            Email = result.Response.Email;
        }
        else
        {
            // Tratar erros
            foreach (var error in result.ErrorMessages)
            {
                // Exibir erro na UI
            }
        }
    }
}
```

## Exemplo 6: Abordagem ERRADA com `object` (anti-pattern)

```csharp
// NÃO FAÇA ISSO — obriga cast manual no consumidor
public class Result
{
    public bool IsSuccess { get; private set; }
    public object Response { get; private set; } // Problema

    public static Result Success(object response)
    {
        return new Result { IsSuccess = true, Response = response };
    }
}

// Na ViewModel — cast explícito, propenso a erro em runtime
var result = await _useCase.Execute();
var user = (Models.User)result.Response; // Pode explodir em runtime
```

## Exemplo 7: Reutilização com outro Model

```csharp
// Mesmo pattern, model diferente — WorkTask ao invés de User
public class CreateWorkTaskUseCase
{
    public async Task<Result<Models.WorkTask>> Execute(CreateTaskRequest request)
    {
        var response = await _api.CreateTask(request);

        if (response.IsSuccessStatusCode)
        {
            var task = new Models.WorkTask
            {
                Id = response.Content.Id,
                Title = response.Content.Title,
                Status = response.Content.Status
            };

            return Result<Models.WorkTask>.Success(task);
        }

        return Result<Models.WorkTask>.Failure(response.Errors);
    }
}
```