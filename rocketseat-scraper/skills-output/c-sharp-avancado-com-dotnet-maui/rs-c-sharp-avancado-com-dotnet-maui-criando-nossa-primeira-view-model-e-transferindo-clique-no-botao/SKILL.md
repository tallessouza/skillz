---
name: rs-csharp-maui-primeira-viewmodel
description: "Applies the ViewModel pattern in .NET MAUI when creating pages with button commands and MVVM structure. Use when user asks to 'create a ViewModel', 'bind a page', 'add button command in MAUI', 'connect view to viewmodel', or 'implement MVVM in .NET MAUI'. Enforces correct folder organization, BindingContext setup, ICommand properties, and XAML binding syntax. Make sure to use this skill whenever scaffolding MAUI pages with interactive elements. Not for Blazor, WPF, or non-MAUI .NET UI frameworks."
---

# ViewModel e Commands no .NET MAUI

> Separe logica de negocio da interface criando ViewModels com ICommand para cada acao do usuario.

## Rules

1. **Espelhe a estrutura de Views em ViewModels** — `Views/Pages/Onboarding/` → `ViewModels/Pages/Onboarding/`, porque o padrao de organizacao torna navegacao previsivel
2. **Atribua BindingContext no construtor do code-behind** — `BindingContext = new OnboardingViewModel();`, porque sem isso nenhum binding funciona
3. **Use ICommand para acoes de botao, nunca event handlers no code-behind** — porque a logica deve viver na ViewModel, nao na View
4. **Nomeie o command com o nome da funcao + Command** — `LoginWithEmailAndPassword` → `LoginWithEmailAndPasswordCommand`, porque cria correspondencia clara
5. **Passe a funcao como referencia, nao como chamada** — `new Command(MinhaFuncao)` nao `new Command(MinhaFuncao())`, porque passar com parenteses executa imediatamente
6. **Declare x:DataType no XAML** — para habilitar autocomplete e validacao em tempo de compilacao

## How to write

### Estrutura de pastas

```
PlanShare.App/
├── Views/
│   ├── Pages/
│   │   └── Onboarding/
│   │       └── OnboardingPage.xaml
│   └── Popups/
└── ViewModels/
    ├── Pages/
    │   └── Onboarding/
    │       └── OnboardingViewModel.cs
    └── Popups/
```

### ViewModel com ICommand

```csharp
namespace PlanShare.App.ViewModels.Pages.Onboarding;

public class OnboardingViewModel
{
    public ICommand LoginWithEmailAndPasswordCommand { get; set; }

    public OnboardingViewModel()
    {
        LoginWithEmailAndPasswordCommand = new Command(LoginWithEmailAndPassword);
    }

    public void LoginWithEmailAndPassword()
    {
        // Validacao, chamada API, regra de negocio
    }
}
```

### Code-behind vinculando BindingContext

```csharp
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
        BindingContext = new OnboardingViewModel();
    }
}
```

### XAML com DataType e Command binding

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Onboarding"
             x:DataType="viewModel:OnboardingViewModel"
             x:Class="PlanShare.App.Views.Pages.Onboarding.OnboardingPage">

    <Button Text="Login com e-mail e senha"
            Command="{Binding LoginWithEmailAndPasswordCommand}" />
</ContentPage>
```

## Example

**Before (logica no code-behind):**
```csharp
// OnboardingPage.xaml.cs
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
    }

    private void ButtonLoginClicked(object sender, EventArgs e)
    {
        // Validacao, API call misturada com UI
    }
}
```
```xml
<Button Text="Login" Clicked="ButtonLoginClicked" />
```

**After (com ViewModel):**
```csharp
// OnboardingViewModel.cs
public class OnboardingViewModel
{
    public ICommand LoginWithEmailAndPasswordCommand { get; set; }

    public OnboardingViewModel()
    {
        LoginWithEmailAndPasswordCommand = new Command(LoginWithEmailAndPassword);
    }

    public void LoginWithEmailAndPassword()
    {
        // Logica isolada na ViewModel
    }
}
```
```xml
<Button Text="Login" Command="{Binding LoginWithEmailAndPasswordCommand}" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao com acao de negocio | ICommand na ViewModel, Command binding no XAML |
| Pagina nova | Crie ViewModel espelhando a pasta da View |
| Multiplos botoes na mesma tela | Um ICommand por acao (sera otimizado com CommunityToolkit depois) |
| Popup com interacao | Mesma logica: ViewModel em ViewModels/Popups/ |
| x:DataType declarado | Autocomplete funciona para nomes de commands |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `Clicked="Handler"` no XAML para logica de negocio | `Command="{Binding MeuCommand}"` |
| Logica de validacao/API no code-behind | Mova para a ViewModel |
| `new Command(MinhaFuncao())` com parenteses | `new Command(MinhaFuncao)` sem parenteses |
| Esquecer `BindingContext = new ViewModel()` | Sempre atribuir no construtor do code-behind |
| ICommand sem get/set | Sempre declare `{ get; set; }` |
| Pastas ViewModels sem espelhar Views | Espelhe: Pages/, Popups/ em ambas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
