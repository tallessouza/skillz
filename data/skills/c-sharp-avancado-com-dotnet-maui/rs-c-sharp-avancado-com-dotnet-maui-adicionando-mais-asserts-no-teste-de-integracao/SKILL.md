---
name: rs-csharp-avancado-asserts-integracao
description: "Enforces proper assertion patterns in .NET integration tests using JsonDocument instead of deserialization. Use when user asks to 'write integration test', 'add assertions', 'test API response', 'validate response body', or 'check API properties'. Applies rules: parse with JsonDocument.ParseAsync, never deserialize to DTOs in integration tests, use streams with using, validate properties via GetProperty. Make sure to use this skill whenever writing or reviewing .NET integration tests that check HTTP response bodies. Not for unit tests, mock-based tests, or deserialization logic."
---

# Assertions em Testes de Integracao com JsonDocument

> Em testes de integracao, valide a resposta real da API via JsonDocument — nunca assuma que a deserializacao esta correta.

## Rules

1. **Use JsonDocument.ParseAsync, nunca deserialize para DTOs** — porque deserializar assume que a conversao esta correta e mascara respostas parciais da API (propriedades faltando recebem valor default sem excecao)
2. **Use ReadAsStreamAsync, nunca ReadAsStringAsync** — porque ReadAsStringAsync converte todo o body em string na memoria, causando problemas de performance
3. **Sempre use `using` com streams** — porque libera a memoria quando o metodo termina, evitando ocupacao desnecessaria
4. **Nomes de propriedades no GetProperty usam camelCase** — porque no JSON as propriedades comecam com letra minuscula (`accessToken`, `name`, `id`)
5. **Valide tipo E valor de cada propriedade** — `GetGuid()` valida que e um GUID valido; `GetString()` retorna string; se o tipo nao bater, lanca excecao e o teste falha
6. **Navegue objetos aninhados com GetProperty encadeado** — `rootElement.GetProperty("tokens").GetProperty("accessToken")` para acessar propriedades dentro de objetos

## How to write

### Leitura do body da resposta

```csharp
// Stream + using = memoria liberada ao fim do metodo
using var responseBody = await response.Content.ReadAsStreamAsync();
var document = await JsonDocument.ParseAsync(responseBody);
```

### Assertions com GetProperty

```csharp
// Propriedade simples (GUID)
document.RootElement
    .GetProperty("id")
    .GetGuid()
    .Should().NotBe(Guid.Empty);

// Propriedade string comparada com valor enviado
document.RootElement
    .GetProperty("name")
    .GetString()
    .Should().Be(request.Name);

// Propriedade aninhada (objeto dentro de objeto)
document.RootElement
    .GetProperty("tokens")
    .GetProperty("accessToken")
    .GetString()
    .Should().NotBeNullOrEmpty();
```

## Example

**Before (deserializando — errado):**
```csharp
var response = await client.PostAsync("/api/users", content);
response.StatusCode.Should().Be(HttpStatusCode.Created);

// ERRADO: assume que deserializacao esta correta
var result = await response.Content.ReadFromJsonAsync<ResponseUserJson>();
result.Id.Should().NotBe(Guid.Empty);
result.Name.Should().Be(request.Name);
// Se a API devolver resposta parcial, Name recebe null sem excecao
```

**After (JsonDocument — correto):**
```csharp
var response = await client.PostAsync("/api/users", content);
response.StatusCode.Should().Be(HttpStatusCode.Created);

using var responseBody = await response.Content.ReadAsStreamAsync();
var document = await JsonDocument.ParseAsync(responseBody);

document.RootElement.GetProperty("id").GetGuid().Should().NotBe(Guid.Empty);
document.RootElement.GetProperty("name").GetString().Should().Be(request.Name);
document.RootElement.GetProperty("tokens").GetProperty("accessToken")
    .GetString().Should().NotBeNullOrEmpty();
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste de integracao validando response body | JsonDocument.ParseAsync com stream |
| Propriedade e um GUID/UUID | GetGuid() + Should().NotBe(Guid.Empty) |
| Propriedade e string que voce enviou na request | GetString() + Should().Be(request.Campo) |
| Propriedade e objeto aninhado | GetProperty encadeado para navegar |
| Propriedade ainda nao implementada na API | Nao adicione assert; adicione quando implementar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ReadAsStringAsync()` | `ReadAsStreamAsync()` com `using` |
| `ReadFromJsonAsync<T>()` em teste de integracao | `JsonDocument.ParseAsync(stream)` |
| `var body = await response.Content.ReadAsStringAsync()` | `using var body = await response.Content.ReadAsStreamAsync()` |
| Stream sem `using` | `using var stream = ...` |
| `GetProperty("Id")` (PascalCase) | `GetProperty("id")` (camelCase) |
| `GetProperty("AccessToken")` | `GetProperty("accessToken")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
