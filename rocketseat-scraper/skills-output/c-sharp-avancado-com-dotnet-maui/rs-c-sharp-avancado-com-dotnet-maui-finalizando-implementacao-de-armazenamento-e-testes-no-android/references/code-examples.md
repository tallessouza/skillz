# Code Examples: Armazenamento e DI no .NET MAUI

## 1. MauiProgram.cs — Registro completo de storage

```csharp
// MauiProgram.cs
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        // Registrar storage — NUNCA esquecer de chamar
        builder.AddStorage();

        return builder.Build();
    }

    // Extension method agrupando registros de storage
    private static MauiAppBuilder AddStorage(this MauiAppBuilder builder)
    {
        builder.Services.AddSingleton<IUserStorage, UserStorage>();
        builder.Services.AddSingleton<ITokensStorage, TokensStorage>();
        return builder;
    }
}
```

## 2. Use Case de Registro com Storage

```csharp
public class RegisterAccountUseCase : IRegisterAccountUseCase
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

        // Criar records tipados a partir da resposta
        var user = new Models.ValueObjects.User(response.Id, response.Name);
        _userStorage.Save(user);

        var tokens = new Models.ValueObjects.Tokens(
            response.Tokens.AccessToken,
            response.Tokens.RefreshToken);
        await _tokensStorage.Save(tokens);
    }
}
```

## 3. Use Case de Login com Storage (mesmo padrao)

```csharp
public class LoginUseCase : ILoginUseCase
{
    private readonly ILoginApi _api;
    private readonly IUserStorage _userStorage;
    private readonly ITokensStorage _tokensStorage;

    public LoginUseCase(
        ILoginApi api,
        ITokensStorage tokensStorage,
        IUserStorage userStorage)
    {
        _api = api;
        _tokensStorage = tokensStorage;
        _userStorage = userStorage;
    }

    public async Task Execute(LoginModel model)
    {
        var request = new LoginRequest(model.Email, model.Password);
        var response = await _api.Login(request);

        var user = new Models.ValueObjects.User(response.Id, response.Name);
        _userStorage.Save(user);

        var tokens = new Models.ValueObjects.Tokens(
            response.Tokens.AccessToken,
            response.Tokens.RefreshToken);
        await _tokensStorage.Save(tokens);
    }
}
```

## 4. Interfaces de Storage (referencia)

```csharp
// IUserStorage.cs
public interface IUserStorage
{
    void Save(User user);
    User? Get();
    void Clear();
}

// ITokensStorage.cs
public interface ITokensStorage
{
    Task Save(Tokens tokens);
    Task<Tokens?> Get();
    Task Clear();
}
```

**Nota:** `ITokensStorage` usa `Task` porque `SecureStorage` e assincrono. `IUserStorage` usa metodos sincronos porque `Preferences` e sincrono.

## 5. Fluxo completo: API → Records → Storage

```
API Response
    ├── response.Id ──────────┐
    ├── response.Name ────────┤
    │                         ▼
    │                   new User(id, name)
    │                         │
    │                         ▼
    │                   _userStorage.Save(user)
    │                         │
    │                         ▼
    │                   Preferences (sincrono)
    │
    ├── response.Tokens.AccessToken ───┐
    └── response.Tokens.RefreshToken ──┤
                                       ▼
                                 new Tokens(access, refresh)
                                       │
                                       ▼
                                 await _tokensStorage.Save(tokens)
                                       │
                                       ▼
                                 SecureStorage (assincrono)
```