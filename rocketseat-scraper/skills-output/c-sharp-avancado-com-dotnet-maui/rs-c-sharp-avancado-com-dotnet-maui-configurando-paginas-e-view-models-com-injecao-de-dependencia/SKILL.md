---
name: rs-csharp-maui-di-paginas-viewmodels
description: "Enforces dependency injection patterns for .NET MAUI pages and ViewModels using CommunityToolkit. Use when user asks to 'register a page', 'configure DI in MAUI', 'connect ViewModel to page', 'setup MauiProgram', or 'choose service lifetime'. Applies rules: never new ViewModel in code-behind, use AddTransientWithShellRoute for page+VM+route registration, prefer Transient over Singleton for ViewModels with form state. Make sure to use this skill whenever configuring .NET MAUI dependency injection or registering pages. Not for API dependency injection, Blazor DI, or general C# DI outside MAUI context."
---

# Injecao de Dependencia em Pages e ViewModels (.NET MAUI)

> Nunca faca `new ViewModel()` no code-behind — registre via DI e receba no construtor da page.

## Rules

1. **Nunca instancie ViewModel diretamente** — `BindingContext = new DoLoginViewModel()` acopla a page a dependencias transitivas (use cases, services, tokens), porque a ViewModel vai precisar de regras de negocio que por sua vez precisam de outros parametros no construtor
2. **Use `AddTransientWithShellRoute` do CommunityToolkit.Maui** — registra ViewModel como DI + associa page a rota Shell em uma unica chamada, porque reduz boilerplate de registrar rota + registrar VM separadamente
3. **Prefira Transient para ViewModels com estado de formulario** — Singleton mantem dados entre navegacoes (usuario volta e ve dados antigos), porque o Singleton faz `new` apenas uma vez e reutiliza a mesma instancia
4. **Scoped em MAUI equivale a Singleton** — o escopo de uma app MAUI e o ciclo de vida inteiro do aplicativo (abriu ate fechou), diferente de uma API onde cada request e um escopo
5. **Receba a ViewModel no construtor da Page** — o service container injeta automaticamente, porque a page foi registrada junto com a ViewModel no `MauiProgram`

## How to write

### Registro no MauiProgram.cs

```csharp
// CommunityToolkit.Maui: registra VM + Page + Rota em uma chamada
builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);
```

### Code-behind da Page (recebe VM por DI)

```csharp
public partial class DoLoginPage : ContentPage
{
    public DoLoginPage(DoLoginViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## Example

**Before (acoplamento direto):**
```csharp
// MauiProgram.cs
Routing.RegisterRoute(RoutesPages.LoginPage, typeof(DoLoginPage));

// DoLoginPage.xaml.cs
public DoLoginPage()
{
    InitializeComponent();
    BindingContext = new DoLoginViewModel(); // new direto = problema
}
```

**After (com DI via CommunityToolkit):**
```csharp
// MauiProgram.cs
builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);

// DoLoginPage.xaml.cs
public DoLoginPage(DoLoginViewModel viewModel)
{
    InitializeComponent();
    BindingContext = viewModel; // injetado pelo container
}
```

## Heuristics

| Situacao | Ciclo de vida |
|----------|---------------|
| ViewModel com formulario (dados editaveis) | Transient — limpa estado a cada navegacao |
| ViewModel read-only (dashboard, listagem estatica) | Singleton pode ser aceitavel |
| Service/UseCase stateless | Singleton ou Transient |
| Qualquer coisa com Scoped em MAUI | Equivale a Singleton — evite confusao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `BindingContext = new MyViewModel()` | `BindingContext = viewModel` (injetado no construtor) |
| `AddSingletonWithShellRoute` para VMs com form | `AddTransientWithShellRoute` |
| `AddScoped` em MAUI achando que e por navegacao | `AddTransient` (Scoped = Singleton em MAUI) |
| Registrar rota + VM separadamente | `AddTransientWithShellRoute<Page, VM>(route)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
