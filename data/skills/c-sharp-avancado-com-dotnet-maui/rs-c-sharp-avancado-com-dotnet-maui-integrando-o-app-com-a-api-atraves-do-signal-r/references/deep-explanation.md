# Deep Explanation: Integrando SignalR Client em .NET MAUI

## Por que separar em interface + classe?

O instrutor cria uma interface `IUserConnectionByCodeClient` e uma classe que a implementa. A razao e que a classe precisa receber parametros via construtor (URL base e TokensStorage) que vem do servico de injecao de dependencia. Sem essa separacao, nao seria possivel configurar o DI corretamente.

## O problema classico do DI com strings

Este e o ponto mais importante da aula. O instrutor mostra que ao tentar registrar:

```csharp
appBuilder.Services.AddTransient<IUserConnectionByCodeClient, UserConnectionByCodeClient>();
```

O container de DI consegue resolver `ITokensStorage` (ja registrado), mas NAO consegue resolver `string urlBase`. Resultado: excecao em runtime.

A solucao e usar o overload de `AddTransient` que aceita uma factory lambda:

```csharp
appBuilder.Services.AddTransient<IUserConnectionByCodeClient>(config =>
    new UserConnectionByCodeClient(
        apiUrl,
        config.GetRequiredService<ITokensStorage>()
    )
);
```

O `config.GetRequiredService<T>()` permite buscar dependencias ja registradas de dentro da factory. Essa tecnica funciona em qualquer projeto C# (APIs, apps, etc).

## Fluxo completo de conexao

1. Instalar `Microsoft.AspNetCore.SignalR.Client` via NuGet
2. Criar interface com metodo `CreateClient()` retornando `HubConnection`
3. Implementar classe que usa `HubConnectionBuilder` com `WithUrl` e `Build`
4. Configurar `AccessTokenProvider` para autenticacao
5. Registrar no DI com factory pattern
6. No ViewModel, chamar `CreateClient()` e guardar o `HubConnection`
7. No `InitializeAsync`, chamar `StartAsync()` para iniciar a conexao
8. Depois, usar `InvokeAsync` para chamar metodos do hub

## A URL do hub

A URL de conexao e composta pela URL base da API + o path configurado no `MapHub` do servidor. No exemplo, o servidor mapeia:

```csharp
app.MapHub<UserConnectionsHub>("/connection");
```

Entao o client conecta em `$"{urlBase}/connection"`.

## AccessTokenProvider

O `WithUrl` aceita um segundo parametro: um delegate que configura `HttpConnectionOptions`. A propriedade `AccessTokenProvider` e do tipo `Func<Task<string?>>` — uma funcao assincrona que retorna o token. O SignalR chama essa funcao automaticamente quando precisa enviar o token na conexao.

## ViewModel: HubConnection como propriedade, nao o client

O instrutor enfatiza: no ViewModel, voce nao guarda o `IUserConnectionByCodeClient`. Voce chama `CreateClient()` no construtor e guarda o `HubConnection` resultante como `private readonly`. E o `HubConnection` que tem os metodos `StartAsync`, `InvokeAsync`, `On`, etc.