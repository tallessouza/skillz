# Code Examples: Hub de Conexao com Codigos

## Estrutura de pastas do Use Case

```
Application/
└── UseCases/
    └── User/
        └── JoinWithCode/
            ├── IJoinWithCodeUseCase.cs
            └── JoinWithCodeUseCase.cs

Domain/
└── DTOs/
    └── ConnectingUserDto.cs
```

## Interface do Use Case

```csharp
public interface IJoinWithCodeUseCase
{
    Task<ConnectingUserDto> Execute(Guid userId);
}
```

## DTO de usuario conectando

```csharp
public record ConnectingUserDto(Guid Id, string Name, string ProfileUrl);
```

## Implementacao do Use Case

```csharp
public class JoinWithCodeUseCase : IJoinWithCodeUseCase
{
    // Futuramente: injetar repositorio para validar duplicatas
    public async Task<ConnectingUserDto> Execute(Guid userId)
    {
        // Buscar pessoa logada
        var user = await GetLoggedUser(userId);

        return new ConnectingUserDto(
            Id: user.Id,
            Name: user.Name,
            ProfileUrl: string.Empty // implementar depois
        );
    }
}
```

## DTO de conexao (CLASSE, nao record — por referencia)

```csharp
public class UserConnectionsDto
{
    public string Code { get; set; }
    public Guid UserId { get; set; }           // ID de quem gerou o codigo
    public string ConnectionId { get; set; }    // ConnectionId de quem gerou

    public Guid ConnectingUserId { get; set; }              // ID de quem informou o codigo
    public string ConnectingUserConnectionId { get; set; }  // ConnectionId de quem informou
}
```

## CodeConnectionService com GetConnectionByCode

```csharp
public class CodeConnectionService
{
    private readonly Dictionary<string, UserConnectionsDto> _connections = new();

    public void Start(string code, UserConnectionsDto dto)
    {
        _connections[code] = dto;
    }

    public UserConnectionsDto? GetConnectionByCode(string code)
    {
        _connections.TryGetValue(code, out var userConnection);
        return userConnection;
    }
}
```

## Hub completo com JoinWithCodes

```csharp
public class UserConnectionsHub : Hub
{
    private readonly CodeConnectionService _codeConnectionService;
    private readonly IJoinWithCodeUseCase _joinWithCodeUseCase;

    public UserConnectionsHub(
        CodeConnectionService codeConnectionService,
        IJoinWithCodeUseCase joinWithCodeUseCase)
    {
        _codeConnectionService = codeConnectionService;
        _joinWithCodeUseCase = joinWithCodeUseCase;
    }

    public async Task GenerateCode()
    {
        // ... gera codigo e armazena no service
    }

    public async Task JoinWithCodes(string code)
    {
        // Passo 1: buscar informacoes do codigo
        var userConnections = _codeConnectionService.GetConnectionByCode(code);

        // Passo 2: chamar use case
        var response = await _joinWithCodeUseCase.Execute(userConnections.UserId);

        // Passo 3: preencher dados de quem esta conectando
        userConnections.ConnectingUserId = response.Id;
        userConnections.ConnectingUserConnectionId = Context.ConnectionId;

        // Passo 4 (proxima aula): notificar quem gerou o codigo
    }
}
```

## Registro no DI (nao esquecer!)

```csharp
public static class DependencyInjectionExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IJoinWithCodeUseCase, JoinWithCodeUseCase>();
        // ... outros use cases
        return services;
    }
}
```

## Demonstracao do `out` — exemplo didatico

```csharp
// Funcao SEM out — parametro normal
public bool Teste(string nome)
{
    if (string.IsNullOrEmpty(nome)) return false;
    return true;
}

// Funcao COM out — obrigatorio preencher
public bool Teste(out string nome)
{
    nome = "Ellison"; // sem isso, nao compila
    return true;
}

// Chamando funcao com out
var resultado = Teste(out var nome);
// resultado = true, nome = "Ellison"
```