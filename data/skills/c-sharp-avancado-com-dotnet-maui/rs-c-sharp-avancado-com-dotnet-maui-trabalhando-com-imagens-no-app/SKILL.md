---
name: rs-csharp-maui-media-picker
description: "Applies .NET MAUI MediaPicker patterns when user asks to 'access camera', 'pick photo from gallery', 'capture image', 'select media', or 'change profile picture' in a MAUI app. Enforces dependency injection with IMediaPicker, proper async/await, null-check for cancelled operations, and platform permission setup for Android and iOS. Make sure to use this skill whenever implementing camera or gallery features in .NET MAUI. Not for video recording, file storage APIs, or image processing/editing."
---

# Media Picker no .NET MAUI

> Utilize IMediaPicker via injecao de dependencia para acessar camera e galeria, sempre tratando cancelamento e configurando permissoes por plataforma.

## Rules

1. **Nunca use MediaPicker.Default diretamente** — injete `IMediaPicker` via construtor, porque uso direto impede testes de unidade e quebra inversao de controle
2. **Sempre await as chamadas** — `CapturePhotoAsync()` e `PickPhotoAsync()` sao assincronos; sem await o resultado sera incorreto
3. **Sempre verifique nulo no retorno** — o usuario pode cancelar a camera ou galeria, retornando `null`; execute logica apenas se `foto is not null`
4. **Configure permissoes ANTES de executar** — sem permissoes no AndroidManifest e Info.plist, o app vai crashar em runtime
5. **Registre IMediaPicker no DI** — use `MediaPicker.Default` como implementacao no container de servicos
6. **Use switch para opcoes de popup** — camera, galeria e deletar sao opcoes finitas e estaveis; switch e adequado quando nao ha expectativa de crescimento

## How to write

### Registro no DI (MauiProgram.cs)

```csharp
builder.Services.AddSingleton<IMediaPicker>(MediaPicker.Default);
```

### ViewModel com injecao

```csharp
public class UserProfileViewModel
{
    private readonly IMediaPicker _mediaPicker;

    public UserProfileViewModel(IMediaPicker mediaPicker)
    {
        _mediaPicker = mediaPicker;
    }
}
```

### Capturar foto da camera

```csharp
var photo = await _mediaPicker.CapturePhotoAsync();
if (photo is not null)
{
    // processar foto — photo.FullPath contem o caminho completo
}
```

### Selecionar foto da galeria

```csharp
var photo = await _mediaPicker.PickPhotoAsync();
if (photo is not null)
{
    // processar foto
}
```

### Switch de opcoes do popup

```csharp
switch (optionSelected)
{
    case ProfileOption.TakePicture:
        var cameraPhoto = await _mediaPicker.CapturePhotoAsync();
        if (cameraPhoto is not null)
            UpdatePhotoProcess(cameraPhoto);
        break;

    case ProfileOption.UploadFromGallery:
        var galleryPhoto = await _mediaPicker.PickPhotoAsync();
        if (galleryPhoto is not null)
            UpdatePhotoProcess(galleryPhoto);
        break;

    case ProfileOption.DeletePhoto:
        // remover foto de perfil
        break;
}
```

## Example

**Before (uso direto, sem null-check):**
```csharp
var photo = MediaPicker.Default.CapturePhotoAsync(); // sem await
ProfileImage = photo.FullPath; // NullReferenceException se cancelar
```

**After (com this skill applied):**
```csharp
var photo = await _mediaPicker.CapturePhotoAsync();
if (photo is not null)
{
    ProfileImage = photo.FullPath;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de camera E galeria | Registre `IMediaPicker` uma vez, use ambos os metodos |
| Opcao "None" no enum | Nao crie case no switch — none = nenhuma acao |
| Video ao inves de foto | Use `CaptureVideoAsync()` ou `PickVideoAsync()` |
| Emulador iOS | Camera nao funciona — teste galeria ou use dispositivo fisico |
| Resultado pode ser nulo | Sempre `if (result is not null)` antes de processar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `MediaPicker.Default.CapturePhotoAsync()` na ViewModel | `_mediaPicker.CapturePhotoAsync()` via DI |
| `var photo = CapturePhotoAsync()` sem await | `var photo = await CapturePhotoAsync()` |
| `ProcessPhoto(photo)` sem null-check | `if (photo is not null) ProcessPhoto(photo)` |
| Permissoes esquecidas no manifest | Configurar AndroidManifest + Info.plist antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
