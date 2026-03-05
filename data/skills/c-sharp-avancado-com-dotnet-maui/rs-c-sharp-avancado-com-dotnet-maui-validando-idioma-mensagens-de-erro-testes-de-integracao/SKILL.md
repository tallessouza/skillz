---
name: rs-csharp-validando-idioma-mensagens-erro
description: "Enforces culture-aware integration testing patterns in C#/.NET projects. Use when user asks to 'test API error messages', 'validate localization', 'test multiple cultures', 'integration test with languages', or 'test resource files'. Applies Theory/ClassData pattern for parameterized culture tests, ResourceManager for expected messages, and Accept-Language header injection. Make sure to use this skill whenever writing integration tests that validate localized API responses. Not for unit tests without HTTP, frontend i18n, or resource file creation."
---

# Testes de Integracao com Validacao de Idioma

> Ao testar APIs que suportam multiplos idiomas, use Theory com ClassData para validar todas as culturas sem duplicar codigo.

## Rules

1. **Use Theory + ClassData, nunca Fact duplicado** — porque cada cultura nova exigiria duplicar a funcao inteira de teste
2. **Limpe o Accept-Language antes de setar** — `_httpClient.DefaultRequestHeaders.AcceptLanguage.Clear()` antes de adicionar, porque headers acumulam entre execucoes
3. **Use ResourceManager.GetString com CultureInfo explicito** — nunca acesse a propriedade do resource diretamente no teste, porque ela retorna o idioma da maquina, nao o idioma sendo testado
4. **Centralize culturas suportadas em uma classe ClassData** — implemente `IEnumerable<object[]>` com `yield return`, porque adicionar/remover idiomas afeta todos os testes de uma vez
5. **Nao assuma ordem de execucao** — Theory nao garante ordem dos InlineData/ClassData, cada caso deve ser independente

## How to write

### Classe ClassData para culturas

```csharp
public class CultureInlineDataTest : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { "pt-BR" };
        yield return new object[] { "en" };
        // Adicionar novo idioma: apenas mais um yield return
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

### Teste de integracao com cultura parametrizada

```csharp
[Theory]
[ClassData(typeof(CultureInlineDataTest))]
public async Task Error_Returns_Message_In_Requested_Culture(string culture)
{
    // Arrange
    var request = new CreateUserRequest { Name = "" };

    _httpClient.DefaultRequestHeaders.AcceptLanguage.Clear();
    _httpClient.DefaultRequestHeaders.AcceptLanguage
        .Add(new StringWithQualityHeaderValue(culture));

    // Act
    var response = await _httpClient.PostAsJsonAsync("/api/users", request);

    // Assert — mensagem esperada no idioma correto
    var expectedMessage = ResourceMessageException.ResourceManager
        .GetString("NameEmpty", new CultureInfo(culture));

    var body = await response.Content.ReadFromJsonAsync<ErrorResponse>();
    body.Errors.Should().HaveCount(1);
    body.Errors.First().Should().Be(expectedMessage);
}
```

## Example

**Before (duplicacao de testes):**
```csharp
[Fact]
public async Task Error_Portuguese() { /* mesmo codigo, culture = "pt-BR" */ }

[Fact]
public async Task Error_English() { /* mesmo codigo, culture = "en" */ }
```

**After (com ClassData):**
```csharp
[Theory]
[ClassData(typeof(CultureInlineDataTest))]
public async Task Error_Returns_Message_In_Requested_Culture(string culture)
{
    // Um unico metodo, executado N vezes com culturas diferentes
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Apenas 2 culturas, teste simples | `[InlineData("pt-BR")] [InlineData("en")]` basta |
| 3+ culturas ou multiplos testes de erro | Crie classe ClassData centralizada |
| Precisa testar cultura + outro parametro | `yield return new object[] { "pt-BR", 7 }` — array com multiplos elementos |
| Cultura nao suportada pela API | Deve cair no resource neutro (default) |
| Mensagem esperada vem errada no teste | Verifique se esta usando ResourceManager.GetString com CultureInfo, nao a propriedade direta |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `ResourceMessageException.NameEmpty` no assert | `ResourceMessageException.ResourceManager.GetString("NameEmpty", new CultureInfo(culture))` |
| Duplicar funcao de teste por idioma | `[Theory]` com `[ClassData]` ou `[InlineData]` |
| Setar Accept-Language sem limpar antes | `Clear()` + `Add(new StringWithQualityHeaderValue(...))` |
| Hardcodar string esperada no teste | Buscar do ResourceManager com cultura explicita |
| Espalhar InlineData de culturas em cada teste | Classe ClassData unica reutilizada em todos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
