---
name: rs-csharp-maui-secure-storage
description: "Enforces Secure Storage patterns when writing .NET MAUI code for sensitive data like tokens or credentials. Use when user asks to 'store tokens', 'save credentials', 'implement secure storage', 'encrypt user data', or 'handle authentication tokens' in MAUI apps. Applies rules: use SecureStorage instead of Preferences for sensitive data, async save/get with await, RemoveAll for cleanup, platform-specific config for Android/iOS. Make sure to use this skill whenever generating MAUI code that handles tokens, API keys, or any sensitive user data. Not for general Preferences storage, non-sensitive settings, or non-MAUI .NET projects."
---

# Secure Storage no .NET MAUI

> Dados sensíveis como tokens devem ser armazenados no SecureStorage (cofre criptografado), nunca no Preferences.

## Rules

1. **Use SecureStorage para dados sensíveis** — tokens, API keys, credenciais vão no `SecureStorage`, não no `Preferences`, porque o SecureStorage criptografa os dados no keychain/keystore do dispositivo
2. **Operações são assíncronas** — `SetAsync` e `GetAsync` exigem `await` e métodos marcados com `async`, porque o SecureStorage faz comunicação assíncrona com o cofre do sistema operacional
3. **Uma chave por valor** — armazene cada campo individualmente (`access_token`, `refresh_token`), porque o SecureStorage trabalha com pares chave-valor simples
4. **Constantes para chaves** — defina chaves como `private const string` para evitar hard code e erros de digitação
5. **GetAsync retorna null se inexistente** — diferente do Preferences que exige valor default, o SecureStorage retorna `null` quando a chave não existe
6. **Use RemoveAll para limpar tokens** — ao fazer logout, use `SecureStorage.RemoveAll()` para limpar todo o storage de uma vez
7. **Configure Android manifest** — defina `android:allowBackup="false"` no `AndroidManifest.xml` para o SecureStorage funcionar corretamente

## How to write

### Interface para TokenStorage

```csharp
public interface ITokenStorage
{
    Task Save(Tokens tokens);
    Task<Tokens> Get();
    void Clear();
}
```

### Implementação com SecureStorage

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

## Example

**Before (tokens no Preferences — inseguro):**
```csharp
Preferences.Set("token", accessToken);
var token = Preferences.Get("token", "");
```

**After (tokens no SecureStorage — criptografado):**
```csharp
await SecureStorage.SetAsync("access_token", accessToken);
var token = await SecureStorage.GetAsync("access_token");
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Token de autenticação (access/refresh) | SecureStorage com async/await |
| Preferência do usuário (tema, idioma) | Preferences (não sensível) |
| Android build | Setar `allowBackup="false"` no manifest |
| iOS simulador | SecureStorage não funciona — usar fallback para Preferences em debug |
| Logout do usuário | `SecureStorage.RemoveAll()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Preferences.Set("token", value)` | `await SecureStorage.SetAsync("token", value)` |
| `SecureStorage.SetAsync(...)` sem `await` | `await SecureStorage.SetAsync(...)` |
| `string key = "access_token"` inline | `private const string AccessTokenKey = "access_token"` |
| `SecureStorage.Remove(key1); SecureStorage.Remove(key2);` | `SecureStorage.RemoveAll()` (para logout completo) |
| `public void Save(Tokens t)` | `public async Task Save(Tokens t)` (SetAsync é async) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
