---
name: rs-csharp-maui-armazenamento-dados
description: "Enforces correct data storage strategy in .NET MAUI apps using Preferences for simple data and SecureStorage for sensitive data. Use when user asks to 'store data in MAUI', 'save token', 'persist user data', 'local storage in .NET MAUI', or 'save preferences'. Classifies data as simple or sensitive, then applies the correct API. Make sure to use this skill whenever implementing any local data persistence in .NET MAUI. Not for database storage, cloud sync, or file system operations."
---

# Armazenamento de Dados no .NET MAUI

> Classifique o dado como simples ou sensivel antes de escolher a API de armazenamento.

## Rules

1. **Classifique antes de armazenar** — pergunte: "esse dado e simples ou sensivel?" porque usar a API errada expoe dados criticos ou adiciona complexidade desnecessaria
2. **Dados simples usam Preferences** — IDs, nomes, configuracoes (idioma, tema), porque sao dados que nao causam dano se expostos
3. **Dados sensiveis usam SecureStorage** — tokens (access token, refresh token), senhas, porque vazamento permite impersonacao do usuario
4. **SecureStorage so aceita string** — serialize para string antes de salvar, porque a API nativa so suporta esse tipo
5. **SecureStorage e assincrono** — sempre use `await` para ler e salvar, porque a operacao de criptografia e async por natureza
6. **Preferences e sincrono** — acesso direto sem await, porque os dados nao passam por criptografia
7. **Ambos persistem entre sessoes** — dados sobrevivem ao fechamento do app, porque usam APIs nativas de persistencia do dispositivo

## How to write

### Organizacao de pastas

```
Data/
├── Network/           # Comunicacao com API
└── Storage/
    ├── Preference/
    │   └── User/      # ID, nome (dados simples)
    └── SecureStorage/
        └── Tokens/    # AccessToken, RefreshToken (dados sensiveis)
```

### Preferences (dados simples)

```csharp
// Salvar — sincrono, sem await
Preferences.Set("user_id", userId.ToString());
Preferences.Set("user_name", userName);

// Ler — sincrono, com valor padrao
string userName = Preferences.Get("user_name", string.Empty);
string userId = Preferences.Get("user_id", string.Empty);

// Remover
Preferences.Remove("user_name");
```

### SecureStorage (dados sensiveis)

```csharp
// Salvar — assincrono, requer await
await SecureStorage.SetAsync("access_token", accessToken);
await SecureStorage.SetAsync("refresh_token", refreshToken);

// Ler — assincrono, retorna null se nao existe
string accessToken = await SecureStorage.GetAsync("access_token");
string refreshToken = await SecureStorage.GetAsync("refresh_token");

// Remover
SecureStorage.Remove("access_token");
```

## Example

**Before (erro comum — token no Preferences):**
```csharp
// ERRADO: token e dado sensivel, nao use Preferences
Preferences.Set("access_token", token);
string token = Preferences.Get("access_token", "");
```

**After (com esta skill aplicada):**
```csharp
// CORRETO: token vai para SecureStorage (criptografado)
await SecureStorage.SetAsync("access_token", token);
string token = await SecureStorage.GetAsync("access_token");
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ID do usuario | Preferences — vai na rota da API, nao e criptografado no JWT |
| Nome do usuario | Preferences — dado publico, usado para exibicao |
| Access Token | SecureStorage — permite impersonacao se vazado |
| Refresh Token | SecureStorage — permite gerar novos access tokens |
| Tema (dark/light) | Preferences — configuracao simples do app |
| Idioma do app | Preferences — preferencia do usuario |
| Senha | SecureStorage — dado altamente sensivel |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `Preferences.Set("token", token)` | `await SecureStorage.SetAsync("token", token)` |
| `SecureStorage.SetAsync("theme", "dark")` | `Preferences.Set("theme", "dark")` |
| Salvar token sem await | `await SecureStorage.SetAsync(...)` |
| Misturar dados simples e sensiveis na mesma pasta | Separar em `Preference/` e `SecureStorage/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
