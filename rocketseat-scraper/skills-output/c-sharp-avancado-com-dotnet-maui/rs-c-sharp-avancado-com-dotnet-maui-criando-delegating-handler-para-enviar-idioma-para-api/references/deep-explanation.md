# Deep Explanation: DelegatingHandler para Enviar Idioma para API

## O Problema

Quando um app .NET MAUI se comunica com uma API ASP.NET, as mensagens de erro retornam no idioma do **servidor**, nao do **dispositivo do usuario**. Se o servidor esta em ingles, o usuario recebe "Invalid email and/or password" mesmo com o app todo em portugues.

### Por que o app esta em portugues?

O app usa **Resource files** (`.resx`) que mapeiam textos por cultura. O dispositivo Android esta em `pt-BR`, entao o app carrega os textos do resource de portugues Brasil.

### Por que a API responde em ingles?

A API tambem tem Resource files para excecoes, com suporte a `pt-BR`. Porem, ela usa o idioma da **thread do servidor**. Existe um **Culture Middleware** na API que:
1. Verifica o header `Accept-Language` da requisicao
2. Se encontra um idioma suportado, troca a cultura da thread
3. Se nao encontra nada, usa o default (ingles)

O app simplesmente **nao estava enviando** o header `Accept-Language`.

## A Analogia do Middleware vs Handler

O instrutor faz uma analogia importante:

- **Middleware (server-side):** funciona como uma "portinha" — a requisicao passa por ele ao entrar E ao sair do controller. O Culture Middleware da API e um exemplo.
- **DelegatingHandler (client-side):** mesma ideia, mas para o HTTP Client. Intercepta a requisicao **antes de sair do app** para a API.

Ambos sao pontos de interceptacao, mas em lados opostos da comunicacao.

## Por que NAO usar parametro no Refit?

A primeira abordagem mostrada (e descartada) foi adicionar `[Header("Accept-Language")] string culture` na interface Refit. Problemas:

1. **Toda interface precisa do parametro extra** — polui todas as funcoes
2. **A regra de negocio (use case) passa a ser responsavel** por informar o idioma
3. **Viola separacao de concerns** — o use case nao deveria saber sobre headers HTTP
4. **Escala mal** — cada nova funcao na API precisa receber o parametro

## Como o DelegatingHandler resolve

O handler herda de `DelegatingHandler` e faz override de `SendAsync`. O fluxo:

```
UseCase chama Refit → Refit monta HttpRequestMessage → 
  HANDLER INTERCEPTA → Adiciona Accept-Language → 
    Requisicao segue para API → Culture Middleware le o header →
      API responde no idioma correto
```

O use case nem sabe que o header existe. A responsabilidade fica na camada de infraestrutura.

## Detalhe importante: CultureInfo.CurrentCulture

O handler usa `CultureInfo.CurrentCulture.Name` que retorna o idioma do dispositivo (ex: `"pt-BR"`). Isso e dinamico — se o usuario mudar o idioma do celular, o app automaticamente passa o novo idioma para a API.

## Registro no DI

O handler precisa de dois registros:
1. `AddSingleton<PlanShareHandler>()` — registra a classe no container
2. `AddHttpMessageHandler<PlanShareHandler>()` — conecta o handler ao pipeline HTTP de cada Refit client

A repeticao do `AddHttpMessageHandler` para cada interface Refit e uma limitacao da configuracao, mas o codigo do handler em si nao duplica.