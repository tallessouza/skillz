# Code Examples: Autorizacao de Hub SignalR

## Exemplo 1: Handler sem context.Succeed (causa erro 500)

```csharp
// PROBLEMA: este handler nao confirma sucesso
// Resultado: erro 500 sem mensagem ao conectar no hub
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    HubAuthRequirement requirement)
{
    var token = GetTokenOnConnection(context);
    // Mesmo extraindo o token corretamente...
    // Sem context.Succeed() o SignalR bloqueia a conexao
}
```

## Exemplo 2: Correcao minima — adicionar context.Succeed

```csharp
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    HubAuthRequirement requirement)
{
    var token = GetTokenOnConnection(context);
    context.Succeed(requirement); // Uma linha resolve o 500
}
```

## Exemplo 3: Handler completo com todas as validacoes

```csharp
protected override async Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    HubAuthRequirement requirement)
{
    try
    {
        // 1. Extrair token da query string
        var token = GetTokenOnConnection(context);

        // 2. Verificar se token nao e vazio
        if (string.IsNullOrWhiteSpace(token))
        {
            context.Fail();
            return;
        }

        // 3. Validar token (pode lancar excecao se expirado/invalido)
        var claims = _tokenValidator.Validate(token);

        // 4. Extrair ID do usuario dos claims
        var userId = claims.GetUserId();

        // 5. Verificar se usuario existe no banco
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            context.Fail();
            return;
        }

        // 6. Verificar se existe refresh token associado
        var hasRefreshToken = await _tokenRepository
            .ExistsRefreshTokenAsync(userId, token);
        if (!hasRefreshToken)
        {
            context.Fail();
            return;
        }

        // 7. Tudo validado — confirmar sucesso
        context.Succeed(requirement);
    }
    catch
    {
        // Token expirado, invalido, ou qualquer excecao
        // SignalR nao repassa mensagem — apenas context.Fail()
        context.Fail();
    }
}
```

## Exemplo 4: GetTokenOnConnection refatorado (sem excecao)

```csharp
// ANTES: lancava excecao se token vazio
private string GetTokenOnConnection(AuthorizationHandlerContext context)
{
    var httpContext = context.Resource as HttpContext;
    var token = httpContext?.Request.Query["access_token"].ToString();

    if (string.IsNullOrWhiteSpace(token))
        throw new UnauthorizedException("Token not found"); // ERRADO

    return token;
}

// DEPOIS: retorna string vazia, handler decide o que fazer
private string GetTokenOnConnection(AuthorizationHandlerContext context)
{
    var httpContext = context.Resource as HttpContext;
    var token = httpContext?.Request.Query["access_token"].ToString();

    if (string.IsNullOrWhiteSpace(token))
        return string.Empty; // Handler trata com context.Fail()

    return token;
}
```

## Exemplo 5: Comparacao filtro MVC vs handler SignalR

```csharp
// FILTRO MVC — sem resultado = fluxo continua
public class AuthenticatedUserFilter : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        // Se nao fizer context.Result = new UnauthorizedObjectResult(...)
        // o fluxo CONTINUA normalmente
    }
}

// HANDLER SIGNALR — sem Succeed = conexao BLOQUEADA
public class HubAuthHandler : AuthorizationHandler<HubAuthRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        HubAuthRequirement requirement)
    {
        // Se nao fizer context.Succeed(requirement)
        // a conexao e BLOQUEADA com erro 500
    }
}
```

## Exemplo 6: Fluxo de handshake no Postman

```
1. Conectar ao hub via WebSocket:
   URL: wss://localhost:PORT/hub?access_token=JWT_TOKEN
   → Handler executa, valida token, retorna sucesso
   → Conexao parcial estabelecida

2. Enviar mensagem de handshake (uma unica vez):
   {"protocol":"json","version":1}␞
   → OnConnectedAsync() e chamado no hub
   → Handshake completo

3. Invocar funcoes do hub:
   {"type":1,"target":"GeneratedCodes","arguments":[]}␞
   → Hub executa a funcao diretamente
   → Handler NAO e chamado novamente
```