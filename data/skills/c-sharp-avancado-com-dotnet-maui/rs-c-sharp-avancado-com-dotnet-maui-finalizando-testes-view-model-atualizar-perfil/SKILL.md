---
name: rs-csharp-maui-vm-testing-mocks
description: "Enforces advanced mock builder patterns for .NET MAUI ViewModel unit testing with Moq. Use when user asks to 'test a ViewModel', 'mock a navigation service', 'write unit tests for MAUI', 'mock MediaPicker', or 'create test builders for interfaces'. Applies generic builder patterns for popup navigation, optional test parameters, and fake data with Bogus. Make sure to use this skill whenever writing or reviewing .NET MAUI ViewModel tests. Not for integration tests, UI tests, or non-MAUI .NET testing."
---

# Testing ViewModels com Mock Builders Avancados (.NET MAUI)

> Construa builders de mock genéricos e reutilizáveis para que cada teste controle exatamente o comportamento dos mocks sem acoplar tipos concretos ao builder.

## Rules

1. **Builders devem ser genéricos quando a interface tem métodos genéricos** — se `INavigationService.ShowPopup<TViewModel, TResult>()` aceita tipos variáveis, o builder deve expor `Build<TViewModel, TResult>(result)` porque fixar tipos no builder impede reuso por outras ViewModels
2. **Parâmetros de teste opcionais com valor default null** — quando um mock só é necessário em alguns testes, receba-o como parâmetro opcional (`ChooseFileOption? fileOption = null`) para não quebrar testes existentes
3. **Use if-ternário para selecionar o build correto** — `fileOption is null ? builder.Build() : builder.Build<TVM, TResult>(fileOption.Value)` porque mantém um único ponto de criação da ViewModel
4. **Parâmetros opcionais de interface exigem valor explícito no Setup** — mesmo que `MediaPickerOptions` seja opcional na interface, o Moq exige que você passe `null` explicitamente no `.Setup()` porque ele precisa saber o tipo exato da chamada
5. **Use Bogus/Faker para dados fake válidos** — `new Faker().Image.LoremFlickerUrl()` gera URLs válidas para `FileResult` porque construtores como `FileResult` validam que o path não é vazio
6. **Cada chamada de `CreateViewModel` retorna instância nova com mocks novos** — `Times.Once()` funciona porque cada teste tem sua própria instância, não há estado compartilhado entre testes

## How to write

### Builder genérico para NavigationService com ShowPopup

```csharp
public class NavigationServiceBuilder
{
    // Build simples (sem retorno de popup)
    public static INavigationService Build() 
    {
        var mock = new Mock<INavigationService>();
        return mock.Object;
    }

    // Build genérico (com retorno de popup)
    public static INavigationService Build<TViewModel, TResult>(TResult result)
        where TViewModel : class
        where TResult : struct
    {
        var mock = new Mock<INavigationService>();
        mock.Setup(nav => nav.ShowPopup<TViewModel, TResult>())
            .ReturnsAsync(result);
        return mock.Object;
    }
}
```

### Builder para MediaPicker com Bogus

```csharp
public class MediaPickerBuilder
{
    public static IMediaPicker Build()
    {
        var faker = new Faker();
        var imgUrl = faker.Image.LoremFlickerUrl();

        var mock = new Mock<IMediaPicker>();
        mock.Setup(mp => mp.PickPhotoAsync(null))
            .ReturnsAsync(new FileResult(imgUrl));
        mock.Setup(mp => mp.CapturePhotoAsync(null))
            .ReturnsAsync(new FileResult(imgUrl));

        return mock.Object;
    }
}
```

### CreateViewModel com parâmetro opcional

```csharp
private (UserProfileViewModel vm, Mock<INavigationService> nav) CreateViewModel(
    Result result,
    ChooseFileOption? fileOption = null)
{
    var navigationService = fileOption is null
        ? NavigationServiceBuilder.Build()
        : NavigationServiceBuilder.Build<OptionsForProfileViewModel, ChooseFileOption>(fileOption.Value);

    var mediaPicker = MediaPickerBuilder.Build();
    var changePhotoUseCase = ChangeUserPhotoUseCaseBuilder.Build(result);

    var vm = new UserProfileViewModel(navigationService, mediaPicker, changePhotoUseCase);
    return (vm, navigationService);
}
```

## Example

**Before (tipos fixados no builder, quebra reuso):**
```csharp
// Builder acoplado a tipos concretos
public static INavigationService Build()
{
    var mock = new Mock<INavigationService>();
    mock.Setup(n => n.ShowPopup<OptionsForProfileViewModel, ChooseFileOption>())
        .ReturnsAsync(ChooseFileOption.TakePicture);
    return mock.Object;
}
```

**After (builder genérico, teste controla o resultado):**
```csharp
// Builder genérico
public static INavigationService Build<TViewModel, TResult>(TResult result)
    where TViewModel : class where TResult : struct
{
    var mock = new Mock<INavigationService>();
    mock.Setup(n => n.ShowPopup<TViewModel, TResult>()).ReturnsAsync(result);
    return mock.Object;
}

// Teste controla o valor
[Theory]
[InlineData(ChooseFileOption.TakePicture)]
[InlineData(ChooseFileOption.UploadFromGallery)]
public async Task ChangePhoto_Success(ChooseFileOption option)
{
    var (vm, _) = CreateViewModel(successResult, fileOption: option);
    await vm.ChangeProfilePhotoCommand.ExecuteAsync(null);
    Assert.Equal(StatusPage.Default, vm.StatusPage);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Interface tem método genérico (`ShowPopup<T1,T2>`) | Builder com `Build<T1,T2>(result)` genérico |
| Parâmetro opcional na interface real | Passe `null` explícito no `mock.Setup()` |
| Mock só necessário em alguns testes | Parâmetro opcional com default `null` no factory method |
| Construtor exige valor válido (ex: `FileResult`) | Use Bogus para gerar dado fake válido |
| Propriedade/feature temporária no código | Não escreva teste para ela |
| Múltiplos cenários (enum values) | Use `[Theory]` + `[InlineData]` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Tipos concretos fixos no builder genérico | `Build<TViewModel, TResult>(result)` com generics |
| `new FileResult("")` (string vazia) | `new FileResult(faker.Image.LoremFlickerUrl())` |
| Parâmetro obrigatório que quebra testes existentes | Parâmetro opcional com `= null` |
| Teste para código temporário/placeholder | Teste apenas para funcionalidade permanente |
| `mock.Setup(mp => mp.PickPhotoAsync())` sem argumento | `mock.Setup(mp => mp.PickPhotoAsync(null))` explícito |
| Verificar `Times.Once()` reutilizando instância | Nova instância por teste via factory method |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
