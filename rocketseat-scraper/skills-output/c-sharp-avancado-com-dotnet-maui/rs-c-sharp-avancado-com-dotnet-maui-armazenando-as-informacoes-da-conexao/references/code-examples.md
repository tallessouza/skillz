# Code Examples: Armazenando Informacoes de Conexao

## Estrutura de pastas

```
Hubs/
├── UserConnectionsHub.cs
└── Services/
    └── CodeConnectionService.cs
DTOs/
└── UserConnectionDto.cs
```

## CodeConnectionService completo

```csharp
// Hubs/Services/CodeConnectionService.cs
public class CodeConnectionService
{
    private readonly Dictionary<string, UserConnectionDto> _connections;

    public CodeConnectionService()
    {
        _connections = new Dictionary<string, UserConnectionDto>();
    }

    // Inicia o fluxo: armazena codigo + dados de quem gerou
    public void Start(CodeUserConnectionDto codeUser, string connectionId)
    {
        var userConnectionDto = new UserConnectionDto
        {
            UserId = codeUser.UserId,
            Code = codeUser.Code,
            ConnectionId = connectionId
        };

        _connections.Add(codeUser.Code, userConnectionDto);
    }
}
```

**Nota do instrutor**: Este dicionario basico NAO e thread-safe. Na proxima aula sera substituido por um tipo adequado para acesso concorrente.

## Forma simplificada de inicializacao (.NET recente)

```csharp
// Forma completa
private readonly Dictionary<string, UserConnectionDto> _connections = 
    new Dictionary<string, UserConnectionDto>();

// Forma simplificada (C# 12+ / .NET 8+)
private readonly Dictionary<string, UserConnectionDto> _connections = [];
```

## UserConnectionDto (classe mutavel)

```csharp
public class UserConnectionDto
{
    // Preenchido no inicio do fluxo (quando gera codigo)
    public string UserId { get; set; }
    public string Code { get; set; }
    public string ConnectionId { get; set; }

    // Preenchido depois (quando outra pessoa digita o codigo)
    public string? RequestingUserId { get; set; }
    public string? RequestingConnectionId { get; set; }
}
```

**Por que classe e nao record**: O DTO precisa ser alterado em momentos diferentes do fluxo. No inicio, so temos UserId/Code/ConnectionId. Depois, quando outra pessoa digita o codigo, preenchemos RequestingUserId e RequestingConnectionId.

## Hub com injecao do servico

```csharp
public class UserConnectionsHub : Hub
{
    private readonly CodeConnectionService _codeConnectionService;
    // ... outros servicos injetados ...

    public UserConnectionsHub(
        CodeConnectionService codeConnectionService
        /* outros parametros */)
    {
        _codeConnectionService = codeConnectionService;
    }

    public async Task GenerateCode()
    {
        // Use case gera o codigo e retorna o DTO
        var codeUserDto = /* ... use case ... */;

        // Armazena no servico em memoria
        // Context.ConnectionId = ID unico desta conexao
        _codeConnectionService.Start(codeUserDto, Context.ConnectionId);

        // ... retorna codigo para o cliente ...
    }
}
```

## Registro no Program.cs

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Singleton: mesma instancia para TODAS as conexoes
builder.Services.AddSingleton<CodeConnectionService>();

// NAO usar:
// builder.Services.AddScoped<CodeConnectionService>();    // cada conexao teria seu proprio dicionario
// builder.Services.AddTransient<CodeConnectionService>(); // nova instancia a cada solicitacao

var app = builder.Build();
```

## Comparacao dos ciclos de vida

```csharp
// Transient: nova instancia TODA VEZ que alguem pede
builder.Services.AddTransient<MyService>();
// Conexao A pede → instancia 1
// Conexao A pede de novo → instancia 2
// Conexao B pede → instancia 3

// Scoped: uma instancia POR CONEXAO/REQUISICAO
builder.Services.AddScoped<MyService>();
// Conexao A pede → instancia 1
// Conexao A pede de novo → instancia 1 (mesma)
// Conexao B pede → instancia 2 (diferente!)

// Singleton: UMA instancia para TODA a aplicacao
builder.Services.AddSingleton<MyService>();
// Conexao A pede → instancia 1
// Conexao B pede → instancia 1 (mesma!)
// Conexao C pede → instancia 1 (mesma!)
```