---
name: rs-csharp-avancado-verify-extension
description: "Enforces creation of reusable verification extension methods in C# unit tests to eliminate assertion duplication. Use when user asks to 'write unit tests', 'refactor test assertions', 'create test helpers', 'avoid test duplication', or 'improve test code quality' in C#/.NET projects. Applies rules: extract repeated verify/assert logic into extension methods, parameterize all variable parts, use method overloading for optional parameters. Make sure to use this skill whenever writing multiple test classes that share similar assertion patterns. Not for production code refactoring, integration tests, or non-C# test frameworks."
---

# Verify Extension Methods para Testes de Unidade C#

> Ao identificar logica de verificacao repetida em testes de unidade, extraia para metodos de extensao parametrizaveis.

## Rules

1. **Sempre pergunte: "esse codigo e util em outras partes?"** — se a resposta for sim, extraia para metodo de extensao, porque duplicacao em testes escala rapidamente com novas ViewModels
2. **Crie extensoes para o tipo concreto, nao para classes estaticas** — classes estaticas como `It` do Moq nao aceitam extension methods em C#
3. **Parametrize todos os valores variaveis** — rotas, mensagens de erro, quantidade de chamadas (`Times`) nunca devem ser hardcoded no extension method
4. **Use method overloading para cenarios opcionais** — se nem todo teste precisa validar dicionario de parametros, crie uma sobrecarga sem esse parametro
5. **Aceite listas ao inves de valores unicos** — receba `IList<string>` ao inves de `string` para mensagens, porque cenarios futuros podem validar multiplas mensagens
6. **Use `Func<Times>` ao inves de `Times`** — para manter compatibilidade com a API do Moq que espera uma funcao que retorna Times

## How to write

### Estrutura do Extension Method

```csharp
public static class NavigationVerifyExtensions
{
    // Sobrecarga COM validacao de dicionario de erros
    public static void VerifyGoTo(
        this Mock<INavigationService> navigationService,
        string route,
        IList<string> errorMessages,
        Func<Times> times)
    {
        navigationService.Verify(
            service => service.GoToAsync(
                It.Is<ShellNavigationState>(s => IsMatchingShellPage(s, route)),
                It.Is<Dictionary<string, object>>(d => IsMatchingErrorDictionary(d, errorMessages))),
            times);
    }

    // Sobrecarga SEM dicionario (navegacao simples)
    public static void VerifyGoTo(
        this Mock<INavigationService> navigationService,
        string route,
        Func<Times> times)
    {
        navigationService.Verify(
            service => service.GoToAsync(
                It.Is<ShellNavigationState>(s => IsMatchingShellPage(s, route))),
            times);
    }

    private static bool IsMatchingShellPage(ShellNavigationState state, string route)
        => state.Location.ToString() == route;

    private static bool IsMatchingErrorDictionary(
        Dictionary<string, object> dictionary,
        IList<string> errorMessages)
        => dictionary["Errors"] is IList<string> errors
           && errors.Count == errorMessages.Count
           && errors.All(errorMessages.Contains);
}
```

### Uso nos testes

```csharp
// Com validacao de erros
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    new List<string> { "erro1" },
    Times.Once);

// Navegacao simples (sem dicionario)
_navigationService.VerifyGoTo(
    RoutPages.LoginPage,
    Times.Once);
```

## Example

**Before (duplicacao entre classes de teste):**
```csharp
// Em RegisterAccountViewModelTests
_navigationService.Verify(
    s => s.GoToAsync(
        It.Is<ShellNavigationState>(state => state.Location.ToString() == RoutPages.ErrorPage),
        It.Is<Dictionary<string, object>>(d =>
            d["Errors"] is IList<string> errors
            && errors.Count == 1
            && errors.Contains("erro1"))),
    Times.Once);

// Mesma logica copiada em LoginViewModelTests, ChangePasswordViewModelTests...
```

**After (com extension method):**
```csharp
// Em qualquer classe de teste
_navigationService.VerifyGoTo(
    RoutPages.ErrorPage,
    new List<string> { "erro1" },
    Times.Once);
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Verify/Assert repetido em 2+ classes de teste | Extrair para extension method |
| Validacao usa `It.Is<T>` com logica complexa | Mover logica para metodo privado nomeado |
| Parametro nem sempre necessario | Criar sobrecarga do metodo |
| Lista com 1 elemento | Ainda usar `IList<string>`, nao `string` |
| `Times.Once` hardcoded | Parametrizar como `Func<Times>` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Ctrl+C, Ctrl+V de asserts entre classes | Extension method reutilizavel |
| `errors.Count == 1` hardcoded | `errors.Count == errorMessages.Count` |
| `(e) => errorMessages.Contains(e)` | `errorMessages.Contains` (passe a funcao direto) |
| `Times times` (struct) como parametro | `Func<Times> times` (funcao que retorna struct) |
| Nomes como `GetValidationForMountPage` | Nomes como `IsMatchingShellPage` |
| Todas as validacoes inline no Verify | Funcoes privadas com nomes descritivos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
