---
name: rs-csharp-maui-app-startup-routing
description: "Applies conditional startup page routing in .NET MAUI apps using ShellSection and stored session data. Use when user asks to 'set initial page', 'redirect on startup', 'check if logged in', 'conditional main page', or 'app shell navigation'. Implements ShellSection-based page switching with Preferences.ContainsKey checks in the constructor. Make sure to use this skill whenever implementing startup routing or login-based page selection in MAUI. Not for token refresh, logout flows, or deep linking."
---

# Roteamento Condicional de Startup no .NET MAUI

> Ao iniciar o app, verifique dados armazenados no construtor e defina a ShellSection correta como CurrentItem — sem async, sem await.

## Rules

1. **Encapsule cada pagina em ShellSection** — cada rota principal precisa de sua propria ShellSection com `x:Name`, porque voce precisa referenciar no CodeBehind para trocar programaticamente
2. **De nome ao Shell pai** — `x:Name="ShellAppName"` no elemento Shell raiz, porque voce precisa acessar `.CurrentItem` para definir qual secao exibir
3. **Nunca use async no construtor** — construtor nao suporta await; use `Preferences.ContainsKey()` (sincrono) ao inves de SecureStorage (async), porque async no construtor causa deadlock
4. **Injete dependencias via construtor** — receba `IUserStorage` no construtor do `App` e repasse ao `AppShell`, porque o DI container do MAUI ja registra essas dependencias
5. **Verifique existencia de chave, nao valor** — use `ContainsKey("userId")` ao inves de `Get()`, porque voce so precisa saber se existe sessao, nao ler o valor
6. **Construtor do App executa antes de CreateWindow** — passe dependencias do `App` para `AppShell` via parametro no `new AppShell(userStorage)`

## How to write

### XAML com ShellSections nomeadas

```xml
<Shell x:Name="ShellPlanShareApp" ...>
    <ShellSection x:Name="onBoardSection">
        <ShellContent ContentTemplate="{DataTemplate views:OnBoardingPage}" />
    </ShellSection>

    <ShellSection x:Name="dashboardSection">
        <ShellContent ContentTemplate="{DataTemplate views:DashboardPage}" />
    </ShellSection>
</Shell>
```

### CodeBehind do AppShell — roteamento condicional

```csharp
public partial class AppShell : Shell
{
    public AppShell(IUserStorage userStorage)
    {
        InitializeComponent();

        if (userStorage.IsLoggedIn())
        {
            ShellPlanShareApp.CurrentItem = dashboardSection;
        }
        else
        {
            ShellPlanShareApp.CurrentItem = onBoardSection;
        }
    }
}
```

### App.xaml.cs — injecao e repasse

```csharp
public partial class App : Application
{
    private readonly IUserStorage _userStorage;

    public App(IUserStorage userStorage)
    {
        InitializeComponent();
        _userStorage = userStorage;
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell(_userStorage));
    }
}
```

### IsLoggedIn no UserStorage

```csharp
public bool IsLoggedIn()
{
    return Preferences.Default.ContainsKey("userId");
}
```

## Example

**Before (ShellContents soltos, sem roteamento):**
```xml
<Shell>
    <ShellContent ContentTemplate="{DataTemplate views:OnBoardingPage}" />
    <ShellContent ContentTemplate="{DataTemplate views:DashboardPage}" />
</Shell>
```

**After (ShellSections nomeadas com roteamento condicional):**
```xml
<Shell x:Name="ShellPlanShareApp">
    <ShellSection x:Name="onBoardSection">
        <ShellContent ContentTemplate="{DataTemplate views:OnBoardingPage}" />
    </ShellSection>
    <ShellSection x:Name="dashboardSection">
        <ShellContent ContentTemplate="{DataTemplate views:DashboardPage}" />
    </ShellSection>
</Shell>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa verificar sessao no startup | Use `Preferences.ContainsKey()` no construtor |
| Precisa de dado async no startup | Mova logica para `OnAppearing` ou `OnNavigatedTo`, nunca no construtor |
| Mais de 2 rotas condicionais | Considere um Router service dedicado |
| Token expirado | Trate em aula/logica separada com refresh token |
| Logout executado | `Preferences.Clear()` remove chaves, proximo startup redireciona ao onboard |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `await SecureStorage.GetAsync()` no construtor | `Preferences.ContainsKey()` (sincrono) |
| ShellContent solto sem ShellSection | Cada pagina em sua propria ShellSection nomeada |
| Verificar login sem `x:Name` nas secoes | Sempre nomeie ShellSections e o Shell pai |
| `async void` no construtor para contornar | Use metodo sincrono ou mova para evento de lifecycle |
| Hardcodar pagina inicial no XAML | Defina `CurrentItem` programaticamente no CodeBehind |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
