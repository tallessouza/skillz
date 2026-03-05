# Deep Explanation: Testing ViewModels com Mock Builders Avançados

## Por que o builder precisa ser genérico?

O instrutor destaca um problema real: a interface `INavigationService` tem um método `ShowPopup<TViewModel, TResult>()` que retorna valores diferentes dependendo de qual ViewModel chama. Se você fixa os tipos no builder (ex: `ShowPopup<OptionsForProfileViewModel, ChooseFileOption>`), esse builder só serve para testes da `UserProfileViewModel`. Outras ViewModels que chamam `ShowPopup` com tipos diferentes precisariam de outro builder ou de modificações.

A solução é transferir a responsabilidade dos tipos concretos para o teste. O builder expõe `Build<TViewModel, TResult>(TResult result)` e o teste decide: "neste contexto, o popup retorna `ChooseFileOption.TakePicture`".

## O problema do parâmetro opcional no Moq

Mesmo que `MediaPickerOptions` seja opcional na interface real (`CapturePhotoAsync(MediaPickerOptions? options = null)`), o Moq exige clareza absoluta no `.Setup()`. Você precisa passar `null` explicitamente:

```csharp
mock.Setup(mp => mp.CapturePhotoAsync(null))  // Funciona
mock.Setup(mp => mp.CapturePhotoAsync())       // ERRO - Moq não infere o parâmetro
```

Isso acontece porque o Moq precisa construir uma expression tree que represente exatamente a chamada esperada. Sem o argumento, ele não consegue resolver o overload.

## Por que não testar código temporário?

O instrutor menciona que a propriedade `PhotoPath` é temporária — ela existe apenas para demonstrar visualmente a troca de avatar, mas será substituída em aulas futuras. Escrever testes para código temporário cria dois problemas:

1. Trabalho jogado fora quando o código mudar
2. Falsos positivos — o teste passa mas valida comportamento que vai desaparecer

A regra é: teste apenas funcionalidade que faz parte do design final.

## O padrão de factory method com parâmetro opcional

O `CreateViewModel` com `ChooseFileOption? fileOption = null` é um padrão elegante porque:

- Testes existentes (Initialize, UpdateProfile, ChangePassword) não passam `fileOption`, então usam o `Build()` simples
- Testes novos (ChangeProfilePhoto) passam o valor, acionando `Build<TVM, TResult>()`
- Zero breaking changes nos testes já escritos

O if-ternário `fileOption is null ? ... : ...` funciona como um roteador: escolhe o builder correto baseado na necessidade do teste.

## Por que `Times.Once()` funciona mesmo com múltiplos testes?

Cada chamada a `CreateViewModel` retorna uma instância nova da ViewModel e mocks novos. Não há estado compartilhado. Então quando você verifica `Times.Once()`, está verificando contra aquele mock específico daquele teste específico. Mesmo rodando `[InlineData(TakePicture)]` e `[InlineData(UploadFromGallery)]` em sequência, cada execução tem seu próprio universo de mocks.

## Organização dos builders em pastas

O instrutor organiza builders em pastas que espelham a origem da interface:
- `Common/TestUtilities/Maui/MediaPickerBuilder.cs` — para interfaces do .NET MAUI
- `Common/TestUtilities/Builders/NavigationServiceBuilder.cs` — para interfaces do projeto

Isso facilita encontrar e manter os builders à medida que o projeto cresce.

## O uso de Bogus para dados válidos

`FileResult` valida que o path não é vazio. Em vez de inventar strings como `"fake/path.jpg"`, o instrutor usa `new Faker().Image.LoremFlickerUrl()` que gera uma URL real de imagem. Isso é mais robusto porque:

- A URL tem formato válido
- Se o construtor adicionar mais validações no futuro, uma URL real tem mais chance de passar
- Documenta a intenção: "preciso de algo que pareça uma imagem válida"