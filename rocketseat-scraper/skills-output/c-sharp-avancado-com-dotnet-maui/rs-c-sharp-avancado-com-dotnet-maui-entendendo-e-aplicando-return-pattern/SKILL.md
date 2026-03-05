---
name: rs-csharp-return-pattern
description: "Applies the Return Pattern (Result class) when writing C#/.NET MAUI code to avoid exceptions in mobile apps. Use when user asks to 'handle errors', 'return results from use cases', 'communicate between ViewModel and UseCase', or 'avoid exceptions in mobile apps'. Enforces static factory methods (Result.Success/Result.Failure) instead of throwing exceptions. Make sure to use this skill whenever implementing use case return types or error handling in .NET MAUI apps. Not for API error handling, middleware exception filters, or web backend code where exceptions are preferred."
---

# Return Pattern em C# / .NET MAUI

> Use cases sempre devolvem um objeto Result com sucesso ou falha — nunca lance exceções em aplicativos mobile.

## Rules

1. **Nunca lance exceções em use cases de app mobile** — exceções consomem recursos do dispositivo do usuário e podem crashar o app se não tratadas, porque diferente de uma API, você não controla o hardware
2. **Use cases sempre retornam Result** — a ViewModel precisa saber o resultado para tomar a decisão correta (redirecionar para sucesso ou exibir erros)
3. **Use métodos estáticos de fábrica** — `Result.Success()` e `Result.Failure(errors)` em vez de `new Result()`, porque torna o código declarativo e legível
4. **IsSuccess com private set** — qualquer classe pode ler, mas somente Result pode alterar, porque garante imutabilidade do resultado
5. **ErrorMessages é nulável** — se deu sucesso, não faz sentido ter uma lista vazia de erros; `null` comunica a ausência de erros
6. **Elimine else desnecessário** — se o `if` tem `return`, o código após ele já é o caminho alternativo, porque reduz indentação e melhora legibilidade

## How to write

### Classe Result (Value Object)

```csharp
public class Result
{
    public bool IsSuccess { get; private set; }
    public IList<string>? ErrorMessages { get; private set; }

    public static Result Success() => new() { IsSuccess = true };
    public static Result Failure(IList<string> errorMessages) => new() { IsSuccess = false, ErrorMessages = errorMessages };
}
```

### Use Case retornando Result

```csharp
public async Task<Result> Execute(RequestJson request)
{
    var response = await _api.Register(request);

    if (response.IsSuccessStatusCode)
    {
        // salvar dados locais
        return Result.Success();
    }

    var errorResponse = await response.Content.ReadFromJsonAsync<ResponseErrorJson>();
    return Result.Failure(errorResponse.Errors);
}
```

### ViewModel consumindo Result

```csharp
var result = await _useCase.Execute(request);

if (result.IsSuccess)
{
    // redirecionar para página de sucesso
}
else
{
    // exibir result.ErrorMessages
}
```

## Example

**Before (lançando exceção no app):**
```csharp
public async Task Execute(RequestJson request)
{
    var response = await _api.Register(request);
    if (!response.IsSuccessStatusCode)
        throw new Exception("Registro falhou"); // crash risk
}
```

**After (com Return Pattern):**
```csharp
public async Task<Result> Execute(RequestJson request)
{
    var response = await _api.Register(request);
    if (response.IsSuccessStatusCode)
        return Result.Success();

    var errorResponse = await response.Content.ReadFromJsonAsync<ResponseErrorJson>();
    return Result.Failure(errorResponse.Errors);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Use case em app mobile | Sempre retorne Result, nunca lance exceção |
| Use case em API backend | Exceções são aceitáveis (você controla o servidor) |
| Sucesso sem dados de retorno | `Result.Success()` simples |
| Sucesso com dados de retorno | Use `Result<T>` genérico (extensão futura) |
| Não entrou no if com return | Não precisa de else, o fluxo já é o caminho alternativo |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `throw new Exception("erro")` em app | `return Result.Failure(errors)` |
| `public bool IsSuccess { get; set; }` | `public bool IsSuccess { get; private set; }` |
| `List<string> ErrorMessages = new()` quando sucesso | `IList<string>? ErrorMessages` (nulável) |
| `new Result { IsSuccess = true }` no use case | `Result.Success()` (factory method) |
| `if (...) { return X; } else { return Y; }` | `if (...) { return X; } return Y;` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
