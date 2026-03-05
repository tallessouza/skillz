---
name: rs-csharp-maui-popup-result
description: "Applies the pattern for returning typed results from .NET MAUI Community Toolkit popups using enums and command parameters. Use when user asks to 'return value from popup', 'get popup result', 'pass parameter to command', 'handle popup selection', or 'close popup with result' in .NET MAUI. Make sure to use this skill whenever implementing popups that return user selections in MAUI apps. Not for simple alerts, DisplayActionSheet, or non-MAUI popup libraries."
---

# Recuperando Resultado Tipado de PopUps no .NET MAUI

> Trate popups como funcoes que retornam um valor tipado — o popup fecha e faz return do resultado selecionado.

## Rules

1. **Crie um enum para as opcoes do popup** — cada opcao do usuario vira um valor do enum, incluindo `None` para cancelamento, porque isso garante type-safety no resultado
2. **Passe o tipo de retorno no ShowPopupAsync** — use `ShowPopupAsync<ViewModel, ChooseFileOption>()` com o enum como segundo tipo generico, porque sem isso o popup nao retorna valor tipado
3. **Use apenas um comando para multiplas opcoes** — passe o enum como CommandParameter no XAML ao inves de criar um comando por opcao, porque reduz duplicacao e centraliza a logica
4. **Sempre cubra o cenario de cancelamento** — o botao cancelar retorna `None` com valor fixo no ClosePopupAsync, porque o popup sempre precisa retornar algo
5. **Extraia o resultado com `result.Result`** — o retorno de ShowPopupAsync e `IPopupResult<T>`, acesse `.Result` para obter o valor do enum

## How to write

### Enum de opcoes

```csharp
public enum ChooseFileOption
{
    None,            // Cancelamento
    TakePicture,     // Camera
    UploadFromGallery, // Galeria
    DeleteCurrentPicture // Remover foto atual
}
```

### ViewModel do Popup (recebe parametro e fecha com resultado)

```csharp
public partial class MyPopupViewModel : ObservableObject
{
    private readonly IPopupService _popupService;

    public MyPopupViewModel(IPopupService popupService)
    {
        _popupService = popupService;
    }

    [RelayCommand]
    private async Task Cancel() =>
        await _popupService.ClosePopupAsync(Shell.Current, ChooseFileOption.None);

    [RelayCommand]
    private async Task OptionSelected(ChooseFileOption option) =>
        await _popupService.ClosePopupAsync(Shell.Current, option);
}
```

### ViewModel que exibe o popup (recebe o resultado)

```csharp
[RelayCommand]
private async Task ChangeProfilePhoto()
{
    var result = await _popupService.ShowPopupAsync<MyPopupViewModel, ChooseFileOption>(Shell.Current);
    var fileOption = result.Result; // tipo: ChooseFileOption

    // Direcionar para o fluxo correto baseado na selecao
    switch (fileOption)
    {
        case ChooseFileOption.TakePicture:
            // logica de camera
            break;
        case ChooseFileOption.UploadFromGallery:
            // logica de galeria
            break;
        case ChooseFileOption.DeleteCurrentPicture:
            // logica de remocao
            break;
        case ChooseFileOption.None:
        default:
            break; // usuario cancelou
    }
}
```

### XAML — CommandParameter com enum via x:Static

```xml
<ContentPage xmlns:fileOptions="clr-namespace:MyApp.Models.Enums">

    <!-- Botao cancelar: comando dedicado, sem parametro -->
    <Button Command="{Binding CancelCommand}" Text="Cancelar" />

    <!-- Opcoes: mesmo comando, parametro diferente -->
    <VerticalStackLayout>
        <VerticalStackLayout.GestureRecognizers>
            <TapGestureRecognizer
                Command="{Binding OptionSelectedCommand}"
                CommandParameter="{x:Static fileOptions:ChooseFileOption.UploadFromGallery}" />
        </VerticalStackLayout.GestureRecognizers>
    </VerticalStackLayout>
</ContentPage>
```

## Example

**Before (um comando por opcao — duplicacao):**
```csharp
[RelayCommand] private async Task TakePhoto() =>
    await _popupService.ClosePopupAsync(Shell.Current, ChooseFileOption.TakePicture);

[RelayCommand] private async Task UploadGallery() =>
    await _popupService.ClosePopupAsync(Shell.Current, ChooseFileOption.UploadFromGallery);

[RelayCommand] private async Task DeletePhoto() =>
    await _popupService.ClosePopupAsync(Shell.Current, ChooseFileOption.DeleteCurrentPicture);
```

**After (um comando com parametro):**
```csharp
[RelayCommand]
private async Task OptionSelected(ChooseFileOption option) =>
    await _popupService.ClosePopupAsync(Shell.Current, option);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Popup com 2+ opcoes do mesmo tipo | Um comando + CommandParameter |
| Popup com botao cancelar | Comando separado retornando `None` |
| Precisa referenciar enum no XAML | `xmlns:alias="clr-namespace:..."` + `x:Static` |
| Elemento sem propriedade Command (StackLayout) | Use `GestureRecognizers > TapGestureRecognizer` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Um RelayCommand por opcao do popup | Um comando com parametro `ChooseFileOption` |
| Retornar string do popup | Retornar enum tipado |
| Ignorar cenario de cancelamento | Sempre ter `None` no enum e comando Cancel |
| Hardcodar valor no comando | Usar `CommandParameter` com `x:Static` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
