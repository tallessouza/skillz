---
name: rs-csharp-maui-dashboard-navigation
description: "Applies .NET MAUI shell navigation patterns when creating new pages and setting root/main page navigation. Use when user asks to 'create a new page', 'navigate to dashboard', 'set main page', 'shell navigation', or 'register page in app shell'. Ensures correct AppShell registration order, ViewModel binding, and root navigation syntax with double-slash prefix. Make sure to use this skill whenever creating new .NET MAUI pages that serve as root pages. Not for API integration, WebSocket, or UI component styling."
---

# Dashboard Page e Navegacao Root no .NET MAUI

> Ao criar paginas que serao main page do app, registre no AppShell como ShellContent e use navegacao com prefixo `//` para definir como pagina raiz.

## Rules

1. **Paginas root vao no AppShell, nao no MauiProgram** — registre apenas a ViewModel no MauiProgram; a pagina e declarada como ShellContent no `AppShell.xaml`, porque o Shell gerencia o ciclo de vida dessas paginas
2. **Ordem dos ShellContent importa** — o primeiro ShellContent no AppShell sera a pagina inicial do app; coloque onboarding antes do dashboard se quiser iniciar no onboarding
3. **Use `//` para navegacao root** — `await Shell.Current.GoToAsync($"//{DashboardPage}")` fecha todas as paginas empilhadas e define a nova como main page, porque sem `//` a pagina apenas empilha sobre a atual
4. **Esconda NavBar quando nao necessario** — use `Shell.NavBarIsVisible="False"` no ContentPage para paginas que nao precisam de barra de navegacao
5. **ViewModel sempre herda ViewModelBase** — mantenha heranca consistente para status page e funcionalidades base

## Steps

### Step 1: Criar arquivo XAML da pagina

Crie o ContentPage com namespace da ViewModel e sem NavBar:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Dashboard"
             x:Class="PlanShare.App.Views.Pages.Dashboard.DashboardPage"
             x:DataType="viewModel:DashboardViewModel"
             Shell.NavBarIsVisible="False">
</ContentPage>
```

### Step 2: Criar ViewModel

```csharp
public partial class DashboardViewModel : ViewModelBase
{
}
```

### Step 3: Configurar CodeBehind com injecao de dependencia

```csharp
public partial class DashboardPage : ContentPage
{
    public DashboardPage(DashboardViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### Step 4: Registrar ViewModel no MauiProgram

Apenas a ViewModel — a pagina e registrada via AppShell:

```csharp
builder.Services.AddTransient<DashboardViewModel>();
```

### Step 5: Declarar ShellContent no AppShell.xaml

```xml
<Shell xmlns:dashboard="clr-namespace:PlanShare.App.Views.Pages.Dashboard">

    <!-- Primeiro = pagina inicial do app -->
    <ShellContent ContentTemplate="{DataTemplate onboarding:OnboardingPage}"
                  Route="{x:Static routes:Pages.OnboardingPage}" />

    <ShellContent ContentTemplate="{DataTemplate dashboard:DashboardPage}"
                  Route="{x:Static routes:Pages.DashboardPage}" />
</Shell>
```

### Step 6: Navegar como pagina raiz apos login

```csharp
if (isSuccess)
{
    // // (double slash) = fechar tudo e definir como main page
    await Shell.Current.GoToAsync($"//{Routes.Pages.DashboardPage}");
}
else
{
    await Shell.Current.GoToAsync(Routes.Pages.ErrorPage);
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina sera main page do app | Registrar no AppShell como ShellContent |
| Pagina sera tela secundaria | Registrar normalmente no MauiProgram |
| Apos login/registro com sucesso | Usar `//` para navegacao root |
| Apos login/registro com erro | Usar GoToAsync simples (empilha) |
| Pagina nao precisa de NavBar | Adicionar `Shell.NavBarIsVisible="False"` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `GoToAsync(DashboardPage)` apos login | `GoToAsync($"//{DashboardPage}")` — senao empilha sobre login |
| Registrar pagina root no MauiProgram | Declarar como ShellContent no AppShell.xaml |
| Dashboard como primeiro ShellContent antes de ter logica de sessao | Manter onboarding primeiro, navegar com `//` apos autenticacao |
| Esquecer o xmlns da pagina no AppShell | Adicionar `xmlns:dashboard="clr-namespace:..."` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
