# Code Examples: Autorização para SignalR Hub

## Estrutura de pastas criada

```
API/
├── Handlers/
│   └── AuthenticatedUserHandler.cs
├── Requirements/
│   └── AuthenticatedUserRequirement.cs
├── Hubs/
│   └── UserConnectionsHub.cs
└── Program.cs
```

## Requirement completo

```csharp
using Microsoft.AspNetCore.Authorization;

namespace API.Requirements;

public class AuthenticatedUserRequirement : IAuthorizationRequirement { }
```

## Handler com extração de token

```csharp
using Microsoft.AspNetCore.Authorization;
using API.Requirements;

namespace API.Handlers;

public class AuthenticatedUserHandler : AuthorizationHandler<AuthenticatedUserRequirement>
{
    private readonly ITokenValidator _tokenValidator;
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public AuthenticatedUserHandler(
        ITokenValidator tokenValidator,
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _tokenValidator = tokenValidator;
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AuthenticatedUserRequirement requirement)
    {
        // Cast de object para DefaultHttpContext
        var defaultHttpContext = context.Resource as DefaultHttpContext;

        // Null-conditional: só acessa se cast funcionou
        var authentication = defaultHttpContext?.Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(authentication))
        {
            context.Fail();
            return;
        }

        // Extrair token (remover "Bearer ")
        var token = authentication.Replace("Bearer ", "").Trim();

        // Validações subsequentes (mesma lógica do controller filter)
        // - Validar token com _tokenValidator
        // - Buscar usuário com _userRepository
        // - Verificar se está ativo
        // - context.Succeed(requirement) se válido
        // - context.Fail() se inválido
    }
}
```

## Program.cs — Registro completo

```csharp
// Registrar política de autorização com requirement
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedUser", policy =>
        policy.Requirements.Add(new AuthenticatedUserRequirement()));
});

// Registrar handler no container de injeção de dependência
builder.Services.AddScoped<IAuthorizationHandler, AuthenticatedUserHandler>();

// SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Mapear hub COM autorização (forma preferida)
app.MapHub<UserConnectionsHub>("/connection")
    .RequireAuthorization("AuthenticatedUser");
```

## Forma alternativa — Authorize attribute no Hub

```csharp
[Authorize(Policy = "AuthenticatedUser")]
public class UserConnectionsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // Só executa se handler aprovou a conexão
        await base.OnConnectedAsync();
    }
}
```

## Truque de debug: descobrir tipo de object

```csharp
// Quando context.Resource é object e você não sabe o tipo real:
var resource = context.Resource;
var tipo = resource.GetType(); // Em debug, revela: DefaultHttpContext

// Depois de descobrir, faça o cast:
var defaultHttpContext = context.Resource as DefaultHttpContext;
```

## Teste via Postman

Para testar a conexão WebSocket com token:
1. Fazer login via Swagger para obter access token
2. No Postman, criar conexão WebSocket para `ws://localhost:PORT/connection`
3. Na aba Headers, adicionar:
   - **Key:** `Authorization`
   - **Value:** `Bearer {seu-token-aqui}`
4. Clicar Connect
5. Se handler aceitar → conexão estabelecida, `OnConnectedAsync` executa
6. Se handler rejeitar → conexão recusada, exceção lançada