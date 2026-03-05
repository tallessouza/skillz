# Code Examples: Secure Storage no .NET MAUI

## Exemplo completo da aula

### 1. Record Tokens (value object)

```csharp
public record Tokens(string AccessToken, string RefreshToken);
```

### 2. Interface ITokenStorage

```csharp
public interface ITokenStorage
{
    Task Save(Tokens tokens);
    Task<Tokens> Get();
    void Clear();
}
```

### 3. Implementação TokenStorage

```csharp
public class TokenStorage : ITokenStorage
{
    private const string AccessTokenKey = "access_token";
    private const string RefreshTokenKey = "refresh_token";

    public async Task Save(Tokens tokens)
    {
        await SecureStorage.SetAsync(AccessTokenKey, tokens.AccessToken);
        await SecureStorage.SetAsync(RefreshTokenKey, tokens.RefreshToken);
    }

    public async Task<Tokens> Get()
    {
        var accessToken = await SecureStorage.GetAsync(AccessTokenKey);
        var refreshToken = await SecureStorage.GetAsync(RefreshTokenKey);

        return new Tokens(accessToken!, refreshToken!);
    }

    public void Clear()
    {
        SecureStorage.RemoveAll();
    }
}
```

### 4. Configuração AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="false"
        ...>
    </application>
</manifest>
```

## Comparação: Preferences vs SecureStorage

### Preferences (dados não sensíveis)

```csharp
// Save — síncrono
Preferences.Set("theme", "dark");

// Get — síncrono, requer default value
var theme = Preferences.Get("theme", "light");

// Clear
Preferences.Clear();
```

### SecureStorage (dados sensíveis)

```csharp
// Save — assíncrono
await SecureStorage.SetAsync("access_token", token);

// Get — assíncrono, retorna null se não existir
var token = await SecureStorage.GetAsync("access_token");

// Clear
SecureStorage.RemoveAll();
```

## Variação: Fallback para iOS Simulator

```csharp
public async Task Save(Tokens tokens)
{
#if DEBUG
    // Fallback para simulador iOS onde SecureStorage não funciona
    if (DeviceInfo.DeviceType == DeviceType.Virtual && DeviceInfo.Platform == DevicePlatform.iOS)
    {
        Preferences.Set(AccessTokenKey, tokens.AccessToken);
        Preferences.Set(RefreshTokenKey, tokens.RefreshToken);
        return;
    }
#endif

    await SecureStorage.SetAsync(AccessTokenKey, tokens.AccessToken);
    await SecureStorage.SetAsync(RefreshTokenKey, tokens.RefreshToken);
}
```

## Variação: Remove individual vs RemoveAll

```csharp
// Remove chave por chave — retorna bool indicando se deletou
bool removed = SecureStorage.Remove("access_token");

// Remove tudo de uma vez — mais simples para logout
SecureStorage.RemoveAll();
```