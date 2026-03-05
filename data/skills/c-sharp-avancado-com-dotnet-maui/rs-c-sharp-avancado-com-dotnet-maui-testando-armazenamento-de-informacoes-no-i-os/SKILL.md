---
name: rs-csharp-maui-ios-secure-storage-workaround
description: "Applies Secure Storage simulator workaround pattern when writing .NET MAUI code that stores tokens or sensitive data on iOS. Use when user asks to 'implement token storage', 'save credentials in MAUI', 'fix iOS simulator crash', 'SecureStorage not working', or 'handle platform-specific storage'. Ensures conditional DI registration using DeviceInfo to swap SecureStorage for Preferences on virtual devices. Make sure to use this skill whenever implementing secure storage in .NET MAUI apps targeting iOS simulators. Not for Android-only storage, general Preferences usage, or non-MAUI .NET projects."
---

# iOS Secure Storage Simulator Workaround (.NET MAUI)

> Quando o app executa em simulador iOS, substituir SecureStorage por Preferences via injecao de dependencia condicional, porque SecureStorage lanca excecao em dispositivos virtuais.

## Rules

1. **Nunca use SecureStorage diretamente em simulador iOS** — ele lanca excecao e crasha o app, porque simuladores nao suportam Keychain corretamente
2. **Crie classe alternativa implementando a mesma interface** — `TokensStorageForVirtualDevice` usa Preferences internamente, porque a interface garante que o restante do app nao percebe a troca
3. **Use DeviceInfo para deteccao condicional** — `DeviceInfo.Platform == DevicePlatform.iOS && DeviceInfo.DeviceType == DeviceType.Virtual` identifica simulador
4. **Mantenha a assinatura async da interface** — retorne `Task.CompletedTask` ou `Task.FromResult()` ao encapsular chamadas sincronas do Preferences, porque a interface exige Task
5. **Remova o workaround quando tiver dispositivo fisico** — este codigo e para ambiente de desenvolvimento apenas, porque em iPhone fisico SecureStorage funciona normalmente

## How to write

### Classe alternativa para simulador

```csharp
public class TokensStorageForVirtualDevice : ITokenStorage
{
    public Task ClearAsync()
    {
        Preferences.Clear();
        return Task.CompletedTask;
    }

    public Task SaveAsync(TokensRecord tokens)
    {
        Preferences.Set("access_token", tokens.AccessToken);
        Preferences.Set("refresh_token", tokens.RefreshToken);
        return Task.CompletedTask;
    }

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

### Registro condicional no DI (MauiProgram.cs)

```csharp
if (DeviceInfo.Platform == DevicePlatform.iOS
    && DeviceInfo.DeviceType == DeviceType.Virtual)
{
    builder.Services.AddSingleton<ITokenStorage, TokensStorageForVirtualDevice>();
}
else
{
    builder.Services.AddSingleton<ITokenStorage, TokensStorage>();
}
```

## Example

**Before (crasha no simulador iOS):**
```csharp
// MauiProgram.cs — registro unico para todas plataformas
builder.Services.AddSingleton<ITokenStorage, TokensStorage>();
// TokensStorage usa SecureStorage internamente → CRASH no simulador
```

**After (funciona em todas plataformas):**
```csharp
// MauiProgram.cs — registro condicional
if (DeviceInfo.Platform == DevicePlatform.iOS
    && DeviceInfo.DeviceType == DeviceType.Virtual)
{
    builder.Services.AddSingleton<ITokenStorage, TokensStorageForVirtualDevice>();
}
else
{
    builder.Services.AddSingleton<ITokenStorage, TokensStorage>();
}
// UserStorage usa Preferences → funciona em qualquer plataforma, sem condicional
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App crasha ao salvar token no simulador iOS | Verificar se esta usando SecureStorage — aplicar este workaround |
| Preferences (dados nao-sensiveis) | Funciona em qualquer plataforma, nao precisa de workaround |
| iPhone fisico disponivel | Remover classe ForVirtualDevice e condicional, usar TokensStorage direto |
| Metodo sincrono precisa retornar Task | Usar `Task.CompletedTask` (void) ou `Task.FromResult(valor)` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `await SecureStorage.SetAsync()` direto sem try-catch no iOS | Registrar classe alternativa via DI condicional |
| Criar arquivo Entitlements.plist manualmente (problematico no Rider/VS) | Usar workaround com Preferences no simulador |
| Mudar assinatura da interface para evitar async | Manter `Task`/`Task<T>` e retornar `Task.CompletedTask`/`Task.FromResult()` |
| Deixar workaround em producao | Remover quando dispositivo fisico estiver disponivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
