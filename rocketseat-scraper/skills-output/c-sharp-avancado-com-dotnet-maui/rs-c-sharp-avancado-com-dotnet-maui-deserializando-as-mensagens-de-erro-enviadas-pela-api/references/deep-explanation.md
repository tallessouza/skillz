# Deep Explanation: Desserializando Erros de API com Refit

## Por que Refit nao deserializa erros automaticamente

Refit foi projetado para deserializar respostas de sucesso no tipo generico do `ApiResponse<T>`. Quando a API retorna erro (status 4xx/5xx), o conteudo e armazenado como string bruta em `response.Error.Content`. Isso significa que o JSON de erro esta la, mas como texto — nao como objeto tipado.

## O problema do construtor sem parametro

Quando `JsonSerializer.Deserialize<T>()` tenta criar uma instancia da classe, ele procura um construtor sem parametro. Se a classe tem apenas construtores com parametros, o deserializer lanca uma excecao:

> "Deserialization failed because there is no parameterless constructor"

A solucao ingenua seria criar `public ResponseErrorJson() { }`, mas isso quebra o design da classe — permite que desenvolvedores criem instancias sem passar dados obrigatorios. O instrutor enfatiza: **"Eu nao quero dar permissao de estar podendo instanciar essa classe sem passar um parametro."**

A solucao correta e usar o atributo `[JsonConstructor]` de `System.Text.Json.Serialization` no construtor que o deserializer deve usar. O deserializer faz match pelo nome dos parametros com as propriedades do JSON.

## O problema do case sensitivity

JSON da API vem em camelCase (`errors`), propriedades C# sao PascalCase (`Errors`). O `JsonSerializer` do .NET e case-sensitive por padrao. Sem `PropertyNameCaseInsensitive = true`, ele deserializa o objeto mas deixa as propriedades como null — um bug silencioso que so aparece em runtime.

O instrutor demonstrou isso ao vivo: o objeto foi criado corretamente, mas `Errors` ficou com count 0 ate configurar o options.

## Duas abordagens comparadas

| Aspecto | Manual (JsonSerializer) | Refit (GetContentAs) |
|---------|------------------------|---------------------|
| Codigo | Mais verboso | Uma linha |
| Controle | Total (options customizaveis) | Delegado ao Refit |
| Case sensitivity | Precisa configurar manualmente | Ja configurado internamente |
| Async | Sincrono | Async (precisa de await) |
| Recomendacao do instrutor | Valido para controle fino | Preferido por simplicidade |

## Importancia do filtro de excecao na API

O padrao funciona porque a API tem um filtro de excecao que garante que **toda excecao** e convertida em um `ResponseErrorJson` com lista de erros. Isso cria um contrato: o app sempre sabe o formato da resposta de erro. Sem esse filtro, cada endpoint poderia devolver formatos diferentes de erro.