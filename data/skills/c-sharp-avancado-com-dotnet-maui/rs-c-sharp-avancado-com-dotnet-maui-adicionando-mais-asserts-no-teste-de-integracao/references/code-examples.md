# Code Examples: Assertions em Testes de Integracao com JsonDocument

## Exemplo completo do teste da aula

```csharp
[Fact]
public async Task Success()
{
    // Arrange
    var request = new RequestRegisterUserJson
    {
        Name = "Noel",
        Email = "noel62@gmail.com",
        Password = "senha123"
    };

    var content = new StringContent(
        JsonSerializer.Serialize(request),
        Encoding.UTF8,
        "application/json");

    // Act
    var response = await _client.PostAsync("/api/users", content);

    // Assert - Status Code
    response.StatusCode.Should().Be(HttpStatusCode.Created);

    // Assert - Body
    using var responseBody = await response.Content.ReadAsStreamAsync();
    var document = await JsonDocument.ParseAsync(responseBody);

    document.RootElement
        .GetProperty("id")
        .GetGuid()
        .Should().NotBe(Guid.Empty);

    document.RootElement
        .GetProperty("name")
        .GetString()
        .Should().Be(request.Name);

    document.RootElement
        .GetProperty("tokens")
        .GetProperty("accessToken")
        .GetString()
        .Should().NotBeNullOrEmpty();
}
```

## Metodos de extracao de valor do JsonElement

| Metodo | Retorno | Uso |
|--------|---------|-----|
| `GetGuid()` | `Guid` | Para IDs no formato GUID |
| `GetString()` | `string?` | Para propriedades texto |
| `GetInt32()` | `int` | Para inteiros |
| `GetBoolean()` | `bool` | Para booleanos |
| `GetDecimal()` | `decimal` | Para valores monetarios |
| `GetDateTime()` | `DateTime` | Para datas |

## Padrao de leitura do response body

```csharp
// 1. Leia como stream (performatico, com using)
using var responseBody = await response.Content.ReadAsStreamAsync();

// 2. Parse para JsonDocument
var document = await JsonDocument.ParseAsync(responseBody);

// 3. Acesse propriedades via RootElement
var id = document.RootElement.GetProperty("id").GetGuid();
var name = document.RootElement.GetProperty("name").GetString();
```

## Navegacao de objetos aninhados

```csharp
// JSON retornado pela API:
// {
//   "id": "550e8400-e29b-41d4-a716-446655440000",
//   "name": "Noel",
//   "tokens": {
//     "accessToken": "eyJhbGciOiJIUzI1NiIs..."
//   }
// }

// Nivel 1: propriedade simples
document.RootElement.GetProperty("id");

// Nivel 2: propriedade dentro de objeto
document.RootElement.GetProperty("tokens").GetProperty("accessToken");
```

## O que acontece quando a API falha

```csharp
// Cenario 1: API nao devolve "id"
// GetProperty("id") → KeyNotFoundException → teste FALHA ✓

// Cenario 2: API devolve id: "abc123" (nao e GUID)
// GetGuid() → FormatException → teste FALHA ✓

// Cenario 3: API devolve id: null
// GetGuid() → InvalidOperationException → teste FALHA ✓
```

## Comparacao: deserializacao vs JsonDocument

```csharp
// ERRADO: deserializacao mascara problemas
var result = await response.Content.ReadFromJsonAsync<ResponseUserJson>();
// Se API nao devolve "name", result.Name = null (default)
// Teste pode passar incorretamente

// CORRETO: JsonDocument detecta ausencia
var document = await JsonDocument.ParseAsync(stream);
document.RootElement.GetProperty("name"); // Excecao se nao existir
```