# Code Examples: Refresh Token Handler no .NET MAUI

## Exemplo 1: Estrutura basica do PlanShareHandler

O handler original antes da implementacao do refresh token:

```csharp
public class PlanShareHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // Troca cultura, adiciona tokens ao header...

        return await base.SendAsync(request, cancellationToken);
    }
}
```

## Exemplo 2: Primeira modificacao — armazenar response

```csharp
protected override async Task<HttpResponseMessage> SendAsync(
    HttpRequestMessage request,
    CancellationToken cancellationToken)
{
    // ... logica pre-request (cultura, tokens no header)

    // ANTES: return await base.SendAsync(request, cancellationToken);
    // DEPOIS: armazena para inspecionar
    var response = await base.SendAsync(request, cancellationToken);

    // ... logica de verificacao vai aqui

    return response;
}
```

## Exemplo 3: Verificacao do status code 401

```csharp
var response = await base.SendAsync(request, cancellationToken);

if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
    // Indicio de token expirado, mas precisa confirmar
}

return response;
```

## Exemplo 4: Desserializacao SEM buffer (BUGADO)

```csharp
if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
    // Consome o stream — leitura unica!
    var error = await response.Content
        .ReadFromJsonAsync<ResponseErrorJson>(cancellationToken);

    if (error is not null && error.TokenIsExpired)
    {
        // refresh logic...
    }
}

return response;
// BUG: o use case que recebe este response
// nao conseguira ler o body novamente — retorna null
```

## Exemplo 5: Implementacao correta COM buffer

```csharp
if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
    // Carrega conteudo em buffer ANTES da primeira leitura
    await response.Content.LoadIntoBufferAsync(cancellationToken);

    var error = await response.Content
        .ReadFromJsonAsync<ResponseErrorJson>(cancellationToken);

    if (error is not null && error.TokenIsExpired)
    {
        // Logica de refresh token sera implementada na proxima aula
    }
}

return response;
// CORRETO: use case consegue ler o body normalmente
```

## Exemplo 6: O que acontece no lado da API (referencia)

O `AuthenticatedUserFilter` na API que gera o 401:

```csharp
// Na API — AuthenticatedUserFilter
try
{
    accessTokenValidator.Validate(token);
}
catch (SecurityTokenExpiredException)
{
    // Retorna 401 com token_is_expired = true
    return new UnauthorizedObjectResult(new ResponseErrorJson
    {
        TokenIsExpired = true,
        Errors = new List<string> { "Token expirado" }
    });
}
```

## Exemplo 7: Estrutura do ResponseErrorJson

```csharp
public class ResponseErrorJson
{
    public bool TokenIsExpired { get; set; }
    public List<string> Errors { get; set; } = new();
}
```

## Exemplo 8: O use case que consome a resposta

```csharp
// No LoginUseCase — tenta ler o response que o handler ja leu
try
{
    var result = await httpClient.PostAsJsonAsync("/login", loginRequest);

    if (!result.IsSuccessStatusCode)
    {
        // Sem LoadIntoBufferAsync no handler → retorna null aqui
        // Com LoadIntoBufferAsync → funciona normalmente
        var error = await result.Content
            .ReadFromJsonAsync<ResponseErrorJson>();

        if (error is null)
        {
            // Cai aqui sem buffer — mostra mensagem generica errada
            throw new Exception("Ocorreu um erro na comunicacao com o servidor");
        }

        // Com buffer — mostra a mensagem real: "e-mail e/ou senha invalidos"
        throw new ApiException(error.Errors);
    }
}
catch (ApiException) { throw; }
```

## Cenarios de teste demonstrados na aula

### Cenario 1: Login com senha errada (sem buffer)
- Input: email valido, senha "123" (errada, correta seria "123456789")
- API retorna: 401 com `{ token_is_expired: false, errors: ["e-mail e/ou senha invalidos"] }`
- Handler: desserializa body (consome stream), `token_is_expired` e false, nao faz nada
- Use case: tenta desserializar novamente → recebe null → mostra "Ocorreu um erro na comunicacao com o servidor"
- **Resultado: mensagem errada para o usuario**

### Cenario 2: Login com senha errada (com buffer)
- Mesmo input
- Handler: chama `LoadIntoBufferAsync`, desserializa, `token_is_expired` e false
- Use case: desserializa novamente → recebe o objeto correto → mostra "e-mail e/ou senha invalidos"
- **Resultado: mensagem correta para o usuario**