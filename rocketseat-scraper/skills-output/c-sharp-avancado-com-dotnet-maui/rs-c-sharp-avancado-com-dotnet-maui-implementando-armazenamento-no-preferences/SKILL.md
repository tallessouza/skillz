---
name: rs-csharp-maui-preferences-storage
description: "Applies .NET MAUI Preferences storage patterns when writing key-value persistence code. Use when user asks to 'store data locally', 'save user preferences', 'implement local storage in MAUI', 'persist settings', or 'cache user info on device'. Enforces record-based encapsulation, constant keys, string conversion for non-supported types, and clear-on-logout. Make sure to use this skill whenever implementing local key-value storage in .NET MAUI apps. Not for secure/sensitive data storage (use SecureStorage), database persistence, or file-based storage."
---

# Armazenamento com Preferences no .NET MAUI

> Encapsule dados em records, use constantes para chaves, e implemente save/get/clear como contrato via interface.

## Rules

1. **Use records para agrupar dados** — `record User(Guid Id, string Name)` nao variaveis soltas, porque records sao imutaveis e evitam informacao espalhada pelo codigo
2. **Defina constantes para chaves** — `private const string IdKey = "id"` nao strings literais repetidas, porque constantes previnem typos silenciosos
3. **Converta tipos nao suportados para string** — `Id.ToString()` e `Guid.Parse(id)` na volta, porque Preferences so suporta: string, int, bool, long, double, float, DateTime
4. **Sempre implemente clear para logout** — use `Preferences.Default.Clear()` nao `Remove` individual, porque logout exige limpeza total
5. **Extraia interface do storage** — `IUserStorage` com Save/Get/Clear, porque facilita mock em testes de unidade
6. **Use Preferences.Default como ponto de acesso** — nao instancie diretamente, porque Default gerencia o ciclo de vida
7. **Passe valor default no Get** — `Get(key, "")` e obrigatorio, porque Preferences nunca lanca excecao — retorna o default se chave nao existe

## How to write

### Record para encapsular dados

```csharp
public record User(Guid Id, string Name);
public record Token(string AccessToken, string RefreshToken);
```

### Storage com interface

```csharp
public interface IUserStorage
{
    void Save(Models.ValueObjects.User user);
    Models.ValueObjects.User Get();
    void Clear();
}
```

### Implementacao do Save

```csharp
private const string IdKey = "id";
private const string NameKey = "name";

public void Save(Models.ValueObjects.User user)
{
    Microsoft.Maui.Storage.Preferences.Default.Set(IdKey, user.Id.ToString());
    Microsoft.Maui.Storage.Preferences.Default.Set(NameKey, user.Name);
}
```

### Implementacao do Get

```csharp
public Models.ValueObjects.User Get()
{
    var id = Microsoft.Maui.Storage.Preferences.Default.Get(IdKey, "");
    var name = Microsoft.Maui.Storage.Preferences.Default.Get(NameKey, "");

    return new Models.ValueObjects.User(Guid.Parse(id), name);
}
```

### Implementacao do Clear

```csharp
public void Clear() => Microsoft.Maui.Storage.Preferences.Default.Clear();
```

## Example

**Before (dados soltos sem encapsulamento):**
```csharp
Preferences.Default.Set("id", userId);
Preferences.Default.Set("name", userName);
// Em outro lugar...
var id = Preferences.Default.Get("id", "");
var name = Preferences.Default.Get("name", "");
// Sem clear no logout — dados ficam residuais
```

**After (com este skill aplicado):**
```csharp
// Records agrupam dados
public record User(Guid Id, string Name);

// Interface define contrato
public interface IUserStorage { void Save(User u); User Get(); void Clear(); }

// Implementacao usa constantes, converte tipos, limpa no logout
public class UserStorage : IUserStorage
{
    private const string IdKey = "id";
    private const string NameKey = "name";

    public void Save(User user)
    {
        Preferences.Default.Set(IdKey, user.Id.ToString());
        Preferences.Default.Set(NameKey, user.Name);
    }

    public User Get()
    {
        var id = Preferences.Default.Get(IdKey, "");
        var name = Preferences.Default.Get(NameKey, "");
        return new User(Guid.Parse(id), name);
    }

    public void Clear() => Preferences.Default.Clear();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado nao sensivel (nome, ID, preferencias UI) | Use Preferences |
| Dado sensivel (tokens, senhas) | Use SecureStorage |
| Guid ou tipo nao suportado | Converta para string, parse na volta |
| Logout do usuario | Chame Clear() para limpar tudo |
| Precisa remover apenas uma chave | Use Remove(key) ao inves de Clear |
| Namespace conflita com pasta do projeto | Use caminho completo: `Microsoft.Maui.Storage.Preferences` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `Preferences.Default.Set("id", guid)` | `Preferences.Default.Set(IdKey, guid.ToString())` |
| Strings literais repetidas como chave | Constantes `private const string` |
| Get sem valor default | `Get(key, "")` — segundo parametro obrigatorio |
| Variaveis soltas para id, nome, token | Record `User(Guid Id, string Name)` |
| Storage sem interface | `IUserStorage` para testabilidade |
| Esquecer clear no logout | Sempre implementar e chamar `Clear()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
