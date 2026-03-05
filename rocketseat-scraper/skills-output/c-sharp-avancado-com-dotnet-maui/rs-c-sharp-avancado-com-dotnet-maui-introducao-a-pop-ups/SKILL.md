---
name: rs-csharp-maui-introducao-pop-ups
description: "Guides popup creation in .NET MAUI using CommunityToolkit when user asks to 'create a popup', 'show options dialog', 'build interactive dialog', or 'add popup to MAUI app'. Covers full setup: XAML/CodeBehind conversion from ContentPage to Popup, ViewModel base class, DI registration with AddTransientPopup. Make sure to use this skill whenever implementing popups or interactive dialogs in .NET MAUI. Not for alerts, snackbars, toast notifications, or standard page navigation."
---

# Popups no .NET MAUI com CommunityToolkit

> Popups sao janelas interativas que permitem exibir componentes customizados e capturar input do usuario, diferente de alertas que sao limitados em customizacao e interatividade.

## Rules

1. **Use CommunityToolkit.Maui para popups** — o .NET MAUI nao oferece popups nativamente, o pacote CommunityToolkit.Maui e obrigatorio
2. **Siga o mesmo fluxo de criacao de paginas** — criar XAML+CodeBehind, criar ViewModel, associar, registrar no DI, porque a estrutura e analoga a paginas com alteracoes sutis
3. **Troque ContentPage por Popup** — no CodeBehind herdar de `CommunityToolkit.Maui.Views.Popup`, no XAML usar `toolkit:Popup` como elemento raiz
4. **Crie uma ViewModel base separada para popups** — popups nao precisam de NavigationService nem GoToPageWithErrors, entao nao reutilize a ViewModelBase de paginas
5. **Registre com AddTransientPopup no DI** — nao usar AddTransientWithShellRoute, popups nao tem rota Shell, a exibicao e feita via ViewModel
6. **Organize em pastas espelhadas** — `Views/Popups/{contexto}/` e `ViewModels/Popups/{contexto}/` para manter a estrutura organizada

## How to write

### Estrutura de pastas

```
Views/
  Popups/
    Files/
      OptionsForProfilePhotoPopup.xaml
      OptionsForProfilePhotoPopup.xaml.cs
ViewModels/
  Popups/
    ViewModelBaseForPopups.cs
    Files/
      OptionsForProfilePhotoPopupViewModel.cs
```

### ViewModel base para popups

```csharp
public abstract partial class ViewModelBaseForPopups : ObservableObject
{
    // Base separada — popups nao precisam de NavigationService
}
```

### ViewModel do popup

```csharp
public partial class OptionsForProfilePhotoPopupViewModel : ViewModelBaseForPopups
{
    // partial porque tera comandos via source generators
}
```

### CodeBehind — trocar ContentPage por Popup

```csharp
using CommunityToolkit.Maui.Views;

public partial class OptionsForProfilePhotoPopup : Popup
{
    public OptionsForProfilePhotoPopup(OptionsForProfilePhotoPopupViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### XAML — usar toolkit:Popup

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:vm="clr-namespace:PlanShare.App.ViewModels.Popups.Files"
    x:Class="PlanShare.App.Views.Popups.Files.OptionsForProfilePhotoPopup"
    x:DataType="vm:OptionsForProfilePhotoPopupViewModel">

    <!-- Componentes customizados aqui -->

</toolkit:Popup>
```

### Registro no MauiProgram.cs

```csharp
private static void AddPopups(IServiceCollection services)
{
    services.AddTransientPopup<OptionsForProfilePhotoPopup, OptionsForProfilePhotoPopupViewModel>();
}

// No builder:
AddPages(builder.Services);
AddPopups(builder.Services);
```

## Example

**Before (tentando usar alerta para 3 opcoes):**
```csharp
// Alerta nao permite componentes customizados nem captura rica de input
await DisplayAlert("Foto de Perfil", "Escolha uma opcao", "OK");
```

**After (popup com opcoes interativas):**
```csharp
// Popup permite qualquer componente XAML e captura resultado tipado
// Registrado via AddTransientPopup, exibido via ViewModel
services.AddTransientPopup<OptionsForProfilePhotoPopup, OptionsForProfilePhotoPopupViewModel>();
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Exibir informacao simples sem interacao | Use DisplayAlert ou Snackbar |
| Precisa de input do usuario com multiplas opcoes | Use Popup |
| Precisa de componentes customizados (entries, botoes, imagens) | Use Popup |
| Fluxo com 3+ opcoes que nao justifica pagina propria | Use Popup |
| Popup relacionado a dominio especifico (arquivos, configs) | Crie subpasta dentro de Popups/ |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Herdar de ContentPage no popup | Herdar de `CommunityToolkit.Maui.Views.Popup` |
| Usar AddTransientWithShellRoute para popup | Usar `AddTransientPopup<TPopup, TViewModel>()` |
| Reutilizar ViewModelBase de paginas para popup | Criar `ViewModelBaseForPopups` separada |
| Criar pagina inteira para 3 opcoes simples | Usar popup |
| Registrar rota Shell para popup | Popups nao tem rota, sao exibidos via ViewModel |
| Misturar popups e pages na mesma pasta | Separar em `Views/Popups/` e `Views/Pages/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
