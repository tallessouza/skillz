# Code Examples: Armazenamento com Preferences no .NET MAUI

## Estrutura de pastas do projeto

```
Models/
├── ValueObjects/
│   ├── User.cs          // record User(Guid Id, string Name)
│   └── Token.cs         // record Token(string AccessToken, string RefreshToken)
Preference/
├── IUserStorage.cs      // interface
└── UserStorage.cs       // implementacao
```

## Record User completo

```csharp
namespace AppName.Models.ValueObjects;

public record User(Guid Id, string Name);
```

## Record Token completo

```csharp
namespace AppName.Models.ValueObjects;

public record Token(string AccessToken, string RefreshToken);
```

## Interface IUserStorage completa

```csharp
namespace AppName.Preference;

public interface IUserStorage
{
    void Save(Models.ValueObjects.User user);
    Models.ValueObjects.User Get();
    void Clear();
}
```

## Classe UserStorage completa

```csharp
namespace AppName.Preference;

public class UserStorage : IUserStorage
{
    private const string IdKey = "id";
    private const string NameKey = "name";

    public void Save(Models.ValueObjects.User user)
    {
        Microsoft.Maui.Storage.Preferences.Default.Set(IdKey, user.Id.ToString());
        Microsoft.Maui.Storage.Preferences.Default.Set(NameKey, user.Name);
    }

    public Models.ValueObjects.User Get()
    {
        var id = Microsoft.Maui.Storage.Preferences.Default.Get(IdKey, "");
        var name = Microsoft.Maui.Storage.Preferences.Default.Get(NameKey, "");

        return new Models.ValueObjects.User(Guid.Parse(id), name);
    }

    public void Clear() => Microsoft.Maui.Storage.Preferences.Default.Clear();
}
```

## Registro no servico de injecao de dependencia

```csharp
// Em MauiProgram.cs
builder.Services.AddSingleton<IUserStorage, UserStorage>();
```

## Tipos suportados pelo Preferences

| Tipo C# | Exemplo |
|---------|---------|
| `string` | `"hello"` |
| `int` | `42` |
| `bool` | `true` |
| `long` | `123456789L` |
| `double` | `3.14` |
| `float` | `1.5f` |
| `DateTime` | `DateTime.Now` |

## Funcoes disponiveis no Preferences.Default

```csharp
// Salvar valor
Preferences.Default.Set("key", "value");

// Recuperar valor (com default obrigatorio)
var value = Preferences.Default.Get("key", "default");

// Verificar se chave existe
bool exists = Preferences.Default.ContainsKey("key");

// Remover chave especifica
Preferences.Default.Remove("key");

// Limpar todas as chaves
Preferences.Default.Clear();
```

## Variacao: TokenStorage seguindo o mesmo padrao

```csharp
public interface ITokenStorage
{
    void Save(Models.ValueObjects.Token token);
    Models.ValueObjects.Token Get();
    void Clear();
}

public class TokenStorage : ITokenStorage
{
    private const string AccessTokenKey = "access_token";
    private const string RefreshTokenKey = "refresh_token";

    public void Save(Models.ValueObjects.Token token)
    {
        // Nota: tokens SAO dados sensiveis — use SecureStorage na pratica
        Microsoft.Maui.Storage.Preferences.Default.Set(AccessTokenKey, token.AccessToken);
        Microsoft.Maui.Storage.Preferences.Default.Set(RefreshTokenKey, token.RefreshToken);
    }

    public Models.ValueObjects.Token Get()
    {
        var access = Microsoft.Maui.Storage.Preferences.Default.Get(AccessTokenKey, "");
        var refresh = Microsoft.Maui.Storage.Preferences.Default.Get(RefreshTokenKey, "");
        return new Models.ValueObjects.Token(access, refresh);
    }

    public void Clear() => Microsoft.Maui.Storage.Preferences.Default.Clear();
}
```

## Uso em uma ViewModel ou Page

```csharp
public class ProfilePage : ContentPage
{
    private readonly IUserStorage _userStorage;

    public ProfilePage(IUserStorage userStorage)
    {
        _userStorage = userStorage;
    }

    private void OnLogin(Guid userId, string userName)
    {
        var user = new Models.ValueObjects.User(userId, userName);
        _userStorage.Save(user);
    }

    private void OnLoadProfile()
    {
        var user = _userStorage.Get();
        // user.Id e user.Name disponiveis
    }

    private void OnLogout()
    {
        _userStorage.Clear();
        // Todos os dados removidos
    }
}
```