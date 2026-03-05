---
name: rs-csharp-maui-refresh-token-handler
description: "Applies transparent refresh token handling pattern in .NET MAUI apps using DelegatingHandler. Use when user asks to 'implement refresh token', 'handle expired token', 'intercept HTTP 401', 'auto-renew token', or 'handle authentication in MAUI'. Enforces correct response buffering with LoadIntoBufferAsync, proper 401 detection with token_is_expired verification, and avoids double-read issues. Make sure to use this skill whenever implementing HTTP authentication interceptors in .NET MAUI or Xamarin. Not for API-side token validation, login UI, or token storage."
---

# Refresh Token Handler no .NET MAUI

> Intercepte respostas 401 no DelegatingHandler, verifique se o token expirou via desserializacao da resposta, e use LoadIntoBufferAsync para permitir leitura multipla do conteudo.

## Rules

1. **Armazene a resposta antes de retornar** — `var response = await base.SendAsync(...)` em vez de `return await base.SendAsync(...)`, porque voce precisa inspecionar o status code antes de devolver
2. **Verifique 401 E token_is_expired** — 401 sozinho nao basta, porque login com credenciais invalidas tambem retorna 401. Confirme via propriedade `token_is_expired` no body
3. **Use LoadIntoBufferAsync antes de desserializar** — `await response.Content.LoadIntoBufferAsync()` permite ler o conteudo mais de uma vez, sem isso a segunda leitura retorna null
4. **Coloque LoadIntoBufferAsync DENTRO do if 401** — nunca fora, porque carregar todo response em buffer impacta performance em respostas grandes
5. **Passe o CancellationToken** — tanto para `LoadIntoBufferAsync` quanto para `ReadFromJsonAsync`, porque o handler recebe um e deve propaga-lo
6. **So use buffer para objetos pequenos** — o response de erro e um JSON pequeno (boolean + lista de strings). Para respostas grandes, buffer causa problemas de memoria

## How to write

### DelegatingHandler com interceptacao de 401

```csharp
protected override async Task<HttpResponseMessage> SendAsync(
    HttpRequestMessage request,
    CancellationToken cancellationToken)
{
    // Armazene a resposta para inspecionar antes de retornar
    var response = await base.SendAsync(request, cancellationToken);

    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
    {
        // Permite leitura multipla do conteudo (apenas dentro do if!)
        await response.Content.LoadIntoBufferAsync(cancellationToken);

        var error = await response.Content
            .ReadFromJsonAsync<ResponseErrorJson>(cancellationToken);

        if (error is not null && error.TokenIsExpired)
        {
            // Logica de refresh token aqui
        }
    }

    return response;
}
```

## Example

**Before (problema: segunda leitura retorna null):**
```csharp
protected override async Task<HttpResponseMessage> SendAsync(
    HttpRequestMessage request, CancellationToken cancellationToken)
{
    var response = await base.SendAsync(request, cancellationToken);

    if (response.StatusCode == HttpStatusCode.Unauthorized)
    {
        // Desserializa aqui — consome o stream
        var error = await response.Content.ReadFromJsonAsync<ResponseErrorJson>();

        if (error.TokenIsExpired)
        {
            // refresh logic...
        }
    }

    // Use case tenta desserializar de novo → recebe NULL
    return response;
}
```

**After (com LoadIntoBufferAsync):**
```csharp
protected override async Task<HttpResponseMessage> SendAsync(
    HttpRequestMessage request, CancellationToken cancellationToken)
{
    var response = await base.SendAsync(request, cancellationToken);

    if (response.StatusCode == HttpStatusCode.Unauthorized)
    {
        await response.Content.LoadIntoBufferAsync(cancellationToken);

        var error = await response.Content
            .ReadFromJsonAsync<ResponseErrorJson>(cancellationToken);

        if (error is not null && error.TokenIsExpired)
        {
            // refresh logic...
        }
    }

    // Use case consegue desserializar normalmente
    return response;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Status code 401 recebido | Verifique token_is_expired no body antes de assumir token expirado |
| Precisa ler response body 2x | Use LoadIntoBufferAsync ANTES da primeira leitura |
| Response body potencialmente grande | NAO use LoadIntoBufferAsync, redesenhe o fluxo |
| Login retorna 401 | Isso e credencial invalida, nao token expirado — o if token_is_expired protege contra isso |
| CancellationToken disponivel | Passe para LoadIntoBufferAsync e ReadFromJsonAsync |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `return await base.SendAsync(...)` direto | Armazene em variavel para inspecionar |
| `if (statusCode == 401) { /* refresh */ }` sem checar body | Desserialize e verifique `token_is_expired` |
| `LoadIntoBufferAsync` fora do if 401 | Coloque dentro do if para evitar impacto em performance |
| `LoadIntoBufferAsync` para responses grandes | Use apenas para objetos JSON pequenos e conhecidos |
| Ignorar CancellationToken nos metodos async | Propague sempre |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
