# Code Examples: iOS Secure Storage Simulator Workaround

## Exemplo completo: TokensStorageForVirtualDevice

Classe alternativa que implementa a mesma interface `ITokenStorage`, usando Preferences em vez de SecureStorage:

```csharp
public class TokensStorageForVirtualDevice : ITokenStorage
{
    // Clear usa Preferences.Clear() em vez de SecureStorage.RemoveAll()
    public Task ClearAsync()
    {
        Preferences.Clear();
        return Task.CompletedTask;
    }

    // Save usa Preferences.Set() em vez de SecureStorage.SetAsync()
    // Nao precisa de async/await porque Preferences.Set e sincrono
    public Task SaveAsync(TokensRecord tokens)
    {
        Preferences.Set("access_token", tokens.AccessToken);
        Preferences.Set("refresh_token", tokens.RefreshToken);
        return Task.CompletedTask;
    }

    // Get usa Preferences.Get() em vez de SecureStorage.GetAsync()
    // Retorna Task.FromResult() para encapsular resultado sincrono em Task
    public Task<TokensRecord> GetAsync()
    {
        var tokens = new TokensRecord(
            Preferences.Get("access_token", string.Empty),
            Preferences.Get("refresh_token", string.Empty)
        );
        return Task.FromResult(tokens);
    }
}
```

### Comparacao com TokensStorage original

```csharp
// TokensStorage original — usa SecureStorage (CRASHA no simulador iOS)
public class TokensStorage : ITokenStorage
{
    public async Task ClearAsync()
    {
        SecureStorage.RemoveAll();
        // SecureStorage.RemoveAll() e sincrono, mas a interface exige Task
    }

    public async Task SaveAsync(TokensRecord tokens)
    {
        await SecureStorage.SetAsync("access_token", tokens.AccessToken);
        await SecureStorage.SetAsync("refresh_token", tokens.RefreshToken);
    }

    public async Task<TokensRecord> GetAsync()
    {
        var accessToken = await SecureStorage.GetAsync("access_token");
        var refreshToken = await SecureStorage.GetAsync("refresh_token");
        return new TokensRecord(accessToken ?? string.Empty, refreshToken ?? string.Empty);
    }
}
```

## Exemplo completo: Registro condicional no MauiProgram.cs

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

        // ... outras configuracoes ...

        AddStorage(builder.Services);

        return builder.Build();
    }

    private static void AddStorage(IServiceCollection services)
    {
        // UserStorage funciona em qualquer plataforma — sem condicional
        services.AddSingleton<IUserStorage, UserStorage>();

        // TokenStorage precisa de condicional para simulador iOS
        if (DeviceInfo.Platform == DevicePlatform.iOS
            && DeviceInfo.DeviceType == DeviceType.Virtual)
        {
            // Simulador iOS: usa Preferences (workaround)
            services.AddSingleton<ITokenStorage, TokensStorageForVirtualDevice>();
        }
        else
        {
            // Dispositivo fisico ou Android: usa SecureStorage (padrao)
            services.AddSingleton<ITokenStorage, TokensStorage>();
        }
    }
}
```

## Como criar a classe alternativa passo a passo

O instrutor demonstrou uma tecnica pratica no Visual Studio:

1. Navegar ate a pasta `Data/Storage/SecureStorage/`
2. Selecionar a classe `TokensStorage`
3. Ctrl+C, Ctrl+V para duplicar o arquivo
4. Renomear para `TokensStorageForVirtualDevice`
5. Alterar o nome da classe dentro do arquivo
6. Substituir todas as chamadas de `SecureStorage` por `Preferences`:
   - `SecureStorage.RemoveAll()` → `Preferences.Clear()`
   - `SecureStorage.SetAsync()` → `Preferences.Set()`
   - `SecureStorage.GetAsync()` → `Preferences.Get()`
7. Remover `async`/`await` (Preferences e sincrono)
8. Adicionar `return Task.CompletedTask` nos metodos void
9. Adicionar `return Task.FromResult()` nos metodos com retorno

## Padrao Task.CompletedTask vs Task.FromResult

```csharp
// Quando o metodo retorna Task (sem valor):
public Task MetodoSemRetorno()
{
    // faz algo sincrono
    return Task.CompletedTask; // "a task foi completada com sucesso"
}

// Quando o metodo retorna Task<T> (com valor):
public Task<MinhaClasse> MetodoComRetorno()
{
    var resultado = new MinhaClasse();
    return Task.FromResult(resultado); // encapsula valor sincrono em Task
}

// ERRADO: mudar a assinatura da interface
// public void MetodoSemRetorno() — QUEBRA a interface
// public MinhaClasse MetodoComRetorno() — QUEBRA a interface
```

## Debug no Rider (macOS) — pontos de atencao

```
// No Rider, para executar em modo debug:
// - NAO clique no botao de Play (executa sem debug)
// - Clique no icone do "inseto" (bug) para executar com debug
// - No Visual Studio seria apenas F5

// Breakpoints uteis para verificar o workaround:
// 1. No LoginUseCase — verificar que TokenStorage e do tipo correto
// 2. No SaveAsync do TokensStorageForVirtualDevice — confirmar que Preferences e usado
// 3. No UserStorage — confirmar que funciona normalmente
```

## Abordagem oficial (Entitlements.plist) — referencia

Embora nao recomendada pelo instrutor devido a bugs, segue a referencia:

```xml
<!-- Platforms/iOS/Entitlements.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>keychain-access-groups</key>
    <array>
        <string>$(AppIdentifierPrefix)com.companyname.planshare</string>
    </array>
</dict>
</plist>
```

Esta abordagem requer configuracao adicional no Bundle Signing do projeto, que pode nao estar disponivel dependendo da versao do Visual Studio ou Rider.