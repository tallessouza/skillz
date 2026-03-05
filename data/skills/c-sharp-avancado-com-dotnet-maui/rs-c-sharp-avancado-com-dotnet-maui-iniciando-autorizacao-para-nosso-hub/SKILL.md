---
name: rs-csharp-avancado-autorizacao-hub
description: "Applies SignalR Hub authorization setup in ASP.NET Core when user asks to 'secure a hub', 'add authentication to SignalR', 'authorize WebSocket connections', 'protect hub endpoint', or 'require auth for real-time connections'. Guides through AuthorizationHandler, IAuthorizationRequirement, policy registration, and DefaultHttpContext token extraction. Make sure to use this skill whenever implementing SignalR hub security or WebSocket authorization in .NET projects. Not for REST API controller authorization, JWT token generation, or identity configuration."
---

# Autorização para SignalR Hub

> Implementar autorização em Hubs SignalR requer AuthorizationHandler + IAuthorizationRequirement + policy registration, porque o Hub não suporta filtros de controller como AuthorizeAttribute customizado.

## Rules

1. **Crie um AuthorizationHandler dedicado** — não reutilize filtros de controller, porque Hubs recebem WebSocket, não HTTP request convencional
2. **Crie um IAuthorizationRequirement mesmo vazio** — a classe vazia faz o link arquitetural entre handler e policy no .NET
3. **Registre handler como Scoped** — use `AddScoped<IAuthorizationHandler, SeuHandler>()`, porque o handler precisa de DI para acessar repositórios
4. **Extraia token via DefaultHttpContext** — `context.Resource` é `object`, faça cast para `DefaultHttpContext` e acesse `Request.Headers.Authorization`
5. **Use null-conditional após cast** — `as DefaultHttpContext` retorna null se falhar, use `?.Request.Headers.Authorization` para evitar exceção

## Steps

### Step 1: Criar o Requirement

```csharp
// Requirements/AuthenticatedUserRequirement.cs
public class AuthenticatedUserRequirement : IAuthorizationRequirement { }
```

Classe vazia — serve apenas como ponte arquitetural entre handler e policy.

### Step 2: Criar o Handler

```csharp
// Handlers/AuthenticatedUserHandler.cs
public class AuthenticatedUserHandler : AuthorizationHandler<AuthenticatedUserRequirement>
{
    private readonly ITokenValidator _tokenValidator;
    private readonly IUserRepository _userRepository;

    public AuthenticatedUserHandler(ITokenValidator tokenValidator, IUserRepository userRepository)
    {
        _tokenValidator = tokenValidator;
        _userRepository = userRepository;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AuthenticatedUserRequirement requirement)
    {
        var defaultHttpContext = context.Resource as DefaultHttpContext;
        var token = defaultHttpContext?.Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(token))
        {
            context.Fail();
            return;
        }

        // Validações de token e usuário (mesma lógica do filter de controller)
    }
}
```

### Step 3: Registrar no Program.cs

```csharp
// 1. Registrar policy de autorização
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedUser", policy =>
        policy.Requirements.Add(new AuthenticatedUserRequirement()));
});

// 2. Registrar handler no container de DI
builder.Services.AddScoped<IAuthorizationHandler, AuthenticatedUserHandler>();

// 3. Aplicar no Hub (opção preferida)
app.MapHub<UserConnectionsHub>("/connection")
    .RequireAuthorization("AuthenticatedUser");
```

### Step 4: Enviar token pelo cliente

No header da conexão WebSocket, enviar:
- **Key:** `Authorization`
- **Value:** `Bearer {token}`

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa autorizar Hub | AuthorizationHandler + policy, não Attribute customizado |
| Precisa acessar headers no handler | Cast `context.Resource` para `DefaultHttpContext` |
| Não sabe o tipo de `context.Resource` | Use `resource.GetType()` em debug para descobrir |
| Quer aplicar auth no Hub | Prefira `.RequireAuthorization()` no MapHub sobre `[Authorize]` na classe |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Usar `[AuthenticatedUser]` filter no Hub | `AuthorizationHandler<TRequirement>` dedicado |
| Cast direto `(DefaultHttpContext)context.Resource` | `context.Resource as DefaultHttpContext` com null-conditional |
| `context.HttpContext.Request.Headers` no handler | `defaultHttpContext?.Request.Headers` após cast do Resource |
| Esquecer `AddScoped<IAuthorizationHandler>` | Sempre registrar o handler no DI container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
