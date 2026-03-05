---
name: rs-csharp-maui-storage-di-setup
description: "Applies dependency injection registration and storage implementation patterns for .NET MAUI apps. Use when user asks to 'register services', 'configure DI', 'store user data', 'save tokens', 'implement preferences', 'secure storage', or 'setup dependency injection in MAUI'. Ensures correct singleton registration with interface-to-class mapping, proper constructor injection in use cases, and storage calls after API success. Make sure to use this skill whenever setting up storage or DI in .NET MAUI projects. Not for API implementation, UI layout, or navigation logic."
---

# Armazenamento e Injecao de Dependencia no .NET MAUI

> Registre classes de armazenamento como singleton no DI container e injete-as nos use cases via construtor para persistir dados apos sucesso da API.

## Rules

1. **Registre storage como singleton** — use `AddSingleton<IInterface, Classe>()` porque storage nao precisa ser recriado a cada uso, uma unica instancia reutilizavel e suficiente
2. **Crie extension methods para organizar registros** — agrupe registros relacionados em metodos como `AddStorage()` no MauiProgram, porque mantem o builder limpo e modular
3. **Sempre chame o extension method no builder** — registrar a funcao e nao chama-la e um erro silencioso comum que resulta em null injection
4. **Injete via construtor com propriedades private readonly** — garante imutabilidade e que o objeto esta disponivel em toda a classe
5. **Armazene dados no use case, nao na view model** — persistencia e regra de negocio, pertence ao use case
6. **Duplique chamadas de storage em use cases distintos quando necessario** — login e registro sao casos de uso separados, duplicar o codigo de armazenamento e correto, nao crie abstracoes desnecessarias
7. **Crie records intermediarios antes de salvar** — nao passe o response diretamente ao storage, construa objetos tipados explicitos

## How to write

### Extension method de registro no MauiProgram

```csharp
// MauiProgram.cs
public static MauiAppBuilder AddStorage(this MauiAppBuilder builder)
{
    builder.Services.AddSingleton<IUserStorage, UserStorage>();
    builder.Services.AddSingleton<ITokensStorage, TokensStorage>();
    return builder;
}

// No builder principal - NUNCA esqueca de chamar
builder.AddStorage();
```

### Injecao no construtor do use case

```csharp
public class LoginUseCase
{
    private readonly IUserStorage _userStorage;
    private readonly ITokensStorage _tokensStorage;

    public LoginUseCase(
        ITokensStorage tokensStorage,
        IUserStorage userStorage)
    {
        _tokensStorage = tokensStorage;
        _userStorage = userStorage;
    }
}
```

### Armazenamento apos sucesso da API

```csharp
// Dentro do Execute do use case, apos resposta com sucesso
var user = new Models.ValueObjects.User(response.Id, response.Name);
_userStorage.Save(user);

var tokens = new Models.ValueObjects.Tokens(
    response.Tokens.AccessToken,
    response.Tokens.RefreshToken);
await _tokensStorage.Save(tokens);
```

## Example

**Before (storage nao integrado):**
```csharp
public class RegisterAccountUseCase
{
    private readonly IRegisterApi _api;

    public RegisterAccountUseCase(IRegisterApi api)
    {
        _api = api;
    }

    public async Task Execute(RegisterModel model)
    {
        var request = new RegisterRequest(model.Name, model.Email, model.Password);
        var response = await _api.Register(request);
        // Dados perdidos - nada armazenado apos sucesso
    }
}
```

**After (com storage integrado):**
```csharp
public class RegisterAccountUseCase
{
    private readonly IRegisterApi _api;
    private readonly IUserStorage _userStorage;
    private readonly ITokensStorage _tokensStorage;

    public RegisterAccountUseCase(
        IRegisterApi api,
        ITokensStorage tokensStorage,
        IUserStorage userStorage)
    {
        _api = api;
        _tokensStorage = tokensStorage;
        _userStorage = userStorage;
    }

    public async Task Execute(RegisterModel model)
    {
        var request = new RegisterRequest(model.Name, model.Email, model.Password);
        var response = await _api.Register(request);

        var user = new Models.ValueObjects.User(response.Id, response.Name);
        _userStorage.Save(user);

        var tokens = new Models.ValueObjects.Tokens(
            response.Tokens.AccessToken,
            response.Tokens.RefreshToken);
        await _tokensStorage.Save(tokens);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados que nao mudam frequentemente (user info) | Use `Preferences` via `IUserStorage` |
| Dados sensiveis (tokens) | Use `SecureStorage` via `ITokensStorage` |
| Classe de storage sem estado mutavel | Registre como `AddSingleton` |
| Mesmo armazenamento em login e registro | Duplique o codigo em cada use case |
| Parametro do use case | Padronize chamando de `model` |
| Teste no Android funciona, iOS simulador falha | Secure Storage precisa configuracao extra no iOS |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `builder.Services.AddTransient<IUserStorage, UserStorage>()` | `AddSingleton` — storage nao precisa ser recriado |
| Salvar `response` direto no storage | Criar record intermediario tipado |
| Chamar storage na ViewModel | Chamar no UseCase — e regra de negocio |
| Registrar no DI e esquecer de chamar `AddStorage()` | Sempre verificar que o extension method e chamado no builder |
| `_api.Register(request); _userStorage.Save(response);` tudo inline | Separar em variaveis nomeadas para clareza |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
