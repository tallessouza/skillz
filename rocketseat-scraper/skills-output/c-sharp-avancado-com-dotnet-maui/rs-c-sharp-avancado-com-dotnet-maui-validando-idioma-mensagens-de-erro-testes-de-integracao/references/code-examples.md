# Code Examples: Validacao de Idioma em Testes de Integracao

## Classe ClassData completa

```csharp
using System.Collections;

public class CultureInlineDataTest : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { "pt-BR" };
        yield return new object[] { "en" };
        // Para adicionar frances:
        // yield return new object[] { "fr-FR" };
    }

    // Implementacao obrigatoria da interface — delega para o metodo tipado
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

## ClassData com multiplos parametros

```csharp
public class CultureAndNumberData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { "pt-BR", 7 };
        yield return new object[] { "en", 42 };
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

// Uso no teste:
[Theory]
[ClassData(typeof(CultureAndNumberData))]
public async Task Test_With_Multiple_Params(string culture, int number)
{
    // culture e number preenchidos na ordem do array
}
```

## Teste de integracao completo

```csharp
[Theory]
[ClassData(typeof(CultureInlineDataTest))]
public async Task Error_When_Name_Is_Empty_Returns_Localized_Message(string culture)
{
    // Arrange
    var request = new RegisterUserRequest
    {
        Name = "",
        Email = "test@test.com",
        Password = "Password123!"
    };

    _httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
    _httpClient.DefaultRequestHeaders.AcceptLanguage
        .Add(new StringWithQualityHeaderValue(culture));

    // Act
    var response = await _httpClient.PostAsJsonAsync("/api/user", request);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    var expectedMessage = ResourceMessageException.ResourceManager
        .GetString("NameEmpty", new CultureInfo(culture));

    var errorResponse = await response.Content
        .ReadFromJsonAsync<ErrorResponse>();

    errorResponse.Should().NotBeNull();
    errorResponse!.Errors.Should().SatisfyRespectively(
        error => error.Should().Be(expectedMessage)
    );
}
```

## Configuracao do Accept-Language no HttpClient

```csharp
// ERRADO — acumula headers entre execucoes
_httpClient.DefaultRequestHeaders.AcceptLanguage
    .Add(new StringWithQualityHeaderValue("pt-BR"));

// CORRETO — limpa antes de adicionar
_httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
_httpClient.DefaultRequestHeaders.AcceptLanguage
    .Add(new StringWithQualityHeaderValue(culture));
```

## ResourceManager vs propriedade direta

```csharp
// ERRADO no contexto de teste parametrizado — retorna idioma da maquina
var message = ResourceMessageException.NameEmpty;

// CORRETO — retorna idioma especificado
var message = ResourceMessageException.ResourceManager
    .GetString("NameEmpty", new CultureInfo(culture));
```

## Estrutura dos arquivos de Resource

```
PlanShare.Exceptions/
├── ResourceMessageException.resx        # Neutro (ingles)
│   └── NameEmpty = "The name cannot be empty"
├── ResourceMessageException.pt-BR.resx  # Portugues Brasil
│   └── NameEmpty = "O nome não pode ser vazio"
```

## CultureMiddleware (referencia)

```csharp
public class CultureMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var acceptLanguage = context.Request.Headers["Accept-Language"].ToString();
        
        if (!string.IsNullOrEmpty(acceptLanguage))
        {
            var cultureInfo = new CultureInfo(acceptLanguage);
            CultureInfo.CurrentCulture = cultureInfo;
            CultureInfo.CurrentUICulture = cultureInfo;
        }

        await next(context);
    }
}
```