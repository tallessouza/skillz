# Code Examples: Recuperando Resultado Tipado de PopUps

## Exemplo 1: Enum completo de opcoes

```csharp
// Models/Enums/ChooseFileOption.cs
// Crie uma classe e troque "public class" por "public enum"
public enum ChooseFileOption
{
    None,                 // Cancelamento — usuario nao quer fazer nada
    TakePicture,          // Tirar foto com camera
    UploadFromGallery,    // Selecionar foto da galeria
    DeleteCurrentPicture  // Deletar foto de perfil atual
}
```

**Estrutura de pastas:**
```
App/
├── Models/
│   └── Enums/
│       └── ChooseFileOption.cs
```

## Exemplo 2: ViewModel do Popup completa

```csharp
public partial class ChooseFilePopupViewModel : ObservableObject
{
    private readonly IPopupService _popupService;

    public ChooseFilePopupViewModel(IPopupService popupService)
    {
        _popupService = popupService;
    }

    // Comando para o botao cancelar — valor fixo None
    [RelayCommand]
    private async Task Cancel() =>
        await _popupService.ClosePopupAsync(
            Shell.Current,
            ChooseFileOption.None
        );

    // Comando unico para todas as opcoes — recebe parametro do XAML
    [RelayCommand]
    private async Task OptionSelected(ChooseFileOption option) =>
        await _popupService.ClosePopupAsync(
            Shell.Current,
            option
        );
}
```

## Exemplo 3: UserProfileViewModel recebendo resultado

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    private readonly IPopupService _popupService;

    [RelayCommand]
    private async Task ChangeProfilePhoto()
    {
        // ShowPopupAsync com dois tipos genericos:
        // 1. ViewModel do popup
        // 2. Tipo do resultado esperado
        var result = await _popupService.ShowPopupAsync<
            ChooseFilePopupViewModel,
            ChooseFileOption
        >(Shell.Current);

        // result e IPopupResult<ChooseFileOption>
        // .Result acessa o valor do enum
        var fileOption = result.Result;

        // Direcionar para o fluxo correto
        switch (fileOption)
        {
            case ChooseFileOption.TakePicture:
                await TakePhotoAsync();
                break;
            case ChooseFileOption.UploadFromGallery:
                await UploadFromGalleryAsync();
                break;
            case ChooseFileOption.DeleteCurrentPicture:
                await DeleteProfilePhotoAsync();
                break;
            case ChooseFileOption.None:
            default:
                // Usuario cancelou, nao faz nada
                break;
        }
    }
}
```

## Exemplo 4: XAML do Popup com CommandParameter

```xml
<?xml version="1.0" encoding="utf-8" ?>
<toolkit:Popup
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:fileOptions="clr-namespace:PlainShare.App.Models.Enums">

    <VerticalStackLayout Spacing="16" Padding="20">

        <!-- Opcao: Upload da Galeria -->
        <VerticalStackLayout>
            <VerticalStackLayout.GestureRecognizers>
                <TapGestureRecognizer
                    Command="{Binding OptionSelectedCommand}"
                    CommandParameter="{x:Static fileOptions:ChooseFileOption.UploadFromGallery}" />
            </VerticalStackLayout.GestureRecognizers>
            <Label Text="Fazer upload de uma foto" />
        </VerticalStackLayout>

        <!-- Opcao: Tirar Foto -->
        <VerticalStackLayout>
            <VerticalStackLayout.GestureRecognizers>
                <TapGestureRecognizer
                    Command="{Binding OptionSelectedCommand}"
                    CommandParameter="{x:Static fileOptions:ChooseFileOption.TakePicture}" />
            </VerticalStackLayout.GestureRecognizers>
            <Label Text="Tirar foto" />
        </VerticalStackLayout>

        <!-- Opcao: Deletar Foto -->
        <VerticalStackLayout>
            <VerticalStackLayout.GestureRecognizers>
                <TapGestureRecognizer
                    Command="{Binding OptionSelectedCommand}"
                    CommandParameter="{x:Static fileOptions:ChooseFileOption.DeleteCurrentPicture}" />
            </VerticalStackLayout.GestureRecognizers>
            <Label Text="Deletar foto de perfil" />
        </VerticalStackLayout>

        <!-- Botao Cancelar -->
        <Button
            Command="{Binding CancelCommand}"
            Text="Cancelar" />

    </VerticalStackLayout>
</toolkit:Popup>
```

## Exemplo 5: Variacao — Popup de confirmacao simples (mesmo padrao)

```csharp
// Enum simples de confirmacao
public enum ConfirmOption
{
    None,
    Confirm,
    Deny
}

// ViewModel do popup
[RelayCommand]
private async Task Respond(ConfirmOption option) =>
    await _popupService.ClosePopupAsync(Shell.Current, option);

// Quem chamou
var result = await _popupService.ShowPopupAsync<
    ConfirmPopupViewModel, ConfirmOption>(Shell.Current);

if (result.Result == ConfirmOption.Confirm)
{
    await ExecuteAction();
}
```