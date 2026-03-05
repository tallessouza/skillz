---
name: rs-csharp-maui-error-handling-non-api
description: "Enforces resilient HTTP error handling in .NET MAUI apps using Refit when API is unreachable. Use when user asks to 'handle API errors', 'treat HTTP exceptions', 'deserialize error responses', 'handle offline scenario', or 'create Refit error handling'. Applies null-check on deserialized error, fallback generic message, and extension method extraction. Make sure to use this skill whenever writing Refit API communication code in .NET MAUI. Not for API-side exception filters, server configuration, or non-Refit HTTP clients."
---

# Tratamento de Erros Não-API em Refit (.NET MAUI)

> Sempre verificar se a resposta de erro veio da API antes de confiar na deserialização — se não veio, fornecer fallback com mensagem genérica.

## Rules

1. **Nunca confie que a deserialização vai funcionar** — `GetContentAsAsync<ResponseErrorJson>()` retorna `null` quando a API não respondeu (sem internet, API fora do ar), porque o content não tem o formato esperado
2. **Sempre faça null-check após deserializar** — se `errors` for `null`, instancie manualmente o `ResponseErrorJson` com mensagem genérica, porque a ViewModel precisa sempre receber um objeto válido para exibir ao usuário
3. **Extraia tratamento repetido em extension method** — crie extensão para `Refit.ApiException` para evitar duplicar lógica de deserialização + null-check em cada use case
4. **Use resource strings para mensagens genéricas** — mensagens como "Ocorreu um erro na comunicação com o servidor" devem vir de resources, porque facilita i18n e centraliza textos

## How to write

### Extension method para ApiException

```csharp
public static class ApiExceptionExtensions
{
    public static async Task<ResponseErrorJson> GetResponseError(
        this Refit.ApiException exception)
    {
        var response = await exception
            .GetContentAsAsync<ResponseErrorJson>();

        if (response is null)
        {
            response = new ResponseErrorJson(
                ResourceText.SERVER_COMMUNICATION_ERROR);
        }

        return response;
    }
}
```

### Uso no Use Case

```csharp
// ANTES: código duplicado em cada use case
var errors = await response.Error
    .GetContentAsAsync<ResponseErrorJson>();
if (errors is null)
{
    errors = new ResponseErrorJson(
        ResourceText.SERVER_COMMUNICATION_ERROR);
}

// DEPOIS: uma linha com extension method
var errorResponse = await response.Error.GetResponseError();
```

## Example

**Before (sem tratamento de API offline):**
```csharp
if (!response.IsSuccessStatusCode)
{
    var errors = await response.Error
        .GetContentAsAsync<ResponseErrorJson>();
    // errors pode ser NULL se API não respondeu → crash ou ViewModel sem info
    return new ResponseResult<User>(errors.Messages);
}
```

**After (com fallback resiliente):**
```csharp
if (!response.IsSuccessStatusCode)
{
    var errorResponse = await response.Error.GetResponseError();
    // errorResponse NUNCA é null — sempre tem mensagem para a ViewModel
    return new ResponseResult<User>(errorResponse.Messages);
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| API respondeu com erro (4xx/5xx) | Deserialização funciona normalmente via `GetContentAsAsync` |
| Sem internet / API fora do ar | `GetContentAsAsync` retorna `null` — usar fallback |
| Múltiplos use cases com mesmo padrão | Extrair extension method em `ApiExceptionExtensions` |
| Precisa de mensagem mais específica | Verificar conectividade do dispositivo antes de usar mensagem genérica |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| Deserializar erro sem null-check | Sempre verificar `if (response is null)` |
| Copiar bloco de tratamento em cada use case | Extension method `GetResponseError()` |
| Mensagem hardcoded no código | Resource string centralizada |
| Deixar `null` propagar para ViewModel | Instanciar `ResponseErrorJson` com mensagem genérica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
