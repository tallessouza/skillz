# Code Examples: ConcurrentDictionary em Servicos .NET

## Exemplo 1: CodeConnectionService completo (da aula)

### Servico com ConcurrentDictionary

```csharp
using System.Collections.Concurrent;

public class CodeConnectionService
{
    private readonly ConcurrentDictionary<string, CodeConnectionDto> _connections = new();

    public bool AddConnection(string code, CodeConnectionDto connectionDto)
    {
        return _connections.TryAdd(code, connectionDto);
    }

    // Metodo para proxima aula: buscar por codigo
    public CodeConnectionDto? GetConnection(string code)
    {
        _connections.TryGetValue(code, out var connection);
        return connection;
    }

    public bool RemoveConnection(string code)
    {
        return _connections.TryRemove(code, out _);
    }
}
```

### DTO utilizado

```csharp
public class CodeConnectionDto
{
    public string UserId { get; set; } = string.Empty;
    public string UserConnectionId { get; set; } = string.Empty;
}
```

### Registro como Singleton

```csharp
builder.Services.AddSingleton<CodeConnectionService>();
```

## Exemplo 2: Uso no Hub SignalR

```csharp
public class MyHub : Hub
{
    private readonly CodeConnectionService _codeConnectionService;
    private readonly IGenerateCodeUseCase _generateCodeUseCase;

    public MyHub(CodeConnectionService codeConnectionService, IGenerateCodeUseCase generateCodeUseCase)
    {
        _codeConnectionService = codeConnectionService;
        _generateCodeUseCase = generateCodeUseCase;
    }

    public async Task GenerateCode()
    {
        var code = _generateCodeUseCase.Execute(); // ex: "824260"

        var dto = new CodeConnectionDto
        {
            UserId = /* ID do usuario autenticado */,
            UserConnectionId = Context.ConnectionId
        };

        _codeConnectionService.AddConnection(code, dto);

        await Clients.Caller.SendAsync("CodeGenerated", code);
    }
}
```

## Exemplo 3: Analogia do contador — problema ilustrado

### Codigo INSEGURO (ilustrativo)

```csharp
// Singleton com estado mutavel SEM protecao
public class CounterService
{
    private int _counter = 7;

    public int GetAndIncrement()
    {
        var current = _counter;  // Thread A le 7, Thread B le 7
        _counter = current + 1;  // Thread A escreve 8, Thread B escreve 8
        return current;           // Ambas retornam 7, valor final: 8 (deveria ser 9)
    }
}
```

### Codigo SEGURO (equivalente)

```csharp
public class CounterService
{
    private int _counter = 7;

    public int GetAndIncrement()
    {
        return Interlocked.Increment(ref _counter) - 1;
        // Thread-safe: Thread A recebe 7 (vira 8), Thread B recebe 8 (vira 9)
    }
}
```

## Exemplo 4: Operacoes comuns do ConcurrentDictionary

```csharp
var dict = new ConcurrentDictionary<string, UserInfo>();

// Adicionar (retorna false se chave ja existe)
bool added = dict.TryAdd("abc123", new UserInfo());

// Buscar
if (dict.TryGetValue("abc123", out var info))
{
    Console.WriteLine(info.UserId);
}

// Remover
if (dict.TryRemove("abc123", out var removed))
{
    Console.WriteLine($"Removido: {removed.UserId}");
}

// Adicionar ou atualizar (atomico)
dict.AddOrUpdate(
    "abc123",
    new UserInfo(),                          // adiciona se nao existe
    (key, existing) => new UserInfo()        // atualiza se ja existe
);

// Obter ou adicionar (atomico)
var value = dict.GetOrAdd("abc123", new UserInfo());
```