# Code Examples: Corrigindo Exception no PopUp

## Exemplo 1: NavigationService — ShowPopup corrigido

```csharp
// Dentro do NavigationService
public async Task<ChooseFileOption> ShowPopup()
{
    var popup = new ChoosePhotoPopup();

    // ANTES (bugado):
    // var result = await Shell.Current.ShowPopupAsync<ChooseFileOption>(popup);
    // → Se tocar fora, result = null → CRASH

    // DEPOIS (corrigido):
    var result = await Shell.Current.ShowPopupAsync<ChooseFileOption>(
        popup,
        canBeDismissedByTappingOutsideOfPopup: false  // ← A correcao
    );

    return result;  // Sempre tera um valor valido do enum
}
```

## Exemplo 2: O enum ChooseFileOption

```csharp
public enum ChooseFileOption
{
    None,                // ← Essencial: representa "cancelar" / "nao fazer nada"
    TakePicture,         // Tirar foto com camera
    UploadFromGallery,   // Upload da galeria
    DeletePhoto          // Deletar foto atual
}
```

## Exemplo 3: ViewModel consumindo o resultado

```csharp
// UserProfileViewModel
public async Task ChangeProfilePhoto()
{
    var selectedOption = await _navigationService.ShowPopup();

    // selectedOption nunca sera null — sempre um valor valido
    switch (selectedOption)
    {
        case ChooseFileOption.TakePicture:
            await TakePicture();
            break;
        case ChooseFileOption.UploadFromGallery:
            await UploadFromGallery();
            break;
        case ChooseFileOption.DeletePhoto:
            await DeletePhoto();
            break;
        case ChooseFileOption.None:
            // Usuario cancelou — nao faz nada
            break;
    }
}
```

## Exemplo 4: Popup sem resultado (onde dismiss externo e OK)

```csharp
// Popup informativo — NAO precisa bloquear dismiss externo
var infoPopup = new InfoPopup("Operacao concluida com sucesso!");
await Shell.Current.ShowPopupAsync(infoPopup);
// Sem tipo generico, sem retorno esperado — dismiss externo e seguro
```

## Teste do cenario

Para verificar a correcao:
1. Abrir o popup
2. Tocar em qualquer area fora do popup
3. **Esperado:** popup NAO fecha, usuario continua vendo as opcoes
4. Clicar em "Cancelar"
5. **Esperado:** popup fecha, resultado = `None`, app continua funcionando