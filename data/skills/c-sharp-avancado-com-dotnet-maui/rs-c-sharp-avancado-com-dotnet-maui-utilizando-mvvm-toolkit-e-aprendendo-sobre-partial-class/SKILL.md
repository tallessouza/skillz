---
name: rs-csharp-mvvm-toolkit-partial-class
description: "Applies CommunityToolkit.MVVM patterns and partial class usage when writing .NET MAUI ViewModels. Use when user asks to 'create a ViewModel', 'add a command', 'simplify ICommand', 'use MVVM Toolkit', or 'implement button action in MAUI'. Enforces RelayCommand attribute over manual ICommand instantiation, and correct partial class declaration. Make sure to use this skill whenever generating .NET MAUI ViewModel code. Not for Blazor, WPF without Toolkit, or non-MAUI C# projects."
---

# MVVM Toolkit e Partial Class no .NET MAUI

> Usar `[RelayCommand]` do CommunityToolkit.MVVM para gerar commands automaticamente, declarando a ViewModel como `partial class`.

## Rules

1. **Instale o CommunityToolkit.MVVM** — `CommunityToolkit.Mvvm` via NuGet, porque ele gera ICommand automaticamente via source generator
2. **Use `[RelayCommand]` em vez de ICommand manual** — decore o metodo com `[RelayCommand]` e o toolkit cria a propriedade `{NomeDoMetodo}Command` automaticamente, porque elimina boilerplate de construtor
3. **Declare a classe como `partial`** — `public partial class`, porque o source generator precisa complementar a classe com o codigo gerado
4. **Nomeie o Command pelo metodo** — se o metodo e `LoginComGoogle()`, o command gerado sera `LoginComGoogleCommand`, porque o toolkit concatena o nome do metodo + "Command"
5. **Mantenha o mesmo namespace** — partial classes so funcionam se todas as partes compartilham o mesmo namespace, porque o compilador C# unifica pelo namespace + nome da classe
6. **Nomes de arquivo podem diferir** — arquivos podem ter nomes diferentes no mesmo diretorio, mas o nome da classe deve ser identico em todas as partes

## How to write

### ViewModel com RelayCommand

```csharp
using CommunityToolkit.Mvvm.Input;

public partial class OnboardViewModel
{
    [RelayCommand]
    private void LoginComEmailESenha()
    {
        // logica de login
    }

    [RelayCommand]
    private void LoginComGoogle()
    {
        // logica de login com Google
    }
}
```

### Binding no XAML

```xml
<Button Text="Login com e-mail e senha"
        Command="{Binding LoginComEmailESenhaCommand}" />

<Button Text="Continuar com Google"
        Command="{Binding LoginComGoogleCommand}" />
```

## Example

**Before (ICommand manual):**

```csharp
public class OnboardViewModel
{
    public ICommand LoginComEmailESenhaCommand { get; }
    public ICommand LoginComGoogleCommand { get; }

    public OnboardViewModel()
    {
        LoginComEmailESenhaCommand = new Command(LoginComEmailESenha);
        LoginComGoogleCommand = new Command(LoginComGoogle);
    }

    private void LoginComEmailESenha() { /* ... */ }
    private void LoginComGoogle() { /* ... */ }
}
```

**After (com MVVM Toolkit):**

```csharp
public partial class OnboardViewModel
{
    [RelayCommand]
    private void LoginComEmailESenha() { /* ... */ }

    [RelayCommand]
    private void LoginComGoogle() { /* ... */ }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo command em ViewModel | `[RelayCommand]` + `partial class` |
| Command assincrono | `[RelayCommand]` em metodo `async Task` — gera command com suporte a async |
| Multiplos devs na mesma ViewModel | Partial class em arquivos separados (mesmo namespace) |
| Partial em diretorios diferentes | Ajuste o namespace manualmente para ser identico |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `public ICommand XCommand { get; }` + `new Command(X)` | `[RelayCommand] private void X()` |
| `public class MinhaViewModel` (sem partial, com Toolkit) | `public partial class MinhaViewModel` |
| Namespaces diferentes para partes da mesma partial class | Mesmo namespace em todas as partes |
| Nome de classe diferente entre partes de partial | Mesmo nome de classe, arquivos podem diferir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
