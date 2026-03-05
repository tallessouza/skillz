---
name: rs-csharp-dotnet-maui-test-viewmodel-errors
description: "Enforces patterns for unit testing ViewModels with failure scenarios in .NET MAUI using Moq. Use when user asks to 'test a ViewModel', 'verify navigation on error', 'mock use case failure', 'assert dictionary parameters', or 'write unit tests for MAUI'. Applies rules: extract complex Verify assertions into helper methods, use simplified collection syntax, force intentional errors to validate asserts, verify navigation parameters with It.Is. Make sure to use this skill whenever writing or reviewing .NET MAUI ViewModel unit tests. Not for integration tests, UI tests, or non-MAUI testing scenarios."
---

# Testes de ViewModel com Cenarios de Falha (.NET MAUI)

> Ao testar ViewModels, extraia validacoes complexas em metodos auxiliares e sempre force erros intencionais para garantir que os asserts funcionam.

## Rules

1. **Extraia verificacoes complexas do Verify em metodos privados** — `GetValidationForRoute(route)` em vez de inline `It.Is<ShellNavigationState>(...)`, porque Verify com multiplos parametros e It.Is aninhados vira uma confusao de parenteses impossivel de manter
2. **Use sintaxe simplificada de colecoes** — `["error1", "error2"]` direto como argumento, nao `new List<string> { "error1" }` atribuido a variavel, porque o .NET moderno converte automaticamente quando passado como parametro
3. **Sempre force erros intencionais apos o teste passar** — troque a chave do dicionario, troque a rota, mude o valor esperado, porque em testes complexos com muitos parenteses e preciso garantir que o assert realmente valida o que voce imagina
4. **Verifique todos os parametros do mock** — se `GoToAsync` recebe rota E dicionario, valide ambos no Verify, porque verificar so o primeiro parametro nao garante que o segundo esta correto
5. **Use cast explicito para valores de dicionario string-object** — `((IList<string>)dictionary["errors"]).Count` porque o dicionario retorna `object` e sem cast nao ha acesso aos metodos do tipo real
6. **Valide navegacao de erro com assert triplo** — StatusPage == default, rota correta, dicionario com erros corretos, porque cada um testa uma responsabilidade diferente da ViewModel

## How to write

### Helper para validacao de rota

```csharp
private ShellNavigationState GetValidationForRoute(string route)
{
    return It.Is<ShellNavigationState>(s => s.Location.OriginalString.Equals(route));
}
```

### Helper para validacao de dicionario de erros

```csharp
private IDictionary<string, object> GetValidationForDictionaryErrors(string errorMessage)
{
    return It.Is<IDictionary<string, object>>(dictionary =>
        dictionary.ContainsKey("errors")
        && dictionary["errors"] is IList<string>
        && ((IList<string>)dictionary["errors"]).Count == 1
        && ((IList<string>)dictionary["errors"]).Contains(errorMessage)
    );
}
```

### Teste completo de cenario de falha

```csharp
[Fact]
public async Task CreateViewModel_UseCaseReturnsFailure_NavigatesToErrorPage()
{
    // Arrange — use case retorna falha com lista simplificada
    var viewModel = CreateViewModel(Result.Failure(["error 1"]));

    // Act
    var action = async () => await viewModel.RegisterCommand.ExecuteAsync(null);
    await action.Should().NotThrowAsync();

    // Assert — tripla validacao
    viewModel.StatusPage.Should().Be(StatusPage.Default);

    _navigationServiceMock.Verify(
        nav => nav.GoToAsync(
            GetValidationForRoute(Routes.Pages.ErrorPage),
            GetValidationForDictionaryErrors("error 1")
        ),
        Times.Once
    );
}
```

## Example

**Before (validacao inline confusa):**
```csharp
_navigationServiceMock.Verify(
    nav => nav.GoToAsync(
        It.Is<ShellNavigationState>(s => s.Location.OriginalString.Equals("//ErrorPage")),
        It.Is<IDictionary<string, object>>(d =>
            d.ContainsKey("errors")
            && d["errors"] is IList<string>
            && ((IList<string>)d["errors"]).Count == 1
            && ((IList<string>)d["errors"]).Contains("error 1")
        )
    ),
    Times.Once
);
```

**After (com helpers extraidos):**
```csharp
_navigationServiceMock.Verify(
    nav => nav.GoToAsync(
        GetValidationForRoute(Routes.Pages.ErrorPage),
        GetValidationForDictionaryErrors("error 1")
    ),
    Times.Once
);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Verify com mais de 2 `It.Is` | Extraia cada um em metodo helper privado |
| Lista passada como argumento direto | Use `["item1", "item2"]` sintaxe simplificada |
| Teste passou de primeira | Force 2-3 erros intencionais para validar os asserts |
| Dicionario `string, object` no parametro | Faca cast explicito antes de acessar propriedades |
| Nao sabe o tipo de retorno de um helper | Use `void`, deixe o IDE corrigir automaticamente |
| Mock retorna failure | Sempre valide StatusPage + navegacao + parametros |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `It.IsAny<IDictionary<string,object>>()` para pular validacao | Valide cada chave e valor do dicionario |
| Verificar so a rota sem o dicionario | Verifique ambos parametros do `GoToAsync` |
| Confiar que o teste funciona sem forcar erro | Troque valores e confirme que falha |
| `new List<string> { "err" }` em argumento | `["err"]` sintaxe simplificada do .NET moderno |
| Inline 10+ linhas dentro do Verify | Extraia helpers `GetValidationFor*` |
| Adivinhar tipo de retorno de helper | Use `void` + return e deixe a IDE corrigir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
