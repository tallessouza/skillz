---
name: rs-csharp-maui-deserializando-erros-api
description: "Enforces correct API error response deserialization patterns in C#/.NET MAUI with Refit. Use when user asks to 'handle API errors', 'deserialize error response', 'parse Refit error', 'catch API exception', or works with Refit ApiResponse error handling. Applies rules: use JsonConstructor attribute instead of parameterless constructors, set PropertyNameCaseInsensitive, prefer GetContentAs over manual deserialization. Make sure to use this skill whenever implementing error handling for Refit API calls in .NET MAUI. Not for success response handling, HTTP client setup, or non-Refit API consumption."
---

# Desserializando Erros de API com Refit

> Quando Refit retorna erro, deserializar manualmente o content da resposta em um objeto tipado para acessar propriedades de erro.

## Rules

1. **Refit so deserializa sucesso** — o content de erro vem como string crua, porque Refit so popula o tipo generico em respostas de sucesso
2. **Use `[JsonConstructor]` em vez de construtor sem parametro** — criar construtor vazio permite instanciar a classe sem dados obrigatorios, quebrando a intencao do design
3. **Configure `PropertyNameCaseInsensitive = true`** — APIs devolvem JSON em camelCase, propriedades C# sao PascalCase, sem isso a deserializacao popula null
4. **Prefira `GetContentAs<T>()` do Refit** — menos codigo e ja usa o deserializer interno configurado corretamente, porque o Refit ja trata case sensitivity
5. **Use `System.Text.Json`** — nao precisa de Newtonsoft.Json, o serializer nativo do .NET e mais leve e performatico

## How to write

### Abordagem recomendada (GetContentAs do Refit)
```csharp
if (response.IsSuccessStatusCode)
{
    // processar sucesso
}
else
{
    var errors = await response.Error.GetContentAs<ResponseErrorJson>();
    // usar errors.Errors para acessar lista de mensagens
}
```

### Abordagem manual (controle total)
```csharp
else
{
    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    var errors = JsonSerializer.Deserialize<ResponseErrorJson>(
        response.Error.Content!, options);
}
```

### Classe de erro com JsonConstructor
```csharp
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    [JsonConstructor]
    public ResponseErrorJson(List<string> errors)
    {
        Errors = errors;
    }

    public ResponseErrorJson(string errorMessage)
    {
        Errors = new List<string> { errorMessage };
    }
}
```

## Example

**Before (erro comum — construtor sem parametro):**
```csharp
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    // ERRADO: permite instanciar sem erros, e nao resolve o problema do deserializer
    public ResponseErrorJson() { }
    public ResponseErrorJson(List<string> errors) { Errors = errors; }
}

// ERRADO: sem options, Errors fica null por case mismatch
var errors = JsonSerializer.Deserialize<ResponseErrorJson>(response.Error.Content!);
```

**After (com esta skill aplicada):**
```csharp
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    [JsonConstructor]
    public ResponseErrorJson(List<string> errors) { Errors = errors; }

    public ResponseErrorJson(string errorMessage)
    {
        Errors = new List<string> { errorMessage };
    }
}

// Simples — usa deserializer interno do Refit
var errors = await response.Error.GetContentAs<ResponseErrorJson>();
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de controle sobre desserializacao | Use JsonSerializer.Deserialize com options |
| Quer simplicidade e menos codigo | Use `response.Error.GetContentAs<T>()` |
| Classe de erro tem multiplos construtores | Marque o correto com `[JsonConstructor]` |
| JSON da API usa camelCase | Configure `PropertyNameCaseInsensitive = true` |
| Nao quer permitir instanciacao sem dados | Nunca adicione construtor sem parametro, use `[JsonConstructor]` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `public ResponseErrorJson() { }` para resolver erro de deserializacao | `[JsonConstructor]` no construtor correto |
| `JsonSerializer.Deserialize<T>(content)` sem options | Passe `new JsonSerializerOptions { PropertyNameCaseInsensitive = true }` |
| `using Newtonsoft.Json` para deserializacao simples | `using System.Text.Json` nativo do .NET |
| `response.Error.Content` sem `!` (null-forgiving) | `response.Error.Content!` pois ja verificou que nao e sucesso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
