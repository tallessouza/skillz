# Code Examples: Desserializando Erros de API com Refit

## Exemplo 1: Abordagem manual completa

```csharp
// No use case do aplicativo MAUI
if (response.IsSuccessStatusCode)
{
    // processar resposta de sucesso normalmente
    var result = response.Content;
}
else
{
    // response.Error.Content e uma string com o JSON de erro
    // Exemplo do content: {"errors":["E-mail e/ou senha invalido"]}

    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    var errors = JsonSerializer.Deserialize<ResponseErrorJson>(
        response.Error.Content!, options);

    // errors.Errors[0] == "E-mail e/ou senha invalido"
}
```

## Exemplo 2: Abordagem com GetContentAs (recomendada)

```csharp
if (response.IsSuccessStatusCode)
{
    var result = response.Content;
}
else
{
    var errors = await response.Error.GetContentAs<ResponseErrorJson>();
    // Refit usa seu deserializer interno, ja configurado com case insensitivity
}
```

## Exemplo 3: Classe ResponseErrorJson com JsonConstructor

```csharp
using System.Text.Json.Serialization;

public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    // Este construtor sera usado pelo JsonSerializer na deserializacao
    // Match funciona porque parametro "errors" == propriedade JSON "errors"
    [JsonConstructor]
    public ResponseErrorJson(List<string> errors)
    {
        Errors = errors;
    }

    // Construtor de conveniencia para criar erro com mensagem unica
    public ResponseErrorJson(string errorMessage)
    {
        Errors = new List<string> { errorMessage };
    }
}
```

## Exemplo 4: Filtro de excecao na API (contexto)

```csharp
// Na API — garante formato consistente de erro
// Qualquer excecao lancada pela API e convertida em ResponseErrorJson
// Isso cria o contrato que o app pode confiar
public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var response = new ResponseErrorJson(context.Exception.Message);
        context.Result = new ObjectResult(response)
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };
    }
}
```

## Exemplo 5: Erro comum — sem options (bug silencioso)

```csharp
// BUG: Errors fica null porque JSON tem "errors" (minusculo)
// e a propriedade C# e "Errors" (maiusculo)
var errors = JsonSerializer.Deserialize<ResponseErrorJson>(
    response.Error.Content!);

// errors nao e null, mas errors.Errors.Count == 0
// Porque? Case sensitivity do JsonSerializer padrao do .NET
```

## Exemplo 6: Erro comum — construtor sem parametro

```csharp
// DESIGN RUIM: permite criar erro sem mensagem
public class ResponseErrorJson
{
    public List<string> Errors { get; set; }

    public ResponseErrorJson() { } // Resolve deserializacao mas quebra o design

    public ResponseErrorJson(List<string> errors)
    {
        Errors = errors;
    }
}

// Agora qualquer dev pode fazer:
var erro = new ResponseErrorJson(); // erro.Errors e null — nao faz sentido
```