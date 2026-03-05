---
name: rs-csharp-maui-testes-vm-onboarding-2
description: "Enforces correct Moq verification patterns for Shell navigation in .NET MAUI unit tests. Use when user asks to 'test ViewModel', 'verify navigation', 'mock Shell navigation', 'fix failing Moq verify', or 'unit test .NET MAUI'. Applies It.Is syntax for Shell Navigation State comparisons, prevents reference equality traps with auto-converted objects. Make sure to use this skill whenever writing or debugging .NET MAUI ViewModel tests that involve navigation. Not for integration tests, UI tests, or non-navigation ViewModel logic."
---

# Verificacao de Navegacao em Testes de ViewModel (.NET MAUI)

> Ao verificar chamadas de navegacao com Moq em .NET MAUI, use `It.Is<ShellNavigationState>` para comparar por valor da propriedade, nunca por referencia de objeto.

## Rules

1. **Nunca passe string direta no Verify para GoToAsync** — `It.Is<ShellNavigationState>(...)` nao `"//LoginPage"`, porque o .NET MAUI converte strings em `ShellNavigationState` automaticamente, criando instancias diferentes que falham na comparacao por referencia
2. **Compare pela propriedade Location.OriginalString** — porque e o valor string interno que identifica a rota, evitando armadilhas de igualdade de referencia entre objetos
3. **Especifique Times.Once() explicitamente** — porque garante que a navegacao foi chamada exatamente uma vez, detectando chamadas duplicadas acidentais
4. **Passe null no ExecuteAsync quando comando nao recebe parametro** — `command.ExecuteAsync(null)`, porque o ICommand.ExecuteAsync exige o parametro mesmo quando nao utilizado
5. **Force erros propositais para validar o teste** — troque a rota esperada ou duplique a chamada para confirmar que o teste realmente detecta falhas

## How to write

### Verificacao correta de navegacao com Moq

```csharp
// Use It.Is para comparar o valor da rota, nao a referencia do objeto
mockNavigationService.Verify(
    nav => nav.GoToAsync(
        It.Is<ShellNavigationState>(state =>
            state.Location.OriginalString == RoutesPages.LoginPage)),
    Times.Once);
```

### Teste completo de comando de navegacao

```csharp
[Fact]
public async Task GoToLoginPage_ShouldNavigateToLoginRoute()
{
    var viewModel = new OnboardingViewModel(mockNavigationService.Object);

    await viewModel.GoToLoginPageCommand.ExecuteAsync(null);

    mockNavigationService.Verify(
        nav => nav.GoToAsync(
            It.Is<ShellNavigationState>(state =>
                state.Location.OriginalString == RoutesPages.LoginPage)),
        Times.Once);
}
```

### Teste para segundo comando (mesmo padrao)

```csharp
[Fact]
public async Task HazardUserAccount_ShouldNavigateToHazardRoute()
{
    var viewModel = new OnboardingViewModel(mockNavigationService.Object);

    await viewModel.HazardUserAccountsCommand.ExecuteAsync(null);

    mockNavigationService.Verify(
        nav => nav.GoToAsync(
            It.Is<ShellNavigationState>(state =>
                state.Location.OriginalString == RoutesPages.HazardUserAccountPage)),
        Times.Once);
}
```

## Example

**Before (teste falha — comparacao por referencia):**
```csharp
// FALHA: string e convertida em ShellNavigationState internamente
// Verify cria outra instancia — referencias diferentes, teste falha
mockNavigationService.Verify(
    nav => nav.GoToAsync(RoutesPages.LoginPage),
    Times.Once);
```

**After (teste passa — comparacao por valor):**
```csharp
// PASSA: compara o valor da string dentro do ShellNavigationState
mockNavigationService.Verify(
    nav => nav.GoToAsync(
        It.Is<ShellNavigationState>(state =>
            state.Location.OriginalString == RoutesPages.LoginPage)),
    Times.Once);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo aceita `ShellNavigationState` mas voce passa string | Use `It.Is<ShellNavigationState>` no Verify |
| Comando nao recebe parametro | Passe `null` em `ExecuteAsync(null)` |
| Comando recebe parametro | Passe o valor real em `ExecuteAsync(valor)` |
| Teste passou mas voce nao tem certeza | Force erros: troque rota, duplique chamada |
| Multiplos comandos de navegacao na ViewModel | Um teste por comando, mesmo padrao |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `Verify(nav => nav.GoToAsync("//route"), ...)` | `Verify(nav => nav.GoToAsync(It.Is<ShellNavigationState>(s => s.Location.OriginalString == "//route")), ...)` |
| `Verify(..., Times.AtLeastOnce)` sem razao | `Verify(..., Times.Once)` para precisao |
| Teste sem validacao de falha proposital | Force erro para confirmar que teste detecta falhas |
| `command.ExecuteAsync()` sem parametro | `command.ExecuteAsync(null)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
