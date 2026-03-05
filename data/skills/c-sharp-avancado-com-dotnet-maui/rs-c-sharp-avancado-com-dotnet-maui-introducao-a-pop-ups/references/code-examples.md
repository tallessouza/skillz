# Code Examples: Popups no .NET MAUI

## Estrutura completa de pastas criada na aula

```
PlanShare.App/
├── Views/
│   ├── Pages/           # Paginas existentes
│   └── Popups/
│       └── Files/
│           ├── OptionsForProfilePhotoPopup.xaml
│           └── OptionsForProfilePhotoPopup.xaml.cs
├── ViewModels/
│   ├── Pages/           # ViewModels existentes
│   └── Popups/
│       ├── ViewModelBaseForPopups.cs
│       └── Files/
│           └── OptionsForProfilePhotoPopupViewModel.cs
└── MauiProgram.cs
```

## ViewModelBaseForPopups.cs — Completo

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace PlanShare.App.ViewModels.Popups;

public abstract partial class ViewModelBaseForPopups : ObservableObject
{
    // Base separada de ViewModelBase de paginas
    // Nao inclui NavigationService nem GoToPageWithErrors
    // porque popups nao navegam — eles retornam resultado
}
```

## OptionsForProfilePhotoPopupViewModel.cs — Completo

```csharp
namespace PlanShare.App.ViewModels.Popups.Files;

public partial class OptionsForProfilePhotoPopupViewModel : ViewModelBaseForPopups
{
    // partial necessario para source generators (comandos futuros)
    // Comandos para as 3 opcoes serao adicionados nas proximas aulas
}
```

## OptionsForProfilePhotoPopup.xaml.cs (CodeBehind) — Completo

```csharp
using CommunityToolkit.Maui.Views;
using PlanShare.App.ViewModels.Popups.Files;

namespace PlanShare.App.Views.Popups.Files;

// IMPORTANTE: herda de Popup, NAO de ContentPage
public partial class OptionsForProfilePhotoPopup : Popup
{
    public OptionsForProfilePhotoPopup(OptionsForProfilePhotoPopupViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;  // Associacao ViewModel <-> Popup
    }
}
```

## OptionsForProfilePhotoPopup.xaml — Completo

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:vm="clr-namespace:PlanShare.App.ViewModels.Popups.Files"
    x:Class="PlanShare.App.Views.Popups.Files.OptionsForProfilePhotoPopup"
    x:DataType="vm:OptionsForProfilePhotoPopupViewModel">

    <!-- Conteudo do popup sera implementado na proxima aula -->

</toolkit:Popup>
```

**Pontos criticos no XAML:**
1. `xmlns:toolkit` — obrigatorio para usar `toolkit:Popup`
2. Elemento raiz e `toolkit:Popup`, nao `ContentPage`
3. Tag de fechamento deve ser `</toolkit:Popup>` (Visual Studio pode nao fechar automaticamente)
4. `x:DataType` aponta para a ViewModel do popup

## MauiProgram.cs — Registro do popup

```csharp
using PlanShare.App.Views.Popups.Files;
using PlanShare.App.ViewModels.Popups.Files;

// No metodo de configuracao:
AddPages(builder.Services);
AddPopups(builder.Services);  // Nova chamada

// Novo metodo:
private static void AddPopups(IServiceCollection services)
{
    // AddTransientPopup — NAO AddTransientWithShellRoute
    // Popups nao tem rota Shell, sao exibidos via ViewModel
    services.AddTransientPopup<OptionsForProfilePhotoPopup, OptionsForProfilePhotoPopupViewModel>();
}
```

## Comparacao: registro de pagina vs popup

```csharp
// PAGINA — tem rota Shell para navegacao
services.AddTransientWithShellRoute<ChangeUserPasswordPage, ChangeUserPasswordViewModel>(nameof(ChangeUserPasswordPage));

// POPUP — sem rota, exibido programaticamente
services.AddTransientPopup<OptionsForProfilePhotoPopup, OptionsForProfilePhotoPopupViewModel>();
```

## Adicionando o namespace do toolkit (referencia)

Copiado de uma pagina existente (ex: pagina de user):
```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

Este namespace e o mesmo usado para Snackbar, alertas e outros componentes do CommunityToolkit.