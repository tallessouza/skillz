---
name: rs-csharp-concurrent-dictionary
description: "Enforces ConcurrentDictionary usage over Dictionary in thread-safe contexts when writing C#/.NET code. Use when user asks to 'create a singleton service', 'share state between connections', 'implement SignalR hub', 'use dictionary in concurrent scenario', or 'fix race condition'. Applies rules: always ConcurrentDictionary in Singleton services, TryAdd over Add, thread-safe collection patterns. Make sure to use this skill whenever generating shared-state code in .NET services. Not for single-threaded console apps, request-scoped services, or non-.NET projects."
---

# ConcurrentDictionary em Servicos .NET

> Em servicos Singleton que compartilham estado entre conexoes, use sempre colecoes thread-safe para evitar race conditions.

## Rules

1. **Nunca use Dictionary em Singleton** — use `ConcurrentDictionary`, porque multiplas conexoes acessam o mesmo objeto simultaneamente e Dictionary nao e thread-safe
2. **Use TryAdd, nao Add** — `ConcurrentDictionary` nao tem `Add()`, use `TryAdd()` que retorna bool indicando sucesso, porque a operacao pode falhar se a chave ja existir por acesso concorrente
3. **Use TryRemove, nao Remove** — mesmo principio: operacoes concorrentes exigem metodos Try* que lidam com falhas graciosamente
4. **Entenda o problema de concorrencia** — sem thread-safety, dois acessos simultaneos ao mesmo valor podem sobrescrever um ao outro, causando perda de dados silenciosa
5. **Servicos Scoped/Transient nao precisam** — `ConcurrentDictionary` e necessario em Singleton porque o objeto e compartilhado; servicos com lifetime menor tem instancia propria por request

## How to write

### Singleton service com dicionario thread-safe

```csharp
public class CodeConnectionService
{
    private readonly ConcurrentDictionary<string, CodeConnectionDto> _connections = new();

    public bool AddConnection(string code, CodeConnectionDto connection)
    {
        return _connections.TryAdd(code, connection);
    }

    public bool RemoveConnection(string code, out CodeConnectionDto? connection)
    {
        return _connections.TryRemove(code, out connection);
    }
}
```

### Registro no DI container

```csharp
builder.Services.AddSingleton<CodeConnectionService>();
```

## Example

**Before (race condition em Singleton):**
```csharp
public class CodeConnectionService
{
    private readonly Dictionary<string, CodeConnectionDto> _connections = new();

    public void AddConnection(string code, CodeConnectionDto connection)
    {
        _connections.Add(code, connection);  // PROBLEMA: nao e thread-safe
    }
}
```

**After (thread-safe):**
```csharp
public class CodeConnectionService
{
    private readonly ConcurrentDictionary<string, CodeConnectionDto> _connections = new();

    public bool AddConnection(string code, CodeConnectionDto connection)
    {
        return _connections.TryAdd(code, connection);  // Thread-safe, retorna bool
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico Singleton com estado compartilhado | Sempre `ConcurrentDictionary` |
| Servico Scoped (por request) | `Dictionary` normal e suficiente |
| SignalR Hub armazenando conexoes | `ConcurrentDictionary` obrigatorio |
| Dicionario local dentro de um metodo | `Dictionary` normal e suficiente |
| Qualquer colecao em Singleton | Avalie equivalente thread-safe (`ConcurrentBag`, `ConcurrentQueue`, etc.) |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `Dictionary<K,V>` em Singleton | `ConcurrentDictionary<K,V>` |
| `_dict.Add(key, value)` em contexto concorrente | `_dict.TryAdd(key, value)` |
| `_dict.Remove(key)` em contexto concorrente | `_dict.TryRemove(key, out var val)` |
| `if (!_dict.ContainsKey(k)) _dict.Add(k, v)` | `_dict.TryAdd(k, v)` (atomico) |
| `_dict[key] = value` sem verificacao | `_dict.AddOrUpdate(key, value, (k, old) => value)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
