# Code Examples: DelegatingHandler para Enviar Idioma para API

## Exemplo 1: Abordagem descartada (parametro no Refit)

```csharp
// Interface Refit com parametro de header — FUNCIONA mas e ruim
public interface ILoginApi
{
    [Post("/api/login")]
    Task<ApiResponse<ResponseJson>> Login(
        [Body] RequestLoginJson request,
        [Header("Accept-Language")] string culture);
}

// Use case precisa passar o parametro — viola separacao de concerns
public class DoLoginUseCase
{
    private readonly ILoginApi _api;

    public async Task Execute(string email, string password)
    {
        var result = await _api.Login(
            new RequestLoginJson { Email = email, Password = password },
            "pt-BR"); // hardcoded e responsabilidade errada
    }
}
```

**Problema:** cada funcao da interface precisa do parametro extra, e o use case vira responsavel por headers HTTP.

## Exemplo 2: DelegatingHandler completo (abordagem correta)

```csharp
using System.Globalization;
using System.Net.Http.Headers;

public class PlanShareHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // Pega o idioma do dispositivo dinamicamente
        var culture = CultureInfo.CurrentCulture.Name; // ex: "pt-BR"

        // Limpa headers existentes para evitar duplicatas
        request.Headers.AcceptLanguage.Clear();

        // Adiciona o idioma do dispositivo
        request.Headers.AcceptLanguage.Add(
            new StringWithQualityHeaderValue(culture));

        // Deixa a requisicao seguir normalmente
        return await base.SendAsync(request, cancellationToken);
    }
}
```

## Exemplo 3: Registro no MauiProgram.cs

```csharp
// Em MauiProgram.cs, dentro de CreateMauiApp()

// Registrar o handler no container de DI
builder.Services.AddSingleton<PlanShareHandler>();

// Para cada interface Refit, adicionar o handler ao pipeline HTTP
builder.Services
    .AddRefitClient<ILoginApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

// Repetir para outras interfaces
builder.Services
    .AddRefitClient<IUserApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

// Repetir para TODAS as interfaces Refit do projeto
```

## Exemplo 4: O que acontece no lado da API (contexto)

```csharp
// Culture Middleware na API (ja existente, nao precisa criar)
// Este codigo esta no servidor — mostrado para contexto
public class CultureMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        var supportedLanguages = // lista de idiomas suportados
        var acceptLanguage = context.Request.Headers.AcceptLanguage;

        // Se o header existe e o idioma e suportado
        if (!string.IsNullOrEmpty(acceptLanguage) &&
            supportedLanguages.Contains(acceptLanguage))
        {
            var cultureInfo = new CultureInfo(acceptLanguage);
            CultureInfo.CurrentCulture = cultureInfo;
            CultureInfo.CurrentUICulture = cultureInfo;
        }
        // Se nao, usa o default (ingles)

        await _next(context);
    }
}
```

## Exemplo 5: Variacao — Handler para Auth Token (mesmo padrao)

```csharp
// O mesmo padrao serve para qualquer header cross-cutting
public class AuthHandler : DelegatingHandler
{
    private readonly ISecureStorage _storage;

    public AuthHandler(ISecureStorage storage)
    {
        _storage = storage;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var token = await _storage.GetAsync("auth_token");

        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
```

## Fluxo completo de execucao

```
1. Usuario clica "Login" no app
2. DoLoginUseCase chama _api.Login(request)
3. Refit monta HttpRequestMessage
4. PlanShareHandler.SendAsync intercepta:
   - CultureInfo.CurrentCulture.Name → "pt-BR"
   - request.Headers.AcceptLanguage.Clear()
   - request.Headers.AcceptLanguage.Add("pt-BR")
5. base.SendAsync envia a requisicao para a API
6. API recebe, Culture Middleware le Accept-Language: pt-BR
7. Thread da API muda para pt-BR
8. InvalidLoginException usa resource pt-BR
9. API responde: "E-mail e/ou senha inválidos"
10. App exibe mensagem em portugues para o usuario
```