# Deep Explanation: Comunicacao HTTP com Refit no .NET MAUI

## Por que nao usar HttpClient diretamente?

O instrutor (Ellison) demonstra lado a lado a diferenca entre usar HttpClient nativo e Refit. Com HttpClient voce precisa:

1. Instanciar o HttpClient e configurar BaseAddress
2. Chamar `PostAsJsonAsync` passando endpoint e request
3. Receber um `HttpResponseMessage` generico
4. Extrair o conteudo com `response.Content.ReadFromJsonAsync<T>()`

Sao multiplas linhas de boilerplate para cada chamada. Com Refit, voce define uma interface, decora os metodos com atributos HTTP (`[Post]`, `[Get]`, `[Put]`, `[Delete]`), e o Refit gera toda a implementacao automaticamente.

## Compartilhamento de DTOs via projeto de comunicacao

O projeto PlanShare tem um projeto separado chamado `PlanShare.Communication` que contem os requests e responses (ex: `RequestRegisterUserJson`, `ResponseRegisterUserJson`). Tanto a API quanto o App MAUI referenciam esse projeto, eliminando duplicacao de codigo.

Para adicionar a referencia: botao direito em Dependencies > Add Project Reference > selecionar PlanShare.Communication.

## Duas formas de usar Refit

### Forma 1: RestService.For (nao recomendada para MAUI)
```csharp
var api = RestService.For<IGitHubApi>("https://api.github.com");
var user = await api.GetUser("octocat");
```
Simples, mas nao integra com o container de DI.

### Forma 2: AddRefitClient via DI (recomendada)
```csharp
builder.Services
    .AddRefitClient<IUserApiClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl));
```
Integra com o sistema de injecao de dependencia do .NET MAUI. Quando voce precisar do client, basta solicitar via construtor.

## Aviso importante sobre HttpClient em APIs

O instrutor faz um aviso explicito: em .NET MAUI voce **pode** fazer `new HttpClient()` porque o ciclo de vida e diferente. Porem, em uma API ASP.NET, **nunca** faca `new HttpClient()` — use `IHttpClientFactory` (link na documentacao oficial da Microsoft). Isso porque em APIs server-side, criar instancias de HttpClient repetidamente causa socket exhaustion.

## Estrutura de pastas

O instrutor organiza o projeto do app assim:
```
PlanShare.App/
└── Data/
    └── Network/
        └── API/
            └── IUserApiClient.cs
```

Essa organizacao separa claramente a camada de dados e rede do restante do app.

## Convencao de nomes

O metodo na interface se chama apenas `Register()` e nao `RegisterUser()`, porque a interface ja se chama `IUserApiClient` — o contexto de "user" ja esta implicito. Isso segue o principio de nao repetir informacao que ja esta no contexto.