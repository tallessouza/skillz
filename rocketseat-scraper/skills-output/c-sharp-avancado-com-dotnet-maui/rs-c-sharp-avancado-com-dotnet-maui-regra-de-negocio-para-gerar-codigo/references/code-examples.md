# Code Examples: Geracao de Codigos Unicos para Conexao

## Estrutura de pastas do projeto

```
Application/
└── UseCases/
    └── User/
        └── Connection/
            └── GenerateCodes/
                ├── IGenerateCodeUserConnectionUseCase.cs
                └── GenerateCodeUserConnectionUseCase.cs

Domain/
└── DTOs/
    └── CodeUserConnectionDTO.cs
```

## DTO no projeto Domain

```csharp
namespace Domain.DTOs;

public record CodeUserConnectionDTO(string Code, Guid UserId);
```

## Interface do UseCase

```csharp
namespace Application.UseCases.User.Connection.GenerateCodes;

public interface IGenerateCodeUserConnectionUseCase
{
    Task<CodeUserConnectionDTO> Execute();
}
```

## Implementacao completa do UseCase

```csharp
using System.Security.Cryptography;
using Domain.DTOs;

namespace Application.UseCases.User.Connection.GenerateCodes;

public class GenerateCodeUserConnectionUseCase : IGenerateCodeUserConnectionUseCase
{
    private readonly ILoggedUser _loggedUser;

    public GenerateCodeUserConnectionUseCase(ILoggedUser loggedUser)
    {
        _loggedUser = loggedUser;
    }

    public async Task<CodeUserConnectionDTO> Execute()
    {
        var user = await _loggedUser.User();

        var code = RandomNumberGenerator
            .GetInt32(fromInclusive: 1, toExclusive: 1_000_000)
            .ToString("D6");

        return new CodeUserConnectionDTO(code, user.Id);
    }
}
```

## Registro no container de DI

```csharp
// Em DependencyInjectionExtension.cs
services.AddScoped<IGenerateCodeUserConnectionUseCase, GenerateCodeUserConnectionUseCase>();
```

## Uso no Hub (SignalR)

```csharp
public class MyHub : Hub
{
    private readonly IGenerateCodeUserConnectionUseCase _generateCode;

    public MyHub(IGenerateCodeUserConnectionUseCase generateCode)
    {
        _generateCode = generateCode;
    }

    public async Task<string> GenerateCode()
    {
        var codeUserConnectionDTO = await _generateCode.Execute();
        return codeUserConnectionDTO.Code;
    }
}
```

## Variacao: codigo de 4 digitos

```csharp
// Para cenarios mais simples (10.000 combinacoes)
var code = RandomNumberGenerator
    .GetInt32(fromInclusive: 1, toExclusive: 10_000)
    .ToString("D4");
```

## TokenProvider que funciona em Controller e Hub

```csharp
public class TokenProvider : ITokenProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TokenProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string Value()
    {
        // Funciona tanto em requests HTTP (Controller)
        // quanto em conexoes WebSocket (Hub)
        // porque o .NET preserva o HttpContext da conexao inicial
        return _httpContextAccessor.HttpContext!
            .Request.Headers.Authorization
            .ToString().Replace("Bearer ", "");
    }
}
```

## Teste manual via Postman (WebSocket)

1. Conectar ao Hub via WebSocket
2. Enviar mensagem de handshake do SignalR
3. Invocar `GenerateCode`
4. Resultado: string de 6 digitos (ex: "780478")
5. Invocar novamente: codigo diferente (ex: "082096")