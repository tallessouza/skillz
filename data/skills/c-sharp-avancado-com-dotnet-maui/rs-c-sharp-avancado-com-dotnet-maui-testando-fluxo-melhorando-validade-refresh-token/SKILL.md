---
name: rs-csharp-dotnet-maui-refresh-token-config
description: "Enforces .NET configuration injection pattern to eliminate magic numbers using IOptions, appsettings.json sections, and BindConfiguration. Use when user asks to 'configure token expiration', 'remove magic numbers', 'inject settings in .NET', 'use appsettings', or 'bind configuration'. Make sure to use this skill whenever hardcoded values appear in .NET business logic that should be environment-specific. Not for JWT token generation logic, authentication middleware setup, or frontend token handling."
---

# Configuracao Injetavel no .NET — Eliminando Numeros Magicos

> Valores que mudam por ambiente devem vir de configuracao injetada, nunca hardcoded no codigo.

## Rules

1. **Nunca use numeros magicos em regras de negocio** — `_tokenSettings.RefreshTokenValidIn` nao `7`, porque numeros magicos nao comunicam intencao e nao permitem configuracao por ambiente
2. **Um arquivo appsettings por ambiente** — `appsettings.Development.json`, `appsettings.Production.json`, porque cada ambiente pode ter valores diferentes
3. **Nomes de propriedades devem ser identicos** — o nome na classe C# deve ser identico ao nome no JSON, porque o binding depende de name matching
4. **Use `get; init;` em classes de configuracao** — nao `get; set;`, porque apos a injecao de dependencia criar a instancia, nenhum codigo deve alterar o valor
5. **Navegue secoes com dois-pontos** — `"Settings:RefreshToken"` nao busca direta, porque o .NET usa `:` como separador de caminho no JSON
6. **Documente status codes na API** — adicione `ProducesResponseType` para cada status possivel (200, 401, 403), porque o Swagger precisa refletir todos os cenarios

## How to write

### Classe de configuracao (Settings)

```csharp
// Propriedades com get; init; — imutaveis apos instanciacao
public class TokenSettings
{
    public int RefreshTokenValidIn { get; init; }
}
```

### Registro no DI com BindConfiguration

```csharp
public static void AddTokenService(this IServiceCollection services)
{
    services.AddOptions<TokenSettings>()
        .BindConfiguration("Settings:RefreshToken");
}
```

### Injecao via IOptions no Use Case

```csharp
public class UseRefreshTokenUseCase
{
    private readonly TokenSettings _tokenSettings;

    public UseRefreshTokenUseCase(IOptions<TokenSettings> tokenSettings)
    {
        _tokenSettings = tokenSettings.Value;
    }

    public void Execute()
    {
        var expireAt = refreshToken.CreatedAt
            .AddDays(_tokenSettings.RefreshTokenValidIn);
    }
}
```

### Estrutura no appsettings.Development.json

```json
{
  "Settings": {
    "RefreshToken": {
      "RefreshTokenValidIn": 7
    }
  }
}
```

## Example

**Before (numero magico):**
```csharp
var expireAt = refreshToken.CreatedAt.AddDays(7);
```

**After (configuracao injetada):**
```csharp
var expireAt = refreshToken.CreatedAt.AddDays(_tokenSettings.RefreshTokenValidIn);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor que muda entre dev/prod | Mova para appsettings e injete via IOptions |
| Precisa recarregar config sem reiniciar | Use `IOptionsSnapshot` ou `IOptionsMonitor` |
| Valor fixo que nunca muda | Constante `const` esta OK |
| Classe de settings com muitas props | Divida em secoes menores no JSON |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `.AddDays(7)` hardcoded em regra de negocio | `.AddDays(_settings.RefreshTokenValidIn)` |
| `public int Prop { get; set; }` em settings | `public int Prop { get; init; }` |
| `BindConfiguration("RefreshToken")` sem caminho completo | `BindConfiguration("Settings:RefreshToken")` |
| Nome diferente na classe vs JSON | Nomes identicos: `RefreshTokenValidIn` em ambos |
| Apenas `[ProducesResponseType(200)]` | Todos os status: 200, 401, 403 documentados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
