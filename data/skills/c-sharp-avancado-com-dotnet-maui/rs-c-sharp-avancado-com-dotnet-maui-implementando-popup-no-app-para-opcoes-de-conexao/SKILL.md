---
name: rs-csharp-dotnet-maui-popup-implementation
description: "Enforces correct popup duplication workflow in .NET MAUI XAML projects. Use when user asks to 'create a popup', 'copy XAML file', 'duplicate a view', 'add a new popup', or 'reuse XAML component'. Applies rules: fix x:Class namespace after copy, update CodeBehind class/constructor names, register in MauiProgram DI, create matching ViewModel with correct enum. Make sure to use this skill whenever duplicating or creating XAML popups in .NET MAUI. Not for creating pages, navigation setup, or SignalR hub connections."
---

# Implementando Popups no .NET MAUI via Duplicacao

> Ao duplicar arquivos XAML para criar novos popups, corrija namespace, x:Class, classe CodeBehind, construtor e registro DI antes de qualquer outra alteracao.

## Rules

1. **Corrija x:Class no XAML** — atualize namespace e nome da classe em `x:Class`, porque o XAML resolve tipos por esse atributo e o namespace antigo causa crash silencioso
2. **Renomeie classe e construtor no CodeBehind** — o rename do arquivo NAO renomeia a classe C#, faca manualmente, porque o compilador nao vincula arquivo a classe automaticamente
3. **Atualize namespace da pasta** — se moveu de `Popups.Files` para `Popups.Connection`, atualize em TODOS os lugares (x:Class, using, xmlns), porque referencias quebradas causam erros de compilacao
4. **Crie ViewModel correspondente** — cada popup tem sua propria ViewModel com `partial class` e heranca correta, porque o binding depende da ViewModel registrada
5. **Registre no MauiProgram** — adicione popup e ViewModel no metodo `AddPopups()` do `MauiProgram.cs`, porque sem registro o DI container nao resolve a instancia
6. **Reutilize commands com parametros** — use um unico `OptionSelectedCommand` com enum como parametro ao inves de commands separados (ex: cancel), porque reduz duplicacao na ViewModel

## How to write

### Estrutura de pastas ao criar popup

```
Views/
  Popups/
    Connection/           ← nova pasta para o contexto
      OptionsForConnectionByCodePopup.xaml
      OptionsForConnectionByCodePopup.xaml.cs

ViewModels/
  Popups/
    Connection/           ← espelha a estrutura de Views
      OptionsForConnectionByCodeViewModel.cs
```

### CodeBehind apos duplicacao

```csharp
// Renomeie classe E construtor manualmente
namespace PlanShare.App.Views.Popups.Connection;  // namespace correto

public partial class OptionsForConnectionByCodePopup : Popup
{
    public OptionsForConnectionByCodePopup(
        OptionsForConnectionByCodeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### ViewModel com command unico e enum

```csharp
public partial class OptionsForConnectionByCodeViewModel : BaseViewModel
{
    [RelayCommand]
    private async Task OptionSelected(ChooseCodeConnectionOption option)
    {
        // Trata todas opcoes: None, UseCode, GenerateCode
        await ClosePopup(option);
    }
}
```

### Enum para opcoes do popup

```csharp
public enum ChooseCodeConnectionOption
{
    None,        // cancelar / sem selecao
    UseCode,     // usar codigo existente
    GenerateCode // gerar novo codigo
}
```

### Registro no MauiProgram.cs

```csharp
private static void AddPopups(IServiceCollection services)
{
    // popup existente
    services.AddTransient<OptionsForProfilePicturePopup>();
    services.AddTransient<OptionsForProfilePictureViewModel>();

    // novo popup — duplicar linha e trocar nomes
    services.AddTransient<OptionsForConnectionByCodePopup>();
    services.AddTransient<OptionsForConnectionByCodeViewModel>();
}
```

### XAML — correcoes criticas apos Ctrl-C/V

```xml
<!-- x:Class com namespace CORRETO -->
<toolkit:Popup
    x:Class="PlanShare.App.Views.Popups.Connection.OptionsForConnectionByCodePopup"
    xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Popups.Connection"
    xmlns:enums="clr-namespace:PlanShare.App.Models.Enums">

    <!-- Command reutilizado com parametro enum -->
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer
            Command="{Binding OptionSelectedCommand}"
            CommandParameter="{x:Static enums:ChooseCodeConnectionOption.UseCode}" />
    </VerticalStackLayout.GestureRecognizers>

    <!-- Botao cancelar usa MESMO command com None -->
    <Button Text="Cancelar"
            Command="{Binding OptionSelectedCommand}"
            CommandParameter="{x:Static enums:ChooseCodeConnectionOption.None}" />
</toolkit:Popup>
```

## Example

**Before (arquivo duplicado sem correcoes):**
```xml
<!-- x:Class ainda aponta para o popup original -->
<toolkit:Popup
    x:Class="PlanShare.App.Views.Popups.Files.OptionsForProfilePicturePopup"
    xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Popups.Files">
```

**After (com this skill applied):**
```xml
<toolkit:Popup
    x:Class="PlanShare.App.Views.Popups.Connection.OptionsForConnectionByCodePopup"
    xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Popups.Connection">
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Duplicando arquivo XAML | Corrija x:Class, namespace, classe, construtor, registro DI |
| Popup com cancel + opcoes | Use command unico com enum (None = cancel) |
| Testando popup novo | Crie botao temporario simples antes de estilizar |
| Varias opcoes no popup | Cada opcao e um VerticalStackLayout com TapGestureRecognizer |
| Popup precisa de largura responsiva | Use DeviceDisplay no CodeBehind para calcular largura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `CancelCommand` separado no ViewModel | `OptionSelectedCommand` com parametro `None` |
| Namespace antigo no x:Class apos copiar | Namespace atualizado refletindo pasta atual |
| Classe com nome do arquivo original no CodeBehind | Classe renomeada manualmente para o novo nome |
| Popup sem registro no MauiProgram | `AddTransient` para popup E ViewModel |
| xmlns:viewmodel apontando para pasta antiga | xmlns atualizado para nova pasta (ex: Popups.Connection) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
