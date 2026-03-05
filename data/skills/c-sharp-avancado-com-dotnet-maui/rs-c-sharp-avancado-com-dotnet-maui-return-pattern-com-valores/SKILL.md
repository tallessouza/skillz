---
name: rs-csharp-dotnet-maui-return-pattern-valores
description: "Applies the generic Result pattern with typed responses in C# when writing use cases, services, or any operation that returns success with data or failure with errors. Use when user asks to 'create a use case', 'return result from service', 'handle success and failure', 'implement result pattern', or 'generic return type'. Enforces Result and Result<T> separation with inheritance, proper constructors, and the 'new' keyword for method hiding. Make sure to use this skill whenever implementing operation results that carry typed data in C#/.NET. Not for HTTP response handling, exception-based error handling, or simple void operations."
---

# Return Pattern com Valores Genéricos em C#

> Separar Result (sem dados) de Result&lt;TResponse&gt; (com dados tipados) usando herança e genéricos, eliminando casts manuais na camada consumidora.

## Rules

1. **Separe Result de Result&lt;T&gt;** — a classe base `Result` serve para operações sem retorno de dados (ex: registro), `Result<TResponse>` herda de `Result` e adiciona a propriedade tipada, porque nem todo use case precisa devolver dados
2. **Nunca use `object` como tipo de retorno** — use genéricos (`T`) para que o compilador resolva o tipo em tempo de compilação, porque `object` força cast manual na ViewModel/consumidor
3. **Use `new` para esconder métodos da classe base** — quando `Result<T>` redefine `Failure()`, marque com `new static` para informar o compilador que a intenção é sobrescrever, porque sem isso gera warning CS0108
4. **Construtores `protected`** — construtores de `Result` e `Result<T>` devem ser `protected`, porque somente as funções estáticas `Success()` e `Failure()` devem instanciar, garantindo factory pattern
5. **Chame `base()` no construtor filho** — `Result<T>` deve chamar `base()` para preencher `IsSuccess` na classe mãe, porque duplicar lógica quebra o princípio DRY e gera bugs silenciosos
6. **Marque `TResponse?` como nullable** — a propriedade `TResponse` pode ser nula no caso de failure, porque o construtor de falha não recebe dados de resposta

## How to write

### Classe base Result (sem dados)

```csharp
public class Result
{
    public bool IsSuccess { get; private set; }
    public IList<string> ErrorMessages { get; private set; }

    // Construtor protected — só factory methods instanciam
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
        return new Result { IsSuccess = false, ErrorMessages = errorMessages };
    }
}
```

### Classe Result&lt;TResponse&gt; (com dados tipados)

```csharp
public class Result<TResponse> : Result
{
    public TResponse? Response { get; private set; }

    protected Result(TResponse response) : base()
    {
        Response = response;
        // base() preenche IsSuccess via construtor pai
    }

    protected Result(IList<string> errorMessages) : base(false, errorMessages) { }

    public static Result<TResponse> Success(TResponse response)
    {
        return new Result<TResponse>(response) { IsSuccess = true };
    }

    // 'new' esconde Failure da classe base — intencional
    public new static Result<TResponse> Failure(IList<string> errorMessages)
    {
        return new Result<TResponse>(errorMessages);
    }
}
```

## Example

**Before (object genérico — força cast na ViewModel):**

```csharp
public class Result
{
    public bool IsSuccess { get; private set; }
    public object Response { get; private set; } // Problema: cast manual
    public IList<string> ErrorMessages { get; private set; }

    public static Result Success(object response)
    {
        return new Result { IsSuccess = true, Response = response };
    }
}

// Na ViewModel — cast manual, propenso a erro
var user = (Models.User)result.Response; // RuntimeError se tipo errado
```

**After (genérico tipado — sem cast):**

```csharp
// No UseCase
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

// Na ViewModel — tipo resolvido em compilação, sem cast
var result = await _useCase.Execute();
if (result.IsSuccess)
{
    Name = result.Response.Name;  // Compilador sabe que é Models.User
    Email = result.Response.Email;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| UseCase retorna apenas sucesso/falha (ex: registro) | Use `Result` sem genérico |
| UseCase retorna dados no sucesso (ex: get profile) | Use `Result<TResponse>` com o Model tipado |
| Múltiplos endpoints com models diferentes | Reutilize `Result<T>` passando o model específico |
| Propriedade de resposta pode ser nula | Marque `TResponse?` com nullable |
| Classe filha redefine método estático da base | Use `new static` para esconder o método base |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `public object Response` | `public TResponse? Response` |
| `(Models.User)result.Response` | `result.Response.Name` (já tipado) |
| Duplicar `IsSuccess`/`ErrorMessages` em `Result<T>` | Herdar de `Result` com `base()` |
| Construtor `public` no Result | Construtor `protected` + factory methods estáticos |
| `Result<T>.Failure()` sem `new` | `public new static Result<T> Failure(...)` |
| Copiar propriedades da base na classe filha | Usar herança: `class Result<T> : Result` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
