# Code Examples: Implementando Popups via Duplicacao no .NET MAUI

## Exemplo completo: ViewModel do popup

```csharp
using CommunityToolkit.Mvvm.Input;

namespace PlanShare.App.ViewModels.Popups.Connection;

public partial class OptionsForConnectionByCodeViewModel : BaseViewModel
{
    // Um unico command para todas as opcoes (incluindo cancelar)
    [RelayCommand]
    private async Task OptionSelected(ChooseCodeConnectionOption option)
    {
        await ClosePopup(option);
    }
}
```

**Comparacao com a ViewModel original (perfil):**
```csharp
// ViewModel do popup de foto de perfil tinha 2 commands:
[RelayCommand]
private async Task OptionSelected(ChooseFileOption option)
{
    await ClosePopup(option);
}

[RelayCommand]
private async Task Cancel()
{
    await ClosePopup(ChooseFileOption.None);
}

// Na nova ViewModel, o Cancel e eliminado
// O botao cancelar usa OptionSelectedCommand com None
```

## Exemplo completo: Enum

```csharp
namespace PlanShare.App.Models.Enums;

public enum ChooseCodeConnectionOption
{
    None,           // cancelar / sem selecao
    UseCode,        // usar codigo de conexao existente
    GenerateCode    // gerar novo codigo de conexao
}
```

## Exemplo completo: CodeBehind do popup

```csharp
using CommunityToolkit.Maui.Views;

namespace PlanShare.App.Views.Popups.Connection;

public partial class OptionsForConnectionByCodePopup : Popup
{
    public OptionsForConnectionByCodePopup(
        OptionsForConnectionByCodeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;

        // Largura responsiva baseada no dispositivo
        Size = new Size(
            DeviceDisplay.MainDisplayInfo.Width / DeviceDisplay.MainDisplayInfo.Density,
            0);
    }
}
```

## Exemplo completo: XAML do popup

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup
    x:Class="PlanShare.App.Views.Popups.Connection.OptionsForConnectionByCodePopup"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:enums="clr-namespace:PlanShare.App.Models.Enums"
    xmlns:resources="clr-namespace:PlanShare.App.Resources"
    xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Popups.Connection"
    x:DataType="viewmodel:OptionsForConnectionByCodeViewModel"
    VerticalOptions="End"
    Color="Transparent">

    <Border Padding="0" BackgroundColor="{StaticResource Gray900}">
        <VerticalStackLayout Spacing="0">

            <!-- Opcao 1: Usar codigo de conexao -->
            <VerticalStackLayout Padding="16">
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding OptionSelectedCommand}"
                        CommandParameter="{x:Static enums:ChooseCodeConnectionOption.UseCode}" />
                </VerticalStackLayout.GestureRecognizers>
                <Label Text="{x:Static resources:ResourceMessages.TitleUseConnectionCode}" />
            </VerticalStackLayout>

            <!-- Opcao 2: Gerar codigo de conexao -->
            <VerticalStackLayout Padding="16">
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding OptionSelectedCommand}"
                        CommandParameter="{x:Static enums:ChooseCodeConnectionOption.GenerateCode}" />
                </VerticalStackLayout.GestureRecognizers>
                <Label Text="{x:Static resources:ResourceMessages.TitleGenerateConnectionCode}" />
            </VerticalStackLayout>

            <!-- Botao Cancelar — mesmo command com None -->
            <Button
                Text="{x:Static resources:ResourceMessages.Cancel}"
                Command="{Binding OptionSelectedCommand}"
                CommandParameter="{x:Static enums:ChooseCodeConnectionOption.None}" />

        </VerticalStackLayout>
    </Border>
</toolkit:Popup>
```

## Exemplo: Chamando o popup a partir do Dashboard

```csharp
// No DashboardViewModel
[RelayCommand]
private async Task ConnectionByCode()
{
    var result = await _navigationService
        .ShowPopup<OptionsForConnectionByCodeViewModel, ChooseCodeConnectionOption>();

    // result contem a opcao selecionada
    switch (result)
    {
        case ChooseCodeConnectionOption.UseCode:
            // navegar para tela de digitar codigo
            break;
        case ChooseCodeConnectionOption.GenerateCode:
            // navegar para tela de gerar codigo
            break;
        case ChooseCodeConnectionOption.None:
            // nada — usuario cancelou
            break;
    }
}
```

## Exemplo: Botao temporario no Dashboard XAML para teste

```xml
<!-- Botao temporario apenas para testar o fluxo do popup -->
<Button
    Text="ADD"
    Command="{Binding ConnectionByCodeCommand}" />
```

## Exemplo: Registro no MauiProgram.cs

```csharp
private static void AddPopups(IServiceCollection services)
{
    // Popup existente
    services.AddTransient<OptionsForProfilePicturePopup>();
    services.AddTransient<OptionsForProfilePictureViewModel>();

    // Novo popup de conexao
    services.AddTransient<OptionsForConnectionByCodePopup>();
    services.AddTransient<OptionsForConnectionByCodeViewModel>();
}
```

## Checklist ao duplicar arquivo XAML

```
□ Renomear arquivo .xaml (Visual Studio Rename)
□ Verificar se .xaml.cs foi renomeado junto
□ Renomear classe no CodeBehind manualmente
□ Renomear construtor no CodeBehind manualmente
□ Atualizar x:Class no XAML (namespace + classe)
□ Atualizar xmlns:viewmodel no XAML (namespace da pasta)
□ Atualizar namespace no CodeBehind
□ Criar ViewModel na pasta espelhada
□ Criar/usar enum correto para opcoes
□ Registrar popup + ViewModel no MauiProgram.cs
□ Testar com botao simples antes de estilizar
```