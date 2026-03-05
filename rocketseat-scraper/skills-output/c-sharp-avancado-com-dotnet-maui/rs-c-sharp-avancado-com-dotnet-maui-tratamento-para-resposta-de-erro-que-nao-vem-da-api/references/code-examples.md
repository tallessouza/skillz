# Code Examples: Tratamento de Erros Não-API em Refit

## Extension method completa

```csharp
// Extensions/ApiExceptionExtensions.cs
using PlanShare.App.Resources;
using Refit;

public static class ApiExceptionExtensions
{
    public static async Task<ResponseErrorJson> GetResponseError(
        this ApiException exception)
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

## Resource string

```xml
<!-- Resources/ResourceText.resx -->
<data name="SERVER_COMMUNICATION_ERROR" xml:space="preserve">
    <value>Ocorreu um erro na comunicação com o servidor. Por favor, tente novamente mais tarde.</value>
</data>
```

## Use case de Login (antes)

```csharp
public async Task<ResponseResult<User>> Execute(RequestLoginJson request)
{
    var response = await _api.Login(request);

    if (response.IsSuccessStatusCode)
    {
        return new ResponseResult<User>(response.Content);
    }
    else
    {
        var errors = await response.Error
            .GetContentAsAsync<ResponseErrorJson>();
        // BUG: errors pode ser null se API não respondeu
        return new ResponseResult<User>(errors.Messages);
    }
}
```

## Use case de Login (depois)

```csharp
public async Task<ResponseResult<User>> Execute(RequestLoginJson request)
{
    var response = await _api.Login(request);

    if (response.IsSuccessStatusCode)
    {
        return new ResponseResult<User>(response.Content);
    }
    else
    {
        var errorResponse = await response.Error.GetResponseError();
        // errorResponse NUNCA é null
        return new ResponseResult<User>(errorResponse.Messages);
    }
}
```

## Use case de Register (mesmo padrão)

```csharp
public async Task<ResponseResult<RegisteredUser>> Execute(
    RequestRegisterJson request)
{
    var response = await _api.Register(request);

    if (response.IsSuccessStatusCode)
    {
        return new ResponseResult<RegisteredUser>(response.Content);
    }
    else
    {
        // Mesmo extension method — zero duplicação
        var errorResponse = await response.Error.GetResponseError();
        return new ResponseResult<RegisteredUser>(errorResponse.Messages);
    }
}
```

## Testando com debugger

Para testar o cenário de API offline:
1. Botão direito no projeto `PlanShare.App` → "Set as Startup Project"
2. Executar sem a API (não configurar múltiplos projetos)
3. Colocar breakpoint no `if (response is null)`
4. Tentar login com dados válidos
5. Verificar que `content` vem `null` e o fallback funciona

## Variação: tratamento mais específico (mencionada pelo instrutor)

```csharp
public static async Task<ResponseErrorJson> GetResponseError(
    this ApiException exception)
{
    var response = await exception
        .GetContentAsAsync<ResponseErrorJson>();

    if (response is null)
    {
        // Possível melhoria: verificar conectividade
        var hasInternet = Connectivity.Current.NetworkAccess
            == NetworkAccess.Internet;

        var message = hasInternet
            ? ResourceText.SERVER_COMMUNICATION_ERROR
            : ResourceText.NO_INTERNET_CONNECTION;

        response = new ResponseErrorJson(message);
    }

    return response;
}
```