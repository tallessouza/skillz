---
name: rs-csharp-maui-error-page-setup
description: "Guides implementation of error pages in .NET MAUI apps following MVVM pattern. Use when user asks to 'create error page', 'show error to user', 'implement error handling UI', 'navigate to error screen', or 'display error messages in MAUI'. Covers ViewModel setup without ViewModelBase inheritance, Shell navigation without navbar, route registration, and resource string binding. Make sure to use this skill whenever building error/failure feedback pages in .NET MAUI. Not for API error handling, try-catch logic, or backend validation."
---

# Implementacao de Pagina de Erros no .NET MAUI

> Crie paginas de erro como destinos de navegacao autonomos, com ViewModel propria, rota registrada e sem barra de navegacao.

## Rules

1. **ViewModel de erro herda de ObservableObject, nao de ViewModelBase** — porque a pagina de erro e especifica e nao precisa compartilhar propriedades base (como loading, titulo) com outras ViewModels
2. **Remova a NavBar com Shell.NavBarIsVisible** — porque a pagina de erro nao faz parte do fluxo normal de navegacao e nao deve ter botao de voltar
3. **Registre a pagina como Transient com rota no AddPages** — porque cada navegacao para erro deve criar uma instancia nova com suas proprias mensagens
4. **Vincule a ViewModel no CodeBehind E no XAML** — CodeBehind para injecao de dependencia, XAML para autocomplete do Visual Studio
5. **Use arquivos de recurso (resx) para textos estaticos** — porque permite traducao e manter consistencia entre idiomas
6. **Navegue para a pagina de erro quando Result.IsSuccess for falso** — porque o Result Pattern ja carrega a lista de mensagens de erro

## Steps

### Step 1: Criar a pagina XAML

Dentro de `Views/Pages/Errors/`, criar `ErrorsPage.xaml`:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Errors"
             xmlns:resources="clr-namespace:PlanShare.App.Resources"
             x:Class="PlanShare.App.Views.Pages.Errors.ErrorsPage"
             x:DataType="viewModel:ErrorsViewModel"
             Shell.NavBarIsVisible="False">

    <Button Text="{x:Static resources:ResourcesText.TRY_AGAIN}"
            HeightRequest="60" />
</ContentPage>
```

### Step 2: Criar a ViewModel

```csharp
public partial class ErrorsViewModel : ObservableObject
{
    // Nao herda de ViewModelBase — erro e contexto isolado
}
```

### Step 3: Vincular no CodeBehind

```csharp
public partial class ErrorsPage : ContentPage
{
    public ErrorsPage(ErrorsViewModel errorsViewModel)
    {
        InitializeComponent();
        BindingContext = errorsViewModel;
    }
}
```

### Step 4: Registrar rota e dependencia

Em `MauiProgram.cs`, dentro de `AddPages`:

```csharp
appBuilder.Services.AddTransientWithShellRoute<ErrorsPage, ErrorsViewModel>(
    RoutPages.ErrorPage
);
```

### Step 5: Navegar em caso de erro

Na ViewModel de login (e registro):

```csharp
var result = await _loginUseCase.Execute(email, password);

if (!result.IsSuccess)
{
    await _navigationService.NavigateToAsync(RoutPages.ErrorPage);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina nao faz parte do fluxo principal | `Shell.NavBarIsVisible="False"` |
| ViewModel nao compartilha estado com outras | Herde de `ObservableObject` direto |
| Mesmo fluxo de erro em multiplas ViewModels | Copie a navegacao para erro em cada uma |
| Texto estatico visivel ao usuario | Use arquivos resx com `x:Static` |
| Botao precisa de altura customizada | Use `HeightRequest` (default e ~40, use 60 para destaque) |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Herdar ViewModelBase para pagina de erro | Herdar `ObservableObject` diretamente |
| Deixar NavBar visivel em paginas de erro | `Shell.NavBarIsVisible="False"` |
| Hardcodar strings no XAML | Usar `x:Static` com arquivos resx |
| Vincular ViewModel so no CodeBehind | Vincular em ambos: CodeBehind (DI) + XAML (`x:DataType`) |
| Pular registro de rota | Sempre `AddTransientWithShellRoute` com constante de rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
