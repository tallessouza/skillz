# Code Examples: Armazenamento de Dados no .NET MAUI

## Classe de resposta da API

Esta e a classe que a API retorna tanto no login quanto no registro:

```csharp
public class ResponseHasterUserJson
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public TokensJson Tokens { get; set; }
}

public class TokensJson
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}
```

## Salvando dados apos login/registro

```csharp
public async Task SaveUserData(ResponseHasterUserJson response)
{
    // Dados simples — Preferences (sincrono)
    Preferences.Set("user_id", response.Id.ToString());
    Preferences.Set("user_name", response.Name);

    // Dados sensiveis — SecureStorage (assincrono)
    await SecureStorage.SetAsync("access_token", response.Tokens.AccessToken);
    await SecureStorage.SetAsync("refresh_token", response.Tokens.RefreshToken);
}
```

## Lendo dados para uso no app

### Dashboard — exibir nome do usuario

```csharp
// Sincrono — Preferences
string userName = Preferences.Get("user_name", string.Empty);
WelcomeLabel.Text = $"Bem-vindo, {userName}";
```

### Requisicoes autenticadas — usar Access Token

```csharp
// Assincrono — SecureStorage
string accessToken = await SecureStorage.GetAsync("access_token");

if (!string.IsNullOrEmpty(accessToken))
{
    httpClient.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", accessToken);
}
```

### Criacao de tarefas — usar ID do usuario

```csharp
// Sincrono — Preferences
string currentUserId = Preferences.Get("user_id", string.Empty);

// Adicionar o usuario logado como responsavel pela tarefa
var responsaveis = new List<string> { currentUserId };
```

## Estrutura de pastas no projeto

```
Data/
├── Network/
│   └── (classes de comunicacao com API)
└── Storage/
    ├── Preference/
    │   └── User/
    │       └── UserPreferences.cs
    └── SecureStorage/
        └── Tokens/
            └── TokenSecureStorage.cs
```

## Tipos suportados pelo Preferences

```csharp
// string
Preferences.Set("theme", "dark");

// int
Preferences.Set("login_count", 5);

// bool
Preferences.Set("notifications_enabled", true);

// DateTime
Preferences.Set("last_login", DateTime.UtcNow);

// double
Preferences.Set("latitude", -23.5505);

// float
Preferences.Set("zoom_level", 1.5f);

// long
Preferences.Set("total_bytes", 1024L);
```

## Limpeza de dados (logout)

```csharp
public async Task ClearUserData()
{
    // Remover dados simples
    Preferences.Remove("user_id");
    Preferences.Remove("user_name");

    // Remover dados sensiveis
    SecureStorage.Remove("access_token");
    SecureStorage.Remove("refresh_token");

    // Ou remover TUDO do SecureStorage
    SecureStorage.RemoveAll();
}
```