# Code Examples: Aplicativos Nativos com .NET MAUI

## Diagrama de camadas (da aula)

A aula nao apresentou codigo diretamente, mas mostrou um diagrama de arquitetura baseado na documentacao oficial da Microsoft. Abaixo, a representacao em codigo dos conceitos discutidos.

## Exemplo: Acesso a camera (abstracao MAUI vs nativo)

### Sem MAUI — codigo especifico por plataforma

```csharp
// Android (usando API nativa)
var intent = new Intent(MediaStore.ActionImageCapture);
StartActivityForResult(intent, REQUEST_IMAGE_CAPTURE);

// iOS (usando API nativa)
var picker = new UIImagePickerController();
picker.SourceType = UIImagePickerControllerSourceType.Camera;
PresentViewController(picker, true, null);
```

### Com MAUI — abstracao unificada

```csharp
// Um unico codigo para Android, iOS, Windows
var photo = await MediaPicker.Default.CapturePhotoAsync();
if (photo != null)
{
    var stream = await photo.OpenReadAsync();
    // Usar a foto — funciona em qualquer plataforma
}
```

O MAUI resolve internamente qual API nativa chamar. O desenvolvedor escreve uma vez.

## Exemplo: Nivel de bateria

```csharp
// MAUI — funciona em todas as plataformas
var level = Battery.Default.ChargeLevel; // 0.0 a 1.0
var state = Battery.Default.State;       // Charging, Discharging, Full, etc.
var source = Battery.Default.PowerSource; // Battery, AC, USB
```

## Compilacao: o que acontece por plataforma

### Android (JIT)

```
Seu codigo C# 
    → Compilador .NET → IL (Intermediate Language)
        → App instalado com IL
            → Usuario abre o app
                → JIT compila IL → codigo nativo ARM/x86
                    → Executa nativo no Android
```

### iOS (AOT)

```
Seu codigo C#
    → Compilador .NET → IL (Intermediate Language)
        → AOT compila IL → codigo nativo ARM (no momento do build)
            → App instalado ja nativo
                → Usuario abre o app
                    → Executa direto (ja compilado)
```

## Estrutura tipica de projeto MAUI

```
MeuApp/
├── App.xaml              # Ponto de entrada (C#/XAML)
├── MainPage.xaml         # Pagina principal
├── Platforms/
│   ├── Android/          # Configuracoes especificas Android
│   ├── iOS/              # Configuracoes especificas iOS
│   ├── Windows/          # Configuracoes especificas Windows
│   └── MacCatalyst/      # Configuracoes especificas Mac
├── Resources/            # Icones, fontes, imagens (compartilhados)
└── MeuApp.csproj         # Um unico projeto, multiplos targets
```

Um repositorio. Um projeto. Multiplas plataformas.