---
name: rs-csharp-maui-navegacao-parametros
description: "Applies .NET MAUI page navigation with parameter passing patterns when writing Shell navigation code. Use when user asks to 'navigate between pages', 'pass parameters to page', 'implement error page', 'use IQueryAttributable', or 'create navigation dictionary' in .NET MAUI. Enforces dictionary-based parameter passing, IQueryAttributable implementation, safe casting with 'as' operator, and method overloading for navigation services. Make sure to use this skill whenever implementing page-to-page navigation with data in .NET MAUI. Not for web API routing, Blazor navigation, or non-MAUI frameworks."
---

# Navegacao com Parametros no .NET MAUI

> Ao navegar entre paginas no .NET MAUI, use dicionarios tipados (string, object) e implemente IQueryAttributable para capturar parametros com seguranca.

## Rules

1. **Implemente IQueryAttributable na ViewModel destino** — `class ErrorViewModel : ObservableObject, IQueryAttributable`, porque o metodo ApplyQueryAttributes e chamado automaticamente pelo Shell ao navegar
2. **Use dicionario string/object para parametros** — `Dictionary<string, object>`, porque permite passar multiplos parametros de qualquer tipo com chaves nomeadas
3. **Faca cast seguro com `as` em vez de cast direto** — `query["errors"] as List<string>` nao `(List<string>)query["errors"]`, porque cast direto lanca excecao se o tipo nao bater, `as` retorna null
4. **Valide parametros antes de usar** — `if (query.Count > 0)` e `if (errorList is not null)`, porque ApplyQueryAttributes e chamado mesmo sem parametros
5. **Defina overload no service E na interface** — adicionar a assinatura com parametros tanto na classe quanto na interface, porque o codigo acessa via interface e nao vera o metodo novo
6. **Use constantes para chaves de dicionario** — evite hardcoded `"errors"` espalhado, porque inconsistencia na chave causa bugs silenciosos

## How to write

### ViewModel destino com IQueryAttributable

```csharp
public partial class ErrorViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty]
    private ObservableCollection<string> errorsList = [];

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.Count > 0)
        {
            var errors = query["errors"] as List<string>;

            if (errors is not null)
            {
                ErrorsList = new ObservableCollection<string>(errors);
            }
        }
    }
}
```

### Navegacao com parametros na ViewModel origem

```csharp
if (result.IsSuccess == false)
{
    var parameters = new Dictionary<string, object>
    {
        { "errors", result.ErrorMessages }
    };

    await _navigationService.GoToAsync(state, parameters);
}
```

### Overload no navigation service

```csharp
// Interface — AMBAS assinaturas
public interface INavigationService
{
    Task GoToAsync(ShellNavigationState state);
    Task GoToAsync(ShellNavigationState state, Dictionary<string, object> parameters);
}

// Implementacao
public class NavigationService : INavigationService
{
    public async Task GoToAsync(ShellNavigationState state)
    {
        await Shell.Current.GoToAsync(state);
    }

    public async Task GoToAsync(ShellNavigationState state, Dictionary<string, object> parameters)
    {
        await Shell.Current.GoToAsync(state, parameters);
    }
}
```

## Example

**Before (navegacao sem parametros):**
```csharp
// ViewModel origem — navega sem dados
if (result.IsSuccess == false)
{
    await _navigationService.GoToAsync(state);
}

// ViewModel destino — erros hardcoded
public ErrorViewModel()
{
    ErrorsList = new ObservableCollection<string> { "Erro generico" };
}
```

**After (com parametros via dicionario):**
```csharp
// ViewModel origem — passa erros reais
if (result.IsSuccess == false)
{
    var parameters = new Dictionary<string, object>
    {
        { "errors", result.ErrorMessages }
    };
    await _navigationService.GoToAsync(state, parameters);
}

// ViewModel destino — captura parametros
public void ApplyQueryAttributes(IDictionary<string, object> query)
{
    if (query.Count > 0)
    {
        var errors = query["errors"] as List<string>;
        if (errors is not null)
        {
            ErrorsList = new ObservableCollection<string>(errors);
        }
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa passar dados entre paginas | Dicionario `Dictionary<string, object>` com chaves nomeadas |
| ViewModel destino precisa receber dados | Implemente `IQueryAttributable` |
| Cast de object para tipo especifico | Use `as` para cast seguro (retorna null em vez de excecao) |
| Mesma chave usada em multiplos lugares | Extraia para constante ou funcao auxiliar |
| Metodo novo no service nao aparece | Verifique se adicionou assinatura na interface |
| ObservableCollection precisa ser preenchida de lista | Passe a lista no construtor: `new ObservableCollection<T>(list)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `(List<string>)query["errors"]` | `query["errors"] as List<string>` |
| Usar parametros sem verificar `query.Count > 0` | Sempre validar antes de acessar |
| Adicionar overload so na classe sem a interface | Adicionar assinatura na interface tambem |
| `"errors"` hardcoded em 3+ lugares | Constante ou funcao auxiliar |
| Preencher ObservableCollection com loop manual | `new ObservableCollection<string>(list)` |
| Mudar retorno do metodo para criar overload | Manter mesmo retorno, mudar apenas parametros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
