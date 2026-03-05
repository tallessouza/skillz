# Deep Explanation: Autorização para SignalR Hub

## Por que não reutilizar o filtro de controller?

O instrutor explica que nos controllers existe um atributo customizado (`AuthenticatedUserAttribute`) que valida token, verifica usuário no banco, checa se está ativo. Mas esse atributo **não funciona em Hubs** porque o Hub não recebe uma requisição HTTP convencional — recebe uma conexão WebSocket.

A lógica de validação é 98-99% igual, mas o **mecanismo de entrega** é diferente. Por isso é necessário um `AuthorizationHandler` dedicado.

## A classe Requirement vazia — por que existe?

O instrutor reconhece que parece estranho criar uma classe que implementa `IAuthorizationRequirement` e fica completamente vazia. Mas explica que é uma **questão arquitetural do .NET**: essa classe é o elo que conecta o handler à policy. Sem ela, não há como o .NET saber qual handler executar para qual policy.

O fluxo completo:
1. Conexão chega → .NET vê que precisa executar policy "AuthenticatedUser"
2. Policy tem um `AuthenticatedUserRequirement` registrado
3. .NET procura um `AuthorizationHandler<AuthenticatedUserRequirement>` registrado
4. Encontra e executa `HandleRequirementAsync`

## O truque do GetType() para descobrir tipos

Quando `context.Resource` retorna `object`, o instrutor demonstra um truque prático: usar `resource.GetType()` em modo debug para descobrir o tipo real. No caso, revelou ser `Microsoft.AspNetCore.Http.DefaultHttpContext`.

Esse padrão é útil sempre que uma API retorna `object` e você precisa fazer cast — ao invés de adivinhar, execute em debug e inspecione o tipo real.

## Duas formas de aplicar autorização no Hub

**Forma 1 — Atributo na classe:**
```csharp
[Authorize(Policy = "AuthenticatedUser")]
public class UserConnectionsHub : Hub { }
```

**Forma 2 — No MapHub (preferida pelo instrutor):**
```csharp
app.MapHub<UserConnectionsHub>("/connection")
    .RequireAuthorization("AuthenticatedUser");
```

O instrutor prefere a segunda porque mantém a configuração centralizada no `Program.cs` ao invés de espalhada em atributos nas classes.

## OnConnectedAsync como prova de conexão

O instrutor usa `OnConnectedAsync` no Hub como teste: se o breakpoint bater nessa função, significa que a conexão foi aceita pelo handler. Se não bater, o handler bloqueou. Essa função executa apenas uma vez, quando a conexão WebSocket é estabelecida com sucesso.

## Null-conditional após cast com `as`

O cast `context.Resource as DefaultHttpContext` retorna `null` se falhar (diferente de `(DefaultHttpContext)context.Resource` que lança exceção). O instrutor usa `?.` após o cast para acessar `Request.Headers.Authorization` de forma segura — se for null, a variável token recebe null e a condicional abaixo já trata esse caso.