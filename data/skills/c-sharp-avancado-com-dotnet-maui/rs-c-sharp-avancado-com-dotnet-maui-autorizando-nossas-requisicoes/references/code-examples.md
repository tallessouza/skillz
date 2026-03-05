# Code Examples: Autorizando Requisicoes

## 1. Estrutura do handler completo (cultura + auth)

```csharp
public class PlainShareHandler : DelegatingHandler
{
    private readonly ITokenStorage _tokenStorage;

    public PlainShareHandler(ITokenStorage tokenStorage)
    {
        _tokenStorage = tokenStorage;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        ChangeRequestCulture(request);
        await AddAuthorizationToken(request);

        return await base.SendAsync(request, cancellationToken);
    }

    private static void ChangeRequestCulture(HttpRequestMessage request)
    {
        // Logica existente de cultura
        request.Headers.AcceptLanguage.Clear();
        request.Headers.AcceptLanguage
            .Add(new StringWithQualityHeaderValue(CultureInfo.CurrentCulture.Name));
    }

    private async Task AddAuthorizationToken(HttpRequestMessage request)
    {
        var tokens = await _tokenStorage.Get();

        if (!string.IsNullOrWhiteSpace(tokens.AccessToken))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", tokens.AccessToken);
        }
    }
}
```

## 2. Interface Refit — abordagem com Authorize (NAO recomendada)

```csharp
// Funciona mas polui use cases
public interface IUserAPI
{
    [Get("/users")]
    Task<ResponseUserProfileJson> GetProfile(
        [Authorize("Bearer")] string token);
}
```

## 3. Interface Refit — abordagem limpa (recomendada)

```csharp
public interface IUserAPI
{
    [Get("/users")]
    Task<ResponseUserProfileJson> GetProfile();
}
```

## 4. Use case SEM handler (problematico)

```csharp
public class GetProfileUseCase
{
    private readonly IUserAPI _api;
    private readonly ITokenStorage _tokenStorage;

    public GetProfileUseCase(IUserAPI api, ITokenStorage tokenStorage)
    {
        _api = api;
        _tokenStorage = tokenStorage;
    }

    public async Task<ResponseUserProfileJson> Execute()
    {
        var tokens = await _tokenStorage.Get();
        return await _api.GetProfile(tokens.AccessToken);
    }
}
```

## 5. Use case COM handler (limpo)

```csharp
public class GetProfileUseCase
{
    private readonly IUserAPI _api;

    public GetProfileUseCase(IUserAPI api)
    {
        _api = api;
    }

    public async Task<ResponseUserProfileJson> Execute()
    {
        return await _api.GetProfile();
    }
}
```

## 6. O filtro na API (backend)

```csharp
// Controller
[AuthenticatedUser]
[HttpGet]
public async Task<IActionResult> GetProfile()
{
    var response = await _useCase.Execute();
    return Ok(response);
}

// Filtro de autenticacao
public class AuthenticateUserAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        var token = TokenOnRequest(context.HttpContext);
        // Valida JWT, extrai ID, verifica usuario no banco
        await next();
    }

    private string TokenOnRequest(HttpContext context)
    {
        var authorization = context.Request.Headers.Authorization.ToString();
        return authorization["Bearer ".Length..].Trim();
    }
}
```

## 7. ITokenStorage e o value object

```csharp
public interface ITokenStorage
{
    Task<Tokens> Get();
    Task Save(Tokens tokens);
}

public record Tokens(string AccessToken, string RefreshToken);

// Implementacao usa SecureStorage (SQLStorage)
public class SqlTokenStorage : ITokenStorage
{
    public async Task<Tokens> Get()
    {
        var accessToken = await SecureStorage.GetAsync("access_token") ?? string.Empty;
        var refreshToken = await SecureStorage.GetAsync("refresh_token") ?? string.Empty;
        return new Tokens(accessToken, refreshToken);
    }
}
```

## 8. Registro do handler no DI container

```csharp
// No MauiProgram.cs ou equivalente
services.AddTransient<PlainShareHandler>();

services.AddRefitClient<IUserAPI>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiUrl))
    .AddHttpMessageHandler<PlainShareHandler>();
```