# Code Examples: Media Picker no .NET MAUI

## Registro completo no MauiProgram.cs

```csharp
// Dentro de CreateMauiApp()
// Registrar MediaPicker no servico de injecao de dependencia
builder.Services.AddSingleton<IMediaPicker>(MediaPicker.Default);

// Outros servicos de plataforma seguem o mesmo padrao:
// builder.Services.AddSingleton<IDeviceDisplay>(DeviceDisplay.Current);
```

## ViewModel completa com MediaPicker

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    private readonly IMediaPicker _mediaPicker;

    [ObservableProperty]
    private string? photoPath;

    public UserProfileViewModel(IMediaPicker mediaPicker)
    {
        _mediaPicker = mediaPicker;
    }

    [RelayCommand]
    private async Task ChangeProfilePhoto()
    {
        // Passo 1: Exibir popup e capturar opcao selecionada
        var optionSelected = await ShowProfilePhotoPopup();

        // Passo 2: Executar codigo dependendo da opcao
        switch (optionSelected)
        {
            case ProfilePhotoOption.TakePicture:
                var cameraPhoto = await _mediaPicker.CapturePhotoAsync();
                if (cameraPhoto is not null)
                    UpdatePhotoProcess(cameraPhoto);
                break;

            case ProfilePhotoOption.UploadFromGallery:
                var galleryPhoto = await _mediaPicker.PickPhotoAsync();
                if (galleryPhoto is not null)
                    UpdatePhotoProcess(galleryPhoto);
                break;

            case ProfilePhotoOption.DeletePhoto:
                // Simulacao temporaria — implementacao real comunicara com API
                PhotoPath = null;
                break;

            // None nao precisa de case — nenhuma acao necessaria
        }
    }

    private void UpdatePhotoProcess(FileResult photo)
    {
        if (photo is not null)
        {
            // photo.FullPath contem o caminho completo do arquivo
            PhotoPath = photo.FullPath;

            // Na implementacao real:
            // - Enviar foto para API
            // - API valida o arquivo
            // - API armazena a foto
            // - Atualizar UI com URL retornada
        }
    }
}
```

## Enum de opcoes do popup

```csharp
public enum ProfilePhotoOption
{
    None,           // Nenhuma acao — usuario fechou o popup
    TakePicture,    // Tirar foto com a camera
    UploadFromGallery, // Selecionar foto da galeria
    DeletePhoto     // Remover foto de perfil
}
```

## AndroidManifest.xml — permissoes necessarias

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissao para acessar a camera -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- Necessario para API 30+ (Android 11+) -->
    <queries>
        <intent>
            <action android:name="android.media.action.IMAGE_CAPTURE" />
        </intent>
    </queries>

    <application ...>
        ...
    </application>
</manifest>
```

## Info.plist (iOS) — permissoes necessarias

```xml
<dict>
    <!-- Permissao para acessar a camera -->
    <key>NSCameraUsageDescription</key>
    <string>A câmera é necessária para alterar a foto de perfil.</string>

    <!-- Permissao para acessar a galeria de fotos -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Acesso solicitado para alterar foto de perfil.</string>
</dict>
```

## Binding na View (XAML)

```xml
<!-- No AvatarView, bind da propriedade temporaria -->
<Image Source="{Binding PhotoPath}" />
```

## Metodos disponiveis no IMediaPicker

```csharp
// Fotos
await _mediaPicker.CapturePhotoAsync();  // Abre camera, tira foto
await _mediaPicker.PickPhotoAsync();     // Abre galeria, seleciona foto

// Videos (mesma logica, funcoes diferentes)
await _mediaPicker.CaptureVideoAsync();  // Abre camera, grava video
await _mediaPicker.PickVideoAsync();     // Abre galeria, seleciona video
```

## Verificando versao minima do Android (csproj)

```xml
<!-- No arquivo .csproj do projeto -->
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">29</SupportedOSPlatformVersion>
```

Versao 29 = API 29. O app nao instala em versoes inferiores. Como o minimo e 29, o app PODE rodar em API 30+, por isso o bloco `<queries>` no AndroidManifest e necessario.