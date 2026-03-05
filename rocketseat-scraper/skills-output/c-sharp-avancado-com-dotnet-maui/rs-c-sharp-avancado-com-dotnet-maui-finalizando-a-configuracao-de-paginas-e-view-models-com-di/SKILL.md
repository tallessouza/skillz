---
name: rs-csharp-maui-di-pages-viewmodels
description: "Enforces correct Dependency Injection setup for .NET MAUI pages and ViewModels. Use when user asks to 'register a page', 'add a ViewModel', 'configure DI in MAUI', 'setup shell routing', or 'create ViewModelBase'. Applies rules: always use ViewModelBase with ObservableObject, register special pages (AppShell-declared) with AddTransient without routing, use AddTransientWithShellRoute for regular pages. Make sure to use this skill whenever configuring DI or creating new pages/ViewModels in .NET MAUI. Not for Blazor, ASP.NET, or non-MAUI dependency injection."
---

# Configuracao de DI para Pages e ViewModels no .NET MAUI

> Toda Page tem uma ViewModel registrada via DI, e paginas declaradas no AppShell exigem registro separado sem rota duplicada.

## Rules

1. **Toda ViewModel herda de ViewModelBase, nunca de ObservableObject diretamente** — porque ViewModelBase centraliza propriedades compartilhadas entre todas as ViewModels, evitando duplicacao futura
2. **ViewModelBase e abstrata e herda de ObservableObject** — porque ninguem deve instanciar a base diretamente, ela existe apenas para heranca
3. **Toda ViewModel deve ser partial** — porque o source generator do CommunityToolkit exige partial para gerar codigo de ObservableObject
4. **Pages declaradas no AppShell NAO usam AddTransientWithShellRoute** — porque o AppShell ja registra a rota, e duplicar causa excecao em tempo de execucao
5. **Pages normais usam AddTransientWithShellRoute com Page, ViewModel e rota** — porque isso registra ambos no DI e configura a navegacao Shell
6. **Code-behind recebe ViewModel no construtor e atribui ao BindingContext** — porque isso conecta a View ao ViewModel via DI

## Steps

### Step 1: Criar ViewModelBase (uma vez por projeto)

```csharp
// ViewModels/Pages/ViewModelBase.cs
public abstract partial class ViewModelBase : ObservableObject
{
    // Propriedades compartilhadas entre todas as ViewModels
}
```

### Step 2: Criar a ViewModel da pagina

```csharp
// ViewModels/Pages/User/Register/RegisterUserAccountViewModel.cs
public partial class RegisterUserAccountViewModel : ViewModelBase
{
}
```

### Step 3: Configurar o Code-Behind

```csharp
public partial class RegisterUserAccountPage : ContentPage
{
    public RegisterUserAccountPage(RegisterUserAccountViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### Step 4: Configurar o XAML

```xml
<ContentPage xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.User.Register"
             x:DataType="viewModel:RegisterUserAccountViewModel">
```

### Step 5: Registrar no MauiProgram

```csharp
// Pagina NORMAL (nao declarada no AppShell)
builder.Services.AddTransientWithShellRoute<RegisterUserAccountPage, RegisterUserAccountViewModel>("RegisterUserAccount");

// Pagina ESPECIAL (declarada no AppShell como ContentTemplate)
builder.Services.AddTransient<OnboardingViewModel>();
// NAO usar AddTransientWithShellRoute — a rota ja existe no AppShell
```

## Error handling

- Se receber excecao de rota duplicada em tempo de execucao: a pagina esta registrada tanto no AppShell quanto no AddTransientWithShellRoute — remova o AddTransientWithShellRoute e use apenas AddTransient para a ViewModel
- Se a ViewModel vier null no construtor: verificar se ela foi registrada no MauiProgram.cs
- Se der erro de compilacao ao registrar: verificar se a ViewModel tem `partial` e herda de ViewModelBase

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina e ContentTemplate no AppShell | `AddTransient<ViewModel>()` apenas |
| Pagina navegada via Shell.GoToAsync | `AddTransientWithShellRoute<Page, VM>(rota)` |
| Nova ViewModel criada | Herdar de ViewModelBase, marcar como partial |
| Propriedade compartilhada entre VMs | Adicionar na ViewModelBase |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `class MyVM : ObservableObject` | `class MyVM : ViewModelBase` |
| Registrar pagina do AppShell com `AddTransientWithShellRoute` | `AddTransient<ViewModel>()` |
| ViewModel sem `partial` | `public partial class MyVM` |
| BindingContext atribuido no XAML com DI | Atribuir no construtor do Code-Behind |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
