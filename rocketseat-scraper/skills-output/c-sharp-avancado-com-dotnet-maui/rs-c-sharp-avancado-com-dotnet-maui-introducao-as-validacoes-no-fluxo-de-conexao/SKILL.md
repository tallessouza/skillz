---
name: rs-csharp-maui-hub-return-pattern
description: "Applies the Return Pattern for SignalR Hub methods in .NET APIs instead of throwing exceptions. Use when user asks to 'create a hub method', 'handle hub errors', 'validate in SignalR', 'return errors from websocket', or 'implement hub response'. Enforces HubOperationResult with success/error flow, immutable properties via init, and consistent return types across all hub methods. Make sure to use this skill whenever implementing SignalR Hub methods or WebSocket error handling in C#/.NET. Not for HTTP REST API error handling, middleware exception filters, or general C# exception patterns."
---

# Return Pattern para SignalR Hubs

> Em Hubs SignalR, use Return Pattern em vez de exceções — cada método retorna HubOperationResult indicando sucesso ou falha com mensagem.

## Rules

1. **Todo método do Hub retorna HubOperationResult\<T\>** — nunca void ou Task sem retorno, porque manter consistência evita que um método fuja do padrão e dificulte o tratamento no cliente
2. **Use init em vez de set nas propriedades** — `{ get; init; }` garante imutabilidade após criação do objeto, porque o resultado de uma operação não deve ser alterado depois de construído
3. **ErrorMessage nunca é null, use string.Empty** — porque simplifica checagens no cliente e evita NullReferenceException
4. **Response pode ser null (apenas em erro)** — marque com `?` para indicar nullable, porque em cenários de falha não há dados para retornar
5. **Não use try-catch nos métodos do Hub** — use Return Pattern com IFs de validação, porque try-catch em cada método polui o código e dificulta controle de quem recebe a notificação de erro
6. **Filtro de exceção do Hub é apenas para exceções desconhecidas** — validações conhecidas usam Return Pattern, exceções inesperadas usam o filtro genérico

## How to write

### Classe HubOperationResult

```csharp
public class HubOperationResult<TResponse>
{
    public bool IsSuccess { get; init; }
    public TResponse? Response { get; init; }
    public string ErrorMessage { get; init; } = string.Empty;

    public static HubOperationResult<TResponse> Success(TResponse response)
    {
        return new HubOperationResult<TResponse>
        {
            IsSuccess = true,
            Response = response
        };
    }

    public static HubOperationResult<TResponse> Failure(string errorMessage)
    {
        return new HubOperationResult<TResponse>
        {
            IsSuccess = false,
            ErrorMessage = errorMessage
        };
    }
}
```

### Método do Hub com Return Pattern

```csharp
public async Task<HubOperationResult<string>> GenerateCode()
{
    var code = _codeService.Generate();
    return HubOperationResult<string>.Success(code);
}
```

### Método com validação

```csharp
public async Task<HubOperationResult<ConnectionResponse>> ReadCode(string code)
{
    if (!_codeDictionary.ContainsKey(code))
        return HubOperationResult<ConnectionResponse>.Failure("Código não encontrado.");

    // fluxo de sucesso
    var connection = await _service.Connect(code);
    return HubOperationResult<ConnectionResponse>.Success(connection);
}
```

## Example

**Before (exceção no Hub — problemático):**
```csharp
public async Task<string> GenerateCode()
{
    try
    {
        var code = _service.Generate();
        return code;
    }
    catch (Exception ex)
    {
        throw new HubException(ex.Message);
    }
}
```

**After (Return Pattern):**
```csharp
public async Task<HubOperationResult<string>> GenerateCode()
{
    var code = _service.Generate();
    return HubOperationResult<string>.Success(code);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Método do Hub sem validação | Retorne `HubOperationResult.Success(data)` mesmo assim, para manter o padrão |
| Validação falhou | Retorne `Failure("mensagem traduzida")` e interrompa o fluxo |
| Exceção inesperada | Deixe para o filtro de exceção do Hub (implementação separada) |
| Precisa notificar pessoas diferentes (gerador vs leitor do código) | Return Pattern facilita — cada método controla quem recebe a resposta |
| Projeto compartilhado (API + App) | Coloque HubOperationResult no projeto de comunicação compartilhado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `throw new HubException(msg)` para validação | `return HubOperationResult<T>.Failure(msg)` |
| `try { } catch { }` em cada método do Hub | IF de validação + Return Pattern |
| `public async Task<string> HubMethod()` | `public async Task<HubOperationResult<string>> HubMethod()` |
| `public string ErrorMessage { get; set; }` | `public string ErrorMessage { get; init; } = string.Empty` |
| `Response` sem `?` nullable | `TResponse? Response { get; init; }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
