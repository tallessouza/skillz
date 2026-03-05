# Deep Explanation: Media Picker no .NET MAUI

## Por que injecao de dependencia ao inves de MediaPicker.Default?

O instrutor explica que classes do .NET MAUI como `MediaPicker` nao devem ser usadas diretamente. O motivo principal e testabilidade — com uso direto, testes de unidade nao conseguem mockar o acesso a camera/galeria.

Padrao no .NET MAUI: algumas classes usam `.Current` (como `DeviceDisplay.Current`), outras usam `.Default` (como `MediaPicker.Default`). Para descobrir qual usar, passe o mouse sobre a propriedade — ela revela a interface implementada (ex: `IMediaPicker`).

Fluxo:
1. Passe o mouse em `.Default` para descobrir a interface (`IMediaPicker`)
2. Registre no DI: `builder.Services.AddSingleton<IMediaPicker>(MediaPicker.Default)`
3. Receba via construtor na ViewModel
4. Use a propriedade injetada no lugar de `MediaPicker.Default`

## Por que o switch e aceitavel aqui

O instrutor antecipa a objecao sobre violacao do Open/Closed Principle (SOLID). Ele argumenta que nesse contexto as opcoes sao finitas e estaveis — camera, galeria e deletar. Nao ha margem real para crescimento (nao faz sentido adicionar "upload do Google Drive" ou "LinkedIn"). Quando o dominio e fechado, switch e pragmatico.

## Por que a opcao "tirar foto" raramente e usada

Insight de UX do instrutor: na pratica, usuarios quase nunca tiram foto na hora para perfil. Preferem selecionar da galeria porque a foto ja foi editada, estavam com roupa melhor, etc. O instrutor mantem a opcao apenas para fins didaticos — para ensinar como acessar a camera.

## Cenarios de resultado nulo

O `FileResult` retornado por `CapturePhotoAsync()` e `PickPhotoAsync()` sera `null` quando:
- O usuario abre a camera e cancela sem tirar foto
- O usuario abre a galeria e fecha sem selecionar
- Sempre verificar antes de processar

## Permissoes — por que e como

### Android

1. **Camera**: Adicionar `<uses-permission android:name="android.permission.CAMERA" />` no AndroidManifest.xml
2. **Queries/Intents (API 30+)**: Adicionar bloco `<queries><intent>...</intent></queries>` — obrigatorio porque a partir da API 30 o Android exige declaracao explicita de intents
3. Versao minima do projeto (API 29) significa que o app pode rodar em API 30+, entao o bloco queries e necessario
4. Permissao de galeria (READ_MEDIA_IMAGES para API 33+) nao foi necessaria separadamente nesse caso

Formas de editar o AndroidManifest:
- Visual Studio: clicar 2x abre UI com checkboxes
- Outra IDE: botao direito → Open With → Android XML file
- Qualquer editor de texto (VS Code, Notepad++)

### iOS

1. **Camera**: Adicionar `NSCameraUsageDescription` no Info.plist com mensagem explicativa
2. **Galeria**: Adicionar `NSPhotoLibraryUsageDescription` no Info.plist com mensagem explicativa
3. As mensagens aparecem no popup de permissao do iOS — devem explicar POR QUE o app precisa do acesso

Formas de editar o Info.plist:
- Visual Studio (Windows): botao direito → Open With → Generic PList Editor
- Rider: clicar 2x abre como XML — adicionar tags `<key>` e `<string>` manualmente
- Xcode (Mac): botao direito → Open in Xcode
- Qualquer editor de texto

## Sobre a propriedade temporaria para exibir foto

O instrutor cria uma propriedade observavel `PhotoPath` e usa `photo.FullPath` para exibir a foto no avatar. Ele enfatiza que isso e temporario/gambiarra — na implementacao real, a foto sera enviada para a API, validada e armazenada no servidor antes de ser exibida.

## Camera no emulador iOS

O instrutor demonstra que a camera NAO funciona no simulador iOS (nao ha hardware de camera). A galeria funciona com fotos de teste pre-instaladas. Para testar camera, use dispositivo fisico.