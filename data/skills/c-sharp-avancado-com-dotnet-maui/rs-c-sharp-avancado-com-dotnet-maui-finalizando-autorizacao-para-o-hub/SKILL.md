---
name: rs-csharp-maui-auth-handler-hub
description: "Enforces correct SignalR Hub authorization handler patterns in C#/.NET applications. Use when user asks to 'create a hub handler', 'authorize SignalR connection', 'implement WebSocket auth', 'fix hub connection error', or 'add authentication to SignalR'. Applies rules: always call context.Succeed(), use context.Fail() instead of throwing exceptions, never rely on failure messages in SignalR context. Make sure to use this skill whenever implementing or debugging SignalR hub authorization handlers. Not for REST API authentication filters, middleware auth, or JWT token generation."
---

# Autorizacao de Hub SignalR — Handler Pattern

> Em authorization handlers de SignalR, sempre confirme sucesso explicitamente com `context.Succeed()` e nunca lance excecoes — use `context.Fail()` com return.

## Rules

1. **Sempre chame `context.Succeed(requirement)`** — sem essa chamada o handler bloqueia a conexao com erro 500, mesmo sem excecoes lancadas, porque diferente de filtros MVC o handler exige confirmacao explicita de sucesso
2. **Nunca lance excecoes no handler** — use `context.Fail()` + `return` em vez de `throw`, porque o SignalR nao repassa mensagens de erro ao cliente independente do que voce colocar
3. **Valide e retorne cedo** — cada ponto de falha (token vazio, usuario nao encontrado, refresh token ausente) deve chamar `context.Fail()` e retornar imediatamente
4. **Envolva validacao de token em try-catch** — `Validate()` pode lancar excecoes (token expirado, invalido), capture todas e chame `context.Fail()` no catch
5. **Nao confie em `AuthorizationFailureReason`** — o SignalR descarta qualquer mensagem de razao de falha antes de responder ao cliente, entao nao gaste tempo com mensagens descritivas no fail
6. **Handler executa apenas uma vez** — ele roda somente no momento da conexao, nao em cada mensagem enviada ao hub (analogia: mostrar ingresso na entrada da balada, depois ninguem pede de novo)

## How to write

### Handler completo com context.Succeed e context.Fail

```csharp
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    YourRequirement requirement)
{
    try
    {
        var token = GetTokenOnConnection(context);

        if (string.IsNullOrWhiteSpace(token))
        {
            context.Fail();
            return;
        }

        var claims = _tokenValidator.Validate(token);
        var userId = claims.GetUserId();

        var user = await _repository.GetByIdAsync(userId);
        if (user is null)
        {
            context.Fail();
            return;
        }

        var hasRefreshToken = await _tokenRepository
            .ExistsRefreshTokenAsync(userId, token);
        if (!hasRefreshToken)
        {
            context.Fail();
            return;
        }

        context.Succeed(requirement);
    }
    catch
    {
        context.Fail();
    }
}
```

### Extrair token da conexao (retornar string vazia, nao excecao)

```csharp
private string GetTokenOnConnection(AuthorizationHandlerContext context)
{
    var httpContext = context.Resource as HttpContext;
    var token = httpContext?.Request.Query["access_token"].ToString();

    if (string.IsNullOrWhiteSpace(token))
        return string.Empty;

    return token;
}
```

## Example

**Before (erro 500 silencioso — handler nao confirma sucesso):**
```csharp
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context, MyRequirement requirement)
{
    var token = GetTokenOnConnection(context);
    var claims = _validator.Validate(token);
    var user = await _repo.GetByIdAsync(claims.GetUserId());

    if (user is null)
        throw new UnauthorizedAccessException("User not found");
    // Sem context.Succeed() — conexao bloqueada com 500!
}
```

**After (com this skill applied):**
```csharp
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context, MyRequirement requirement)
{
    try
    {
        var token = GetTokenOnConnection(context);
        if (string.IsNullOrWhiteSpace(token)) { context.Fail(); return; }

        var claims = _validator.Validate(token);
        var user = await _repo.GetByIdAsync(claims.GetUserId());
        if (user is null) { context.Fail(); return; }

        context.Succeed(requirement);
    }
    catch
    {
        context.Fail();
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Conexao retorna 500 sem excecao visivel | Verifique se `context.Succeed()` esta sendo chamado |
| Precisa informar cliente do motivo da falha | Nao e possivel via handler SignalR — trate no lado do cliente |
| Token pode expirar antes da conexao | Renove o token no cliente imediatamente antes de conectar |
| Apos conexao estabelecida | Handler nao executa mais — mensagens fluem sem revalidacao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `throw new UnauthorizedException(...)` no handler | `context.Fail(); return;` |
| Handler sem `context.Succeed(requirement)` | Sempre chame no caminho de sucesso |
| `context.Fail(new AuthorizationFailureReason(..., "msg"))` esperando que cliente receba | `context.Fail()` simples — SignalR descarta a mensagem |
| Retornar string vazia via `throw` no helper | `return string.Empty` |
| Esperar que handler valide cada mensagem | Handler executa uma unica vez na conexao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
