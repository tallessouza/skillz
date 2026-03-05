---
name: rs-csharp-maui-event-to-command
description: "Applies .NET MAUI EventToCommandBehavior pattern using CommunityToolkit to convert page lifecycle events into ViewModel commands. Use when user asks to 'handle page appearing', 'call API on page load', 'execute command on navigation', 'bind event to command in MAUI', or 'use onAppearing with MVVM'. Covers DelegatingHandler lifecycle fix (Singleton to Transient). Make sure to use this skill whenever writing .NET MAUI page lifecycle or event-to-command bindings. Not for general C# patterns, Blazor, or WPF event handling."
---

# Event to Command em .NET MAUI com CommunityToolkit

> Transforme eventos de ciclo de vida da pagina em chamadas de comando na ViewModel usando EventToCommandBehavior, mantendo o code-behind limpo.

## Rules

1. **Nunca salve referencia da ViewModel no code-behind para chamar metodos** — use EventToCommandBehavior do CommunityToolkit, porque manter referencia da ViewModel no code-behind quebra a separacao MVVM e infla a classe
2. **Decore metodos com [RelayCommand] para gerar comandos** — `[RelayCommand]` sobre `InitializeAllies()` gera `InitializeAlliesCommand` automaticamente, porque o CommunityToolkit.Mvvm.Input cuida da geracao
3. **O nome do evento e o nome da funcao override sem o prefixo "On"** — `OnAppearing` → evento `Appearing`, porque o "On" significa "ao/quando" e nao faz parte do nome do evento
4. **Use Transient para DelegatingHandler, nunca Singleton** — `AddSingleton` causa excecao "must not be reused", porque cada HttpClient precisa de sua propria instancia do handler
5. **Apos corrigir um bug, refaca o fluxo completo** — desinstale o app, reinstale e teste desde o login, porque estado cached pode mascarar o bug

## How to write

### EventToCommandBehavior no XAML

```xml
<ContentPage.Behaviors>
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeAlliesCommand}" />
</ContentPage.Behaviors>
```

### RelayCommand na ViewModel

```csharp
[RelayCommand]
private async Task InitializeAllies()
{
    // Chama UseCase que comunica com a API
    var profile = await _getUserProfileUseCase.Execute();
    UserProfile = profile;
}
```

### DelegatingHandler com Transient

```csharp
// CORRETO: cada interface recebe instancia propria do handler
builder.Services.AddTransient<PlanShareHandler>();

builder.Services.AddRefitClient<IUserApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

builder.Services.AddRefitClient<ILoginApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();
```

## Example

**Before (code-behind poluido):**
```csharp
public partial class UserProfilePage : ContentPage
{
    private readonly UserProfileViewModel _viewModel;

    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
        _viewModel = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.InitializeAllies();
    }
}
```

**After (MVVM limpo com EventToCommandBehavior):**
```csharp
// Code-behind — limpo, sem referencia a ViewModel
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```
```xml
<!-- XAML — evento transformado em comando -->
<ContentPage.Behaviors>
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeAlliesCommand}" />
</ContentPage.Behaviors>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa executar logica quando pagina aparece | Use `EventToCommandBehavior` com `EventName="Appearing"` |
| Descobrir nome do evento a partir do override | Remova o prefixo "On" do nome da funcao |
| HttpClient handler lanca "must not be reused" | Troque `AddSingleton` por `AddTransient` no handler |
| Bug corrigido mas app ainda falha | Desinstale o app para limpar estado salvo (tokens, prefs) |
| Versao do .NET MAUI nao dispara o evento | Verifique se e bug conhecido; na proxima versao pode ter fix ou aplique workaround manual |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `private readonly ViewModel _vm;` no code-behind para chamar metodos | `EventToCommandBehavior` no XAML |
| `async void OnAppearing()` com chamada direta ao VM | `[RelayCommand]` + binding no XAML |
| `AddSingleton<DelegatingHandler>()` | `AddTransient<DelegatingHandler>()` |
| Testar bug fix sem reinstalar o app | Desinstalar, reinstalar, refazer fluxo completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
